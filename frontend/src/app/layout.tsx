import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JsonLd } from '@/components/SEO/JsonLd';
import { LanguageProvider } from '@/context/LanguageContext';
import { AdminProvider } from '@/context/AdminContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://addispay.et'),
  title: {
    default: 'Addispay | Transforming Commerce Across Ethiopia',
    template: '%s | Addispay',
  },
  description: 'Addispay Financial Technology Share Company provides seamless, NBE-licensed payment solutions, merchant acquiring, instant transfers, mobile money, and POS integrations across Ethiopia.',
  keywords: [
    'Addispay',
    'Ethiopia Payment Gateway',
    'NBE Licensed Payment Operator',
    'Mobile Money Ethiopia',
    'Merchant Portal Ethiopia',
    'telebirr payment integration',
    'CBE QR Payment',
    'Ethiopia Fintech',
    'Business Banking Ethiopia',
    'Payment System Operator NPS/PSO/007/2022'
  ],
  authors: [{ name: 'Addispay Share Company', url: 'https://addispay.et' }],
  creator: 'Addispay Financial Technology Share Company',
  publisher: 'Addispay Financial Technology Share Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://addispay.et',
    siteName: 'Addispay',
    title: 'Addispay | Transforming Transactions & Empowering Ethiopian Businesses',
    description: 'NBE-licensed payment platform empowering 50,000+ merchants in Ethiopia with instant checkout, mobile money, and business banking tools.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Addispay Payment Platform Ethiopia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Addispay | Digital Payments for Ethiopia',
    description: 'Accept mobile money, bank transfers, and QR payments in seconds with Addispay.',
    images: ['/og-image.jpg'],
    creator: '@addispay',
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
  icons: {
    icon: '/favicon.ico',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Addispay Financial Technology Share Company',
  alternateName: 'Addispay',
  url: 'https://addispay.et',
  logo: 'https://addispay.et/logo.png',
  description: 'National Bank of Ethiopia (NBE) licensed Payment System Operator (NPS/PSO/007/2022) providing digital payments, merchant acquiring, and financial technology infrastructure.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Lem Hotel, Efrata Building 4th Floor',
    postOfficeBoxNumber: '8710',
    addressLocality: 'Addis Ababa',
    addressCountry: 'ET',
  },
  telephone: ['+251116684243', '+251116685873'],
  email: ['info@addispay.co', 'support@addispay.et'],
  foundingDate: '2022',
  hasCredential: 'NBE License NPS/PSO/007/2022',
  sameAs: [
    'https://twitter.com/addispay',
    'https://linkedin.com/company/addispay',
    'https://facebook.com/addispay'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <LanguageProvider>
          <AdminProvider>
            <Navbar />
            <main className="flex-grow pt-20">{children}</main>
            <Footer />
          </AdminProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
