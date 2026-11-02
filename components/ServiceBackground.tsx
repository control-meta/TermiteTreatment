import styles from './ServiceBackground.module.css';

/** Decorative CSS motion only; no client script or interaction layer. */
export default function ServiceBackground({ hero = false }: { hero?: boolean }) {
  return <div className={`${styles.background} ${hero ? styles.hero : ''}`} aria-hidden="true" data-service-background={hero ? 'hero' : 'page'}>
    <span className={styles.wash} />
    <span className={styles.secondWash} />
    <span className={styles.thirdWash} />
    <svg className={styles.contour} viewBox="0 0 420 420" fill="none">
      <circle cx="210" cy="210" r="209" /><circle cx="210" cy="210" r="169" /><circle cx="210" cy="210" r="129" />
      <path d="M210 80C300 110 334 218 210 337C86 218 120 110 210 80Z M210 108V337 M210 205L258 163 M210 259L164 218" />
    </svg>
  </div>;
}
