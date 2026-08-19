import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, DesignTheme } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  theme: DesignTheme;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onStartCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  theme,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout,
  onContinueShopping,
}) => {
  if (!isOpen) return null;

  const totalChf = items.reduce((sum, item) => {
    const itemPrice =
      item.product.priceChf + (item.selectedVariant ? item.selectedVariant.priceExtraChf : 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h3 className="font-serif text-lg font-medium text-neutral-900">
              Warenkorb ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4 text-neutral-500">
              <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg text-neutral-700">Dein Warenkorb ist leer.</p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Stöbere durch unsere handgemalten Originale, Kunstdrucke oder buche einen Workshop.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white shadow-xs cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Zum Shop
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemPrice =
                item.product.priceChf +
                (item.selectedVariant ? item.selectedVariant.priceExtraChf : 0);

              return (
                <div
                  key={item.cartId}
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex gap-3 relative"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-lg object-cover bg-neutral-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-xs font-serif font-semibold text-neutral-900 line-clamp-1">
                        {item.product.title}
                      </h4>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-neutral-500">
                          {item.selectedVariant.name}
                        </p>
                      )}

                      {item.customText && (
                        <p className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded mt-1 line-clamp-1">
                          «{item.customText}»
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-200">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-neutral-900 font-serif">
                        {(itemPrice * item.quantity).toFixed(0)}.– CHF
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.cartId)}
                    className="p-1 rounded-full text-neutral-400 hover:text-rose-600 hover:bg-rose-50 self-start"
                    title="Artikel entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50/70 space-y-4">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex items-center justify-between">
                <span>Zwischensumme</span>
                <span className="font-medium text-neutral-900">{totalChf}.– CHF</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-emerald-600" />
                  Versandkosten Schweiz
                </span>
                <span className="font-semibold text-emerald-700">Kostenlos (0.– CHF)</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-900 font-serif">
                <span>Gesamtsumme (inkl. MwSt.)</span>
                <span className="text-lg">{totalChf}.– CHF</span>
              </div>
            </div>

            <button
              id="btn-drawer-checkout"
              onClick={onStartCheckout}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <span>Zur Kasse · {totalChf}.– CHF</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-neutral-400">
              Sichere Zahlung mit TWINT, Schweizer Banküberweisung oder Kreditkarte
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
