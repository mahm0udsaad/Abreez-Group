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
import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";

export default function ProductSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Get first 8 products from all categories combined
  const products = productsData.categorizedProducts
    .flatMap((category) => category.products)
    .slice(0, 8);

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
              src={product.images.main}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-blue-600 bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Package className="text-white h-16 w-16" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
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
          {/* Desktop view - grid layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
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
                  <CarouselItem key={product.id} className="md:basis-1/2">
                    <ProductCard product={product} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Explore More button */}
          <motion.div className="mt-12 text-center" variants={itemVariants}>
            <Link href="/products">
              <Button size="lg" className="group bg-[color:--primary-color]">
                Explore More Products
                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
