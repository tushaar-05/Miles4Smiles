import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { syncLiveGoogleSheets } from '@/lib/sheetsSync';

function getProvidedPasscode(req: NextRequest): string {
  return (
    req.headers.get('x-admin-passcode') ||
    req.headers.get('x-volunteer-passcode') ||
    req.nextUrl.searchParams.get('passcode') ||
    ''
  );
}

function verifyAdminStrict(req: NextRequest): boolean {
  const adminPasscode = process.env.ADMIN_PASSCODE || 'm4s@2026';
  const provided = getProvidedPasscode(req);
  return provided === adminPasscode;
}

function verifyAdminOrVolunteer(req: NextRequest): boolean {
  const adminPasscode = process.env.ADMIN_PASSCODE || 'm4s@2026';
  const volunteerPasscode = process.env.VOLUNTEER_PASSCODE || 'desk2026';
  const provided = getProvidedPasscode(req);

  return provided === adminPasscode || provided === volunteerPasscode;
}

/**
 * GET /api/admin/registrations
 * Returns all registration rows from Supabase (Accessible by Admin and Volunteer Desk)
 * Automatically syncs with live Google Sheets feeds
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminOrVolunteer(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid passcode' },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Database connection is unavailable' },
      { status: 500 }
    );
  }

  try {
    // ⚡ Trigger silent auto-sync in background asynchronously WITHOUT blocking user request
    syncLiveGoogleSheets().catch(err => console.error('Background sheet sync notice:', err));

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      registrations: data || [],
    });
  } catch (err: unknown) {
    console.error('API error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to fetch registrations';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/admin/registrations
 * Create a new manual / on-spot registration (Accessible by Admin and Volunteer Desk)
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminOrVolunteer(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid passcode' },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Database connection is unavailable' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const chestNumber = body.chest_number || String(Math.floor(100 + Math.random() * 900));
    const bibPrefix =
      (body.category || '').toLowerCase().includes('senior')
        ? 'SR'
        : (body.gender || '').toLowerCase() === 'female'
        ? 'F'
        : 'M';
    const bibNumber = body.bib_number || `M4S-${bibPrefix}-${chestNumber}`;

    // Auto calculate price based on race tier to prevent manual tampering
    const isComp = (body.race_type || '').toLowerCase().includes('comp');
    const autoAmount = isComp ? 249 : 149;

    const newPayload: Record<string, unknown> = {
      first_name: body.first_name || '',
      last_name: body.last_name || '',
      gender: body.gender || 'Male',
      blood_group: body.blood_group || 'O+',
      dob: body.dob || '2000-01-01',
      weight: body.weight || '',
      height: body.height || '',
      t_shirt_size: body.t_shirt_size || 'M',
      email: body.email || '',
      phone: body.phone || '',
      city: body.city || 'Pune',
      emergency_name: body.emergency_name || '',
      emergency_phone: body.emergency_phone || '',
      category: body.category || 'Male',
      amount: autoAmount,
      chest_number: chestNumber,
      bib_number: bibNumber,
      razorpay_order_id: `desk_order_${Date.now()}`,
      razorpay_payment_id: body.payment_id || `desk_pay_${Date.now()}`,
      payment_status: body.payment_status || 'paid',
    };

    // Try inserting with race_type
    const { data, error } = await supabase
      .from('registrations')
      .insert({ ...newPayload, race_type: body.race_type || (isComp ? 'Competitive 5K' : 'Non-Competitive 5K') })
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST204' || error.message.includes('race_type')) {
        const { data: retryData, error: retryError } = await supabase
          .from('registrations')
          .insert(newPayload)
          .select()
          .single();

        if (retryError) {
          return NextResponse.json({ success: false, error: retryError.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, registration: retryData });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, registration: data });
  } catch (err: unknown) {
    console.error('Registration creation error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create registration';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/registrations
 * Edit participant profile information (RESTRICTED: Admin Only)
 */
export async function PATCH(req: NextRequest) {
  if (!verifyAdminStrict(req)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Admin access required for editing' },
      { status: 403 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Database connection is unavailable' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { id, ...editableFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};

    const allowedKeys = [
      'first_name',
      'last_name',
      'gender',
      'blood_group',
      'dob',
      'weight',
      'height',
      't_shirt_size',
      'email',
      'phone',
      'city',
      'emergency_name',
      'emergency_phone',
      'category',
      'race_type',
      'amount',
      'chest_number',
      'bib_number',
      'payment_status',
    ];

    for (const key of allowedKeys) {
      if (editableFields[key] !== undefined) {
        if (key === 'amount') {
          updatePayload[key] = Number(editableFields[key]);
        } else {
          updatePayload[key] = editableFields[key];
        }
      }
    }

    const { data, error } = await supabase
      .from('registrations')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST204' || error.message.includes('race_type')) {
        delete updatePayload.race_type;
        const { data: retryData, error: retryError } = await supabase
          .from('registrations')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (retryError) {
          return NextResponse.json({ success: false, error: retryError.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, registration: retryData });
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      registration: data,
    });
  } catch (err: unknown) {
    console.error('Admin update error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to update registration';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/registrations
 * Delete a registration record (RESTRICTED: Admin Only)
 */
export async function DELETE(req: NextRequest) {
  if (!verifyAdminStrict(req)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Admin access required for deletion' },
      { status: 403 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Database connection is unavailable' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (err: unknown) {
    console.error('Admin delete error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to delete record';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
