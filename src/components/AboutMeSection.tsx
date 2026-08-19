import React from 'react';
import {
  Heart,
  Brush,
  Sparkles,
  MapPin,
  Coffee,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { DesignTheme } from '../types';

interface AboutMeSectionProps {
  theme: DesignTheme;
  onContactZuzu: () => void;
  onScrollToVideos: () => void;
}

export const AboutMeSection: React.FC<AboutMeSectionProps> = ({
  theme,
  onContactZuzu,
  onScrollToVideos,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Inspiration & Skizze',
      desc: 'Am Zürichseeufer oder im Atelier in Richterswil: Sanfte Linienführung und Textkomposition entstehen zuerst mit Bleistift.',
    },
    {
      num: '02',
      title: 'Pigmente & Nass-in-Nass',
      desc: 'Mit hochwertigen Schmincke Horadam Pigmenten und viel Wasser fließen Farben organisch ineinander – jedes Blatt ein Unikat.',
    },
    {
      num: '03',
      title: 'Hand-Lettering & Kalligraphie',
      desc: 'Mit Pinselstift, feiner Tusche und ruhiger Hand wird jeder Buchstabe mit Schwung und Gefühl von Hand geformt.',
    },
    {
      num: '04',
      title: 'Veredelung & Schweizer Eichenrahmen',
      desc: 'Auf Wunsch mit Blattgold-Akzenten veredelt, im säurefreien Passepartout gerahmt und sicher plastikarm verpackt.',
    },
  ];

  return (
    <section
      id="about"
      className="py-16 md:py-24 transition-colors duration-300 border-t"
      style={{
        backgroundColor: theme.bgBase,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Main About Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Artist Portrait & Studio Vibe Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Main Portrait Frame */}
              <div
                className="rounded-3xl p-3 sm:p-4 shadow-xl border overflow-hidden"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                    alt="Zäzilia Zuzu Jenni im Atelier Richterswil"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-serif uppercase tracking-widest text-amber-200">
                      Künstlerin & Lettering-Coach
                    </p>
                    <h3 className="text-xl font-serif font-light">
                      Zäzilia «Zuzu» Jenni
                    </h3>
                  </div>
                </div>
              </div>

              {/* Floating Coffee & Studio note badge */}
              <div
                className="absolute -bottom-6 -right-4 sm:-right-6 p-4 rounded-2xl shadow-xl border backdrop-blur-md max-w-[220px]"
                style={{
                  backgroundColor: `${theme.bgCard}F2`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      Atelier in Richterswil
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Besuche auf Voranmeldung herzlich willkommen!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sympathetic Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
                color: theme.primaryColor,
              }}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Über mich & mein Atelier zumano.ch</span>
            </div>

            <div className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight"
                style={{ color: theme.textPrimary }}
              >
                «Die Kunst, mit Pinsel & Worten <br />
                <span className="italic font-normal">Ruhe ins Leben zu bringen.»</span>
              </h2>

              <p
                className="text-xl sm:text-2xl font-hand"
                style={{ color: theme.accentColor }}
              >
                Grüezi, ich bin Zäzilia Jenni – aber die meisten nennen mich einfach Zuzu!
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
              <p>
                In meinem sonnigen Atelier in <strong>Richterswil am Zürichsee</strong> schaffe ich
                einen Raum der Entschleunigung. Inspiriert von der klaren, sanften Ästhetik des
                nordischen Designs kombiniere ich fließende <strong>Aquarellmalerei</strong> mit
                präzisem <strong>Hand-Lettering</strong> und natürlichem Massivholz.
              </p>
              <p>
                Ob eine personalisierte Hochzeitstafel, eine Geburtskarte für ein Neugeborenes, ein
                großformatiges Wandgemälde für ein Café oder ein inspirierender Workshop am Samstag:
                Ich liebe es, Emotionen in zeitlose Kunstwerke zu verwandeln.
              </p>
            </div>

            {/* Atelier Values Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-100/70 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Echte Handarbeit – kein Massendruck</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-100/70 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nachhaltiges Schweizer Holz & Büttenpapier</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-100/70 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Individuelle Beratung & Wunschmotive</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-100/70 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Atelier-Workshops in gemütlicher Runde</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                id="btn-about-contact"
                onClick={onContactZuzu}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Mail className="w-4 h-4" />
                <span>Nachricht an Zuzu schreiben</span>
              </button>

              <button
                id="btn-about-videos"
                onClick={onScrollToVideos}
                className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold border transition-all hover:bg-neutral-100 flex items-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderSubtle,
                  color: theme.textPrimary,
                }}
              >
                <span>Kurze Atelier-Filme ansehen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step Process Section ("Wie ich arbeite") */}
        <div className="pt-8 border-t" style={{ borderColor: theme.borderSubtle }}>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3
              className="text-2xl sm:text-3xl font-serif font-light"
              style={{ color: theme.textPrimary }}
            >
              Vom Gedanken zum Kunstwerk: <span className="italic font-normal">Mein Entstehungsprozess</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans">
              Transparenz und handwerkliche Sorgfalt bei jedem einzelnen Pinselstrich.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl border shadow-xs space-y-3 relative group transition-all hover:shadow-md"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-serif font-bold opacity-30"
                  style={{ color: theme.primaryColor }}
                >
                  {step.num}
                </div>
                <h4 className="font-serif text-lg font-medium text-neutral-900">
                  {step.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
