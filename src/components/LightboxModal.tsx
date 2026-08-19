import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Brush,
  Tag,
  Calendar,
  Layers,
  Heart,
  Share2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { GalleryItem, DesignTheme } from '../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  theme: DesignTheme;
  onClose: () => void;
  onSelectNext: () => void;
  onSelectPrev: () => void;
  onRequestCommission: (item: GalleryItem) => void;
  onGoToShopItem?: (item: GalleryItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  theme,
  onClose,
  onSelectNext,
  onSelectPrev,
  onRequestCommission,
  onGoToShopItem,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectNext();
      if (e.key === 'ArrowLeft') onSelectPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectNext, onSelectPrev]);

  // Reset zoom on item change
  useEffect(() => {
    setIsZoomed(false);
  }, [item?.id]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="gallery-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col lg:flex-row bg-[#1A1918] text-neutral-100 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar for Mobile */}
        <div className="flex items-center justify-between p-3 border-b border-neutral-800 lg:hidden bg-neutral-900/80">
          <span className="text-xs text-neutral-400 font-sans">
            Werk {currentIndex + 1} von {items.length}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left / Main: High-Res Image Area */}
        <div className="relative flex-1 bg-black/50 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px] lg:min-h-[580px] p-4 select-none">
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`max-h-[75vh] w-auto object-contain transition-all duration-300 rounded-lg shadow-xl cursor-zoom-in ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Zoom Toggle Button */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-4 left-4 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white backdrop-blur-sm border border-neutral-700 transition-transform hover:scale-105"
            title={isZoomed ? 'Verkleinern' : 'Vergrössern'}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Navigation Arrows */}
          <button
            id="btn-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPrev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white backdrop-blur-sm border border-neutral-700 transition-all hover:scale-110 shadow-lg"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            id="btn-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              onSelectNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white backdrop-blur-sm border border-neutral-700 transition-all hover:scale-110 shadow-lg"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Artwork Story & Specification Sidebar */}
        <div className="w-full lg:w-96 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#1E1D1B] border-t lg:border-t-0 lg:border-l border-neutral-800">
          <div className="space-y-5">
            {/* Header with Close and Share */}
            <div className="hidden lg:flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-sans">
                {item.categoryLabel} · {currentIndex + 1} / {items.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="Link kopieren"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="Schließen (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {copied && (
              <div className="p-2 rounded bg-emerald-900/50 border border-emerald-700 text-emerald-300 text-xs text-center">
                Link in Zwischenablage kopiert!
              </div>
            )}

            {/* Title & Category */}
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
                {item.categoryLabel}
              </div>
              <h2 className="text-2xl font-serif font-light text-neutral-100 leading-snug">
                {item.title}
              </h2>
            </div>

            {/* Description & Story */}
            <div className="space-y-3 text-sm text-neutral-300 leading-relaxed font-sans">
              <p>{item.description}</p>
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                <span className="font-semibold text-neutral-200 block">Künstlerische Geschichte:</span>
                <p className="italic text-neutral-400">«{item.story}»</p>
              </div>
            </div>

            {/* Artwork Specifications */}
            <div className="space-y-2.5 pt-2 text-xs border-t border-neutral-800 text-neutral-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-500" />
                  Format:
                </span>
                <span className="text-neutral-200 font-medium">{item.dimensions}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Brush className="w-3.5 h-3.5 text-neutral-500" />
                  Technik:
                </span>
                <span className="text-neutral-200 font-medium text-right">{item.technique}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  Entstehungsjahr:
                </span>
                <span className="text-neutral-200 font-medium">{item.year} · Atelier Richterswil</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-neutral-800 text-neutral-400 border border-neutral-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 mt-4 border-t border-neutral-800 space-y-2.5">
            <button
              id="btn-lightbox-inquire"
              onClick={() => {
                onRequestCommission(item);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ähnliches Werk als Auftrag anfragen</span>
            </button>

            {item.inShop && onGoToShopItem && (
              <button
                onClick={() => {
                  onGoToShopItem(item);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Im Shop als Kunstdruck / Unikat ansehen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
