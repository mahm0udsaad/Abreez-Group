import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Package, Circle } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";

const ColorSwitchingCard = ({ product, lng }) => {
  const [selectedColor, setSelectedColor] = useState("white");
  const { t } = useTranslation(lng, "common");
  const generateProductId = (product) => {
    return `${product.category[0].name
      .split(" ")[0]
      .slice(0, 3)
      .toUpperCase()}${product.id}`;
  };

  const handleColorClick = (colorName) => {
    setSelectedColor(colorName === selectedColor ? null : colorName);
  };

  // Get current color data
  const currentColor =
    product.colors.find((c) => c.name === selectedColor) || product.colors[0];

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0 * 0.1 }}
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentColor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0 * 0.1 }}
            >
              <Image
                src={currentColor.image} // Dynamically update image based on selected color
                alt={`${product.name} in ${currentColor.name}`}
                width={400}
                height={300}
                className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>
          </AnimatePresence>
          <Badge
            variant={product.totalAvailable > 0 ? "secondary" : "destructive"}
            className="absolute top-2 right-2"
          >
            {product.totalAvailable > 0
              ? t("available") +
                " " +
                product.colors.reduce((acc, c) => acc + c.available, 0)
              : t("out_of_stock")}
          </Badge>
        </div>
        <CardContent className="p-4 flex-grow">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">{t("tabs.info")}</TabsTrigger>
              <TabsTrigger value="description">
                {t("tabs.description")}
              </TabsTrigger>
            </TabsList>
            <TabsContent dir={lng === "en" ? "ltr" : "rtl"} value="info">
              <h2 className="text-xl font-semibold line-clamp-1 mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">
                  <span>{t("available_colors")}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color.name}
                    variant="outline"
                    className={`flex items-center justify-between px-2 py-1 h-auto transition-all duration-300 ${
                      currentColor.name === color.name
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleColorClick(color.name)}
                  >
                    <div className="flex items-center gap-1">
                      <Circle
                        className="h-4 w-4"
                        fill={color.name}
                        color={color.name}
                      />
                      <span className="text-xs capitalize">{color.name}</span>
                    </div>
                    <span className="text-xs font-medium">
                      {color.available} pcs
                    </span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="description">
              <p className="text-sm text-gray-600">{product.description}</p>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            {product.category.map((cat) => (
              <Badge
                key={cat.name}
                variant="outline"
                className="mt-2 mr-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </CardContent>
        <div className="mx-3 flex items-center ">
          <Badge
            dir="ltr"
            variant="outline"
            className="mt-2 mx-2 flex gap-1 bg-gray-200 rounded-md hover:bg-blue-100 "
          >
            <span className="text-lg">#</span>
            {product.id}
          </Badge>
        </div>
        <CardFooter className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
            {t("view_details")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ColorSwitchingCard;
