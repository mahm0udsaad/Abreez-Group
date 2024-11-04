"use client";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "../ui/button";
import LanguageSwitcher from "../btns/lang-switch";
import { usePathname } from "next/navigation";

export default function NavBar({ lng }) {
  const { t } = useTranslation(lng, "common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();
  const pathnameList = pathname.split("/");
  const shouldHideNavbar =
    pathnameList.includes("products") && pathnameList.length > 3;

  const navItems = [
    { name: t("navigation.home"), href: "/#" },
    { name: t("navigation.about"), href: "/#about" },
    { name: t("navigation.services"), href: "/#services" },
    { name: t("navigation.portfolio"), href: "/#portfolio" },
    { name: t("navigation.testimonials"), href: "/#testimonials" },
    { name: t("navigation.faq"), href: "/#faq" },
    { name: t("navigation.contact"), href: "/#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    !shouldHideNavbar && (
      <header
        dir="ltr"
        className={`${
          pathnameList.includes("products") ? "absolute" : "fixed"
        }  top-0 z-50 w-full transition-all duration-300 ${
          scrollPosition > 50 ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/">
            {scrollPosition < 50 ? (
              <Image
                priority
                src="/abreez-logo-white.png"
                alt="Abreez Group Logo"
                width={160}
                height={160}
                className="w-32 md:w-40"
              />
            ) : (
              <Image
                priority
                src="/logo.svg"
                alt="Abreez Group Logo"
                width={160}
                height={160}
                className="w-32 md:w-40"
              />
            )}
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={`${item.href}`}
                    className={
                      scrollPosition > 50
                        ? "text-gray-600 hover:text-[#8cc63f] transition-colors"
                        : "text-white hover:text-[#8cc63f] transition-colors"
                    }
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher currentLang={lng} />
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${
                scrollPosition > 50
                  ? "text-gray-600 hover:text-[#8cc63f]"
                  : "text-white hover:text-[#8cc63f]"
              } transition-colors`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t">
            <ul className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={`${item.href}`}
                    className="block py-2 text-gray-600 hover:text-[#8cc63f] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    )
  );
}
