'use client';

import { useRouter } from 'next/navigation';
import { Database, LogOut, ShieldCheck, Home } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminHeader({ mongoConfigured }: { mongoConfigured: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.headerBrand}>
          <a href="/admin" className={styles.logoLink}>
            <ShieldCheck size={26} className={styles.logoIcon} />
            <span>TermiteTreatment <strong>Admin</strong></span>
          </a>

          <div className={`${styles.statusBadge} ${mongoConfigured ? styles.statusActive : styles.statusStandby}`}>
            <Database size={14} />
            <span>{mongoConfigured ? 'MongoDB: Live Connected' : 'MongoDB: Standby (Local Fallback)'}</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.navLink}>
            <Home size={15} />
            <span>View Live Site</span>
          </a>

          <button onClick={handleLogout} className={styles.logoutBtn} title="Log out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

