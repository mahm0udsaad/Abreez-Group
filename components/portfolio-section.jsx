"use client";

import { useTranslation } from "@/app/i18n/client";
import { motion } from "framer-motion";
import Image from "next/image";

export const PortfolioSection = ({ lng }) => {
  const { t } = useTranslation(lng, "common");

  const portfolioItems = [
    {
      title: t("portfolio.items.usb.title"),
      image:
        "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=500&h=400&q=80",
      description: t("portfolio.items.usb.description"),
    },
    {
      title: t("portfolio.items.bottles.title"),
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&h=400&q=80",
      description: t("portfolio.items.bottles.description"),
    },
    {
      title: t("portfolio.items.giftBoxes.title"),
      image:
        "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=500&h=400&q=80",
      description: t("portfolio.items.giftBoxes.description"),
    },
    {
      title: t("portfolio.items.apparel.title"),
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&h=400&q=80",
      description: t("portfolio.items.apparel.description"),
    },
  ];

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold mb-12 text-center text-[#114270]">
          {t("portfolio.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
