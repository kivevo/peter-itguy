import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Wifi, 
  MonitorSpeaker, 
  Shield, 
  Code, 
  HardDrive,
  Network,
  ArrowRight
} from "lucide-react";

const Services = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const services = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Custom websites and web applications tailored to your business needs",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile-First"],
      price: "Starter $499 | Pro $899 | Premium $1499",
      popular: true,
      highlight: "Most Popular"
    },
    {
      icon: Wifi,
      title: "Network & WiFi Setup",
      description: "Professional network configuration and WiFi optimization for homes and businesses",
      features: ["Network Planning", "WiFi Heatmap", "Security Setup", "Performance Tuning"],
      price: "Home $149 | Office $299 | Enterprise $599",
      popular: false,
      highlight: "Best Value"
    },
    {
      icon: MonitorSpeaker,
      title: "CCTV Installation",
      description: "Complete security camera systems with remote monitoring capabilities",
      features: ["HD Cameras", "Remote Access", "Motion Detection", "Cloud Storage"],
      price: "Basic $299 | Smart $599 | Advanced $999",
      popular: false,
      highlight: "Top Security"
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Protect your business from cyber threats with comprehensive security solutions",
      features: ["Threat Assessment", "Firewall Setup", "Anti-virus", "Security Training"],
      price: "From $199 – Free Consultation",
      popular: false,
      highlight: "Secure Choice"
    },
    {
      icon: HardDrive,
      title: "Hardware Support",
      description: "Computer repair, upgrades, and maintenance services",
      features: ["Diagnostics", "Component Replacement", "Performance Optimization", "Data Recovery"],
      price: "Basic Fix $49 | Full Service $99 | Premium Care $199",
      popular: false,
      highlight: "Budget Friendly"
    },
    {
      icon: Code,
      title: "IT Consulting",
      description: "Strategic IT guidance to help your business leverage technology effectively",
      features: ["IT Strategy", "Technology Planning", "System Integration", "Training"],
      price: "Free Consultation – Custom Quote",
      popular: false,
      highlight: "Free Consultation"
    },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-indigo-600/90 text-white">
            <Network className="w-4 h-4 mr-2" />
            Professional IT Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Complete IT Solutions for
            <span className="block animate-text-glow">Your Business</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From web development to network security, I provide comprehensive IT services 
            tailored to small businesses, startups, and homeowners.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className={`relative transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/50 bg-gray-800/50 backdrop-blur-sm border-gray-700 ${
                  service.popular ? 'ring-2 ring-indigo-500' : ''
                } ${hoveredCard === index ? 'scale-105' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {service.highlight && (
                  <Badge className="absolute -top-3 left-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
                    {service.highlight}
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-indigo-400" />
                  </div>
                  <CardTitle className="text-white">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center space-x-2 animate-slide-in"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-indigo-500/20">
                    <span className="text-lg font-semibold text-indigo-400">{service.price}</span>
                    
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Inline styles for animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes text-glow {
    0%, 100% { text-shadow: 0 0 10px rgba(79, 70, 229, 0.5); }
    50% { text-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
  }
  .animate-fade-in { animation: fade-in 1s ease-out; }
  .animate-slide-in { animation: slide-in 0.5s ease-out; }
  .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Services;
