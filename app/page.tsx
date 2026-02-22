import HeroRegisterSection from "@/components/HeroRegisterSection";
import UseCaseSection from "@/components/UseCaseSection";
import PreRegisterSection from "@/components/PreRegisterSection";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroRegisterSection />
      <UseCaseSection />
      <PreRegisterSection />
    </main>
  );
}
