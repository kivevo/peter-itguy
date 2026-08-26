import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import TechMarquee from "@/components/TechMarquee";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import BlogResources from "@/components/BlogResources";
import Contact from "@/components/Contact";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <TechMarquee />
        <Services />
        <Portfolio />
        <Process />
        <About />
        <Testimonials />
        <BlogResources />
        <Contact />
        <CallToActionBand />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
