import React from "react";
import Navigation from "@/components/Navigation";
import About from "@/components/About";
import TrustBadges from "@/components/TrustBadges";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import Testimonials from "@/components/Testimonials";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { UserCheck } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navigation />

      <main className="flex-1 pt-20 lg:pt-28">
        {/* Full About Section */}
        <About />

        {/* Credentials & Certifications */}
        <TrustBadges />

        {/* Client Logos Strip */}
        <ClientLogoStrip />

        {/* Client Testimonials */}
        <Testimonials />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default AboutPage;
