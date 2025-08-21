import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  Award, 
  Users, 
  Coffee,
  Code,
  Shield,
  Download,
  ExternalLink
} from "lucide-react";

const About = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const skills = [
    { name: "Web Development", level: 95, highlight: "Top Skill" },
    { name: "Network Security", level: 90, highlight: "Highly Proficient" },
    { name: "CCTV Systems", level: 88, highlight: "Expert Setup" },
    { name: "Hardware Troubleshooting", level: 92, highlight: "Reliable Fixes" },
    { name: "System Administration", level: 85, highlight: "Efficient Management" },
    { name: "Customer Service", level: 98, highlight: "Client Favorite" },
  ];

  const achievements = [
    {
      icon: GraduationCap,
      title: "Computer Science Graduate",
      description: "Bachelor's degree with focus on networking and cybersecurity",
      highlight: "Academic Excellence"
    },
    {
      icon: Award,
      title: "5+ Years Experience",
      description: "Proven track record in IT support and web development",
      highlight: "Trusted Expert"
    },
    {
      icon: Users,
      title: "50+ Happy Clients",
      description: "Small businesses and homeowners trust my expertise",
      highlight: "Client Trust"
    },
    {
      icon: Coffee,
      title: "24/7 Availability",
      description: "Always ready to help with urgent IT issues",
      highlight: "Always On"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-tech-dark/50 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <Badge variant="outline" className="border-electric-blue/30 text-electric-blue bg-electric-blue/10 mb-4 animate-pulse">
                <Code className="w-4 h-4 mr-2" />
                Meet Your IT Expert
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-electric-blue/70 animate-text-glow">
                I'm Peter John,
                <span className="block">The IT Guy</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p className="animate-slide-in" style={{ animationDelay: "100ms" }}>
                  As a Computer Science graduate with a passion for technology, I've dedicated 
                  my career to helping businesses and individuals harness the power of IT to 
                  achieve their goals.
                </p>
                <p className="animate-slide-in" style={{ animationDelay: "200ms" }}>
                  From custom web development to comprehensive network security solutions, 
                  I bring both technical expertise and a customer-first approach to every project. 
                  My mission is simple: make technology work seamlessly for you.
                </p>
                <p className="animate-slide-in" style={{ animationDelay: "300ms" }}>
                  When I'm not coding or configuring networks, you'll find me staying updated 
                  with the latest tech trends and continuously improving my skills to better serve my clients.
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-white animate-fade-in">Technical Expertise</h3>
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="space-y-2 animate-slide-in relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {skill.highlight && (
                    <Badge className="absolute -top-3 left-0 bg-gradient-to-r from-electric-blue to-electric-blue/70 text-white">
                      {skill.highlight}
                    </Badge>
                  )}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <span className="text-sm text-electric-blue">{skill.level}%</span>
                  </div>
                  <div 
                    className="w-full bg-tech-gray rounded-full h-2"
                    role="progressbar"
                    aria-label={`Skill level for ${skill.name}`}
                    aria-valuenow={skill.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div 
                      className="bg-gradient-electric h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              {/* Download Resume */}
              <a 
                href="/Resume.pdf" 
                download="Peter_John_Resume.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="electric" 
                  size="lg" 
                  className="group hover:shadow-lg hover:shadow-electric-blue/50 transition-shadow"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Download Resume
                </Button>
              </a>

              {/* View Resume */}
              <a 
                href="/Resume.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group hover:shadow-lg hover:shadow-electric-blue/30 transition-shadow"
                >
                  <ExternalLink className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  View Resume
                </Button>
              </a>
            </div>
          </div>

          {/* Achievements & Visual */}
          <div className="space-y-8">
            {/* Professional Photo Placeholder */}
            <div className="relative animate-fade-in">
              <div className="w-full h-80 bg-gradient-card rounded-2xl border border-electric-blue/20 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-electric rounded-full flex items-center justify-center mx-auto electric-glow">
                    <Shield className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Professional Profile</h4>
                    <p className="text-muted-foreground">Computer Science Graduate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <Card 
                    key={index} 
                    className={`bg-gradient-card border-electric-blue/20 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-electric-blue/50 relative ${
                      hoveredCard === index ? 'scale-105' : ''
                    }`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {achievement.highlight && (
                      <Badge className="absolute -top-3 left-4 bg-gradient-to-r from-electric-blue to-electric-blue/70 text-white">
                        {achievement.highlight}
                      </Badge>
                    )}
                    <CardContent className="p-4 text-center space-y-2 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="w-8 h-8 bg-electric-blue/20 rounded-lg flex items-center justify-center mx-auto">
                        <IconComponent className="w-4 h-4 text-electric-blue" />
                      </div>
                      <h4 className="font-semibold text-sm text-white">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quote */}
            <Card className="bg-gradient-card border-electric-blue/20 animate-fade-in">
              <CardContent className="p-6">
                <blockquote className="text-center">
                  <p className="text-lg italic text-muted-foreground mb-4">
                    "Technology should empower, not frustrate. My goal is to make 
                    IT solutions so seamless that you can focus entirely on growing your business."
                  </p>
                  <footer className="font-semibold text-electric-blue">
                    — Peter John
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </div>
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
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes text-glow {
    0%, 100% { text-shadow: 0 0 10px rgba(0, 170, 255, 0.5); }
    50% { text-shadow: 0 0 20px rgba(0, 170, 255, 0.8); }
  }
  .animate-fade-in { animation: fade-in 1s ease-out; }
  .animate-slide-in { animation: slide-in 0.5s ease-out; }
  .animate-spin-slow { animation: spin-slow 10s linear infinite; }
  .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default About;
