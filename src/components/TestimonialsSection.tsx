import React, { useState } from 'react';
import {
  Star,
  Quote,
  CheckCircle2,
  MapPin,
  Heart,
  PlusCircle,
  MessageSquare,
  Sparkles,
  Camera,
  X,
  Send,
  Award,
} from 'lucide-react';
import { DesignTheme, CustomerTestimonial } from '../types';
import { CUSTOMER_TESTIMONIALS } from '../data/mockData';

interface TestimonialsSectionProps {
  theme: DesignTheme;
  onOpenLightbox?: (item: {
    id: string;
    title: string;
    imageUrl: string;
    categoryLabel: string;
    description: string;
  }) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  theme,
  onOpenLightbox,
}) => {
  // Local list of testimonials (seeded from mockData + localStorage)
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>(() => {
    try {
      const saved = localStorage.getItem('zumano_testimonials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...CUSTOMER_TESTIMONIALS, ...parsed];
      }
      return CUSTOMER_TESTIMONIALS;
    } catch {
      return CUSTOMER_TESTIMONIALS;
    }
  });

  // Filter category
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Modal for submitting a new testimonial
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formProjectType, setFormProjectType] = useState<string>('Personalisierte Holztafel');
  const [formRating, setFormRating] = useState<number>(5);
  const [formComment, setFormComment] = useState<string>('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<boolean>(false);

  const filterOptions = [
    { id: 'all', label: 'Alle Stimmen' },
    { id: 'holz', label: 'Holztafeln & Hochzeiten' },
    { id: 'aquarell', label: 'Aquarelle & Kunst' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'karten', label: 'Geburtskarten & Papeterie' },
  ];

  const filteredTestimonials = testimonials.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'holz')
      return (
        item.projectType.toLowerCase().includes('holz') ||
        item.projectType.toLowerCase().includes('hochzeit') ||
        item.projectType.toLowerCase().includes('tafel')
      );
    if (selectedFilter === 'aquarell')
      return (
        item.projectType.toLowerCase().includes('aquarell') ||
        item.projectType.toLowerCase().includes('wandmalerei')
      );
    if (selectedFilter === 'workshop')
      return item.projectType.toLowerCase().includes('workshop');
    if (selectedFilter === 'karten')
      return (
        item.projectType.toLowerCase().includes('karten') ||
        item.projectType.toLowerCase().includes('geburt')
      );
    return true;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim() || !formComment.trim()) return;

    const newTestimonial: CustomerTestimonial = {
      id: `testi-user-${Date.now()}`,
      author: formAuthor.trim(),
      location: formLocation.trim() || 'Schweiz',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      rating: formRating,
      date: 'Gerade eben',
      projectType: formProjectType,
      comment: `«${formComment.trim()}»`,
      verifiedBuyer: true,
      artworkPhotoUrl:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    };

    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);

    try {
      const customOnes = updated.filter((t) => t.id.startsWith('testi-user-'));
      localStorage.setItem('zumano_testimonials', JSON.stringify(customOnes));

      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: formAuthor.trim(),
          location: formLocation.trim() || 'Schweiz',
          rating: formRating,
          projectType: formProjectType,
          comment: formComment.trim(),
        }),
      });
    } catch (err) {
      console.warn('Testimonial submission fallback:', err);
    }

    setFormSuccessMessage(true);
    setTimeout(() => {
      setFormSuccessMessage(false);
      setIsModalOpen(false);
      setFormAuthor('');
      setFormLocation('');
      setFormComment('');
    }, 1800);
  };

  return (
    <section
      id="kundenmeinungen"
      className="py-16 md:py-24 border-t transition-colors duration-300 relative overflow-hidden"
      style={{
        backgroundColor: theme.bgBase,
        borderColor: theme.borderSubtle,
      }}
    >
      {/* Decorative subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.primaryColor}20` }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.accentColor}18` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
                color: theme.primaryColor,
              }}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span className="font-semibold">Kundenstimmen & Erfahrungen</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight"
              style={{ color: theme.textPrimary }}
            >
              Von Herzen gestaltet – das sagen meine Kundinnen & Kunden
            </h2>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
              Echte Rückmeldungen zu handgemachten Holztafeln, Aquarell-Aufträgen, Geburtskarten
              und kreativen Workshops im Atelier in Richterswil.
            </p>
          </div>

          {/* Action: Share Review */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-open-review-modal"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-full text-white text-xs sm:text-sm font-medium shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Erfahrung mitteilen</span>
            </button>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div
          className="p-6 rounded-2xl border shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-neutral-200"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderSubtle,
          }}
        >
          {/* Rating */}
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${theme.primaryColor}15` }}
            >
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold text-lg text-neutral-900">
                <span>5.0 / 5.0</span>
                <span className="text-amber-500 flex">★★★★★</span>
              </div>
              <div className="text-xs text-neutral-500">Über 140 Kundenbewertungen</div>
            </div>
          </div>

          {/* 100% Swiss Handmade */}
          <div className="pt-4 sm:pt-0 sm:pl-6 flex items-center justify-center sm:justify-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${theme.accentColor}15` }}
            >
              <Award className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900">100% Schweizer Handwerk</div>
              <div className="text-xs text-neutral-500">
                Atelier Richterswil & Schweizer Hölzer
              </div>
            </div>
          </div>

          {/* Personal Care */}
          <div className="pt-4 sm:pt-0 sm:pl-6 flex items-center justify-center sm:justify-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${theme.primaryColor}15` }}
            >
              <MessageSquare className="w-6 h-6" style={{ color: theme.primaryColor }} />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900">Persönlicher Austausch</div>
              <div className="text-xs text-neutral-500">
                Jedes Werk wird individuell besprochen
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterOptions.map((opt) => {
            const isActive = selectedFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedFilter(opt.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'shadow-xs font-semibold'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isActive ? theme.primaryColor : theme.bgCard,
                  color: isActive ? '#FFFFFF' : theme.textMuted,
                  border: `1px solid ${isActive ? theme.primaryColor : theme.borderSubtle}`,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <article
              key={item.id}
              className="p-6 rounded-2xl border shadow-xs flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-md group relative"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
              }}
            >
              {/* Decorative Quote Icon */}
              <div className="flex items-center justify-between">
                {/* 5 Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-2xs"
                    />
                  ))}
                </div>

                <Quote
                  className="w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ color: theme.primaryColor }}
                />
              </div>

              {/* Project Badge */}
              <div>
                <span
                  className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium border"
                  style={{
                    backgroundColor: `${theme.primaryColor}10`,
                    borderColor: `${theme.primaryColor}20`,
                    color: theme.primaryColor,
                  }}
                >
                  {item.projectType}
                </span>
              </div>

              {/* Comment Quote */}
              <p
                className="text-sm leading-relaxed italic font-serif"
                style={{ color: theme.textPrimary }}
              >
                {item.comment}
              </p>

              {/* Optional Artwork Thumbnail */}
              {item.artworkPhotoUrl && (
                <div
                  onClick={() => {
                    if (onOpenLightbox) {
                      onOpenLightbox({
                        id: item.id,
                        title: item.projectType,
                        imageUrl: item.artworkPhotoUrl!,
                        categoryLabel: 'Kunden-Auftrag',
                        description: `${item.author} (${item.location}): ${item.comment}`,
                      });
                    }
                  }}
                  className="relative h-32 rounded-xl overflow-hidden border cursor-pointer group/img"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <img
                    src={item.artworkPhotoUrl}
                    alt={item.projectType}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/30 transition-colors flex items-end p-2.5">
                    <span className="text-[11px] text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1 font-sans">
                      <Camera className="w-3 h-3" />
                      <span>Originalfoto vergrößern</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Author Footer */}
              <div
                className="pt-4 border-t flex items-center justify-between gap-3 text-xs"
                style={{ borderColor: theme.borderSubtle }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatarUrl}
                    alt={item.author}
                    className="w-9 h-9 rounded-full object-cover border"
                    style={{ borderColor: theme.borderSubtle }}
                  />
                  <div>
                    <div className="font-semibold" style={{ color: theme.textPrimary }}>
                      {item.author}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {item.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verifiziert</span>
                    </span>
                  )}
                  <div className="text-[10px] text-neutral-400 mt-0.5">{item.date}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Share Review Modal */}
      {isModalOpen && (
        <div
          id="modal-share-review"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderSubtle,
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${theme.primaryColor}15`,
                  color: theme.primaryColor,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deine Erfahrung zählt</span>
              </div>
              <h3
                className="text-2xl font-serif font-medium"
                style={{ color: theme.textPrimary }}
              >
                Kundenmeinung einreichen
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                Hast du ein Bild, eine Holztafel oder einen Workshop besucht? Teile deine Freude mit
                anderen Kunstliebhabern!
              </p>
            </div>

            {formSuccessMessage ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-semibold text-emerald-900">Vielen herzlichen Dank!</h4>
                <p className="text-xs text-emerald-700">
                  Deine Rückmeldung wurde hinzugefügt und ist ab sofort sichtbar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
                {/* Star Rating Select */}
                <div>
                  <label className="block font-medium mb-1.5 text-neutral-700">
                    Deine Bewertung:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= formRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-semibold text-neutral-700 text-xs">
                      {formRating} von 5 Sternen
                    </span>
                  </div>
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-neutral-700">
                      Dein Name / Initialen *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="z.B. Sarah M. oder Familie Keller"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden focus:ring-2"
                      style={{ borderColor: theme.borderSubtle }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-neutral-700">
                      Wohnort (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. Richterswil, Wädenswil, Zürich"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden focus:ring-2"
                      style={{ borderColor: theme.borderSubtle }}
                    />
                  </div>
                </div>

                {/* Project Category */}
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">
                    Um welches Werk / Erlebnis ging es?
                  </label>
                  <select
                    value={formProjectType}
                    onChange={(e) => setFormProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden focus:ring-2"
                    style={{ borderColor: theme.borderSubtle }}
                  >
                    <option value="Personalisierte Holztafel (Hochzeit / Einzug)">
                      Personalisierte Holztafel (Hochzeit / Einzug)
                    </option>
                    <option value="Aquarell-Original (Zürichsee / Natur)">
                      Aquarell-Original (Zürichsee / Natur)
                    </option>
                    <option value="Fine-Art Kunstdruck">Fine-Art Kunstdruck</option>
                    <option value="Hand-Lettering & Aquarell Workshop">
                      Hand-Lettering & Aquarell Workshop
                    </option>
                    <option value="Geburtskarten & Papeterie-Set">
                      Geburtskarten & Papeterie-Set
                    </option>
                    <option value="Wandmalerei / Kreidetafel für Event">
                      Wandmalerei / Kreidetafel für Event
                    </option>
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">
                    Deine Erfahrungen & Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Wie hat dir das Werk gefallen? Wie war der Kontakt mit Zuzu? Wo hat das Kunstwerk seinen Platz gefunden?"
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-white focus:outline-hidden focus:ring-2"
                    style={{ borderColor: theme.borderSubtle }}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full text-white font-medium shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Meinung veröffentlichen</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
