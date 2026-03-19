import Feature from "./components/landing/Feature";
import Footer from "./components/landing/Footer";
import Hero from "./components/landing/Hero";
import SectionCta from "./components/landing/SectionCta";
import Work from "./components/landing/Work";


export default function HomePage() {

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Work />
      <Feature />
      <SectionCta />
      <Footer />
    </main>
  );
}
