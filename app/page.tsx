import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { HowItWorksSection } from '@/components/how-it-works/HowItWorksSection';
import { WorldCardsSection } from '@/components/worlds/WorldCardsSection';
import { SizeComparisonSection } from '@/components/cro/SizeComparisonSection';
import { MagicIncentivesBanner } from '@/components/incentives/MagicIncentivesBanner';
import { FaqSection } from '@/components/faq/FaqSection';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { SizeSelectorModal } from '@/components/worlds/SizeSelectorModal';
import { AtrapaLaTernuraModal } from '@/components/gamification/AtrapaLaTernuraModal';
import { RuletaDelDestinoModal } from '@/components/gamification/RuletaDelDestinoModal';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountDrawer } from '@/components/auth/AccountDrawer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col justify-between">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Experience Sections */}
      <div className="flex-1 space-y-4">
        <HeroSection />
        <HowItWorksSection />
        <WorldCardsSection />
        <SizeComparisonSection />
        <MagicIncentivesBanner />
        <FaqSection />
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Modals & Drawers */}
      <CartDrawer />
      <SizeSelectorModal />
      <AtrapaLaTernuraModal />
      <RuletaDelDestinoModal />
      <CheckoutModal />
      <AuthModal />
      <AccountDrawer />
      <FloatingWhatsApp />
    </main>
  );
}
