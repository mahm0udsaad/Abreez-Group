"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProductHeader from "./component/products-header";
import { useTranslation } from "@/app/i18n/client";
import ColorSwitchingCard from "./cards/product-card";
import { getAllProducts, getProductsByCategory } from "@/actions/get-products";

const ITEMS_PER_LOAD = 14;

export function ProductListing({ lng, initialProducts }) {
  const [loadedProducts, setLoadedProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
  const { t } = useTranslation(lng, "common");
  const [currentProducts, setCurrentProducts] = useState([]);
  let filteredProducts = [];
  // Add debouncing effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const getFilteredProducts = async () => {
      let products = loadedProducts;

      if (selectedCategory !== "All") {
        const { products: categoryProducts } = await getProductsByCategory(
          selectedCategory,
          0,
          loadedProducts.length,
        );
        products = categoryProducts || [];
      }

      // Filter products based on search term or color ID
      const filtered = products.filter((product) => {
        const searchMatches =
          product.name.toLowerCase().includes(debouncedSearchTerm) ||
          product.description.toLowerCase().includes(debouncedSearchTerm) ||
          product.category.some((cat) =>
            cat.name.toLowerCase().includes(debouncedSearchTerm),
          ) ||
          product.colors.some(
            (color) =>
              color.name.toLowerCase().includes(debouncedSearchTerm) ||
              color.id.toLowerCase() === debouncedSearchTerm,
          ) ||
          product.id.toLowerCase() === debouncedSearchTerm;

        return searchMatches;
      });

      setCurrentProducts(filtered);
    };

    getFilteredProducts();
  }, [debouncedSearchTerm, selectedCategory, loadedProducts]);

  // Reset loadedProducts when search term or category changes
  useEffect(() => {
    setLoadedProducts(initialProducts);
  }, [debouncedSearchTerm, selectedCategory, initialProducts]);

  const loadMoreProducts = async () => {
    if (isLoadingMore || loadedProducts.length >= filteredProducts.length)
      return;

    setIsLoadingMore(true);

    const { success, products } = await getAllProducts(
      loadedProducts.length,
      ITEMS_PER_LOAD,
    );

    if (success) {
      setLoadedProducts((prev) => [...prev, ...products]);
    }

    setIsLoadingMore(false);
  };

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { rootMargin: "200px" },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreProducts, filteredProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <ProductHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
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
              {currentProducts.map((product) => (
                <ColorSwitchingCard
                  key={product.id}
                  product={product}
                  lng={lng}
                  searchTerm={searchTerm}
                />
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
