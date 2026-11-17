import type { Metadata, Viewport } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Sweet Scoop Kawaii 🎀 | Cucharadas Sorpresa en Colombia',
  description: 'Descubre la cucharada sorpresa más tierna de Colombia. Papelería Kawaii, Beauty Glow y Dulcería Nacional cargados de ilusión, emoción y sorpresas mágicas.',
  keywords: [
    'Sweet Scoop Kawaii',
    'Cucharada sorpresa Colombia',
    'Papelería Kawaii Manizales',
    'Beauty Glow maquillaje sorpresa',
    'Dulces nacionales Colombia',
    'Cucharita Kawaii',
    'Scoop sorpresa'
  ],
  authors: [{ name: 'Sweet Scoop Kawaii' }],
  openGraph: {
    title: 'Sweet Scoop Kawaii 🎀 | Cucharadas Sorpresa en Colombia',
    description: 'La experiencia e-commerce sorpresa más tierna de Colombia. ¡Manifiesta tu suerte hoy!',
    url: 'https://sweetscoopkawaii.com',
    siteName: 'Sweet Scoop Kawaii',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sweet Scoop Kawaii 🎀',
    description: 'Descubre la cucharada sorpresa más tierna de Colombia.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD E-Commerce Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Sweet Scoop Kawaii',
    image: 'https://sweetscoopkawaii.com/og-image.jpg',
    description: 'Venta de cucharadas sorpresa temáticas Kawaii en Manizales y todo Colombia.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Manizales',
      addressRegion: 'Caldas',
      addressCountry: 'CO'
    },
    telephone: '+573104494494',
    priceRange: '$$',
    offers: [
      {
        '@type': 'Offer',
        name: 'Cucharita Surpresa Kawaii',
        price: '35000',
        priceCurrency: 'COP',
        availability: 'https://schema.org/InStock'
      },
      {
        '@type': 'Offer',
        name: 'Gran Cucharada Kawaii',
        price: '50000',
        priceCurrency: 'COP',
        availability: 'https://schema.org/InStock'
      }
    ]
  };

  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${quicksand.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
