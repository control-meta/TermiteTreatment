'use client';

import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { company } from '../lib/company';
import styles from './FloatingContactButtons.module.css';

export default function FloatingContactButtons() {
  const pathname = usePathname();

  // Hide on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
    'Hello! I would like to know more about your termite pest control services.'
  )}`;

  return (
    <aside className={styles.container} aria-label="Quick contact buttons">
      {/* Phone Call Button */}
      <div className={styles.actionItem}>
        <span className={styles.tooltip} id="phone-button-tooltip">
          Call: {company.phone}
        </span>
        <a
          href={company.telephone}
          className={`${styles.button} ${styles.phoneButton}`}
          aria-label={`Call us at ${company.phone}`}
          aria-describedby="phone-button-tooltip"
          title={`Call us: ${company.phone}`}
        >
          <span className={styles.icon}>
            <Phone size={24} strokeWidth={2.2} aria-hidden="true" />
          </span>
        </a>
      </div>

      {/* WhatsApp Button */}
      <div className={styles.actionItem}>
        <span className={styles.tooltip} id="whatsapp-button-tooltip">
          Chat on WhatsApp
        </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.whatsappButton}`}
          aria-label="Chat on WhatsApp"
          aria-describedby="whatsapp-button-tooltip"
          title="Chat on WhatsApp"
        >
          <span className={styles.pulseRing} aria-hidden="true" />
          <span className={styles.icon}>
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
            </svg>
          </span>
        </a>
      </div>
    </aside>
  );
}
