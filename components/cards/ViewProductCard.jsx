// ViewProductCard.js
"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Package,
  PenTool,
  ShoppingCart,
  ArrowLeft,
  Circle,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { sellProduct } from "@/actions/edit-product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function ViewProductCard({ product, setProduct, onEditClick }) {
  const [currentColor, setCurrentColor] = useState(product.colors[0]);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleColorClick = (colorName) => {
    setCurrentColor(
      product.colors.find((c) => c.name === colorName) || product.colors[0],
    );
  };

  const handleSell = async () => {
    if (sellQuantity > currentColor.available) {
      toast({
        title: "Error",
        description: "Cannot sell more than available quantity",
        variant: "destructive",
      });
      return;
    }

    // Save original values for potential reversion
    const originalColors = [...product.colors];
    const originalTotalAvailable = product.totalAvailable;

    // Optimistically update product state
    setProduct((prevProduct) => {
      const updatedColors = prevProduct.colors.map((color) =>
        color.id === currentColor.id
          ? { ...color, available: color.available - sellQuantity }
          : color,
      );

      return {
        ...prevProduct,
        colors: updatedColors,
        totalAvailable: prevProduct.totalAvailable - sellQuantity,
      };
    });

    startTransition(async () => {
      const result = await sellProduct(
        product.id,
        currentColor.id,
        sellQuantity,
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Sale processed successfully",
          variant: "Success",
        });
        setSellQuantity(1);
        setIsSellDialogOpen(false);
      } else {
        // Revert to original values on error
        setProduct((prevProduct) => ({
          ...prevProduct,
          colors: originalColors,
          totalAvailable: originalTotalAvailable,
        }));

        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-gray-800 border-gray-700">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentColor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={currentColor.image}
              alt={`${product.name} in ${currentColor.name}`}
              width={400}
              height={300}
              className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>
        <Badge
          variant={product.totalAvailable > 0 ? "secondary" : "destructive"}
          className="absolute top-2 right-2 bg-green-600 text-white"
        >
          {product.totalAvailable > 0
            ? `Available ${product.colors.reduce(
                (acc, c) => acc + c.available,
                0,
              )}`
            : "Out of stock"}
        </Badge>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 left-2 bg-blue-500 text-white hover:bg-blue-600"
          onClick={onEditClick}
          disabled={isPending}
        >
          <PenTool className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4 flex-grow text-gray-200">
        <h2 className="text-xl font-semibold line-clamp-1 mb-2">
          {product.name}
        </h2>
        <p className="text-sm text-gray-300 mb-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-5 w-5 text-blue-400" />
          <span className="font-semibold text-gray-200">Available Colors:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {product.colors.map((color) => (
            <Button
              key={color.name}
              variant="outline"
              className={`flex items-center justify-between px-2 py-1 h-auto transition-all duration-300 ${
                currentColor.name === color.name
                  ? "ring-2 ring-blue-500 bg-gray-700"
                  : "bg-gray-700"
              } text-gray-200 border-gray-600`}
              onClick={() => handleColorClick(color.name)}
              disabled={isPending}
            >
              <div className="flex items-center gap-1">
                <Circle
                  className="h-4 w-4"
                  fill={color.name}
                  color={color.name}
                />
                <span className="text-xs capitalize">{color.name}</span>
              </div>
              <span className="text-xs font-medium">{color.available} pcs</span>
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <Badge
            key={product.category.id}
            variant="outline"
            className="mt-2 mr-2 bg-gray-700 text-blue-400 hover:bg-gray-600 transition-colors duration-300 border-gray-600"
          >
            {product.category.name}
          </Badge>
        </div>
      </CardContent>
      <div className="mx-3 flex items-center">
        <Badge
          dir="ltr"
          variant="outline"
          className="mt-2 mx-2 flex gap-1 bg-gray-200 rounded-md hover:bg-blue-100"
        >
          <span className="text-lg">#</span>
          {product.id}
        </Badge>
      </div>
      <CardFooter className="p-4">
        <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
              disabled={isPending}
            >
              Sell
              <ShoppingCart className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-blue-400">Sell Product</DialogTitle>
              <DialogDescription className="text-gray-300">
                Select the color and quantity you want to sell for{" "}
                {product.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="colorSelect" className="text-gray-200">
                Color
              </Label>
              <select
                id="colorSelect"
                value={currentColor.id}
                onChange={(e) =>
                  setCurrentColor(
                    product.colors.find((c) => c.id === e.target.value),
                  )
                }
                className="w-full mt-1 bg-gray-700 text-white border-gray-600 rounded-md"
              >
                {product.colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="py-4">
              <Label htmlFor="sellQuantity" className="text-gray-200">
                Quantity
              </Label>
              <Input
                id="sellQuantity"
                type="number"
                value={sellQuantity}
                onChange={(e) => setSellQuantity(parseInt(e.target.value))}
                max={currentColor.available}
                min={1}
                className="mt-1 bg-gray-700 text-white border-gray-600"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsSellDialogOpen(false)}
                variant="outline"
                className="bg-gray-700 text-white border-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSell}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
