"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Package, Circle } from "lucide-react";
import productsData from "@/data/products.json";
import Image from "next/image";
import ProductHeader from "./component/products-header";
import { useTranslation } from "@/app/i18n/client";

const ITEMS_PER_LOAD = 12;

const categories = ["All", ...productsData.categories.map((cat) => cat.name)];

export function ProductListing({ lng }) {
  const [loadedProducts, setLoadedProducts] = useState(ITEMS_PER_LOAD);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColors, setSelectedColors] = useState({});
  const loadMoreRef = useRef(null);
  const { t } = useTranslation(lng, "common");

  // Add debouncing effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Enhanced filtered products with search functionality
  const filteredProducts = useMemo(() => {
    let products = [];

    if (selectedCategory === "All") {
      products = productsData.categorizedProducts.flatMap(
        (category) => category.products,
      );
    } else {
      const categoryData = productsData.categorizedProducts.find(
        (category) => category.name === selectedCategory,
      );
      products = categoryData ? categoryData.products : [];
    }

    return products.filter((product) => {
      const searchMatches =
        product.name.toLowerCase().includes(debouncedSearchTerm) ||
        product.description.toLowerCase().includes(debouncedSearchTerm) ||
        product.category.some((cat) =>
          cat.name.toLowerCase().includes(debouncedSearchTerm),
        ) ||
        product.colors.some((color) =>
          color.name.toLowerCase().includes(debouncedSearchTerm),
        );

      return searchMatches;
    });
  }, [debouncedSearchTerm, selectedCategory]);

  // Reset loadedProducts when search term or category changes
  useEffect(() => {
    setLoadedProducts(ITEMS_PER_LOAD);
  }, [debouncedSearchTerm, selectedCategory]);

  // Get the current products to display
  const currentProducts = filteredProducts.slice(0, loadedProducts);

  // Function to load more products
  const loadMoreProducts = () => {
    if (loadedProducts < filteredProducts.length) {
      setLoadedProducts((prev) => prev + ITEMS_PER_LOAD);
    }
  };

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadedProducts, filteredProducts]);

  const handleColorClick = (productId, colorName) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: prev[productId] === colorName ? null : colorName,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <ProductHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          lng={lng}
        />

        <div className="min-h-screen">
          {currentProducts.length === 0 ? (
            <motion.p
              className="text-center text-gray-500 mt-8 text-xl min-h-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t("no_products_found")}
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.images.main}
                        alt={product.name}
                        width={480}
                        height={360}
                        className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                      <AnimatePresence>
                        {selectedColors[product.id] && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                            style={{
                              backgroundColor: selectedColors[product.id],
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <Badge
                        variant={
                          product.totalAvailable > 0
                            ? "secondary"
                            : "destructive"
                        }
                        className="absolute top-2 right-2"
                      >
                        {product.totalAvailable > 0
                          ? t("available") +
                            " " +
                            product.colors.reduce(
                              (acc, c) => acc + c.available,
                              0,
                            )
                          : t("out_of_stock")}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <Tabs defaultValue="info" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="info">
                            {t("tabs.info")}
                          </TabsTrigger>
                          <TabsTrigger value="description">
                            {t("tabs.description")}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent
                          dir={lng === "en" ? "ltr" : "rtl"}
                          value="info"
                        >
                          <h2 className="text-xl font-semibold line-clamp-1 mb-2">
                            {product.name}
                          </h2>
                          {product.colors && product.colors.length > 0 && (
                            <div className="mt-4">
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
                                      selectedColors[product.id] === color.name
                                        ? "ring-2 ring-blue-500 bg-blue-50"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      handleColorClick(product.id, color.name)
                                    }
                                  >
                                    <div className="flex items-center gap-1">
                                      <Circle
                                        className="h-4 w-4"
                                        fill={color.name}
                                        color={color.name}
                                      />
                                      <span className="text-xs capitalize">
                                        {color.name}
                                      </span>
                                    </div>
                                    <span className="text-xs font-medium">
                                      {color.available} {t("pcs")}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="description">
                          <p className="text-sm text-gray-600">
                            {product.description}
                          </p>
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
                    <CardFooter className="p-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
                        {t("view_details")}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div
          ref={loadMoreRef}
          className="h-20 flex justify-center items-center"
        >
          {loadedProducts < filteredProducts.length && (
            <p>{t("loading_more_products")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
