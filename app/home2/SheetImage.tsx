import styles from './home2.module.css';

/** Display one image from a two-row photographic sheet without stretching it. */
export default function SheetImage({ src, index, columns = 3, alt, className = '' }: {
  src: string;
  index: number;
  columns?: number;
  alt: string;
  className?: string;
}) {
  return <span className={`${styles.sheetImage} ${className}`}>
    <img src={src} alt={alt} width={1536} height={1024} loading="lazy" style={{ width: `${columns * 100}%`, left: `${-(index % columns) * 100}%`, transform: `translateY(${index < columns ? -25 : -75}%)` }} />
  </span>;
}
