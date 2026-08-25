'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Pause } from 'lucide-react';
import { brochure as brochureApi, errorMessage, mediaUrl, type BrochureImage } from '@/lib/api';
import { EmptyState, Spinner } from '@/components/ui';

export default function BrochureGalleryPage() {
  const [images, setImages] = useState<BrochureImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await brochureApi.list(30);
        if (!cancelled) {
          setImages(list);
          setActiveIndex(list.length > 2 ? 2 : 0);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || images.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const handleNext = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getCardStyle = (index: number) => {
    const total = images.length;
    if (total === 0) return {};
    let offset = (index - activeIndex + total) % total;
    if (offset > total / 2) offset -= total;

    if (offset === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(100%)',
      };
    }
    if (offset === 1) {
      return {
        transform: 'translateX(85%) scale(0.82) rotateY(-15deg)',
        zIndex: 20,
        opacity: 0.75,
        filter: 'brightness(90%)',
      };
    }
    if (offset === -1) {
      return {
        transform: 'translateX(-85%) scale(0.82) rotateY(15deg)',
        zIndex: 20,
        opacity: 0.75,
        filter: 'brightness(90%)',
      };
    }
    if (offset === 2) {
      return {
        transform: 'translateX(150%) scale(0.65) rotateY(-25deg)',
        zIndex: 10,
        opacity: 0.4,
        filter: 'brightness(80%)',
      };
    }
    if (offset === -2) {
      return {
        transform: 'translateX(-150%) scale(0.65) rotateY(25deg)',
        zIndex: 10,
        opacity: 0.4,
        filter: 'brightness(80%)',
      };
    }
    return {
      transform: `translateX(${offset * 100}%) scale(0.5)`,
      zIndex: 0,
      opacity: 0,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-between overflow-hidden bg-white px-4 py-12 text-[#101828]">
      <div className="flex w-full max-w-6xl items-center justify-between px-4 pb-6">
        <div>
          <h1 className="text-2xl font-black text-[#101828] sm:text-3xl">Brochure Gallery</h1>
          <p className="text-xs font-medium text-[#6A7282]">Interactive 3D perspective coverflow</p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={images.length === 0}
          className="flex items-center gap-2 rounded-2xl border border-[#00A36D]/20 bg-[#F8FDFB] px-4 py-2 text-xs font-bold text-[#00A36D] transition-all hover:bg-[#E5F5EE] disabled:opacity-50"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{isPlaying ? 'Auto Play' : 'Paused'}</span>
        </button>
      </div>

      {loading ? (
        <Spinner label="Loading brochure..." />
      ) : error ? (
        <EmptyState title="Could not load brochure" description={error} />
      ) : images.length === 0 ? (
        <EmptyState
          title="No brochure images yet"
          description="Images will appear here once a Super Admin or Marketer publishes them."
        />
      ) : (
        <>
          <div className="perspective-[1200px] relative my-4 flex h-[480px] w-full max-w-6xl items-center justify-center sm:h-[560px]">
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 z-40 rounded-full border border-gray-200 bg-white/90 p-4 text-gray-800 shadow-xl transition-all hover:scale-110 hover:border-[#00A36D] hover:bg-[#00A36D] hover:text-white sm:left-8"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            <div className="relative flex h-full w-full items-center justify-center">
              {images.map((image, idx) => {
                const style = getCardStyle(idx);
                const isCenter = idx === activeIndex;
                const src = mediaUrl(image.imageUrl);

                return (
                  <div
                    key={image.id}
                    onClick={() => setActiveIndex(idx)}
                    style={style}
                    className="group absolute h-[340px] w-[280px] cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl transition-all duration-500 ease-out select-none sm:h-[440px] sm:w-[380px] md:h-[480px] md:w-[440px]"
                  >
                    <img src={src} alt={image.title || `Brochure ${idx + 1}`} className="h-full w-full object-cover p-2" />

                    {isCenter && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenImage(src);
                        }}
                        className="absolute top-4 right-4 rounded-2xl bg-black/60 p-3 text-white opacity-0 shadow-lg backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-[#00A36D]"
                        title="Fullscreen View"
                      >
                        <Maximize2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 z-40 rounded-full border border-gray-200 bg-white/90 p-4 text-gray-800 shadow-xl transition-all hover:scale-110 hover:border-[#00A36D] hover:bg-[#00A36D] hover:text-white sm:right-8"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-6">
            {images.map((image, idx) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === idx ? 'w-8 bg-[#00A36D]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative flex h-[90vh] w-full max-w-6xl items-center justify-center">
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-30 rounded-full bg-gray-800 p-3 text-white transition-colors hover:bg-rose-500"
            >
              <X className="h-6 w-6" />
            </button>
            <img src={fullscreenImage} alt="Fullscreen View" className="h-full w-full object-contain p-2" />
          </div>
        </div>
      )}
    </div>
  );
}
