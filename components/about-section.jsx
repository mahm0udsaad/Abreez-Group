"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, Users, LeafyGreen, Award } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const simpleSlideInVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.4, // Faster for features
      },
    },
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.h2
              variants={simpleSlideInVariants}
              className="text-3xl font-bold mb-6 text-blue-600"
            >
              About Abreez Group
            </motion.h2>
            <motion.p
              variants={simpleSlideInVariants}
              className="mb-4 text-gray-600"
            >
              Founded in 2013, Abreez Group has rapidly grown to become the
              leading provider of promotional gifts and integrated corporate
              solutions in the Middle East. With a strong presence in the UAE
              and Saudi Arabia, we cater to diverse needs across the region.
            </motion.p>
            <motion.p
              variants={simpleSlideInVariants}
              className="mb-4 text-gray-600"
            >
              Our commitment to quality and innovation has earned us the ISO
              certification and numerous accolades. We're driven by our vision
              to be the most inspiring brand in the industry, delivering
              creative and impactful solutions that exceed expectations.
            </motion.p>
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
                <motion.div
                  key={index}
                  variants={featureVariants}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div variants={simpleSlideInVariants} className="mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Learn More About Us
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={simpleSlideInVariants}
            className="relative flex justify-end w-full h-auto"
          >
            <Image
              src="https://abreezgroup.com/wp-content/uploads/2023/09/Catalogue-ABreez-2024-T.jpg"
              width={400}
              height={400}
              alt="About Abreez Group"
              className="rounded-lg shadow-lg object-contain"
            />
            <motion.div
              variants={simpleSlideInVariants}
              className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg"
            >
              <p className="text-2xl font-bold">10+</p>
              <p className="text-sm">Years of Excellence</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
