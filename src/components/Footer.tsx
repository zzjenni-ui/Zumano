import React from 'react';
import {
  Instagram,
  Facebook,
  Heart,
  Phone,
  Mail,
  MapPin,
  Brush,
  ArrowUp,
  Sparkles,
} from 'lucide-react';
import { DesignTheme } from '../types';

interface FooterProps {
  theme: DesignTheme;
  onNavigate: (section: string) => void;
  onOpenPhpGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onNavigate, onOpenPhpGuide }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="border-t transition-colors duration-300 pt-16 pb-12"
      style={{
        backgroundColor: theme.bgBase,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b" style={{ borderColor: theme.borderSubtle }}>
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-2xl font-light text-neutral-900">
                ZUMANO<span style={{ color: theme.accentColor }}>.CH</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border bg-neutral-100 font-medium text-neutral-600">
                Atelier Richterswil
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm font-sans">
              Handgemalte Aquarellkunst, modernes Hand-Lettering und personalisierte
              Holztafeln von Zäzilia «Zuzu» Jenni. Jedes Werk ein mit Liebe gefertigtes Unikat.
            </p>

            {/* Social Icons Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                id="footer-link-instagram"
                href="https://www.instagram.com/zumano.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-pink-100 hover:text-pink-600 text-neutral-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Folge @zumano.ch auf Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                id="footer-link-facebook"
                href="https://www.facebook.com/zumano.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-blue-100 hover:text-blue-600 text-neutral-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Folge ZUMANO auf Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                id="footer-link-mail"
                href="mailto:zzjenni@gmail.com"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-700 text-neutral-700 flex items-center justify-center transition-colors shadow-2xs"
                title="E-Mail schreiben"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                id="footer-link-phone"
                href="tel:0788180636"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-amber-100 hover:text-amber-700 text-neutral-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Anrufen"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-900 font-sans">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Galerie & Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Online-Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customizer')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Bildideen-Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Über Zuzu & Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kundenmeinungen')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Kundenstimmen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('videos')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Atelier-Filme
                </button>
              </li>
            </ul>
          </div>

          {/* Products & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-900 font-sans">
              Angebot & Unikate
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>Aquarell Original-Unikate</li>
              <li>Personalisierte Hochzeitstafeln</li>
              <li>Geburts- & Taufkarten</li>
              <li>Hand-Lettering Kurse & Workshops</li>
              <li>Wandgestaltungen für Gastronomie & Heime</li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-900 font-sans">
              Atelier Richterswil
            </h4>
            <div className="space-y-2 text-xs text-neutral-500 leading-relaxed">
              <p>Zäzilia «Zuzu» Jenni</p>
              <p>8805 Richterswil am Zürichsee</p>
              <p>Telefon: 078 818 06 36</p>
              <p>E-Mail: zzjenni@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} zumano.ch · Gestaltet mit</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>in der Schweiz</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {onOpenPhpGuide && (
              <button
                id="btn-footer-php-guide"
                onClick={onOpenPhpGuide}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer bg-neutral-100/70 hover:bg-neutral-200/80 px-2.5 py-1 rounded-md"
              >
                <span>🐘 PHP & Hosting Guide</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <span>Nach oben</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
