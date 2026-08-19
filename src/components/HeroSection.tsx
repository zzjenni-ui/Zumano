import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Palette,
  ShoppingBag,
  Heart,
  MapPin,
  CheckCircle2,
  Brush,
} from 'lucide-react';
import { DesignTheme } from '../types';

interface HeroSectionProps {
  theme: DesignTheme;
  onExploreGallery: () => void;
  onOpenCustomizer: () => void;
  onOpenShop: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onExploreGallery,
  onOpenCustomizer,
  onOpenShop,
}) => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 transition-colors duration-300"
      style={{ backgroundColor: theme.bgBase }}
    >
      {/* Subtle Nordic atmospheric background shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.primaryColor}20` }}
        />
        <div
          className="absolute top-1/2 -left-20 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.accentColor}18` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Location & Handcraft Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-2xs backdrop-blur-sm"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
                color: theme.textPrimary,
              }}
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Atelier Richterswil am Zürichsee · Schweiz</span>
              <span className="text-neutral-300">|</span>
              <span className="font-semibold" style={{ color: theme.primaryColor }}>
                100% Handgemacht
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight font-serif leading-[1.12]"
                style={{ color: theme.textPrimary }}
              >
                Nordische Poesie, <br className="hidden sm:inline" />
                <span className="italic font-normal">Aquarell & Hand-Lettering</span>
              </h1>

              <p
                className="text-lg sm:text-xl font-hand text-2xl sm:text-3xl"
                style={{ color: theme.accentColor }}
              >
                «Hey, ich freu mich auch für dich zu malen!»
              </p>
            </div>

            {/* Description */}
            <p
              className="text-base sm:text-lg max-w-2xl leading-relaxed"
              style={{ color: theme.textMuted }}
            >
              Willkommen bei <strong>zumano.ch</strong> von Zäzilia «Zuzu» Jenni. Entdecke handgefertigte
              Aquarell-Unikate, individuelle Holz- und Hochzeitsschilder, botanische Kunstdrucke und
              unsere interaktive Kunstideen-Werkstatt zum direkten Personalisieren.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="btn-hero-customizer"
                onClick={onOpenCustomizer}
                className="px-6 py-3.5 rounded-full text-sm font-semibold text-white shadow-md transition-all hover:scale-105 flex items-center gap-2 cursor-pointer group"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Bildidee jetzt customizen & gestalten</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="btn-hero-shop"
                onClick={onOpenShop}
                className="px-6 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderSubtle,
                  color: theme.textPrimary,
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Zum Online-Shop</span>
              </button>

              <button
                id="btn-hero-gallery"
                onClick={onExploreGallery}
                className="px-4 py-3 rounded-full text-sm font-medium transition-colors hover:text-neutral-900 cursor-pointer underline underline-offset-4"
                style={{ color: theme.textMuted }}
              >
                Galerie durchstöbern
              </button>
            </div>

            {/* Quick Guarantee Highlights */}
            <div className="pt-4 border-t grid grid-cols-2 sm:grid-cols-3 gap-3"
              style={{ borderColor: theme.borderSubtle }}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kostenloser Versand CH</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Individuelle Wunschtexte</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Atelierkurse in Kleingruppen</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition with Layered Artwork Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Artwork Card */}
              <div
                className="rounded-2xl p-3 sm:p-4 shadow-xl border relative transition-all duration-300 hover:shadow-2xl"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-neutral-100 group">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
                    alt="Aquarell Original Werk von zumano.ch"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Glass Tag on Image */}
                  <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-serif italic text-neutral-800 shadow-xs border border-white/60">
                    «Morgentau am Zürichsee» – Aquarell Original
                  </div>

                  <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full font-medium">
                    Handgemalt in Richterswil
                  </div>
                </div>

                {/* Card footer description */}
                <div className="mt-3.5 flex items-center justify-between px-1">
                  <div>
                    <h3 className="font-serif text-base font-medium text-neutral-900">
                      Feinste Pigmente auf 300g Büttenpapier
                    </h3>
                    <p className="text-xs text-neutral-500 font-sans">
                      Jedes Bild entsteht mit Liebe zum Detail und natürlichen Erdtönen
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
                  >
                    <Brush className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Floating Floating Mini Badge (Personalized Boards) */}
              <div
                className="absolute -bottom-6 -left-4 sm:-left-6 p-3.5 rounded-xl shadow-lg border backdrop-blur-md max-w-[210px] hidden sm:block animate-bounce-subtle"
                style={{
                  backgroundColor: `${theme.bgCard}F2`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    ✍️
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">
                      Wunschbeschriftung
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Für Hochzeiten & Geburtstage
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Floating Mini Badge 2 (Studio Reviews) */}
              <div
                className="absolute -top-4 -right-4 sm:-right-6 p-3 rounded-xl shadow-lg border backdrop-blur-md hidden sm:flex items-center gap-2.5"
                style={{
                  backgroundColor: `${theme.bgCard}F2`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="flex text-amber-500 text-xs">
                  ★★★★★
                </div>
                <div className="text-xs font-medium text-neutral-800">
                  <strong>5.0</strong> (120+ zufriedene Kunden)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
