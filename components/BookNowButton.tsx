'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2, FileText, LockKeyhole, MessageCircle, Phone, Sparkles, User, X } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { company, termiteServices } from '../lib/company';
import styles from './BookNowButton.module.css';

type BookingData = {
  name: string;
  phone: string;
  service: string;
};

export default function BookNowButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus the name input field whenever popover opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Click outside listener to dismiss the popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closePopover();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Escape key listener to close
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        closePopover();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  function closePopover() {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setBooking(null);
    }, 220);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const service = String(formData.get('service') || 'General Inspection & Treatment').trim();

    setBooking({ name, phone, service });
    setSubmitted(true);
  }

  const whatsappMessage = booking
    ? `Hello TermiteTreatment, I would like to book an inspection.\n\nName: ${booking.name}\nPhone: ${booking.phone}\nService: ${booking.service}\n\nPlease confirm availability.`
    : '';

  // Hide on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.container} aria-label="Quick booking">
      {/* Small popover box in the bottom left side right above the button */}
      {isOpen && (
        <div
          className={styles.popoverCard}
          role="dialog"
          aria-modal="false"
          aria-labelledby="quick-book-title"
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closePopover}
            aria-label="Close booking box"
          >
            <X size={15} />
          </button>

          {!submitted ? (
            <>
              <div className={styles.popoverHeader}>
                <span className={styles.eyebrow}>
                  <Sparkles size={11} /> Quick Booking
                </span>
                <h3 className={styles.title} id="quick-book-title">
                  Book an Inspection
                </h3>
                <p className={styles.subtitle}>
                  Leave your name &amp; number. We’ll call you back within 15 minutes.
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="quick-book-name">
                    Your Name *
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                      <User size={15} />
                    </span>
                    <input
                      ref={nameInputRef}
                      id="quick-book-name"
                      name="name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="quick-book-phone">
                    Phone Number *
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                      <Phone size={15} />
                    </span>
                    <PhoneInput
                      id="quick-book-phone"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      required
                      autoComplete="tel"
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="quick-book-service">
                    Service <small style={{ color: '#7b8c7f', fontWeight: 'normal' }}>(Optional)</small>
                  </label>
                  <select
                    id="quick-book-service"
                    name="service"
                    defaultValue="Free Inspection & Assessment"
                    className={styles.select}
                  >
                    <option value="Free Inspection & Assessment">Free Inspection &amp; Assessment</option>
                    {termiteServices.map(item => (
                      <option key={item.slug} value={item.title}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.submitBtn}>
                  Book Now <ArrowRight size={16} />
                </button>

                <p className={styles.privacy}>
                  <LockKeyhole size={11} /> Your details are 100% private &amp; safe.
                </p>
              </form>
            </>
          ) : (
            /* Success confirmation card in the small box */
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={30} strokeWidth={2.4} />
              </div>
              <h4 className={styles.successTitle}>Request Received!</h4>
              <p className={styles.successText}>
                Thanks, <strong>{booking?.name}</strong>. Our expert will call you at <strong>{booking?.phone}</strong> shortly.
              </p>

              <div className={styles.successDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Name</span>
                  <span className={styles.detailValue}>{booking?.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Phone</span>
                  <span className={styles.detailValue}>{booking?.phone}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Service</span>
                  <span className={styles.detailValue}>{booking?.service}</span>
                </div>
              </div>

              <div className={styles.successActions}>
                <a
                  href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappAction}
                >
                  <MessageCircle size={15} /> Confirm on WhatsApp
                </a>
                <button type="button" className={styles.doneBtn} onClick={closePopover}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Book Now Trigger Button */}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close booking form' : 'Book Now - Quick Inspection Request'}
      >
        <span className={styles.pill}>{isOpen ? 'Close' : 'Book Now'}</span>
        <span className={styles.outerHalo}>
          <span className={styles.innerCircle}>
            <span className={styles.icon}>
              {isOpen ? <X size={21} strokeWidth={2.4} /> : <FileText size={23} strokeWidth={2.2} />}
            </span>
            {!isOpen && <span className={styles.badgeDot} aria-hidden="true" />}
          </span>
        </span>
      </button>
    </div>
  );
}
