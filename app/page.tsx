import HeroSection from "@/components/HeroSection";
import UseCaseSection from "@/components/UseCaseSection";
import PreRegisterSection from "@/components/PreRegisterSection";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <UseCaseSection />
      <PreRegisterSection />
    </main>
  );
}
