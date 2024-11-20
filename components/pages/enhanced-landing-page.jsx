"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";
import { Gift, Briefcase, Palette, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ServicesSection from "../services-section";
import { AnimatedSection } from "../wrappers/autoScroll";
import { PortfolioSection } from "../portfolio-section";
import ClientSecion from "../clients-secion";
import ProductSection from "../product-section";
import FAQSection from "../faq-section";
import Link from "next/link";
import ContactForm from "../forms/contact-form";

export function EnhancedLandingPage({ lng, heroImages }) {
  const { t } = useTranslation(lng, "common");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const { scrollYProgress } = useScroll();

  const testimonials = [
    {
      text: t("testimonials.items.0.text"),
      author: t("testimonials.items.0.author"),
      position: t("testimonials.items.0.position"),
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    },
    {
      text: t("testimonials.items.1.text"),
      author: t("testimonials.items.1.author"),
      position: t("testimonials.items.1.position"),
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    },
    {
      text: t("testimonials.items.2.text"),
      author: t("testimonials.items.2.author"),
      position: t("testimonials.items.2.position"),
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
    },
  ];

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages?.length);
    }, 5000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex(
        (prevIndex) => (prevIndex + 1) % testimonials.length,
      );
    }, 6000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#2495d3] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 ">
          {heroImages?.length === 1 ? (
            <Image
              key={heroImages[0]}
              src={heroImages[0]}
              alt={t("hero.imageAlt", { number: 1 })}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            heroImages.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentHeroIndex ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={src}
                  alt={t("hero.imageAlt", { number: index + 1 })}
                  layout="fill"
                  objectFit="cover "
                />
              </motion.div>
            ))
          )}
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-5" />

        <div className="relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold mb-4 drop-shadow-lg"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl mb-8 drop-shadow-md"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/products"
              className="bg-[#2495d3] text-white px-8 py-3 rounded-full font-semibold text-lg transition duration-300 hover:bg-[#0d355a] shadow-lg"
            >
              {t("hero.cta")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <AnimatedSection>
        <section
          id="about"
          className="py-20 bg-gradient-to-br from-[#114270] to-[#3b82f6] text-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-12 text-center">
              {t("about.title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6">{t("about.description1")}</p>
                <p className="text-lg">{t("about.description2")}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: t("about.stats.products.title"),
                    subtitle: t("about.stats.products.subtitle"),
                    icon: Gift,
                  },
                  {
                    title: t("about.stats.presence.title"),
                    subtitle: t("about.stats.presence.subtitle"),
                    icon: Briefcase,
                  },
                  {
                    title: t("about.stats.solutions.title"),
                    subtitle: t("about.stats.solutions.subtitle"),
                    icon: Palette,
                  },
                  {
                    title: t("about.stats.certification.title"),
                    subtitle: t("about.stats.certification.subtitle"),
                    icon: CheckCircle,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white bg-opacity-10 p-6 rounded-lg text-center backdrop-blur-sm"
                  >
                    <item.icon className="w-12 h-12 mx-auto mb-4 text-[#8cc63f]" />
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Section */}
      <Suspense fallback={<div>Loading...</div>}>
        <AnimatedSection>
          <ServicesSection lng={lng} />
        </AnimatedSection>
      </Suspense>

      {/* Featured Products Section */}
      <Suspense fallback={<div>Loading...</div>}>
        <AnimatedSection>
          <ProductSection lng={lng} />
        </AnimatedSection>
      </Suspense>

      {/* Portfolio Section */}
      <AnimatedSection>
        <PortfolioSection lng={lng} />
      </AnimatedSection>

      {/* Testimonial Section */}
      <AnimatedSection>
        <section
          id="testimonials"
          className="py-20 bg-gradient-to-br from-[#114270] to-[#3b82f6] text-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-12 text-center">
              {t("testimonials.title")}
            </h2>
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="relative h-64"
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: index === currentTestimonialIndex ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm">
                      <p className="text-xl italic mb-4">{testimonial.text}</p>
                      <div className="flex items-center">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          width={50}
                          height={50}
                          className="rounded-full mr-4"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Client Section */}
      <AnimatedSection>
        <ClientSecion lng={lng} />
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection>
        <FAQSection lng={lng} />
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection>
        <ContactForm t={t} />
      </AnimatedSection>
    </div>
  );
}
