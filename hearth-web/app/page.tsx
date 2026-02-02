import { Hero } from "./sections/Hero";
import { CreatureSelector } from "./sections/CreatureSelector";
import { HowItWorks } from "./sections/HowItWorks";
import { Features } from "./sections/Features";
import { WidgetShowcase } from "./sections/WidgetShowcase";
import { FAQ } from "./sections/FAQ";
import { FinalCTA } from "./sections/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream selection:bg-coral selection:text-white overflow-hidden">
      <Hero />
      <CreatureSelector />
      <HowItWorks />
      <Features />
      <WidgetShowcase />
      <FAQ />
      <FinalCTA />


    </main>
  );
}
