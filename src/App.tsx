import React, { useState, useEffect } from 'react';
import { DESIGN_THEMES } from './data/mockData';
import {
  DesignTheme,
  DesignThemeId,
  GalleryItem,
  ShopProduct,
  ProductVariant,
  CartItem,
  GeneratedArtIdea,
} from './types';
import { ThemeSwitcherBanner } from './components/ThemeSwitcherBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GallerySection } from './components/GallerySection';
import { ShopSection } from './components/ShopSection';
import { ArtCustomizerSection } from './components/ArtCustomizerSection';
import { AboutMeSection } from './components/AboutMeSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { StudioVideosSection } from './components/StudioVideosSection';
import { SocialAndContactSection } from './components/SocialAndContactSection';
import { LightboxModal } from './components/LightboxModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PhpHostingGuideModal } from './components/PhpHostingGuideModal';
import { Footer } from './components/Footer';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Theme state: default to 'nordic-minimal' (Warm Nordic Sage & Ochre)
  const [currentThemeId, setCurrentThemeId] = useState<DesignThemeId>('nordic-minimal');
  const currentTheme: DesignTheme =
    DESIGN_THEMES[currentThemeId] || DESIGN_THEMES['nordic-minimal'];

  // Active navigation section
  const [activeSection, setActiveSection] = useState<string>('home');

  // Modals & Drawers state
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isPhpGuideOpen, setIsPhpGuideOpen] = useState<boolean>(false);

  // Commission prefill from customizer
  const [commissionPrefill, setCommissionPrefill] = useState<string>('');

  // Cart state with localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zumano_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('zumano_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add to cart from Shop or Product Modal
  const handleAddToCart = (
    product: ShopProduct,
    quantity: number = 1,
    selectedVariant?: ProductVariant,
    customText?: string,
    frameOption?: 'none' | 'oak' | 'black' | 'white'
  ) => {
    const cartId = `${product.id}-${selectedVariant?.id || 'default'}-${customText || 'standard'}-${frameOption || 'none'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartId,
          product,
          quantity,
          selectedVariant,
          customText,
          frameOption,
        },
      ];
    });

    showToast(`«${product.title}» wurde zum Warenkorb hinzugefügt!`);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleCommissionInquiry = (idea: GeneratedArtIdea, notes?: string) => {
    const text = `Wunsch-Konzept: ${idea.title}\nStil: ${idea.subTitle}\nTechnik: ${idea.technique}\nFarben: ${idea.colorPalette.map((c) => c.name).join(', ')}\nZitat/Text: ${idea.letteringSuggestion}\n${notes ? notes : ''}`;
    setCommissionPrefill(text);
    handleNavigate('contact');
    showToast('Konzept in die Anfrage übernommen! Scrolle zum Formular.');
  };

  const handleRequestCustomArtFromGallery = () => {
    handleNavigate('customizer');
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      className="min-h-screen flex flex-col font-sans antialiased text-neutral-900 selection:bg-amber-200 selection:text-neutral-900 transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.bgBase,
        color: currentTheme.textPrimary,
      }}
    >
      {/* 1. Theme Switcher Banner at the very top (3 Design Variations) */}
      <ThemeSwitcherBanner
        currentTheme={currentThemeId}
        onSelectTheme={setCurrentThemeId}
      />

      {/* 2. Sticky Navbar with Theme support & Cart indicator */}
      <Navbar
        theme={currentTheme}
        cartCount={totalCartCount}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          theme={currentTheme}
          onExploreGallery={() => handleNavigate('gallery')}
          onOpenShop={() => handleNavigate('shop')}
          onOpenCustomizer={() => handleNavigate('customizer')}
        />

        {/* Gallery & Portfolio Section with Lightbox */}
        <GallerySection
          theme={currentTheme}
          onOpenLightbox={(item) => setSelectedGalleryItem(item)}
          onRequestCustomArt={handleRequestCustomArtFromGallery}
        />

        {/* Online Shop Section */}
        <ShopSection
          theme={currentTheme}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onQuickAddToCart={(product) => handleAddToCart(product, 1)}
        />

        {/* Interactive Art Customizer & Idea Generator (Gemini-Powered) */}
        <ArtCustomizerSection
          theme={currentTheme}
          onSendAsCommissionInquiry={handleCommissionInquiry}
        />

        {/* About Me & Philosophy Section */}
        <AboutMeSection
          theme={currentTheme}
          onContactZuzu={() => handleNavigate('contact')}
          onScrollToVideos={() => handleNavigate('videos')}
        />

        {/* Kundenmeinungen & Testimonials Section */}
        <TestimonialsSection
          theme={currentTheme}
          onOpenLightbox={(item) =>
            setSelectedGalleryItem({
              id: item.id,
              title: item.title,
              imageUrl: item.imageUrl,
              category: 'schilder',
              categoryLabel: item.categoryLabel,
              dimensions: 'Individuelle Anfertigung',
              technique: 'Handarbeit aus dem Atelier zumano.ch',
              year: '2024',
              thumbnailUrl: item.imageUrl,
              description: item.description,
              story: 'Kundenfoto und Erfahrungsbericht aus der Schweiz.',
              tags: ['Kundenarbeit', 'Atelier', 'Handarbeit'],
              priceChf: 0,
              inShop: false,
            })
          }
        />

        {/* Studio Videos & Custom Video Upload Section */}
        <StudioVideosSection theme={currentTheme} />

        {/* Social Media (Instagram / Facebook) & Contact Section */}
        <SocialAndContactSection
          theme={currentTheme}
          prefilledCommissionData={commissionPrefill}
        />
      </main>

      {/* Footer */}
      <Footer
        theme={currentTheme}
        onNavigate={handleNavigate}
        onOpenPhpGuide={() => setIsPhpGuideOpen(true)}
      />

      {/* PHP Webhosting & Deployment Guide Modal */}
      <PhpHostingGuideModal
        isOpen={isPhpGuideOpen}
        onClose={() => setIsPhpGuideOpen(false)}
        theme={currentTheme}
      />

      {/* Lightbox Modal for Gallery Artworks */}
      <LightboxModal
        item={selectedGalleryItem}
        theme={currentTheme}
        onClose={() => setSelectedGalleryItem(null)}
        onRequestCommission={() => {
          setSelectedGalleryItem(null);
          handleNavigate('customizer');
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        theme={currentTheme}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        theme={currentTheme}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onStartCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => handleNavigate('shop')}
      />

      {/* Checkout Modal (Swiss TWINT / QR-Invoice / Card) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        theme={currentTheme}
        onOrderSuccess={() => {
          setCartItems([]);
          localStorage.removeItem('zumano_cart');
        }}
      />

      {/* Floating Cart Pill if items exist */}
      {totalCartCount > 0 && !isCartOpen && (
        <button
          id="btn-floating-cart"
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full text-white shadow-2xl flex items-center gap-2.5 font-semibold text-xs sm:text-sm hover:scale-105 transition-all cursor-pointer animate-fade-in"
          style={{ backgroundColor: currentTheme.primaryColor }}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Warenkorb ({totalCartCount})</span>
        </button>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-neutral-900 text-white text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2.5 animate-fade-in border border-neutral-700"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
