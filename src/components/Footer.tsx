import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    "Web Development",
    "Network Setup", 
    "CCTV Installation",
    "Cybersecurity",
    "Hardware Support",
    "IT Consulting"
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com", label: "X" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Globe, href: "https://portfolio.com", label: "Portfolio" }
  ];

  return (
    <footer className="bg-tech-dark border-t border-electric-blue/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Description */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-electric rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold hero-text-glow">
                  Peter John
                </span>
              </div>
              <p className="text-muted-foreground">
                Your trusted local IT expert providing comprehensive technology solutions 
                for businesses and homes across Kenya.
              </p>
              <div className="space-y-2">
                <a 
                  href="tel:+254751035034" 
                  className="flex items-center space-x-2 text-sm hover:text-electric-blue transition-colors"
                >
                  <Phone className="w-4 h-4 text-electric-blue" />
                  <span>+254 751035034</span>
                </a>
                <a 
                  href="mailto:peterkivevo001@gmail.com" 
                  className="flex items-center space-x-2 text-sm hover:text-electric-blue transition-colors"
                >
                  <Mail className="w-4 h-4 text-electric-blue" />
                  <span>peterkivevo001@gmail.com</span>
                </a>
                <a 
                  href="https://maps.google.com/?q=Nairobi, Kenya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:text-electric-blue transition-colors"
                >
                  <MapPin className="w-4 h-4 text-electric-blue" />
                  <span>Nairobi, Kenya</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-electric-blue transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {services.map((service, index) => (
                  <li key={index}>
                    <a 
                      href="#services" 
                      className="text-muted-foreground hover:text-electric-blue transition-colors duration-300 cursor-pointer"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ready to discuss your IT needs? Get in touch for a free consultation.
                </p>
                <a href="mailto:peterkivevo001@gmail.com">
                  <Button variant="electric" size="sm" className="w-full">
                    Get Free Audit
                  </Button>
                </a>
                <div className="flex space-x-2">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-electric-blue/20 rounded-lg flex items-center justify-center hover:bg-electric-blue/30 transition-colors duration-300"
                        aria-label={social.label}
                      >
                        <IconComponent className="w-4 h-4 text-electric-blue" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-electric-blue/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 Peter John. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="#privacy" 
                className="text-sm text-muted-foreground hover:text-electric-blue transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                className="text-sm text-muted-foreground hover:text-electric-blue transition-colors"
              >
                Terms of Service
              </a>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={scrollToTop}
                className="hover:bg-electric-blue/10"
              >
                <ArrowUp className="w-4 h-4 mr-1" />
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
