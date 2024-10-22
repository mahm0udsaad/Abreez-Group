"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronRight, Gift, Briefcase, Shirt, Coffee } from "lucide-react";
import Image from "next/image";

export default function ProductSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const products = [
    {
      name: "Custom USB Drives",
      description: "High-capacity branded USB drives for your corporate needs.",
      icon: Gift,
      image: "/placeholder.svg",
    },
    {
      name: "Custom USB Drives",
      description: "High-capacity branded USB drives for your corporate needs.",
      icon: Gift,
      image: "/placeholder.svg",
    },
    {
      name: "Custom USB Drives",
      description: "High-capacity branded USB drives for your corporate needs.",
      icon: Gift,
      image: "/placeholder.svg",
    },
    {
      name: "Branded Power Banks",
      description: "Portable chargers with your company logo.",
      icon: Briefcase,
      image: "/placeholder.svg",
    },
    {
      name: "Corporate Apparel",
      description: "High-quality branded clothing for your team.",
      icon: Shirt,
      image: "/placeholder.svg",
    },
    {
      name: "Promotional Drinkware",
      description: "Branded mugs, tumblers, and water bottles.",
      icon: Coffee,
      image: "/placeholder.svg",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const ProductCard = ({ product, index }) => (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="h-full">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-blue-600 bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <product.icon className="text-white h-16 w-16" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <Button variant="outline" className="w-full group">
              Learn More
              <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section
      id="products"
      className="py-16 md:py-24 bg-gray-50 overflow-hidden"
    >
      <div className="container mx-auto" ref={ref}>
        <motion.h2
          className="text-3xl font-bold mb-12 text-center text-blue-600"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Featured Products
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Desktop view - all 4 products */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </div>

          {/* Mobile and tablet view - carousel */}
          <div className="lg:hidden">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {products.map((product, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <ProductCard product={product} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
