"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Package,
  Circle,
  Search,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import productsData from "@/data/products.json";
import Image from "next/image";
import ProductHeader from "./component/products-header";

const ITEMS_PER_PAGE = 12;

// Extract unique categories from the data
const categories = [
  "All",
  ...new Set(productsData.categorizedProducts.map((category) => category.name)),
];

export function ProductListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollContainerRef = useRef(null);
  const [selectedColors, setSelectedColors] = useState({});

  // Flatten and filter products based on search and category
  const filteredProducts = useMemo(() => {
    let products = [];

    if (selectedCategory === "All") {
      // Get all products from categorizedProducts
      products = productsData.categorizedProducts.flatMap(
        (category) => category.products,
      );
    } else {
      // Get products from specific category
      const categoryData = productsData.categorizedProducts.find(
        (category) => category.name === selectedCategory,
      );
      products = categoryData ? categoryData.products : [];
    }

    // Apply search filter
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, selectedCategory]);

  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        />

        {currentProducts.length === 0 ? (
          <motion.p
            className="text-center text-gray-500 mt-8 text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            No products found.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                        product.totalAvailable > 0 ? "secondary" : "destructive"
                      }
                      className="absolute top-2 right-2"
                    >
                      {product.totalAvailable > 0
                        ? `${product.totalAvailable} available`
                        : "Out of stock"}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="description">
                          Description
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="info">
                        <h2 className="text-xl font-semibold line-clamp-1 mb-2">
                          {product.name}
                        </h2>
                        {product.colors && product.colors.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="h-5 w-5 text-blue-500" />
                              <span className="font-semibold text-gray-700">
                                Available Colors:
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
                                    {color.available} pcs
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
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredProducts.length > ITEMS_PER_PAGE && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from(
                { length: Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) },
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => paginate(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
