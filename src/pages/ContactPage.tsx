import React from "react";
import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Phone } from "lucide-react";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1 pt-20 lg:pt-28">
        {/* Contact Form & Contact Details Hub */}
        <Contact />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ContactPage;
