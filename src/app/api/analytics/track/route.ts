import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

// Live in-memory counter starting from 0 (real live tracking)
let inMemoryViews: Record<string, number> = {};
let totalCount = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = body.path || '/';

    // Only count home page ('/') views
    if (path !== '/') {
      return NextResponse.json({ success: true, count: totalCount });
    }

    inMemoryViews['/'] = (inMemoryViews['/'] || 0) + 1;
    totalCount += 1;

    // Optional Supabase logging if table exists
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase
          .from('page_views')
          .insert({
            path: '/',
            referrer: body.referrer || '',
            user_agent: req.headers.get('user-agent') || '',
            ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
            created_at: new Date().toISOString(),
          });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, count: totalCount });
  } catch (err) {
    return NextResponse.json({ success: true, count: totalCount });
  }
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  let dbCount = 0;

  if (supabase) {
    try {
      const { count } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('path', '/');
      if (typeof count === 'number' && count > 0) {
        dbCount = count;
      }
    } catch (e) {}
  }

  const effectiveTotal = Math.max(totalCount, dbCount);

  return NextResponse.json({
    success: true,
    totalViews: effectiveTotal,
    homeViews: effectiveTotal,
  });
}
