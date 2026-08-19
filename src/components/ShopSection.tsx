import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  Eye,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
} from 'lucide-react';
import { SHOP_PRODUCTS } from '../data/mockData';
import { ShopProduct, ShopCategory, DesignTheme } from '../types';

interface ShopSectionProps {
  theme: DesignTheme;
  onSelectProduct: (product: ShopProduct) => void;
  onQuickAddToCart: (product: ShopProduct) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  theme,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('all');

  const categories: { id: ShopCategory; label: string }[] = [
    { id: 'all', label: 'Alle Produkte' },
    { id: 'originale', label: 'Originale & Unikate' },
    { id: 'kunstdrucke', label: 'Kunstdrucke' },
    { id: 'holztafeln', label: 'Holztafeln & Schilder' },
    { id: 'karten-sets', label: 'Karten & Papeterie' },
    { id: 'workshops', label: 'Workshops & Kurse' },
    { id: 'gutscheine', label: 'Gutscheine' },
  ];

  const filteredProducts = SHOP_PRODUCTS.filter((prod) => {
    return selectedCategory === 'all' || prod.category === selectedCategory;
  });

  return (
    <section
      id="shop"
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
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
                color: theme.primaryColor,
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>zumano.ch Online-Shop</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-light font-serif tracking-tight"
              style={{ color: theme.textPrimary }}
            >
              Kunst für dein Zuhause, <br className="hidden sm:inline" />
              <span className="italic font-normal">Kurse & persönliche Geschenke</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
              Jedes Stück wird von Zuzu mit Liebe im Atelier Richterswil gemalt, beschriftet und
              liebevoll verpackt. Wähle aus Originalen, hochwertigen Kunstdrucken oder Workshops.
            </p>
          </div>

          {/* Swiss Trust Highlights */}
          <div className="flex items-center gap-4 text-xs text-neutral-600 bg-neutral-100/70 p-3 rounded-2xl border border-neutral-200">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Gratis Versand CH</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>TWINT & Rechnung</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`shop-filter-${cat.id}`}
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
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              id={`shop-card-${product.id}`}
              className="group rounded-2xl overflow-hidden border shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
              }}
            >
              {/* Product Image Box */}
              <div
                className="relative aspect-4/5 overflow-hidden bg-neutral-100 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Badge (e.g. Unikat, Bestseller) */}
                {product.badge && (
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Category label badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-sm text-neutral-800 border border-white/60">
                  {product.categoryLabel}
                </div>

                {/* Hover Quick View overlay button */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-4 py-2 rounded-full bg-white/95 text-neutral-900 shadow-lg text-xs font-semibold flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-transform">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Optionen & Details</span>
                  </div>
                </div>
              </div>

              {/* Product Content Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                    <span>★ {product.rating.toFixed(1)}</span>
                    <span className="text-neutral-400">({product.reviewsCount})</span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif text-lg font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price and Add Button */}
                <div
                  className="pt-3 border-t flex items-center justify-between gap-3"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <div>
                    <div className="text-base sm:text-lg font-bold text-neutral-900 font-serif">
                      {product.priceChf}.– CHF
                    </div>
                    {product.originalPriceChf && (
                      <span className="text-xs text-neutral-400 line-through">
                        {product.originalPriceChf}.– CHF
                      </span>
                    )}
                  </div>

                  <button
                    id={`btn-add-product-${product.id}`}
                    onClick={() => {
                      if (product.allowsCustomization || (product.variants && product.variants.length > 1)) {
                        onSelectProduct(product);
                      } else {
                        onQuickAddToCart(product);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer shrink-0"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {product.allowsCustomization ? 'Anpassen & Kaufen' : 'In den Warenkorb'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
