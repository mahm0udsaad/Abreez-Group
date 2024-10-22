"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
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
import {
  ChevronRight,
  Package,
  Circle,
  Search,
  ChevronLeft,
} from "lucide-react";
import productsData from "@/data/products.json";
import Image from "next/image";

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">
        Our Product Catalog
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Discover our wide range of high-quality products
      </p>
      <div className="mb-6">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div
            ref={scrollContainerRef}
            className="w-11/12 mx-auto flex overflow-x-auto space-x-2 px-4 pb-2 main-scrollbar"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={"outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "text-sm whitespace-nowrap flex-shrink-0 bg-blue-600 text-white"
                    : "text-sm whitespace-nowrap flex-shrink-0"
                }
              >
                {category}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {currentProducts.length === 0 ? (
        <div className="h-[50dvh] flex justify-center">
          <p className="text-center text-gray-500 mt-8">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="relative">
                  <Image
                    src={product.images.main}
                    alt={product.name}
                    className="w-full h-64 object-contain"
                    width={480}
                    height={360}
                  />
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
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold line-clamp-1">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Reseller Price:
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ${product.resellerPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Corporate Price:
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${product.corporatePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-gray-500" />
                        <span className="font-semibold text-gray-700">
                          Available Colors:
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {product.colors.map((color) => (
                          <div
                            key={color.name}
                            className="flex items-center justify-between bg-gray-100 rounded-md px-2 py-1"
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    {product.category.map((cat) => (
                      <Badge
                        key={cat.name}
                        variant="outline"
                        className="mt-2 mr-2"
                      >
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      {filteredProducts.length > ITEMS_PER_PAGE && (
        <Pagination className="mt-8">
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
  );
}
