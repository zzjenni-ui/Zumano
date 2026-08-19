import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  Truck,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ShopProduct, ProductVariant, DesignTheme } from '../types';

interface ProductDetailModalProps {
  product: ShopProduct | null;
  theme: DesignTheme;
  onClose: () => void;
  onAddToCart: (
    product: ShopProduct,
    quantity: number,
    selectedVariant?: ProductVariant,
    customText?: string,
    frameOption?: 'none' | 'oak' | 'black' | 'white'
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  theme,
  onClose,
  onAddToCart,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [frameOption, setFrameOption] = useState<'none' | 'oak' | 'black' | 'white'>('none');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const currentPrice =
    product.priceChf + (selectedVariant ? selectedVariant.priceExtraChf : 0);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariant, customText, frameOption);
    setAddedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.imageUrl];

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 shadow-sm border border-neutral-200"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images Gallery */}
        <div className="w-full md:w-1/2 p-6 bg-[#F9F7F4] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-neutral-200 shadow-sm">
              <img
                src={images[selectedImageIndex] || product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-neutral-900 ring-1 ring-neutral-900'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Quality Note */}
          <div className="pt-4 border-t border-neutral-200/80 text-xs text-neutral-500 space-y-1.5 hidden md:block">
            <div className="flex items-center gap-1.5 font-medium text-neutral-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Original aus dem Atelier Richterswil</span>
            </div>
            <p>Sorgfältig verpackt und plastikarm mit Schweizer Post versendet.</p>
          </div>
        </div>

        {/* Right: Product Details & Options */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[75vh] md:max-h-[85vh]">
          <div className="space-y-5">
            {/* Category & Title */}
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                {product.categoryLabel}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-neutral-900 mt-1">
                {product.title}
              </h2>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500 text-sm">
                  {'★'.repeat(Math.floor(product.rating))}
                </div>
                <span className="text-xs font-semibold text-neutral-700">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-400">
                  ({product.reviewsCount} Bewertungen)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-neutral-200">
              <span className="text-3xl font-bold text-neutral-900 font-serif">
                {currentPrice}.– CHF
              </span>
              {product.originalPriceChf && (
                <span className="text-base text-neutral-400 line-through">
                  {product.originalPriceChf}.– CHF
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Inkl. MwSt. · Kostenloser Versand CH
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Variants (e.g. Formats, Framing, Dates) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800 block">
                  Format / Ausführung wählen:
                </label>
                <div className="space-y-1.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full p-2.5 rounded-xl text-xs text-left border flex items-center justify-between transition-all cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'border-neutral-900 bg-neutral-50 font-semibold ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="font-medium text-neutral-900">
                        {v.priceExtraChf > 0
                          ? `+${v.priceExtraChf}.– CHF`
                          : v.priceExtraChf < 0
                          ? `${v.priceExtraChf}.– CHF`
                          : 'Inklusive'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization input (for personalized boards / cards / vouchers) */}
            {product.allowsCustomization && (
              <div className="space-y-2 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <label className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Persönliche Wunschbeschriftung:
                </label>
                <textarea
                  rows={2}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={
                    product.customizationPlaceholder ||
                    'Dein Wunschtext, Namen, Datum oder Anlass...'
                  }
                  className="w-full p-2.5 rounded-lg text-xs bg-white border border-amber-300 outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}

            {/* Artisan Specs (Material, Format, Shipping) */}
            <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-neutral-800 w-24 shrink-0">Material:</span>
                <span>{product.material}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-neutral-800 w-24 shrink-0">Maße:</span>
                <span>{product.format}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-neutral-800 w-24 shrink-0">Lieferzeit:</span>
                <span>{product.shippingInfo}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions: Quantity & Add to Cart */}
          <div className="pt-6 mt-4 border-t border-neutral-200 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-semibold text-neutral-800 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                id="btn-modal-add-to-cart"
                onClick={handleAdd}
                disabled={addedSuccess}
                className="flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                    <span>In den Warenkorb gelegt!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>In den Warenkorb · {(currentPrice * quantity).toFixed(0)}.– CHF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
