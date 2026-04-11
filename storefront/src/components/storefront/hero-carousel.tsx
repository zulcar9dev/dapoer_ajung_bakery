"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@shared/types";

interface HeroCarouselProps {
  banners: Banner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const activeBanners = banners.filter((b) => b.isActive);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
    );
  }, [activeBanners.length]);

  // Auto-advance
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[current];

  return (
    <section className="relative overflow-hidden bg-foreground">
      {/* Slides */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        {activeBanners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <Image
              src={b.image || "/images/placeholder.jpg"}
              alt={b.title}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-lg animate-fade-in">
                  <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-surface mb-4 leading-tight">
                    {b.title}
                  </h2>
                  {b.subtitle && (
                    <p className="text-base md:text-lg text-surface/80 mb-6 leading-relaxed">
                      {b.subtitle}
                    </p>
                  )}
                  {b.ctaLink && (
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary-dark h-12 px-8 text-base font-semibold shadow-lg"
                      render={<Link href={b.ctaLink} />}
                    >
                      {b.ctaText || "Lihat Selengkapnya"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-surface/20 text-surface hover:bg-surface/40 backdrop-blur-sm"
            aria-label="Banner sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-surface/20 text-surface hover:bg-surface/40 backdrop-blur-sm"
            aria-label="Banner selanjutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-primary"
                    : "w-2 bg-surface/50 hover:bg-surface/80"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
