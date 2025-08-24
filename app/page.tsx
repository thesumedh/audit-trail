import { LandingPage } from "../components/landing-page";
import { ThemeToggle } from "../components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <LandingPage />
    </div>
  );
}
