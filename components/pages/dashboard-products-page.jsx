"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid, List } from "lucide-react";
import ProductCard from "../cards/dashboard-product-card";
import SellDialog from "../btns/list-sell";
import { CategorySelector } from "../component/dash-categories-selection";

const categories = ["All", "Clothing", "Electronics", "Home & Garden"];

export default function ProductsView({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" ||
        product.category.id === selectedCategory.id),
  );

  return (
    <>
      <div className="mb-6 flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              className="pl-10 bg-gray-800 text-white border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-48">
          <CategorySelector
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={`${
              viewMode === "grid" ? "bg-blue-500" : "bg-gray-800"
            } text-white border-gray-700`}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={`${
              viewMode === "list" ? "bg-blue-500" : "bg-gray-800"
            } text-white border-gray-700`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={(updatedProduct) => {
                setProducts(
                  products.map((p) =>
                    p.id === updatedProduct.id ? updatedProduct : p,
                  ),
                );
              }}
            />
          ))}
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Total Available
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Colors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filteredProducts?.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {product.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {product.totalAvailable}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <div key={color.id} className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-1"
                          style={{ backgroundColor: color.name }}
                        />
                        <span className="text-gray-200">
                          {color.name} ({color.available})
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SellDialog
                    colors={product.colors}
                    onSell={() => {}}
                    productName={product.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
