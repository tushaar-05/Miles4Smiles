import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

function verifyAdmin(req: NextRequest): boolean {
  const configuredPasscode = process.env.ADMIN_PASSCODE || 'm4s@2026';
  const providedPasscode =
    req.headers.get('x-admin-passcode') ||
    req.nextUrl.searchParams.get('passcode') ||
    '';

  return providedPasscode === configuredPasscode;
}

/**
 * GET /api/admin/registrations
 * Returns all registration rows from Supabase
 */
export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid admin passcode' },
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
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin fetch error:', error);
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
    console.error('Admin API error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to fetch registrations';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/admin/registrations
 * Create a new manual / on-spot registration directly from admin panel
 */
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid admin passcode' },
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
      amount: Number(body.amount) || 0,
      chest_number: chestNumber,
      bib_number: bibNumber,
      razorpay_order_id: `manual_order_${Date.now()}`,
      razorpay_payment_id: body.payment_id || `manual_pay_${Date.now()}`,
      payment_status: body.payment_status || 'paid',
    };

    // Try inserting with race_type
    const { data, error } = await supabase
      .from('registrations')
      .insert({ ...newPayload, race_type: body.race_type || 'Competitive 5K' })
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
    console.error('Admin create error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create registration';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/registrations
 * Edit any user profile information & payment status
 */
export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid admin passcode' },
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
    const { id, ...editableFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};

    // Allow updating all profile fields
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
      // If race_type column doesn't exist in Supabase yet, retry without race_type
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
 * Delete a registration record (e.g. test rows)
 */
export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid admin passcode' },
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
