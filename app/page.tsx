import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LogoMarquee } from "@/components/LogoMarquee";
import { IntroSplit } from "@/components/IntroSplit";
import { WhyChoose } from "@/components/WhyChoose";
import { StepsSection } from "@/components/StepsSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Pillars } from "@/components/Pillars";
import { ThreadPreview } from "@/components/ThreadPreview";
import { SocialProof } from "@/components/SocialProof";
import { Testimonials } from "@/components/Testimonials";
import { PricingSection } from "@/components/PricingSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { FaqSection } from "@/components/FaqSection";
import { ClosingCta } from "@/components/ClosingCta";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <IntroSplit />
        <WhyChoose />
        <StepsSection />
        <ProductShowcase />
        <Pillars />
        <ThreadPreview />
        <SocialProof />
        <Testimonials />
        <PricingSection />
        <ArticlesSection />
        <FaqSection />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
