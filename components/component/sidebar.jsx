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
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";
import { UserButton } from "@clerk/nextjs";

export default function SideBar({ lng }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useTranslation(lng, "dashboard");
  return (
    <aside
      className={`bg-gray-800 shadow-lg transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="">
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
                {t("adminPanel")}
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
                {isSidebarOpen && t("products")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-200 hover:bg-gray-700"
              asChild
            >
              <Link href="/dashboard/add-product">
                <Plus className="mr-2 h-4 w-4" />
                {isSidebarOpen && t("addNewProduct")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-200 hover:bg-gray-700"
              asChild
            >
              <Link href="/dashboard/categories">
                <Tag className="mr-2 h-4 w-4" />
                {isSidebarOpen && t("categories")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-200 hover:bg-gray-700"
              asChild
            >
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                {isSidebarOpen && t("settings")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-200 hover:bg-gray-700"
              asChild
            >
              <Link href="/dashboard/landing-page-manager">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {isSidebarOpen && t("landingPageManager")}
              </Link>
            </Button>
          </nav>
        </div>
        <div className="p-4">
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
