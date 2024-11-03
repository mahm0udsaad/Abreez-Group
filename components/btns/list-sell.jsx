"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function SellDialog({ productName, colors, onSell }) {
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);

  const handleSell = () => {
    if (selectedColorId) {
      onSell(selectedColorId, sellQuantity);
      setIsSellDialogOpen(false);
      setSelectedColorId(null);
      setSellQuantity(1);
    }
  };

  return (
    <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">
          Sell
          <ShoppingCart className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-blue-400">Sell Product</DialogTitle>
          <DialogDescription className="text-gray-300">
            Select the color and quantity you want to sell for {productName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="colorSelect" className="text-gray-200">
            Color
          </Label>
          <Select onValueChange={setSelectedColorId}>
            <SelectTrigger className="w-full mt-1 bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {colors.map((color) => (
                <SelectItem key={color.id} value={color.id}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            max={
              selectedColorId
                ? colors.find((c) => c.id === selectedColorId)?.available
                : undefined
            }
            min={1}
            className="mt-1 bg-gray-700 text-white border-gray-600"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSell}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!selectedColorId}
          >
            Confirm Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
