// components/sections/Portfolio.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, ArrowRight } from "lucide-react";

export default function Portfolio() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const projects = [
    {
      icon: Folder,
      title: "Bus Booking System",
      description: "An online system for reserving and managing bus tickets.",
      features: ["Online Reservations", "Payment Integration", "Real-time Updates", "User Dashboard"],
      link: "#",
      highlight: "Most Popular",
    },
    {
      icon: Folder,
      title: "Hotel Management System",
      description: "Room booking, guest management, billing & reporting platform.",
      features: ["Room Booking", "Guest Management", "Billing System", "Reporting Tools"],
      link: "#",
      highlight: "Top Choice",
    },
    {
      icon: Folder,
      title: "Crypto Trading Bot",
      description: "Automated trading bot for Binance with smart strategies.",
      features: ["Automated Trading", "Smart Algorithms", "Binance API", "Performance Analytics"],
      link: "#",
      highlight: "High Performance",
    },
    {
      icon: Folder,
      title: "Rent Management System",
      description: "Track tenants, payments, and invoices with M-Pesa integration.",
      features: ["Tenant Tracking", "M-Pesa Integration", "Invoice Management", "Payment Alerts"],
      link: "#",
      highlight: "Best Value",
    },
  ];

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-indigo-600/90 text-white">
            <Folder className="w-4 h-4 mr-2" />
            Featured Projects
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Showcasing My
            <span className="block animate-text-glow">Recent Work</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A selection of applications and platforms I’ve built to solve real-world problems 
            for businesses and individuals.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card
                key={index}
                className={`relative transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/50 bg-gray-800/50 backdrop-blur-sm border-gray-700 ${
                  project.highlight === "Most Popular" ? "ring-2 ring-indigo-500" : ""
                } ${hoveredCard === index ? "scale-105" : ""}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => (window.location.href = project.link)}
              >
                {project.highlight && (
                  <Badge className="absolute -top-3 left-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
                    {project.highlight}
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-indigo-400" />
                  </div>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <CardDescription className="text-gray-400">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {project.features.map((feature, idx) => (
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
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 font-semibold hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project
                    </a>
                      </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Keep only necessary animations
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

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
