'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { publicationStorageKey } from '../lib/content-publication';

export default function PublishedContentRefresh() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.self !== window.top || params.get('admin_preview') === '1' || params.get('preview') === 'true') return;
    let pending: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      clearTimeout(pending);
      pending = setTimeout(() => router.refresh(), 100);
    };
    const published = (event: StorageEvent) => {
      if (event.key !== publicationStorageKey || !event.newValue) return;
      try { if (JSON.parse(event.newValue).path === pathname) refresh(); }
      catch { /* Ignore unrelated or malformed storage values. */ }
    };
    const restored = (event: PageTransitionEvent) => { if (event.persisted) refresh(); };
    window.addEventListener('storage', published);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', restored);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearTimeout(pending);
      window.removeEventListener('storage', published);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', restored);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [pathname, router]);
  return null;
}
