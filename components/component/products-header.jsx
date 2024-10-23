import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ProductHeader({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const scrollContainerRef = useRef(null);

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
    <>
      <div
        ref={headerRef}
        className="relative mb-8 overflow-hidden rounded-3xl shadow-lg mt-2"
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
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-green-500/40 " />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 bg-white/10 backdrop-blur-md">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2 text-center text-white flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-2 text-yellow-300" />
              Our Product Catalog
            </h1>
            <motion.p
              className="text-center text-white/90 mb-8 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover our wide range of high-quality products
            </motion.p>

            <div className="relative mb-4 max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-lg focus:border-white/50 focus:ring focus:ring-white/20 focus:ring-opacity-50 transition-all duration-300 text-white placeholder-white/70"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
          </motion.div>
        </div>
      </div>

      <div
        ref={categoriesRef}
        className={`${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md py-4"
            : "bg-transparent py-2"
        } transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-8 relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-2 px-8 py-2 no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`text-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white/80 backdrop-blur-sm text-blue-600 hover:bg-white"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
