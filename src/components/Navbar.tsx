import React, { useState } from 'react';
import {
  ShoppingBag,
  Instagram,
  Facebook,
  Phone,
  Menu,
  X,
  Sparkles,
  Heart,
  Palette,
  Video,
  Layers,
} from 'lucide-react';
import { DesignTheme } from '../types';

interface NavbarProps {
  theme: DesignTheme;
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'gallery', label: 'Galerie & Werke' },
    { id: 'shop', label: 'Online-Shop' },
    { id: 'customizer', label: 'Bildideen & Customizer', isSpecial: true },
    { id: 'about', label: 'Über mich & Atelier' },
    { id: 'kundenmeinungen', label: 'Kundenstimmen' },
    { id: 'videos', label: 'Filme & Videos' },
    { id: 'contact', label: 'Kontakt & Kurse' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-[45px] md:top-[41px] z-40 transition-colors duration-300 backdrop-blur-md border-b"
      style={{
        backgroundColor: `${theme.bgBase}F2`,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => handleLinkClick('hero')}
            className="flex flex-col items-start text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-2xl sm:text-3xl font-light tracking-[0.2em] font-serif transition-transform group-hover:scale-105"
                style={{ color: theme.textPrimary }}
              >
                ZUMANO
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-sans tracking-normal bg-neutral-200/60 text-neutral-700 font-medium">
                .ch
              </span>
            </div>
            <span
              className="text-[11px] tracking-wider uppercase font-sans font-medium -mt-0.5"
              style={{ color: theme.textMuted }}
            >
              Atelier Zäzilia Jenni · Richterswil ZH
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'shadow-xs font-semibold'
                      : 'hover:bg-neutral-200/40 text-neutral-600 hover:text-neutral-900'
                  } ${link.isSpecial ? 'ring-1 ring-amber-400/40' : ''}`}
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.primaryColor,
                          color: '#FFFFFF',
                        }
                      : {}
                  }
                >
                  {link.isSpecial && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Socials */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Social Links */}
            <a
              id="link-instagram-header"
              href="https://www.instagram.com/zumano.ch"
              target="_blank"
              rel="noopener noreferrer"
              title="ZUMANO auf Instagram"
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:border-pink-400 hover:text-pink-600"
              style={{
                borderColor: theme.borderSubtle,
                color: theme.textMuted,
                backgroundColor: theme.bgCard,
              }}
            >
              <Instagram className="w-4 h-4" />
            </a>

            <a
              id="link-facebook-header"
              href="https://www.facebook.com/zumano.ch"
              target="_blank"
              rel="noopener noreferrer"
              title="ZUMANO auf Facebook"
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:border-blue-500 hover:text-blue-600"
              style={{
                borderColor: theme.borderSubtle,
                color: theme.textMuted,
                backgroundColor: theme.bgCard,
              }}
            >
              <Facebook className="w-4 h-4" />
            </a>

            {/* Direct Phone / Contact */}
            <a
              id="btn-call-header"
              href="tel:0788180636"
              title="Anrufen: 078 818 06 36"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:bg-neutral-100"
              style={{
                borderColor: theme.borderSubtle,
                color: theme.textPrimary,
                backgroundColor: theme.bgCard,
              }}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>078 818 06 36</span>
            </a>

            {/* Cart Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full border transition-all hover:scale-105 cursor-pointer shadow-xs"
              style={{
                borderColor: theme.borderSubtle,
                backgroundColor: theme.bgCard,
                color: theme.textPrimary,
              }}
              aria-label="Warenkorb öffnen"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg lg:hidden text-neutral-700 hover:bg-neutral-200/50"
              aria-label="Menü umschalten"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden py-4 border-t space-y-1.5"
            style={{ borderColor: theme.borderSubtle }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors hover:bg-neutral-200/40"
                style={{
                  color:
                    activeSection === link.id
                      ? theme.primaryColor
                      : theme.textPrimary,
                }}
              >
                <div className="flex items-center gap-2">
                  {link.isSpecial && (
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  )}
                  <span>{link.label}</span>
                </div>
                {activeSection === link.id && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                )}
              </button>
            ))}

            <div className="pt-3 flex items-center justify-between px-4 text-xs text-neutral-500 border-t border-neutral-200">
              <a
                href="tel:0788180636"
                className="flex items-center gap-1.5 font-medium text-neutral-700"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>078 818 06 36 (Zuzu Jenni)</span>
              </a>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/zumano.ch"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pink-600"
                >
                  Instagram
                </a>
                <span>·</span>
                <a
                  href="https://www.facebook.com/zumano.ch"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
