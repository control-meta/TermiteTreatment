'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight, Database, AlertCircle } from 'lucide-react';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please check your connection.');
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <ShieldCheck size={32} />
          </div>
          <h1>Admin Control Panel</h1>
          <p>Sign in to manage and live-edit website content</p>
        </div>

        {error && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            <span>Username</span>
            <div className={styles.inputWrap}>
              <User size={18} className={styles.inputIcon} />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. admin"
                autoComplete="username"
              />
            </div>
          </label>

          <label className={styles.label}>
            <span>Password</span>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </div>
          </label>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className={styles.footerNote}>
          <Database size={15} />
          <span>MongoDB Live Architecture &bull; Option 2</span>
        </div>
      </div>
    </div>
  );
}

