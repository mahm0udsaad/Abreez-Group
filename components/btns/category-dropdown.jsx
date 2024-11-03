import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CategoryMenuItem = ({ category, selectedCategory, onSelect }) => {
  const [showSubcategories, setShowSubcategories] = useState(false);
  const hasSubcategories = true;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowSubcategories(true)}
      onMouseLeave={() => setShowSubcategories(false)}
    >
      <div
        className="flex items-center justify-between px-2 py-2 hover:bg-white/30 cursor-pointer"
        onClick={() => onSelect(category.name)}
      >
        <div className="flex items-center gap-2">
          <Check
            className={cn(
              "h-4 w-4",
              selectedCategory === category.name ? "opacity-100" : "opacity-0",
            )}
          />
          <span className="text-sm font-medium">{category.name}</span>
        </div>
        {hasSubcategories && <ChevronRight className="h-4 w-4 opacity-50" />}
      </div>

      <AnimatePresence>
        {showSubcategories && hasSubcategories && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full top-0 min-w-[200px] bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-lg ml-1 py-1"
            style={{ transform: "translateX(4px)" }}
          >
            <div className="px-3 py-2 border-b border-white/20 mb-1">
              <h3 className="font-semibold text-sm opacity-70">
                Subcategories
              </h3>
            </div>
            {category.subCategories.map((sub) => (
              <motion.div
                key={sub}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                className="px-3 py-1.5 hover:bg-white/30 cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(sub);
                }}
              >
                <div className="flex items-center gap-2">
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedCategory === sub ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span>{sub}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryDropdown = ({
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (category) => {
    setSelectedCategory(category);
  };
  console.log(categories);

  return (
    <div className="relative" style={{ zIndex: 50 }}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-lg px-4 py-2 flex items-center justify-between w-48 hover:bg-white/30"
      >
        {selectedCategory || "Select category..."}
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-48 bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-lg shadow-lg"
          >
            {categories.map((category) => (
              <CategoryMenuItem
                key={category.name}
                category={category}
                selectedCategory={selectedCategory}
                onSelect={handleSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryDropdown;
