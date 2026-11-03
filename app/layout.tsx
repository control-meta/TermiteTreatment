import type { Metadata, Viewport } from 'next';
import './globals.css';
import './responsive.css';
import './nature-ambient.css';
import './page-ambient.css';
import './mobile-motion.css';
import ScrollMotion from '../components/ScrollMotion';
import FloatingContactButtons from '../components/FloatingContactButtons';
import BookNowButton from '../components/BookNowButton';
import AdminPreviewGuard from '../components/AdminPreviewGuard';
import { company, offices } from '../lib/company';

export const viewport: Viewport = {
  themeColor: '#14532d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://termitepestcontrol.co.in'),
  title: {
    default: 'TermiteTreatment | Specialist Termite Pest Control & Inspection in India',
    template: '%s | TermiteTreatment',
  },
  description: 'Protect what matters most. Expert termite inspections, odorless drilling & injection treatments, pre-construction soil barriers, and annual maintenance plans across India.',
  keywords: [
    'termite control',
    'termite pest control',
    'termite treatment',
    'anti termite treatment',
    'termite inspection',
    'pest control services India',
    'pre construction termite treatment',
    'post construction termite treatment',
    'termite AMC plan',
    'pest control Mumbai',
    'pest control Bengaluru',
    'pest control Delhi NCR',
    'pest control Pune',
    'pest control Goa',
  ],
  authors: [{ name: 'TermiteTreatment Specialist Team' }],
  creator: 'TermiteTreatment',
  publisher: 'TermiteTreatment',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://termitepestcontrol.co.in',
    siteName: 'TermiteTreatment',
    title: 'TermiteTreatment | Specialist Termite Pest Control & Inspection in India',
    description: 'Expert termite inspections, targeted treatments and preventive pest care for homes, businesses and construction projects across India.',
    images: [
      {
        url: '/images/termiguard-family.webp',
        width: 1200,
        height: 630,
        alt: 'TermiteTreatment Specialist Team - Thoughtful pest care for your property',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TermiteTreatment | Specialist Termite Pest Control & Inspection in India',
    description: 'Protect what matters most. Explore termite inspections, targeted treatments and preventive care for homes and businesses.',
    images: ['/images/termiguard-family.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'TermiteTreatment',
  alternateName: 'Termite Pest Control India',
  url: 'https://termitepestcontrol.co.in',
  logo: 'https://termitepestcontrol.co.in/images/termiguard-family.webp',
  image: 'https://termitepestcontrol.co.in/images/termiguard-family.webp',
  description: 'Specialist termite control, inspection, pre-construction and post-construction termite treatments for homes and businesses across India.',
  telephone: company.phone,
  email: company.email,
  priceRange: '₹₹',
  areaServed: offices.map(o => o.city),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  sameAs: [`https://wa.me/${company.whatsapp}`],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <AdminPreviewGuard />
        {children}
        <ScrollMotion />
        <BookNowButton />
        <FloatingContactButtons />
      </body>
    </html>
  );
}
