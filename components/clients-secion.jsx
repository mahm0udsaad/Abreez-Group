"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AutoScrollingRow } from "./wrappers/autoScroll";
import { useTranslation } from "@/app/i18n/client";

export default function ClientSecion({ lng }) {
  const { t } = useTranslation(lng, "common");

  const clients = [
    "/clients/1.jpg",
    "/clients/3.png",
    "/clients/04.jpg",
    "/clients/4.png",
    "/clients/07.jpg",
    "/clients/7.png",
    "/clients/8.png",
    "/clients/9.png",
    "/clients/10.png",
    "/clients/12.png",
    "/clients/012.png",
    "/clients/14.png",
    "/clients/014.png",
    "/clients/19.png",
    "/clients/24.png",
    "/clients/26.png",
    "/clients/48.jpg",
    "/clients/54.png",
    "/clients/65.png",
    "/clients/67.png",
    "/clients/89.jpg",
    "/clients/90.jpg",
    "/clients/098.jpg",
    "/clients/111.jpg",
    "/clients/120.png",
    "/clients/322.png",
    "/clients/325.jpg",
    "/clients/890.jpg",
    "/clients/3222.png",
  ];
  const duplicatedClients = [...clients, ...clients, ...clients]; // Triple to ensure smooth infinite scroll

  return (
    <section dir="ltr" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold mb-12 text-center text-[#114270]">
          {t("clients")}
        </h2>
        <AutoScrollingRow lng={lng}>
          {duplicatedClients.map((src, index) => (
            <div key={index} className="flex-shrink-0 mx-8 flex items-center">
              <Image
                src={src}
                alt={`Client ${index + 1}`}
                width={250}
                height={64}
                className="max-h-20 w-auto object-contain"
              />
            </div>
          ))}
        </AutoScrollingRow>
      </div>
    </section>
  );
}
