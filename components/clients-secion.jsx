"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ClientSecion() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const scrollWidth = scrollContainer.scrollWidth;
      const animationDuration = scrollWidth / 50; // Adjust speed here

      scrollContainer.style.setProperty("--scroll-width", `${scrollWidth}px`);
      scrollContainer.style.setProperty(
        "--animation-duration",
        `${animationDuration}s`,
      );
    }
  }, []);

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
    "/clients/29.jpg",
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

  return (
    <section
      id="clients"
      className="py-16 md:py-24 bg-gray-100 overflow-hidden"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-600">
          Our Trusted Clients
        </h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex animate-scroll"
            style={{
              "--scroll-width": "5000px",
              "--animation-duration": "100s",
            }}
          >
            {[...clients, ...clients].map((src, index) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
