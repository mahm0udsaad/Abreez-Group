"use client";
import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Printer, Factory, PackageCheck } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";
import { getServices } from "@/actions/services";

const ServicesSection = ({ lng }) => {
  const { t } = useTranslation(lng, "common");
  const [services, setServices] = useState({
    PRINTING: [],
    MANUFACTURING: [],
    PACKAGING: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const result = await getServices();
        if (result.success) {
          // Categorize services
          const categorizedServices = result.data.reduce(
            (acc, service) => {
              const category = service.category.toUpperCase();
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(service);
              return acc;
            },
            {
              PRINTING: [],
              MANUFACTURING: [],
              PACKAGING: [],
            },
          );

          setServices(categorizedServices);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

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

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto">
        <motion.h2
          className="text-5xl font-bold mb-12 text-center text-[#114270]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("services.title")}
        </motion.h2>

        <Tabs defaultValue="PRINTING" className="w-full">
          <TabsList className="grid w-full h-24 sm:grid-cols-3 mb-8">
            <TabsTrigger
              value="PRINTING"
              className="text-lg flex items-center justify-center"
            >
              <Printer className="mx-2 h-6 w-6" /> {t("services.tabs.printing")}
            </TabsTrigger>
            <TabsTrigger
              value="MANUFACTURING"
              className="text-lg flex items-center justify-center"
            >
              <Factory className="mr-2 h-6 w-6" />{" "}
              {t("services.tabs.manufacturing")}
            </TabsTrigger>
            <TabsTrigger
              value="PACKAGING"
              className="text-lg flex items-center justify-center"
            >
              <PackageCheck className="mr-2 h-6 w-6" />{" "}
              {t("services.tabs.packaging")}
            </TabsTrigger>
          </TabsList>

          {/* Dynamic service categories from database */}
          {Object.entries(services).map(([category, categoryServices]) => (
            <TabsContent key={category} value={category}>
              {isLoading ? (
                <div className="text-center text-xl text-gray-500">
                  Loading services...
                </div>
              ) : categoryServices?.length === 0 ? (
                <div className="text-center text-xl text-gray-500">
                  No services found in this category
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {categoryServices.map((service) => (
                    <motion.div
                      dir={lng === "ar" ? "rtl" : "ltr"}
                      key={service.id}
                      variants={itemVariants}
                      className="bg-gray-100 rounded-lg overflow-hidden shadow-lg"
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={500}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                          {service.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ServicesSection;
