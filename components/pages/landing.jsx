import { Button } from "@/components/ui/button";
import { HeroSection } from "../hero-section";
import Image from "next/image";
import dynamic from "next/dynamic";
import ClientSecion from "../clients-secion";
import AboutSection from "../about-section";
const ProductSection = dynamic(() => import("../product-section"), {
  loading: () => <div>Loading...</div>,
});
const ServicesSection = dynamic(() => import("../services-section"), {
  loading: () => <div>Loading...</div>,
});

export default function RefinedLandingPage() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <ClientSecion />
      <AboutSection />
      <ServicesSection />

      <ProductSection />

      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-400 text-white relative">
        <Image
          src="https://abreezgroup.com/wp-content/uploads/2022/02/mid-banner.jpg"
          layout="fill"
          alt="About Abreez Group"
          className="rounded-lg shadow-lg absolute inset-0 object-cover opacity-50"
        />
        <div className="container mx-auto text-center relative">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's create impactful promotional solutions tailored to your needs.
          </p>
          <Button size="lg" variant="secondary">
            Get Started Today
          </Button>
        </div>
      </section>
    </main>
  );
}
