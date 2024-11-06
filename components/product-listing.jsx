"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import ProductHeader from "./component/products-header";
import { useTranslation } from "@/app/i18n/client";
import ColorSwitchingCard from "./cards/product-card";
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from "@/actions/get-products";

const ITEMS_PER_LOAD = 14;

export function ProductListing({ lng, initialProducts }) {
  const [loadedProducts, setLoadedProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);
  const { t } = useTranslation(lng, "common");

  // Handle search with debouncing
  useEffect(() => {
    let timer;
    const fetchProducts = async () => {
      setIsSearching(true);
      try {
        let result;
        if (searchTerm) {
          console.log("Searching for:", searchTerm);

          // If there's a search term
          const cleanSearchTerm = searchTerm.trim();
          result = await searchProducts(cleanSearchTerm, 0, ITEMS_PER_LOAD);
        } else if (selectedCategory?.id) {
          // If no search term but category selected
          result = await getProductsByCategory(
            selectedCategory.id,
            0,
            ITEMS_PER_LOAD,
          );
        } else {
          // No search term and no category
          result = await getAllProducts(0, ITEMS_PER_LOAD);
        }

        if (result.success) {
          setLoadedProducts(result.products);
          setHasMore(result.hasMore);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoadedProducts([]);
        setHasMore(false);
      } finally {
        setIsSearching(false);
      }
    };

    // Set timer for debouncing
    timer = setTimeout(fetchProducts, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      let result;

      if (searchTerm) {
        const cleanSearchTerm = searchTerm.trim();
        result = await searchProducts(
          cleanSearchTerm,
          loadedProducts.length,
          ITEMS_PER_LOAD,
        );
      } else if (selectedCategory?.id) {
        result = await getProductsByCategory(
          selectedCategory.id,
          loadedProducts.length,
          ITEMS_PER_LOAD,
        );
      } else {
        result = await getAllProducts(loadedProducts.length, ITEMS_PER_LOAD);
      }

      if (result.success && result.products.length > 0) {
        setLoadedProducts((prev) => [...prev, ...result.products]);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [searchTerm, isLoadingMore, hasMore, loadedProducts, selectedCategory]);

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isSearching
        ) {
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
  }, [loadMoreProducts, hasMore, isLoadingMore, isSearching]);

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
          {isSearching ? (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500">{t("searching")}</p>
            </motion.div>
          ) : loadedProducts.length === 0 ? (
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
              {loadedProducts.map((product) => (
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
          {isLoadingMore && <p>{t("loading_more_products")}</p>}
          {!hasMore && loadedProducts.length > 0 && (
            <p className="text-gray-500">{t("no_more_products")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
