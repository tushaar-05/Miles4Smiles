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

    // Send tracking request for home page visit
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/',
          type: 'visit',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }),
      }).catch(() => {});
    } catch (e) {}

    // Engagement listener (scroll past 200px or dwell > 6s)
    let hasEngaged = false;
    const sendEngagement = () => {
      if (hasEngaged) return;
      hasEngaged = true;
      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/', type: 'engage' }),
        }).catch(() => {});
      } catch (e) {}
    };

    const handleScroll = () => {
      if (window.scrollY > 200) {
        sendEngagement();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const timer = setTimeout(sendEngagement, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
