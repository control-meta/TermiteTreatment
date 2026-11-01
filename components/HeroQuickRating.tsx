import { Users, Star, ShieldCheck, ChevronDown } from 'lucide-react';
import styles from './HeroQuickRating.module.css';

export default function HeroQuickRating() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.ratingBar}>
        {/* Item 1: Happy Customers */}
        <div className={styles.item}>
          <span className={styles.iconCircle} aria-hidden="true">
            <Users size={20} strokeWidth={2.2} />
          </span>
          <div className={styles.itemText}>
            <strong className={styles.itemValue}>5000+</strong>
            <span className={styles.itemLabel}>Happy Customers</span>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Item 2: Rating */}
        <div className={`${styles.item} ${styles.itemCenter}`}>
          <div className={styles.stars} aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
            ))}
          </div>
          <strong className={styles.itemValue}>4.9/5</strong>
          <span className={styles.itemLabel}>Customer Rating</span>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* Item 3: Satisfaction */}
        <div className={styles.item}>
          <span className={styles.iconCircle} aria-hidden="true">
            <ShieldCheck size={20} strokeWidth={2.2} />
          </span>
          <div className={styles.itemText}>
            <strong className={styles.itemValue}>100%</strong>
            <span className={styles.itemLabel}>Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Scroll to Explore indicator */}
      <a href="#why-us" className={styles.scrollExplore} aria-label="Scroll to explore">
        <span className={styles.scrollCircle}>
          <ChevronDown size={17} strokeWidth={2.4} />
        </span>
        <span className={styles.scrollText}>SCROLL TO EXPLORE</span>
      </a>
    </div>
  );
}
