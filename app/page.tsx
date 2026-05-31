import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhyChoose } from "@/components/WhyChoose";
import { Features } from "@/components/Features";
import { StepsSection } from "@/components/StepsSection";
import { PricingSection } from "@/components/PricingSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyChoose />
        <Features />
        <StepsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
