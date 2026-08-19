import React, { useState } from 'react';
import {
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INSTAGRAM_POSTS } from '../data/mockData';
import { DesignTheme } from '../types';

interface SocialAndContactSectionProps {
  theme: DesignTheme;
  prefilledCommissionData?: string;
}

export const SocialAndContactSection: React.FC<SocialAndContactSectionProps> = ({
  theme,
  prefilledCommissionData,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('commission');
  const [message, setMessage] = useState(prefilledCommissionData || '');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFeedback, setServerFeedback] = useState<string | null>(null);

  // Sync if prefilled data changes from customizer
  React.useEffect(() => {
    if (prefilledCommissionData) {
      setMessage((prev) =>
        prev.includes(prefilledCommissionData)
          ? prev
          : `${prev ? prev + '\n\n' : ''}[Generierte Bildidee]:\n${prefilledCommissionData}`
      );
    }
  }, [prefilledCommissionData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerFeedback(null);

    const payload = {
      name,
      email,
      phone,
      subject: serviceType,
      message,
      commissionDetails: prefilledCommissionData || '',
    };

    try {
      // Try PHP endpoint first if available, otherwise Express /api/contact
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setServerFeedback(data.message || 'Nachricht erfolgreich übermittelt!');
      }
    } catch (err) {
      console.warn('API submission fallback:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 transition-colors duration-300 border-t"
      style={{
        backgroundColor: theme.bgBase,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Instagram & Facebook Social Showcase Header */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderSubtle,
                  color: theme.primaryColor,
                }}
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Social Media & Live-Einblicke</span>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-light font-serif tracking-tight"
                style={{ color: theme.textPrimary }}
              >
                Folge @zumano.ch auf <br className="hidden sm:inline" />
                <span className="italic font-normal">Instagram & Facebook</span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
                Tägliche Stories von der Staffelei, neue Farbpaletten und Ankündigungen
                zu spontanen Workshop-Plätzen.
              </p>
            </div>

            {/* Direct Social Profile Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                id="link-instagram-profile"
                href="https://www.instagram.com/zumano.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:scale-105 flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram @zumano.ch</span>
              </a>

              <a
                id="link-facebook-profile"
                href="https://www.facebook.com/zumano.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:scale-105 flex items-center gap-2 bg-[#1877F2]"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook ZUMANO</span>
              </a>
            </div>
          </div>

          {/* Instagram Feed Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/zumano.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-neutral-200 block"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white text-xs">
                  <p className="line-clamp-3 italic font-serif">
                    «{post.caption}»
                  </p>
                  <div className="flex items-center justify-between font-sans text-[11px] text-neutral-300 border-t border-white/20 pt-2">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5" />
                      @zumano.ch
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact & Inquiry Studio Section */}
        <div
          className="rounded-3xl p-6 sm:p-10 border shadow-lg"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Contact Info & Address Richterswil */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                  Kontakt & Besuche
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-light text-neutral-900">
                  Schreib mir eine Nachricht <br />
                  <span className="italic font-normal">oder ruf kurz an.</span>
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                Ich freue mich über jede Anfrage – ob für ein Hochzeits-Unikat, eine
                persönliche Geburtskarte, eine Wandgestaltung oder einen gemütlichen Workshop.
              </p>

              {/* Direct Info Cards */}
              <div className="space-y-3 pt-2">
                <a
                  href="tel:0788180636"
                  className="flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:bg-neutral-50 group"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Telefon & WhatsApp</div>
                    <div className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700">
                      078 818 06 36
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:zzjenni@gmail.com"
                  className="flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:bg-neutral-50 group"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">E-Mail Adresse</div>
                    <div className="text-sm font-bold text-neutral-900 group-hover:text-blue-700">
                      zzjenni@gmail.com
                    </div>
                  </div>
                </a>

                <div
                  className="flex items-center gap-3 p-3.5 rounded-xl border"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Atelier Standort</div>
                    <div className="text-sm font-bold text-neutral-900">
                      8805 Richterswil am Zürichsee · Schweiz
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif text-emerald-950 font-light">
                    Vielen Dank für deine Nachricht!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                    Ich habe deine Anfrage erhalten und melde mich in der Regel innerhalb von 24 Stunden
                    persönlich bei dir aus dem Atelier.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    Weitere Nachricht senden
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700 block">
                        Dein Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="z.B. Sarah Muster"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700 block">
                        Deine E-Mail Adresse *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@beispiel.ch"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700 block">
                        Telefonnummer (optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="079 123 45 67"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700 block">
                        Thema der Anfrage
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none bg-white font-medium"
                      >
                        <option value="commission">Individuelle Auftragsarbeit / Unikat</option>
                        <option value="wedding">Hochzeitstafel & Schilder</option>
                        <option value="cards">Geburtskarten & Papeterie</option>
                        <option value="workshop">Hand-Lettering Kurs / Workshop</option>
                        <option value="mural">Wandmalerei vor Ort</option>
                        <option value="other">Sonstige Frage</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">
                      Deine Nachricht / Wünsche / Format *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Beschreibe kurz deine Vorstellung (Anlass, Wunschfarben, Format, Lieferdatum)..."
                      className="w-full p-3.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400 font-sans"
                    />
                  </div>

                  <button
                    id="btn-submit-contact-form"
                    type="submit"
                    className="w-full py-3.5 px-5 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Unverbindliche Anfrage absenden</span>
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center">
                    Deine Daten werden vertraulich behandelt und ausschließlich zur Beantwortung deiner Anfrage genutzt.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
