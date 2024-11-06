"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Package,
  Printer,
  Stamp,
  Scale,
  Ruler,
  X,
} from "lucide-react";

export default function ProductDetailsPage({ product }) {
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0].id || null,
  );

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-white dark:bg-gray-900 overflow-y-auto"
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              className="text-gray-600 dark:text-gray-300"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="mx-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative aspect-square">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedColor || "default"}
                    src={
                      selectedColor
                        ? product.colors.find((c) => c.id === selectedColor)
                            ?.image
                        : product.colors[0].image
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex gap-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {product.name}
                </h1>
                {selectedColor && (
                  <Badge variant="secondary" className="text-sm">
                    {selectedColor.split("C")[1]}
                  </Badge>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Available Colors:
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Badge
                      key={color.id}
                      variant="outline"
                      className={`px-3 py-1 cursor-pointer transition-all flex items-center gap-2 ${
                        selectedColor === color.id
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedColor(color.id)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color.name }}
                      />
                      <span className="text-gray-900 dark:text-gray-100">
                        {color.name} ({color.available})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Product Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="p-2">
                      <Package className="h-4 w-4" />
                    </Badge>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Category
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.category.parent.name} &gt;{" "}
                        {product.category.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="p-2">
                      <Package className="h-4 w-4" />
                    </Badge>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Materials
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.materials}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="p-2">
                      <Ruler className="h-4 w-4" />
                    </Badge>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Item Size
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.itemSize}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="p-2">
                      <Scale className="h-4 w-4" />
                    </Badge>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Item Weight
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.itemWeight}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Printing Options:
                  </h3>
                  <ul className="space-y-2">
                    {product.printingOptions.map((option) => (
                      <li key={option.id} className="flex items-center gap-2">
                        <Badge variant="outline" className="p-1">
                          {option.name.toLowerCase().includes("printing") ? (
                            <Printer className="h-4 w-4" />
                          ) : (
                            <Stamp className="h-4 w-4" />
                          )}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {option.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Product Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Placeholder for similar products */}
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                Similar Product 1
              </div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                Similar Product 2
              </div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                Similar Product 3
              </div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                Similar Product 4
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
