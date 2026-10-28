import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoryStage } from "@/components/story/StoryStage";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServicesList } from "@/components/sections/ServicesList";
import { Proof } from "@/components/sections/Proof";
import { FinalCta } from "@/components/sections/FinalCta";
console.log("dsagd");

export default function Home() {
  return (
    <>
      <a
        href="#how-it-works"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip the story
      </a>
      <Header />
      <main>
        <StoryStage />
        <HowItWorks />
        <ServicesList />
        <Proof />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
