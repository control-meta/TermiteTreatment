'use client';

import type { ComponentPropsWithoutRef, ClipboardEvent, FormEvent } from 'react';

type PhoneInputProps = Omit<ComponentPropsWithoutRef<'input'>,
  'type' | 'inputMode' | 'pattern' | 'minLength' | 'maxLength' | 'onInput' | 'onPaste' | 'value' | 'onChange'
>;

export default function PhoneInput(props: PhoneInputProps) {
  function keepDigits(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
    if (input.value !== value) {
      const cursor = Math.min(input.value.slice(0, input.selectionStart ?? input.value.length).replace(/[^0-9]/g, '').length, value.length);
      input.value = value;
      input.setSelectionRange(cursor, cursor);
    }
  }

  function pasteDigits(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const input = event.currentTarget;
    const digits = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const before = input.value.slice(0, start);
    const after = input.value.slice(end);
    const inserted = digits.slice(0, Math.max(0, 10 - before.length - after.length));
    input.value = before + inserted + after;
    const cursor = start + inserted.length;
    input.setSelectionRange(cursor, cursor);
  }

  return <input
    {...props}
    type="tel"
    inputMode="numeric"
    minLength={10}
    maxLength={10}
    pattern="[0-9]{10}"
    title="Enter exactly 10 digits (0–9)."
    onInput={keepDigits}
    onPaste={pasteDigits}
  />;
}
