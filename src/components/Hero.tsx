import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, CheckCircle, Star } from "lucide-react";
import heroImg from "../assets/hero-tech.jpg"; 


// Define types for the component state
interface HeroState {
  hoveredCard: boolean | null;
}

const Hero: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<HeroState['hoveredCard']>(null);

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900/30 to-gray-900 relative overflow-hidden px-4 pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full filter blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-2xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Content Section */}
          <div className="space-y-4">
            {/* Badge */}
            <Badge className="bg-indigo-600/90 text-white animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              24/7 IT Support
            </Badge>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 leading-tight">
                Your Trusted
                <span className="block animate-text-glow">IT Expert</span>
                <span className="text-xl sm:text-2xl text-gray-300 block">
                  Peter John
                </span>
              </h1>
              <p className="text-base text-gray-300 max-w-lg">
                Computer Science graduate with 5+ years in web development, network setups, 
                and CCTV installations, delivering reliable IT solutions.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-1">
              {[
                "Free Network Audit & Consultation",
                "Same-Day Emergency IT Services",
                "5+ Years of Industry Experience",
                "Certified in Network Security & Web Development"
              ].map((benefit: string, idx: number) => (
                <div 
                  key={benefit} 
                  className="flex items-center space-x-3 animate-slide-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-indigo-400" />
                  <span className="text-base text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4 border-t border-indigo-500/20">
              <div className="text-center">
                <div className="text-2xl font-semibold text-indigo-400">50+</div>
                <div className="text-sm text-gray-300">Happy Clients</div>
              </div>
              <div className="w-px h-12 bg-gray-700" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-indigo-400">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
              <div className="w-px h-12 bg-gray-700" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-indigo-400">100%</div>
                <div className="text-sm text-gray-300">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Image Card */}
          <Card 
  className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-indigo-500/50 transition-transform duration-300 hover:scale-105"
>
  {/* Full background image */}
  <img 
  src={heroImg} 
  alt="Peter John IT Expert" 
  className="w-full h-full object-cover" 
/>


  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content inside the image */}
  <div className="absolute bottom-0 w-full p-4 text-center text-white">
    {/* Certified Expert badge */}
    <Badge className="mb-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md">
      Certified Expert
    </Badge>

    

    {/* Tagline */}
    <p className="mt-2 text-indigo-400 italic text-sm">
      “Delivering Reliable Tech Solutions”
    </p>
  </div>
</Card>

        </div>
      </div>
    </section>
  );
};

// Updated styles with compact animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes text-glow {
    0%, 100% { text-shadow: 0 0 5px rgba(79, 70, 229, 0.5); }
    50% { text-shadow: 0 0 10px rgba(79, 70, 229, 0.8); }
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  .animate-fade-in { animation: fade-in 0.8s ease-out; }
  .animate-slide-in { animation: slide-in 0.4s ease-out; }
  .animate-text-glow { animation: text-glow 1.5s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
`;

if (typeof document !== 'undefined') {
  const styleSheet: HTMLStyleElement = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Hero;