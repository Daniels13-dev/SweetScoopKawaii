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
import { CharmsBoardModal } from '@/components/worlds/CharmsBoardModal';
import { AtrapaLaTernuraModal } from '@/components/gamification/AtrapaLaTernuraModal';
import { RuletaDelDestinoModal } from '@/components/gamification/RuletaDelDestinoModal';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountDrawer } from '@/components/auth/AccountDrawer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-pink-50/20 text-pink-950 flex flex-col justify-between overflow-x-hidden">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Experience Sections */}
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <WorldCardsSection />
        <SizeComparisonSection />
        <MagicIncentivesBanner />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Modals & Drawers */}
      <CartDrawer />
      <SizeSelectorModal />
      <CharmsBoardModal />
      <AtrapaLaTernuraModal />
      <RuletaDelDestinoModal />
      <CheckoutModal />
      <AuthModal />
      <AccountDrawer />
      <FloatingWhatsApp />
    </div>
  );
}
