import React from 'react';
import { Sparkles, Palette, Check } from 'lucide-react';
import { DESIGN_THEMES } from '../data/mockData';
import { DesignThemeId } from '../types';

interface ThemeSwitcherBannerProps {
  currentTheme: DesignThemeId;
  onSelectTheme: (themeId: DesignThemeId) => void;
}

export const ThemeSwitcherBanner: React.FC<ThemeSwitcherBannerProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <aside
      id="theme-switcher-banner"
      aria-label="Design-Vorschau Stile"
      className="bg-neutral-900 text-neutral-100 py-2.5 px-4 sticky top-0 z-50 border-b border-neutral-800 shadow-md backdrop-blur-md bg-opacity-95"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <span className="text-neutral-200">
            <strong className="text-white font-semibold">3 Beispieldesigns zur Auswahl:</strong> Klicke zum Umschalten der Website-Ästhetik
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {Object.values(DESIGN_THEMES).map((theme) => {
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                id={`btn-theme-${theme.id}`}
                onClick={() => onSelectTheme(theme.id as DesignThemeId)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-sm ring-2 ring-amber-400 font-semibold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <span>{theme.name.split(':')[0]}</span>
                {isActive && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
