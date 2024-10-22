import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Gift,
  Box,
  Briefcase,
  Shirt,
  LeafyGreen,
  Award,
  Users,
  ChevronRight,
} from "lucide-react";
import { HeroSection } from "../hero-section";
import Image from "next/image";
import AboutSection from "../about-section";
import ProductSection from "../product-section";
export default function RefinedLandingPage() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <section id="clients" className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-600">
            Our Trusted Clients
          </h2>
          <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={`/placeholder.svg?height=80&width=120&text=Client+${
                    index + 1
                  }`}
                  alt={`Client ${index + 1}`}
                  className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <AboutSection />

      <section id="services" className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-600">
            Our Comprehensive Services
          </h2>
          <Tabs defaultValue="corporate" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:max-w-[800px] mx-auto mb-8">
              <TabsTrigger value="corporate">Corporate Solutions</TabsTrigger>
              <TabsTrigger value="events">Event Services</TabsTrigger>
              <TabsTrigger value="printing">Printing Solutions</TabsTrigger>
            </TabsList>
            {["corporate", "events", "printing"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Gift,
                      title: "Corporate Gifts",
                      description: "Innovative promotional items",
                    },
                    {
                      icon: Box,
                      title: "Luxury Gift Boxes",
                      description: "Premium packaging solutions",
                    },
                    {
                      icon: Briefcase,
                      title: "Corporate Branding",
                      description: "Cohesive brand identity",
                    },
                    {
                      icon: Shirt,
                      title: "Uniforms",
                      description: "Custom-designed workwear",
                    },
                    {
                      icon: LeafyGreen,
                      title: "Eco-Friendly Products",
                      description: "Sustainable promotional items",
                    },
                    {
                      icon: Award,
                      title: "Recognition Awards",
                      description: "Custom trophies and plaques",
                    },
                  ].map((service, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <service.icon className="h-5 w-5 mr-2 text-blue-600" />
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src="/placeholder.svg?height=150&width=300"
                          alt={service.title}
                          className="w-full h-32 object-cover mb-4 rounded"
                        />
                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

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
