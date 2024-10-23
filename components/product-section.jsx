"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import productsData from "@/data/products.json";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";

export default function ProductSection({ lng }) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);
  const { t } = useTranslation(lng, "common");
  const products = productsData.allProducts;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let productInterval;
    if (isInView) {
      productInterval = setInterval(() => {
        const itemsPerSlide = isMobile ? 2 : 3;
        const maxIndex = Math.ceil(products.length / itemsPerSlide) - 1;
        setCurrentProductIndex((prevIndex) => (prevIndex + 1) % maxIndex);
      }, 4000);
    }
    return () => clearInterval(productInterval);
  }, [isInView, products.length, isMobile]);

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

  const ProductCard = ({ product }) => (
    <motion.div variants={itemVariants} className="h-full w-full">
      <Card className="h-full">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={product.images.main}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-contain"
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
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => router.push("/products")}
            className="flex items-center text-[#114270] font-semibold p-1"
          >
            {t("learnMore")} <ArrowRight className="mx-2 w-4 h-4" />
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold mb-12 text-center text-[#114270]">
          {t("featuredProducts")}
        </h2>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: `${lng === "ar" ? "" : "-"}${currentProductIndex * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          >
            {Array.from({
              length: Math.ceil(products.length / (isMobile ? 2 : 3)),
            }).map((_, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 flex gap-4 md:gap-8"
              >
                {products
                  .slice(
                    index * (isMobile ? 2 : 3),
                    index * (isMobile ? 2 : 3) + (isMobile ? 2 : 3),
                  )
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
