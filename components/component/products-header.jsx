import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/app/i18n/client";

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
  // Process categories to ensure they're in the correct format
  const processedCategories = Array.isArray(categories)
    ? categories.map((cat) => (typeof cat === "string" ? cat : cat.name))
    : [];

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

  return (
    <>
      <div
        ref={headerRef}
        className="relative mb-8 overflow-hidden rounded-3xl shadow-lg pt-4"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-cover.png"
            alt="Header background"
            width={1920}
            height={400}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-green-500/40 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 bg-white/10 ">
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
              className="text-center text-white/90 mb-8 text-lg"
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-white/30 bg-white/20 backdrop-blur-lg focus:border-white/50 focus:ring focus:ring-white/20 focus:ring-opacity-50 transition-all duration-300 text-white placeholder-white/70"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={false}
                    className="w-[200px] justify-between border-2 border-white/30 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white"
                  >
                    {t(`categories.${selectedCategory}`) ||
                      "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {processedCategories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="flex items-center"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategory === category
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {t(`categories.${category}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        ref={categoriesRef}
        className={`${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md py-4"
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={false}
                  className="w-[200px] justify-between"
                >
                  {t(`categories.${selectedCategory}`) || "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {processedCategories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {t(`categories.${category}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
