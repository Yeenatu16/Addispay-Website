'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Pause } from 'lucide-react';

const brochureImages = [
  '/images/documents/doc_1.jpg',
  '/images/documents/doc_2.jpg',
  '/images/documents/doc_3.jpg',
  '/images/documents/doc_4.jpg',
  '/images/documents/doc_5.jpg',
  '/images/documents/doc_6.jpg',
  '/images/documents/doc_7.jpg',
  '/images/documents/doc_8.jpg',
  '/images/documents/doc_9.jpg',
  '/images/documents/doc_10.jpg',
  '/images/documents/doc_11.jpg',
  '/images/documents/doc_12.jpg',
  '/images/documents/posHero.png',
  '/images/documents/gatewayHero.png',
];

export default function CodePen3DCoverflowCarouselPage() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Auto-slide timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % brochureImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % brochureImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + brochureImages.length) % brochureImages.length);
  };

  // Compute offset relative to active index
  const getCardStyle = (index: number) => {
    const total = brochureImages.length;
    let offset = (index - activeIndex + total) % total;
    if (offset > total / 2) {
      offset -= total;
    }

    // Determine scale, opacity, z-index, and X offset based on CodePen perspective formula
    if (offset === 0) {
      // Center Active Card
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(100%) shadow(0 25px 50px -12px rgba(0, 0, 0, 0.25))',
      };
    } else if (offset === 1) {
      // Right 1 Card
      return {
        transform: 'translateX(85%) scale(0.82) rotateY(-15deg)',
        zIndex: 20,
        opacity: 0.75,
        filter: 'brightness(90%)',
      };
    } else if (offset === -1) {
      // Left 1 Card
      return {
        transform: 'translateX(-85%) scale(0.82) rotateY(15deg)',
        zIndex: 20,
        opacity: 0.75,
        filter: 'brightness(90%)',
      };
    } else if (offset === 2) {
      // Right 2 Card
      return {
        transform: 'translateX(150%) scale(0.65) rotateY(-25deg)',
        zIndex: 10,
        opacity: 0.4,
        filter: 'brightness(80%)',
      };
    } else if (offset === -2) {
      // Left 2 Card
      return {
        transform: 'translateX(-150%) scale(0.65) rotateY(25deg)',
        zIndex: 10,
        opacity: 0.4,
        filter: 'brightness(80%)',
      };
    } else {
      // Offscreen Cards
      return {
        transform: `translateX(${offset * 100}%) scale(0.5)`,
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none' as const,
      };
    }
  };

  return (
    <div className="min-h-[90vh] bg-white text-[#101828] py-12 px-4 flex flex-col items-center justify-between overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between px-4 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101828]">Brochure Gallery</h1>
          <p className="text-xs text-[#6A7282] font-medium">Interactive 3D Perspective Coverflow Carousel</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-2xl bg-[#F8FDFB] hover:bg-[#E5F5EE] text-[#00A36D] text-xs font-bold border border-[#00A36D]/20 transition-all flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Auto Play' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* CODEPEN 3D PERSPECTIVE COVERFLOW CAROUSEL CONTAINER */}
      <div className="relative w-full max-w-6xl h-[480px] sm:h-[560px] my-4 flex items-center justify-center perspective-[1200px]">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 z-40 p-4 rounded-full bg-white/90 shadow-xl border border-gray-200 text-gray-800 hover:bg-[#00A36D] hover:text-white hover:border-[#00A36D] transition-all hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Carousel Stack */}
        <div className="relative w-full h-full flex items-center justify-center">
          {brochureImages.map((imgSrc, idx) => {
            const style = getCardStyle(idx);
            const isCenter = idx === activeIndex;

            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={style}
                className="absolute w-[280px] sm:w-[380px] md:w-[440px] h-[340px] sm:h-[440px] md:h-[480px] bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out select-none group"
              >
                <img
                  src={imgSrc}
                  alt={`Brochure Card ${idx + 1}`}
                  className="w-full h-full object-cover p-2"
                />

                {isCenter && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenImage(imgSrc);
                    }}
                    className="absolute top-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white hover:bg-[#00A36D] transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    title="Fullscreen View"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 z-40 p-4 rounded-full bg-white/90 shadow-xl border border-gray-200 text-gray-800 hover:bg-[#00A36D] hover:text-white hover:border-[#00A36D] transition-all hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

      </div>

      {/* Bottom Indicator Dots */}
      <div className="flex items-center gap-2 pt-6">
        {brochureImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === idx
                ? 'w-8 bg-[#00A36D]'
                : 'w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in zoom-in-95 duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full max-w-6xl h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-gray-800 text-white hover:bg-rose-500 z-30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={fullscreenImage}
              alt="Fullscreen View"
              className="w-full h-full object-contain p-2"
            />
          </div>
        </div>
      )}

    </div>
  );
}
