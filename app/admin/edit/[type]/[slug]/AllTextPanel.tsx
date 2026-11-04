'use client';

import { useState } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import type { PageTextEntry } from '../../../../../lib/page-text';
import styles from './editor.module.css';

export default function AllTextPanel({ entries, onChange, onClose }: {
  entries: PageTextEntry[];
  onChange: (key: string, value: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const search = query.trim().toLowerCase();
  const filtered = entries.filter(entry => `${entry.label} ${entry.attribute || ''} ${entry.source} ${entry.value}`.toLowerCase().includes(search));
  return <aside className={styles.formPanel} aria-label="All page text">
    <div className={styles.textPanelHeader}>
      <div><h2>All text <span>({entries.length})</span></h2><p>Edits apply to this page, including its header and footer.</p></div>
      <button type="button" onClick={onClose} className={styles.deleteBtn} aria-label="Close all text panel"><X size={18} /></button>
    </div>
    <label className={styles.textSearch}><Search size={16} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a label, button, or any text…" aria-label="Search all page text" /></label>
    <div className={styles.formScroll}>
      {entries.length === 0 ? <p className={styles.textPanelNote}>Loading page text…</p> : filtered.length === 0 ? <p className={styles.textPanelNote}>No matching text. Try another word.</p> : <div className={styles.allTextFields}>
        {filtered.map(entry => <label className={styles.fieldLabel} key={entry.key}>
          <span className={styles.textEntryLabel}>{entry.label}<button type="button" className={styles.deleteBtn} disabled={entry.value === entry.source} onClick={() => onChange(entry.key, entry.source)} title="Restore original wording" aria-label={`Reset ${entry.label.toLowerCase()}`}><RotateCcw size={13} /></button></span>
          <textarea maxLength={30000} rows={entry.value.length > 100 ? 4 : 2} value={entry.value} onChange={event => onChange(entry.key, event.target.value)} aria-label={`${entry.label}: ${entry.source.trim().slice(0, 90) || 'Empty text'}`} />
        </label>)}
      </div>}
    </div>
  </aside>;
}
