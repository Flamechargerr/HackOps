import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Terminal,
  Shield,
  Users,
  Target,
  Award,
  BookOpen,
  Github,
  Heart,
  Zap,
  Code,
  Lock,
  Globe
} from "lucide-react";
import Header from "@/components/layout/Header";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import TiltCard from "@/components/common/TiltCard";
import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Safe Environment",
      description: "Practice real hacking techniques in a completely safe and legal sandbox. No risk of breaking real systems."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Real-World Scenarios",
      description: "Learn techniques actually used by security professionals to identify and exploit vulnerabilities."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Guided Learning",
      description: "Each challenge includes hints, explanations, and educational content to help you understand the concepts."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Gamified Progress",
      description: "Earn badges, climb the leaderboard, and track your progress as you master new skills."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join a community of security enthusiasts, share knowledge, and learn from others."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Open Source",
      description: "HackOps is completely open source. Contribute, suggest features, or learn from the codebase."
    }
  ];

  const stats = [
    { value: "25+", label: "Interactive Challenges" },
    { value: "6", label: "Security Categories" },
    { value: "15+", label: "Badges to Earn" },
    { value: "100%", label: "Free & Open Source" }
  ];

  const techStack = [
    { name: "React", description: "Frontend Framework" },
    { name: "TypeScript", description: "Type Safety" },
    { name: "Vite", description: "Build Tool" },
    { name: "Tailwind CSS", description: "Styling" },
    { name: "FastAPI", description: "Backend API" },
    { name: "MongoDB", description: "Database" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link to="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">About HackOps</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Learn <span className="text-primary">Cybersecurity</span>
              <br />
              The Right Way
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              HackOps is an interactive cybersecurity learning platform that transforms complex security concepts
              into engaging, hands-on challenges. Master real-world skills in a completely safe environment.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="glass-card p-8 md:p-12 rounded-2xl mb-20 border border-primary/20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  We believe that cybersecurity education should be accessible, engaging, and practical.
                  Traditional learning methods often leave students with theoretical knowledge but little
                  hands-on experience.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  HackOps bridges this gap by providing interactive challenges that simulate real-world
                  security scenarios. Whether you're a beginner exploring cybersecurity or an experienced
                  professional sharpening your skills, HackOps has something for you.
                </p>
              </div>
              <div className="flex justify-center">
                <TiltCard>
                  <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                    <div className="text-center">
                      <Shield className="w-20 h-20 text-primary mx-auto mb-4" />
                      <div className="text-lg font-medium">Safe Learning</div>
                      <div className="text-sm text-muted-foreground">Zero Risk, Maximum Knowledge</div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose HackOps?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built by security enthusiasts, for security enthusiasts
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <TiltCard key={feature.title}>
                  <div className="glass-card p-6 rounded-xl h-full">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Challenge Categories */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Challenge Categories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore diverse security domains with our comprehensive challenge library
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: <Terminal />, name: "Terminal", color: "from-blue-500 to-cyan-500" },
                { icon: <Lock />, name: "Password", color: "from-green-500 to-emerald-500" },
                { icon: <Globe />, name: "Encryption", color: "from-purple-500 to-pink-500" },
                { icon: <Code />, name: "XSS", color: "from-orange-500 to-red-500" },
                { icon: <Shield />, name: "SQL", color: "from-yellow-500 to-orange-500" },
                { icon: <Zap />, name: "Blockchain", color: "from-indigo-500 to-purple-500" },
              ].map((cat) => (
                <div
                  key={cat.name}
                  className="glass-card p-4 rounded-xl text-center group hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => navigate("/challenges")}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <div className="font-medium text-sm">{cat.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Built With Modern Tech</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                HackOps is built with a robust, modern technology stack
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack.map((tech) => (
                <div key={tech.name} className="glass-card p-4 rounded-xl text-center">
                  <div className="font-bold text-primary mb-1">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Source */}
          <div className="glass-card p-8 md:p-12 rounded-2xl mb-20 border border-primary/20 text-center">
            <Github className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Open Source & Free Forever</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              HackOps is completely open source under the MIT license. Contribute to the project,
              report issues, or learn from the codebase on GitHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/Flamechargerr/HackOps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="glow" size="lg">
                  <Github className="mr-2 w-5 h-5" />
                  View on GitHub
                </Button>
              </a>
              <a
                href="https://github.com/Flamechargerr/HackOps#contributing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 w-5 h-5" />
                  Contribute
                </Button>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground mb-8">
              Jump into your first challenge and begin your cybersecurity journey today.
            </p>
            <Button variant="glow" size="lg" onClick={() => navigate("/challenges")}>
              <Zap className="mr-2 w-5 h-5" />
              Explore Challenges
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/10 py-10 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Terminal size={20} className="text-primary" />
            <span className="font-mono font-bold text-lg">HackOps</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HackOps. Open source cybersecurity training platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
