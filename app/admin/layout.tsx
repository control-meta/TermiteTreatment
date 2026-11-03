import { redirect } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import { isMongoConfigured } from '../../lib/mongodb';
import AdminHeader from './AdminHeader';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();

  // If not logged in, we let the client redirect or page handle,
  // but if accessing /admin root directly without session, redirect to /admin/login
  return (
    <div className={styles.adminRoot}>
      {authed && <AdminHeader mongoConfigured={isMongoConfigured()} />}
      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}
