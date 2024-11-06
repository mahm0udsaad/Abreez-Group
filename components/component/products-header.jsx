import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";
import { CategorySelector } from "@/components/component/client-cat-selector"; // Update the import path as needed

export default function ProductHeader({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  lng,
}) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const { t } = useTranslation(lng, "common");

  useEffect(() => {
    const handleScroll = () => {
      if (categoriesRef.current && headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setIsSticky(headerBottom <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Assuming you want to store just the name
  };

  // Transform your categories data to match the CategorySelector format
  const transformedCategories = Array.isArray(categories)
    ? categories.map((cat) => ({
        id: typeof cat === "string" ? cat : cat.id,
        name: typeof cat === "string" ? cat : cat.name,
        // Add other necessary properties like subcategories if needed
      }))
    : [];

  return (
    <>
      <div
        ref={headerRef}
        className="relative mb-8 overflow-hidden pt-4 rounded-b-lg"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-cover.png"
            alt="Header background"
            width={1920}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-green-500/40 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 p-12">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2 text-center text-white flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-2 text-yellow-300" />
              {t("catalog.title")}
            </h1>
            <motion.p
              className="text-center text-white/90 mb-8 text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("catalog.description")}
            </motion.p>

            <div className="flex gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={t("catalog.searchPlaceholder")}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-white/30 bg-white/20 backdrop-blur-lg focus:border-white/50 focus:ring focus:ring-white/20 focus:ring-opacity-50 transition-all duration-300 text-white placeholder-white/70"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              </div>

              <CategorySelector
                onSelect={handleCategorySelect}
                selectedCategory={selectedCategory}
                categories={transformedCategories}
                t={t}
                placeholder="Select category..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div
        ref={categoriesRef}
        className={`${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-lg shadow-md py-4"
            : "hidden"
        } transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/20 backdrop-blur-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <CategorySelector
              onSelect={handleCategorySelect}
              selectedCategory={selectedCategory}
              categories={transformedCategories}
              t={t}
              placeholder="Select category..."
            />
          </div>
        </div>
      </div>
    </>
  );
}
