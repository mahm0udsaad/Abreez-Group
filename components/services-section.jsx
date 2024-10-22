"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Factory, PackageCheck } from "lucide-react"; // Import Lucide Icons
import servicesData from "@/data/services";

// Service categories mapping
const serviceCategories = {
  printing: [
    "UV Printing Service",
    "Commercial Screen Printing",
    "Pad Printing Service",
    "Digital Printing Service",
    "Heat Transfer T-Shirt Service",
    "Sublimation Printing Service",
    "Digital Printing Sandblast Effect",
    "PVC ID Card Printing",
  ],
  manufacturing: [
    "Laser Cutting & Engraving",
    "Crystal Laser 2D / 3D Engraving",
    "Router and Manual Cutting",
    "Laser Metal Markings",
    "Assembly",
    "Custom Made Products",
    "Embroidery & Stitching",
    "Epoxy Coating",
  ],
  packaging: [
    "Box Making",
    "Folder Making",
    "Commercial & Industrial Labels & Tags",
    "Hot Foiling",
    "Debossing /Embossing  Service",
    "Vinyl Cutting",
  ],
};

const ServicesSection = () => {
  // Access the services array from the imported data
  const { services } = servicesData;

  // Remove the first service since it's just a title
  const filteredServices =
    services?.filter((service) => service.id !== 1) || [];

  const categorizeServices = (services) => {
    const categorized = {
      printing: [],
      manufacturing: [],
      packaging: [],
    };

    services.forEach((service) => {
      if (serviceCategories.printing.includes(service.title)) {
        categorized.printing.push(service);
      } else if (serviceCategories.manufacturing.includes(service.title)) {
        categorized.manufacturing.push(service);
      } else if (serviceCategories.packaging.includes(service.title)) {
        categorized.packaging.push(service);
      }
    });

    return categorized;
  };

  const categorizedServices = categorizeServices(filteredServices);

  // Animation variants
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

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto" ref={ref}>
        <motion.h2
          className="text-3xl font-bold mb-12 text-center text-blue-600"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Our Comprehensive Services
        </motion.h2>

        <Tabs defaultValue="printing" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="printing"
              className="text-lg flex items-center justify-center"
            >
              <Printer className="mr-2 h-6 w-6" /> Printing Solutions
            </TabsTrigger>
            <TabsTrigger
              value="manufacturing"
              className="text-lg flex items-center justify-center"
            >
              <Factory className="mr-2 h-6 w-6" /> Manufacturing Services
            </TabsTrigger>
            <TabsTrigger
              value="packaging"
              className="text-lg flex items-center justify-center"
            >
              <PackageCheck className="mr-2 h-6 w-6" /> Packaging Solutions
            </TabsTrigger>
          </TabsList>

          {Object.entries(categorizedServices).map(([category, services]) => (
            <TabsContent key={category} value={category}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {services.map((service) => (
                  <motion.div key={service.id} variants={itemVariants}>
                    <Card className="transition-all duration-300 hover:shadow-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 relative">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="object-cover w-full h-68"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <h3 className="text-xl font-semibold mb-2">
                            {service.title}
                          </h3>
                          <p className="text-gray-600">
                            {service.description || service.fullContent}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ServicesSection;
