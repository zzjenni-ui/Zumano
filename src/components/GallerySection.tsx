import React, { useState } from 'react';
import {
  Maximize2,
  Brush,
  Sparkles,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryCategory, GalleryItem, DesignTheme } from '../types';

interface GallerySectionProps {
  theme: DesignTheme;
  onOpenLightbox: (item: GalleryItem) => void;
  onRequestCustomArt: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  theme,
  onOpenLightbox,
  onRequestCustomArt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: GalleryCategory; label: string; count: number }[] = [
    { id: 'all', label: 'Alle Werke', count: GALLERY_ITEMS.length },
    {
      id: 'aquarell',
      label: 'Aquarelle',
      count: GALLERY_ITEMS.filter((i) => i.category === 'aquarell').length,
    },
    {
      id: 'lettering',
      label: 'Hand-Lettering',
      count: GALLERY_ITEMS.filter((i) => i.category === 'lettering').length,
    },
    {
      id: 'schilder',
      label: 'Holz- & Kreidetafeln',
      count: GALLERY_ITEMS.filter((i) => i.category === 'schilder').length,
    },
    {
      id: 'karten',
      label: 'Karten & Papeterie',
      count: GALLERY_ITEMS.filter((i) => i.category === 'karten').length,
    },
    {
      id: 'wandbilder',
      label: 'Wandmalerei',
      count: GALLERY_ITEMS.filter((i) => i.category === 'wandbilder').length,
    },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section
      id="gallery"
      className="py-16 md:py-24 transition-colors duration-300 border-t"
      style={{
        backgroundColor: theme.bgBase,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
                color: theme.primaryColor,
              }}
            >
              <Brush className="w-3.5 h-3.5" />
              <span>Atelier Galerie & Portfolio</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-light font-serif tracking-tight"
              style={{ color: theme.textPrimary }}
            >
              Entdecke die Vielfalt der <br className="hidden sm:inline" />
              <span className="italic font-normal">handgemalten Kunstwerke</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
              Klicke auf ein Bild, um es in voller Größe und hoher Auflösung zu betrachten,
              Details zur Technik zu lesen oder ein individuelles Werk anzufragen.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Suche (z.B. Aquarell, Hochzeit...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm border outline-none transition-all focus:ring-2 focus:ring-neutral-400"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
                color: theme.textPrimary,
              }}
            />
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`gallery-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'shadow-xs font-semibold'
                    : 'hover:bg-neutral-200/50 text-neutral-600'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: theme.primaryColor,
                        color: '#FFFFFF',
                      }
                    : {
                        backgroundColor: theme.bgCard,
                        borderColor: theme.borderSubtle,
                      }
                }
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-200/70 text-neutral-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border p-8 space-y-3"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderSubtle,
            }}
          >
            <p className="text-neutral-500 font-serif text-lg">
              Keine Kunstwerke zu diesem Filter gefunden.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-medium underline cursor-pointer"
              style={{ color: theme.primaryColor }}
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`gallery-card-${item.id}`}
                onClick={() => onOpenLightbox(item)}
                className="group relative rounded-2xl overflow-hidden border shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderSubtle,
                }}
              >
                {/* Image Container with Hover Zoom & Zoom-In Icon */}
                <div className="relative aspect-4/5 overflow-hidden bg-neutral-100">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-white/90 text-neutral-900 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300 flex items-center gap-1.5 text-xs font-medium">
                      <Maximize2 className="w-4 h-4 text-neutral-900" />
                      <span>Großansicht</span>
                    </div>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-sm text-neutral-800 shadow-2xs border border-white/60">
                    {item.categoryLabel}
                  </div>

                  {item.featured && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500 text-white shadow-2xs">
                      Atelier Highlight
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2">
                  <h3
                    className="font-serif text-base font-medium transition-colors group-hover:text-neutral-600 line-clamp-1"
                    style={{ color: theme.textPrimary }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-xs line-clamp-2 leading-relaxed font-sans"
                    style={{ color: theme.textMuted }}
                  >
                    {item.description}
                  </p>

                  <div
                    className="pt-2 border-t flex items-center justify-between text-[11px]"
                    style={{
                      borderColor: theme.borderSubtle,
                      color: theme.textMuted,
                    }}
                  >
                    <span>{item.dimensions}</span>
                    <span className="font-medium text-neutral-700">{item.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Commission Banner CTA */}
        <div
          className="mt-14 rounded-2xl p-6 sm:p-8 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            backgroundColor: `${theme.bgCard}`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="space-y-1.5 text-center md:text-left">
            <h3
              className="text-xl sm:text-2xl font-serif font-light"
              style={{ color: theme.textPrimary }}
            >
              Du hast ein eigenes Wunschmotiv oder Zitat im Sinn?
            </h3>
            <p className="text-sm text-neutral-500 max-w-xl">
              Ob Hochzeitsgeschenk, persönliches Aquarell oder Firmenschild – Zuzu setzt deine Vision
              im Atelier in Richterswil von Hand um.
            </p>
          </div>

          <button
            id="btn-gallery-custom-request"
            onClick={onRequestCustomArt}
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 flex items-center gap-2 cursor-pointer shrink-0"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Jetzt Bildidee generieren & anfragen</span>
          </button>
        </div>
      </div>
    </section>
  );
};
