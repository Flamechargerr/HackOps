import Header from "@/components/Header";
import { Link } from "react-router-dom";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">About HackerPro</h1>
      <p className="text-muted-foreground mb-8 max-w-xl text-center">
        This platform offers interactive ethical hacking challenges to help you learn cybersecurity skills in a fun and safe environment.
      </p>
      <Link to="/" className="text-primary hover:underline">Back to Home</Link>
    </main>
  </div>
);

export default About; 