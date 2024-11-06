import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Package, Circle } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";

// Utility function to highlight text
const HighlightText = ({ text, searchTerm }) => {
  if (!searchTerm || searchTerm.length < 2) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 px-1 rounded-sm">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

const ColorSwitchingCard = ({ product, lng, searchTerm }) => {
  const [selectedColor, setSelectedColor] = useState("white");
  const { t } = useTranslation(lng, "common");

  // Find the color by ID if searchTerm matches a color's id
  const colorById = product.colors.find(
    (color) => color.id.toLowerCase() === searchTerm?.toLowerCase(),
  );

  // Set current color based on selected color or matching searchTerm
  const currentColor =
    colorById ||
    product.colors.find((c) => c.name === selectedColor) ||
    product.colors[0];

  // Handle color click to toggle selected color
  const handleColorClick = (colorName) => {
    setSelectedColor(colorName === selectedColor ? null : colorName);
  };

  // Check if any color matches the search term
  const hasColorMatch = product.colors.some(
    (color) =>
      color.id.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      color.name.toLowerCase().includes(searchTerm?.toLowerCase()),
  );

  // Determine if this product matches the search criteria
  const isMatch =
    searchTerm &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hasColorMatch);

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={isMatch ? "ring-2 ring-blue-500 rounded-lg" : ""}
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentColor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={currentColor.image}
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
              ? `${t("available")} ${product.colors.reduce(
                  (acc, c) => acc + c.available,
                  0,
                )}`
              : t("out_of_stock")}
          </Badge>
          {searchTerm &&
            product.id.toLowerCase().includes(searchTerm.toLowerCase()) && (
              <Badge className="absolute top-2 left-2 bg-yellow-100 text-yellow-800">
                ID Match
              </Badge>
            )}
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
                <HighlightText text={product.name} searchTerm={searchTerm} />
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">
                  {t("available_colors")}
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
                    } ${
                      searchTerm &&
                      (color.id
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                        color.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
                        ? "ring-2 ring-yellow-400"
                        : ""
                    }`}
                    onClick={() => handleColorClick(color.name)}
                  >
                    <div className="flex items-center gap-1">
                      <Circle
                        className="h-4 w-4"
                        fill={color.name}
                        color={color.name}
                      />
                      <span className="text-xs capitalize">
                        <HighlightText
                          text={color.name}
                          searchTerm={searchTerm}
                        />
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {color.available} pcs
                    </span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="description">
              <p className="text-sm text-gray-600">
                <HighlightText
                  text={product.description}
                  searchTerm={searchTerm}
                />
              </p>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Badge
              key={product.category.id}
              variant="outline"
              className="mt-2 mr-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
            >
              <HighlightText
                text={product.category.name}
                searchTerm={searchTerm}
              />
            </Badge>
          </div>
        </CardContent>
        <div className="mx-3 flex items-center">
          <Badge
            dir="ltr"
            variant="outline"
            className={`mt-2 mx-2 flex gap-1 ${
              searchTerm &&
              currentColor.id.toLowerCase().includes(searchTerm.toLowerCase())
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-200"
            } rounded-md hover:bg-blue-100`}
          >
            <span className="text-lg">#</span>
            <HighlightText text={currentColor.id} searchTerm={searchTerm} />
          </Badge>
        </div>
        <CardFooter className="p-4">
          <Link
            href={`/products/${product.id}`}
            className="rounded flex items-center justify-center py-2 w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          >
            {t("view_details")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ColorSwitchingCard;
