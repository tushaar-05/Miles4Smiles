'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track the Home Page ('/')
    if (pathname !== '/') return;

    // Check if user already viewed in this browser session (prevents refresh inflation)
    if (typeof window !== 'undefined') {
      const alreadyTrackedSession = sessionStorage.getItem('m4s_home_session_tracked');
      if (alreadyTrackedSession) return;
      sessionStorage.setItem('m4s_home_session_tracked', 'true');
    }

    // Send tracking request for home page
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }),
      }).catch(() => {});
    } catch (e) {}
  }, [pathname]);

  return null;
}
