import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  Smartphone,
  MessageSquare,
  Calendar,
  Shield
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Me",
      description: "For urgent IT issues",
      value: "+254 751035034",
      action: "tel:+254751035034",
      available: "24/7 Emergency"
    },
    {
      icon: Mail,
      title: "Email Me",
      description: "For general inquiries",
      value: "peterkivevo001@gmail.com",
      action: "mailto:peterkivevo001@gmail.com",
      available: "24-48h response"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Quick messages & updates",
      value: "+254 751035034",
      action: "https://wa.me/254751035034",
      available: "Instant response"
    },
    {
      icon: MapPin,
      title: "Visit Office",
      description: "By appointment only",
      value: "Nairobi, Kenya",
      action: "https://maps.google.com/?q=Nairobi,Kenya",
      available: "Mon-Fri 9AM-6PM"
    }
  ];

  const services = [
    "Web Development",
    "Network Setup",
    "CCTV Installation", 
    "Cybersecurity",
    "Hardware Support",
    "IT Consulting"
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-tech-dark/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-electric-blue/30 text-electric-blue bg-electric-blue/10 mb-4">
            <Smartphone className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Solve Your
            <span className="text-electric-blue hero-text-glow block">
              IT Challenges?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you need immediate support or want to discuss a new project, 
            I'm here to help. Get in touch and let's make technology work for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-gradient-card border-electric-blue/20 card-hover group"
                >
                  <a href={method.action} target="_blank" rel="noopener noreferrer">
                    <CardContent className="p-6 cursor-pointer">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center group-hover:bg-electric-blue/30 transition-colors">
                          <IconComponent className="w-6 h-6 text-electric-blue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{method.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                          <p className="font-medium text-electric-blue mb-1">{method.value}</p>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{method.available}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </a>
                </Card>
              );
            })}

            {/* Emergency Contact */}
            <Card className="bg-gradient-electric border-electric-blue text-primary-foreground">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Emergency IT Support</h3>
                <p className="text-sm opacity-90 mb-4">
                  Critical system down? Network compromised? 
                  I'm available 24/7 for emergency situations.
                </p>
                <a href="tel:+254751035034">
                  <Button variant="outline" size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-electric-blue/20">
              <CardHeader>
                <CardTitle className="text-2xl">Send Me a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-tech-gray border-electric-blue/20 focus:border-electric-blue"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-tech-gray border-electric-blue/20 focus:border-electric-blue"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-tech-gray border-electric-blue/20 focus:border-electric-blue"
                        placeholder="+254 7123456789"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="service" className="text-sm font-medium">
                        Service Needed
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-tech-gray border border-electric-blue/20 rounded-md text-foreground focus:border-electric-blue focus:outline-none"
                      >
                        <option value="">Select a service</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-tech-gray border-electric-blue/20 focus:border-electric-blue min-h-32"
                      placeholder="Tell me about your project or IT needs..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" variant="electric" size="lg" className="group flex-1">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                    <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer">
                      <Button type="button" variant="glass" size="lg" className="group">
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule Call
                      </Button>
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
