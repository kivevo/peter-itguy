// components/sections/Navigation.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Wifi, MonitorSpeaker, Code, Phone, ArrowRight } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home", icon: Shield },
    { name: "Services", href: "#services", icon: Wifi },
    { name: "About", href: "#about", icon: Code },
    { name: "Portfolio", href: "#portfolio", icon: MonitorSpeaker },
    { name: "Contact", href: "#contact", icon: Phone },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-indigo-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2 animate-fade-in">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center animate-spin-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6l-2 4h4l-2 4"
                />
              </svg>
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 animate-text-glow">
              KivevoX
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-300 hover:text-indigo-400 transition-colors duration-300 animate-slide-in"
                  style={{ animationDelay: `${navItems.indexOf(item) * 100}ms` }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
            <Button
              asChild
              className="party bg-indigo-600 hover:bg-indigo-500 text-white animate-slide-in"
              style={{ animationDelay: `${navItems.length * 100}ms` }}
            >
              <a href="#contact">
                Get Quotation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-indigo-400"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/90 backdrop-blur-md rounded-lg mt-2 border border-indigo-500/20">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-indigo-400 transition-colors duration-300 animate-slide-in"
                    style={{ animationDelay: `${navItems.indexOf(item) * 100}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
              <div className="pt-2">
                <Button
                  asChild
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white animate-slide-in"
                  style={{ animationDelay: `${navItems.length * 100}ms` }}
                >
                  <a href="#contact">
                    Get Free Audit
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Inline styles for animations (same as Services and Portfolio)
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes text-glow {
    0%, 100% { text-shadow: 0 0 10px rgba(79, 70, 229, 0.5); }
    50% { text-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
  }
  .animate-fade-in { animation: fade-in 1s ease-out; }
  .animate-slide-in { animation: slide-in 0.5s ease-out; }
  .animate-spin-slow { animation: spin-slow 10s linear infinite; }
  .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Navigation;