"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Package,
  Plus,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <aside
      className={`bg-gray-800 shadow-lg transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        {isSidebarOpen && (
          <h1 className="text-2xl font-bold text-blue-400 flex items-center">
            <Image
              src="/fav.jpg"
              className="mx-2 h-6 w-6"
              width={24}
              height={24}
              alt="logo"
            />
            Admin Panel
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-blue-400 hover:bg-gray-700"
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="mt-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-200 hover:bg-gray-700"
          asChild
        >
          <Link href="/dashboard">
            <Package className="mr-2 h-4 w-4" />
            {isSidebarOpen && "Products"}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-200 hover:bg-gray-700"
          asChild
        >
          <Link href="/dashboard/add-product">
            <Plus className="mr-2 h-4 w-4" />
            {isSidebarOpen && "Add New Product"}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-200 hover:bg-gray-700"
          asChild
        >
          <Link href="/dashboard/categories">
            <Tag className="mr-2 h-4 w-4" />
            {isSidebarOpen && "Categories"}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-200 hover:bg-gray-700"
          asChild
        >
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            {isSidebarOpen && "Settings"}
          </Link>
        </Button>
      </nav>
    </aside>
  );
}
