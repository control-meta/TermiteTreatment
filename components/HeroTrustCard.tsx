import { Users, Star, ShieldCheck } from 'lucide-react';
import styles from './HeroTrustCard.module.css';

export default function HeroTrustCard() {
  return (
    <aside className={styles.card} aria-label="Customer trust and satisfaction rating">
      {/* 1. Happy Customers */}
      <div className={styles.item}>
        <span className={styles.iconCircle} aria-hidden="true">
          <Users size={22} strokeWidth={2.2} />
        </span>
        <div className={styles.itemText}>
          <strong className={styles.itemValue}>5000+</strong>
          <span className={styles.itemLabel}>Happy Customers</span>
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      {/* 2. Customer Rating */}
      <div className={`${styles.item} ${styles.itemCenter}`}>
        <div className={styles.stars} aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
          ))}
        </div>
        <strong className={styles.itemValue}>4.9/5</strong>
        <span className={styles.itemLabel}>Customer Rating</span>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      {/* 3. Satisfaction */}
      <div className={styles.item}>
        <span className={styles.iconCircle} aria-hidden="true">
          <ShieldCheck size={22} strokeWidth={2.2} />
        </span>
        <div className={styles.itemText}>
          <strong className={styles.itemValue}>100%</strong>
          <span className={styles.itemLabel}>Satisfaction</span>
        </div>
      </div>
    </aside>
  );
}
