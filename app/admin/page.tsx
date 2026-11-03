import { redirect } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import { isMongoConfigured } from '../../lib/mongodb';
import { locations } from '../../lib/locations';
import { termiteServices } from '../../lib/company';
import { getAllLocationServices } from '../../lib/content-service';
import { MapPin, Shield, Edit3, ExternalLink, Database, CheckCircle2, Sparkles } from 'lucide-react';
import LocationServicesSection from './LocationServicesSection';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  const mongoReady = isMongoConfigured();
  const localServices = await getAllLocationServices();

  return (
    <div className={styles.container}>
      {/* Overview Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerCopy}>
          <div className={styles.pill}>
            <Sparkles size={13} />
            <span>GRAPHICAL CMS &bull; OPTION 2</span>
          </div>
          <h1>Website Pages &amp; Content Management</h1>
          <p>
            Preview and edit content on all locations, core services, and city-specific service pages in real-time.
            Changes save to MongoDB and reflect live immediately.
          </p>
        </div>

        <div className={styles.mongoStatusCard}>
          <div className={styles.mongoCardHeader}>
            <Database size={18} className={mongoReady ? styles.iconGreen : styles.iconOrange} />
            <strong>Database Status</strong>
          </div>
          <p>
            {mongoReady ? (
              <span className={styles.statusTextGreen}>
                <CheckCircle2 size={14} /> Connected to MongoDB. Total live pages: <strong>{locations.length + termiteServices.length + localServices.length}</strong>
              </span>
            ) : (
              <span className={styles.statusTextStandby}>
                Standby mode. Paste your <code>MONGODB_URI</code> in <code>.env</code> and run <code>npm run db:seed</code> when ready.
              </span>
            )}
          </p>
        </div>
      </section>

      {/* 1. Location Pages (6) */}
      <section className={styles.section} id="locations">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <MapPin size={20} className={styles.titleIcon} />
              Location Pages ({locations.length})
            </h2>
            <p className={styles.sectionDesc}>Edit city headlines, about copy, local coverage areas, and localized FAQs.</p>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {locations.map(loc => (
            <article key={loc.slug} className={styles.pageCard}>
              <div className={styles.cardHeader}>
                <span className={styles.tagBadge}>{loc.state}</span>
                <span className={styles.routeTag}>/locations/{loc.slug}</span>
              </div>
              <h3 className={styles.cardTitle}>{loc.name}</h3>
              <p className={styles.cardExcerpt}>{loc.about.slice(0, 115)}...</p>

              <div className={styles.areasSummary}>
                <strong>Covered areas:</strong> {loc.areas.slice(0, 3).join(', ')} + {loc.areas.length - 3} more
              </div>

              <div className={styles.cardFooter}>
                <a href={`/admin/edit/location/${loc.slug}`} className={styles.editBtn}>
                  <Edit3 size={14} />
                  <span>Edit Live &amp; Preview</span>
                </a>
                <a href={`/locations/${loc.slug}`} target="_blank" rel="noopener noreferrer" className={styles.viewLink} title="View public page">
                  <ExternalLink size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2. Core Service Pages (5) */}
      <section className={styles.section} id="services">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <Shield size={20} className={styles.titleIcon} />
              Core Service Pages ({termiteServices.length})
            </h2>
            <p className={styles.sectionDesc}>Edit national service titles, benefits, process steps, definitions, and FAQs.</p>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {termiteServices.map(srv => (
            <article key={srv.slug} className={styles.pageCard}>
              <div className={styles.cardHeader}>
                <span className={styles.tagBadge}>National Service</span>
                <span className={styles.routeTag}>/services/{srv.slug}</span>
              </div>
              <h3 className={styles.cardTitle}>{srv.title}</h3>
              <p className={styles.cardExcerpt}>{srv.text}</p>

              <div className={styles.areasSummary}>
                <strong>Highlights:</strong> {srv.tags.join(' &bull; ')}
              </div>

              <div className={styles.cardFooter}>
                <a href={`/admin/edit/service/${srv.slug}`} className={styles.editBtn}>
                  <Edit3 size={14} />
                  <span>Edit Live &amp; Preview</span>
                </a>
                <a href={`/services/${srv.slug}`} target="_blank" rel="noopener noreferrer" className={styles.viewLink} title="View public page">
                  <ExternalLink size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Location-Specific Service Pages (30) */}
      <LocationServicesSection
        items={localServices}
        cities={locations.map(l => ({ name: l.name, slug: l.slug }))}
      />
    </div>
  );
}
