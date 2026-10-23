import React from 'react';
import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Rights — Campus Skill Connect',
  description:
    'Comprehensive privacy charter detailing our zero-data-selling pledge, cryptographic 4-tier PostgreSQL Row Level Security (RLS), 1-click JSON data export, and full compliance with the Digital Personal Data Protection Act, 2023 (India) and GDPR.',
  keywords: [
    'privacy policy',
    'DPDP Act 2023',
    'student data protection',
    'campus skill connect privacy',
    'row level security privacy',
    'data sovereignty',
    'academic data privacy',
    'GDPR compliance',
    'data portability',
  ],
  openGraph: {
    title: 'Privacy Policy & Data Rights — Campus Skill Connect',
    description:
      'Learn how Campus Skill Connect protects student proof-of-work with 4-tier database Row Level Security, zero data broker monetization, and full DPDP Act 2023 alignment.',
    url: 'https://campusskillconnect.org/privacy',
    siteName: 'Campus Skill Connect',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Campus Skill Connect Privacy Policy',
    description:
      'Official privacy charter and statutory data protection disclosures for Campus Skill Connect under the Digital Personal Data Protection Act, 2023 (India) and GDPR.',
    url: 'https://campusskillconnect.org/privacy',
    datePublished: '2026-01-15',
    dateModified: '2026-10-23',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Campus Skill Connect',
      url: 'https://campusskillconnect.org',
      logo: 'https://campusskillconnect.org/favicon.ico',
    },
    about: {
      '@type': 'Legislation',
      name: 'Digital Personal Data Protection Act, 2023 (DPDPA)',
      legislationJurisdiction: 'India',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyClient />
    </>
  );
}
