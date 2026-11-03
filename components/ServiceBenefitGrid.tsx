'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Building2, CalendarCheck2, House, Layers3, Settings2, ShieldCheck } from 'lucide-react';
import { benefitDescriptions } from '../lib/service-benefits';
import { balanceBenefitLines } from '../lib/balanced-benefit-lines';
import styles from '../app/(company)/services/[slug]/service-detail.module.css';

const icons = [House, Layers3, ShieldCheck, Settings2, Building2, CalendarCheck2];

export default function ServiceBenefitGrid({ benefits, numbered = false }: { benefits: [string, string][]; numbered?: boolean }) {
  const grid = useRef<HTMLDivElement>(null);
  const [balanced, setBalanced] = useState<string[][] | null>(null);

  useLayoutEffect(() => {
    const container = grid.current;
    const context = document.createElement('canvas').getContext('2d');
    if (!container || !context) return;
    let active = true;
    let frame = 0;

    function update() {
      if (!active || !container || !context) return;
      const paragraphs = [...container.querySelectorAll('p')];
      if (!paragraphs.length) return;
      const style = getComputedStyle(paragraphs[0]);
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const letterSpacing = parseFloat(style.letterSpacing) || 0;
      const measure = (text: string) => context.measureText(text).width + Math.max(0, text.length - 1) * letterSpacing;
      // Allow a small rounding margin so a line never spills outside its column.
      const width = Math.min(...paragraphs.map(p => p.getBoundingClientRect().width)) - 2;
      if (width <= 0) return;

      // Use the same reference copy on every service page, so equal card widths
      // produce equal line counts even when the selected service changes.
      const reference = [...benefitDescriptions, ...benefits.map(([, text]) => text)];
      let target = 3;
      for (const text of reference) {
        let rows = 1;
        let line = '';
        for (const word of text.split(/\s+/)) {
          const candidate = line ? `${line} ${word}` : word;
          if (line && measure(candidate) > width) { rows++; line = word; }
          else line = candidate;
        }
        target = Math.max(target, rows);
      }
      const next = benefits.map(([, text]) => balanceBenefitLines(text, target, width, measure));
      if (next.some(lines => !lines)) { setBalanced(null); return; }
      const lines = next as string[][];
      setBalanced(previous => JSON.stringify(previous) === JSON.stringify(lines) ? previous : lines);
    }

    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
    update();
    const resize = new ResizeObserver(schedule);
    container.querySelectorAll('p').forEach(p => resize.observe(p));
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(() => { if (active) schedule(); });
    document.fonts.addEventListener('loadingdone', schedule);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('resize', schedule);
      document.fonts.removeEventListener('loadingdone', schedule);
    };
  }, [benefits]);

  return <div className={styles.benefitGrid} ref={grid}>
    {benefits.map(([heading, text], index) => {
      const Icon = icons[index];
      return <article className={styles.benefit} key={heading}>
        <span className={styles.benefitIcon}><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></span>
        <h3 data-edit-benefit-index={index} data-edit-benefit-part="title">{numbered ? `${index + 1}. ${heading}` : heading}</h3>
        <p data-edit-benefit-index={index} data-edit-benefit-part="description">{balanced?.[index] ? balanced[index].map((line, row) => <span className={styles.benefitLine} key={row}>{line}{row < balanced[index].length - 1 ? ' ' : ''}</span>) : text}</p>
      </article>;
    })}
  </div>;
}
