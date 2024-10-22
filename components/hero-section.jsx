"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  Target,
  LeafyGreen,
  Palette,
} from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-blue-900">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }} // Reduced duration for faster fade-in
      >
        <Image
          src="/hero-cover.png" // New image
          alt="Hero background"
          layout="fill" // Makes the image fill the entire section
          objectFit="cover" // Ensures the image covers the entire area without distortion
          quality={100} // High quality image
          className="opacity-30"
        />
      </motion.div>

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} // Reduced duration for faster animation
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Elevate Your Brand with Abreez Group
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Leading provider of promotional gifts and integrated corporate
              solutions in the Middle East since 2013.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-blue-600 hover:text-blue-700 bg-white hover:bg-gray-100"
            >
              Explore Our Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }} // Reduced duration and delay for faster appearance
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg transform -rotate-3"></div>
            <Card className="relative bg-white/95 backdrop-blur-sm shadow-xl transform rotate-3">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  Discover Our Solutions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    icon: Sparkles,
                    title: "Innovative Products",
                    description:
                      "Cutting-edge promotional items that make a lasting impression.",
                  },
                  {
                    icon: Target,
                    title: "Tailored Branding",
                    description:
                      "Custom solutions to elevate your corporate identity.",
                  },
                  {
                    icon: LeafyGreen,
                    title: "Eco-Friendly Options",
                    description:
                      "Sustainable choices for environmentally conscious brands.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }} // Faster transition for items
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <item.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group">
                    Get a Custom Quote
                    <Palette className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }} // Reduced duration and delay for faster slide-up
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
        >
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </motion.div>
    </section>
  );
}
