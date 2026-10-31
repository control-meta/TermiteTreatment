'use client';

import { useEffect, useRef, useState } from 'react';

export default function TermiteField() {
  const mount = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(!preference.matches);
    const onChange = () => setEnabled(!preference.matches);
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled || !mount.current) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;
    import('../lib/termiteScene').then(({ createTermiteScene }) => {
      if (cancelled || !mount.current) return;
      try { destroy = createTermiteScene(mount.current); }
      catch { setEnabled(false); }
    }).catch(() => { if (!cancelled) setEnabled(false); });
    return () => { cancelled = true; destroy?.(); };
  }, [enabled]);

  return <div ref={mount} className="termite-field" aria-hidden="true" />;
}
