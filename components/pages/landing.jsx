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

export default function RefinedLandingPage() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <section id="clients" className="py-16 md:py-24 bg-gray-100">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-600">
            Our Trusted Clients
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
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
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                About Abreez Group
              </h2>
              <p className="mb-4 text-gray-600">
                Founded in 2013, Abreez Group has rapidly grown to become the
                leading provider of promotional gifts and integrated corporate
                solutions in the Middle East. With a strong presence in the UAE
                and Saudi Arabia, we cater to diverse needs across the region.
              </p>
              <p className="mb-4 text-gray-600">
                Our commitment to quality and innovation has earned us the ISO
                certification and numerous accolades. We're driven by our vision
                to be the most inspiring brand in the industry, delivering
                creative and impactful solutions that exceed expectations.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Gift,
                    title: "10,000+ Products",
                    description: "Extensive range of promotional items",
                  },
                  {
                    icon: Users,
                    title: "Regional Presence",
                    description: "Strong foothold in UAE and Saudi Arabia",
                  },
                  {
                    icon: LeafyGreen,
                    title: "Eco-Friendly",
                    description: "Sustainable gift solutions",
                  },
                  {
                    icon: Award,
                    title: "ISO Certified",
                    description: "Committed to quality and excellence",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="About Abreez Group"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <p className="text-2xl font-bold">10+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section id="products" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-600">
            Featured Products
          </h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {[
                {
                  name: "Custom USB Drives",
                  description:
                    "High-capacity branded USB drives for your corporate needs.",
                },
                {
                  name: "Eco-Friendly Notebooks",
                  description:
                    "Sustainable notebooks made from recycled materials.",
                },
                {
                  name: "Branded Power Banks",
                  description: "Portable chargers with your company logo.",
                },
                {
                  name: "Corporate Gift Sets",
                  description: "Curated gift sets for executives and clients.",
                },
                {
                  name: "Custom Apparel",
                  description: "High-quality branded clothing for your team.",
                },
                {
                  name: "Promotional Drinkware",
                  description: "Branded mugs, tumblers, and water bottles.",
                },
              ].map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center p-6">
                        <img
                          src="/placeholder.svg?height=200&width=200"
                          alt={product.name}
                          className="w-full h-48 object-cover mb-4 rounded"
                        />
                        <h3 className="font-semibold text-lg mb-2 text-center">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-4">
                          {product.description}
                        </p>
                        <Button variant="outline" className="mt-auto">
                          Learn More
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container text-center">
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
