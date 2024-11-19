"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

const mockedData = [
  {
    id: "PROD001",
    name: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt",
    category: "Clothing",
    totalAvailable: 100,
    color: {
      name: "White",
      image: "/placeholder.svg?height=50&width=50",
    },
    materials: "Cotton",
    itemSize: "S, M, L, XL",
    itemWeight: "0.2 kg",
    printingOptions: ["Screen Print", "DTG"],
  },
  {
    id: "PROD002",
    name: "Wireless Earbuds",
    description: "High-quality wireless earbuds",
    category: "Electronics",
    totalAvailable: 50,
    color: {
      name: "Black",
      image: "/placeholder.svg?height=50&width=50",
    },
    materials: "Plastic, Silicone",
    itemSize: "One Size",
    itemWeight: "0.05 kg",
    printingOptions: ["Laser Engraving"],
  },
  {
    id: "PROD003",
    name: "Ceramic Mug",
    description: "Durable ceramic mug",
    category: "Home & Garden",
    totalAvailable: 200,
    color: {
      name: "Blue",
      image: "/placeholder.svg?height=50&width=50",
    },
    materials: "Ceramic",
    itemSize: "11 oz",
    itemWeight: "0.3 kg",
    printingOptions: ["Sublimation", "Screen Print"],
  },
];

export default function ExcelDataTable({ onAccept }) {
  const [data, setData] = useState(mockedData);
  const [acceptedItems, setAcceptedItems] = useState(new Set());

  const handleAcceptItem = (id) => {
    setAcceptedItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const handleAcceptAll = () => {
    setAcceptedItems(new Set(data.map((item) => item.id)));
  };

  const handleConfirmAccepted = () => {
    const acceptedData = data.filter((item) => acceptedItems.has(item.id));
    onAccept(acceptedData);
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] w-full rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              <TableHead className="text-blue-400">ID</TableHead>
              <TableHead className="text-blue-400">Name</TableHead>
              <TableHead className="text-blue-400">Description</TableHead>
              <TableHead className="text-blue-400">Category</TableHead>
              <TableHead className="text-blue-400">Total Available</TableHead>
              <TableHead className="text-blue-400">Color</TableHead>
              <TableHead className="text-blue-400">Materials</TableHead>
              <TableHead className="text-blue-400">Size</TableHead>
              <TableHead className="text-blue-400">Weight</TableHead>
              <TableHead className="text-blue-400">Printing Options</TableHead>
              <TableHead className="text-blue-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-b border-gray-700">
                <TableCell className="text-gray-200">{item.id}</TableCell>
                <TableCell className="text-gray-200">{item.name}</TableCell>
                <TableCell className="text-gray-200 line-clamp-1">
                  {item.description}
                </TableCell>
                <TableCell className="text-gray-200">{item.category}</TableCell>
                <TableCell className="text-gray-200">
                  {item.totalAvailable}
                </TableCell>
                <TableCell className="text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={item.color.image}
                      alt={item.color.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span>{item.color.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-200">
                  {item.materials}
                </TableCell>
                <TableCell className="text-gray-200">{item.itemSize}</TableCell>
                <TableCell className="text-gray-200">
                  {item.itemWeight}
                </TableCell>
                <TableCell className="text-gray-200">
                  {item.printingOptions.join(", ")}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleAcceptItem(item.id)}
                    disabled={acceptedItems.has(item.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {acceptedItems.has(item.id) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Accepted
                      </>
                    ) : (
                      "Accept"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex justify-between">
        <Button
          onClick={handleAcceptAll}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          disabled={acceptedItems.size === data.length}
        >
          Accept All
        </Button>
        <Button
          onClick={handleConfirmAccepted}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={acceptedItems.size === 0}
        >
          Confirm Accepted ({acceptedItems.size})
        </Button>
      </div>
    </div>
  );
}
