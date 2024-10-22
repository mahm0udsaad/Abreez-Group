"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Menu } from "lucide-react";
import Image from "next/image";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrollPosition > 50 ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src="/logo.svg"
            alt="Abreez Group Logo"
            width={160}
            height={160}
            className="hidden md:block"
          />
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {["About", "Services", "Products", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Get a Quote
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <ul className="flex flex-col p-4">
            {["About", "Services", "Products", "Contact"].map((item) => (
              <li key={item} className="py-2">
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
