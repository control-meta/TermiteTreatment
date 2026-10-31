'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { BadgeCheck, Check, ChevronDown } from 'lucide-react';
import { termiteServices } from '../lib/company';

const options = [...termiteServices.map(item => ({ title: item.title, description: item.shortTitle })), { title: 'Not sure — I need an inspection', description: 'Start with a closer look' }];

export default function ServicePicker({ value, onChange, invalid, triggerRef }: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const id = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  function show() {
    setHighlighted(Math.max(0, options.findIndex(option => option.title === value)));
    setOpen(true);
  }
  function choose(index: number) {
    onChange(options[index].title);
    setOpen(false);
    triggerRef.current?.focus();
  }

  return <div className="service-picker" ref={wrapper}>
    <input type="hidden" name="service" value={value}/>
    <button ref={triggerRef} type="button" role="combobox" aria-label="Select service" aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined} aria-required="true" aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} className={`service-trigger input-wrap ${value ? 'has-value' : ''}`} onClick={() => open ? setOpen(false) : show()} onKeyDown={event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!open) show();
        else setHighlighted(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault(); setOpen(true); setHighlighted(event.key === 'Home' ? 0 : options.length - 1);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); if (open) choose(highlighted); else show();
      } else if (event.key === 'Escape') {
        if (open) event.preventDefault(); setOpen(false);
      } else if (event.key === 'Tab') setOpen(false);
      else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const index = options.findIndex(option => option.title.toLowerCase().startsWith(event.key.toLowerCase()));
        if (index >= 0) { event.preventDefault(); setOpen(true); setHighlighted(index); }
      }
    }}><BadgeCheck size={21} aria-hidden="true"/><span>{value || 'Select Service'}</span><ChevronDown className="service-chevron" size={18} aria-hidden="true"/></button>
    {open && <div className="service-menu" id={`${id}-list`} role="listbox" aria-label="Available services">
      <div className="service-menu-label" aria-hidden="true">HOW CAN WE HELP?</div>
      {options.map((option, index) => <div key={option.title} id={`${id}-option-${index}`} role="option" aria-selected={value === option.title} className={`service-option ${highlighted === index ? 'is-highlighted' : ''}`} onPointerMove={() => setHighlighted(index)} onClick={() => choose(index)}><span><strong>{option.title}</strong><small>{option.description}</small></span><span className="service-option-check" aria-hidden="true">{value === option.title && <Check size={16}/>}</span></div>)}
    </div>}
    {invalid && <p className="service-error" id={`${id}-error`} role="alert">Please select a service to continue.</p>}
  </div>;
}
