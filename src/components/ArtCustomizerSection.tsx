import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Sliders,
  Palette,
  Send,
  Check,
  Eye,
  Brush,
  Layers,
  Home,
  Heart,
  HelpCircle,
  MessageSquare,
  Clock,
  Coins,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedArtIdea, DesignTheme } from '../types';

interface ArtCustomizerSectionProps {
  theme: DesignTheme;
  onSendAsCommissionInquiry: (idea: GeneratedArtIdea, customNotes?: string) => void;
}

export const ArtCustomizerSection: React.FC<ArtCustomizerSectionProps> = ({
  theme,
  onSendAsCommissionInquiry,
}) => {
  // Config state
  const [selectedTheme, setSelectedTheme] = useState('Nordische Bergseen & Nebelwälder');
  const [selectedMedium, setSelectedMedium] = useState('Aquarell auf 300g Arches Büttenpapier');
  const [selectedColorMood, setSelectedColorMood] = useState('Nordisch Sanft (Salbei, Sand & Nebelgrau)');
  const [selectedOccasion, setSelectedOccasion] = useState('Wohnraum & Entschleunigung');
  const [customText, setCustomText] = useState('«Zuhause ist dort, wo das Herz zur Ruhe kommt»');
  const [selectedFormat, setSelectedFormat] = useState('A3 (30 × 40 cm)');
  const [selectedRoom, setSelectedRoom] = useState<'living' | 'easel' | 'bedroom' | 'nursery'>('living');

  // Interactive refinement
  const [refinementInput, setRefinementInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generated idea state
  const [generatedIdea, setGeneratedIdea] = useState<GeneratedArtIdea>({
    title: '«Nebelschwingen über dem See»',
    subTitle: 'Nordisches Aquarell & Hand-Lettering Unikat',
    description:
      'Ein harmonisches Kunstwerk mit sanft ineinander fließenden Aquarell-Lasuren in Salbeigrün und warmem Sand. Feine botanische Tuschezweige und ein handgeschriebenes Zitat in moderner Kalligraphie verleihen dem Werk zeitlose Ruhe.',
    technique: 'Nass-in-Nass Aquarelltechnik mit Schmincke Horadam Pigmenten & lichtechter japanischer Tusche',
    colorPalette: [
      { name: 'Salbeigrün', hex: '#7E8E7E' },
      { name: 'Nordic Sand', hex: '#D4C7B5' },
      { name: 'Kaltes Nebelgrau', hex: '#9BA2A6' },
      { name: 'Warme Ockererde', hex: '#C49A6C' },
      { name: 'Schieferblau', hex: '#3A4651' },
    ],
    letteringSuggestion: '«Zuhause ist dort, wo das Herz zur Ruhe kommt»',
    fontStyleAdvice: 'Fließende Brush-Kalligraphie mit feinen Aufstrichen und schlichter serifenloser Ergänzung.',
    framingRecommendation: 'Schlichter Eichenholzrahmen Natur mit 5cm säurefreiem Schrägschnitt-Passepartout.',
    canvasVisual: {
      backgroundGradient: 'linear-gradient(135deg, #E6ECE8 0%, #D8DEC9 40%, #D4C7B5 100%)',
      brushMotif: 'Sanfte Berg- & Seeverläufe mit zarten Eukalyptuszweigen',
      accentColor: '#7E8E7E',
    },
    estimatedCreationTime: '3-5 Werktage im Atelier Richterswil',
    recommendedPriceChf: '185.– bis 280.– CHF',
  });

  const sampleQuotes = [
    '«Zuhause ist dort, wo das Herz zur Ruhe kommt»',
    '«Das Leben ist die Kunst, das Schöne im Kleinen zu finden»',
    '«Für immer & ewig – Sarah & Noah 24.08.2024»',
    '«Kleine Wunder beginnen ganz leise»',
    '«Atmen. Loslassen. Kreieren.»',
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/generate-art-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedTheme,
          medium: selectedMedium,
          colorMood: selectedColorMood,
          occasion: selectedOccasion,
          customText: customText,
          roomSetting: selectedRoom,
          format: selectedFormat,
        }),
      });
      const data = await res.json();
      if (data.success && data.idea) {
        setGeneratedIdea(data.idea);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7E8E7E', '#D4C7B5', '#C49A6C'],
        });
      } else {
        setErrorMsg('Konnte Bildidee nicht generieren. Standard-Konzept geladen.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Verbindungsfehler. Konzept im Offline-Modus erstellt.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim()) return;

    setIsRefining(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/customize-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentIdea: generatedIdea,
          modificationRequest: refinementInput,
        }),
      });
      const data = await res.json();
      if (data.success && data.updatedIdea) {
        setGeneratedIdea(data.updatedIdea);
        setRefinementInput('');
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.6 },
          colors: ['#C49A6C', '#7E8E7E'],
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Anpassung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <section
      id="customizer"
      className="py-16 md:py-24 transition-colors duration-300 border-t"
      style={{
        backgroundColor: theme.bgBase,
        borderColor: theme.borderSubtle,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border shadow-2xs"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderSubtle,
              color: theme.primaryColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interaktiver Bildideen-Generator & Customizer</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight"
            style={{ color: theme.textPrimary }}
          >
            Gestalte dein eigenes <br className="hidden sm:inline" />
            <span className="italic font-normal">Kunstwerk-Konzept</span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
            Kombiniere deine Wunschmotive, Farben und persönlichen Texte. Unser intelligentes Atelier-Tool
            entwirft ein harmonisches Konzept, das du direkt anpassen und als handgemaltes Unikat bei Zuzu anfragen kannst.
          </p>
        </div>

        {/* Studio Customizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (Left, 5 cols) */}
          <div
            className="lg:col-span-5 rounded-2xl p-6 sm:p-7 border shadow-sm space-y-6"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4" style={{ color: theme.primaryColor }} />
                <h3 className="font-semibold text-sm text-neutral-900">
                  Wunsch-Kriterien konfigurieren
                </h3>
              </div>
              <span className="text-xs text-neutral-500">Schritt 1 von 2</span>
            </div>

            {/* Theme / Motif Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                1. Kunst-Thema & Motiv
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none bg-neutral-50 focus:ring-2 focus:ring-neutral-400 font-medium"
                style={{ borderColor: theme.borderSubtle, color: theme.textPrimary }}
              >
                <option value="Nordische Bergseen & Nebelwälder">Nordische Bergseen & Nebelwälder (Sanft & Beruhigend)</option>
                <option value="Botanischer Eukalyptus & Wildblumen">Botanischer Eukalyptus & Wildblumen (Zart & Frisch)</option>
                <option value="Hochzeits- & Event-Willkommenstafel">Hochzeits- & Event-Willkommenstafel (Festlich & Edel)</option>
                <option value="Geburtskarte & Kinderzimmer-Tiere (Fuchs/Wal)">Geburtskarte & Kinderzimmer-Tiere (Liebevoll)</option>
                <option value="Poetisches Hand-Lettering Zitat">Poetisches Hand-Lettering Zitat (Wohnung & Inspiration)</option>
                <option value="Moderne Schiefertafel für Küche/Gastronomie">Moderne Schiefertafel für Küche & Genuss</option>
              </select>
            </div>

            {/* Medium Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                2. Material & Mal-Technik
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Aquarell auf 300g Büttenpapier',
                  'Massivholz Schweizer Lärche',
                  'Natur-Schiefertafel',
                  'Großformat-Wandmalerei',
                ].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMedium(m)}
                    className={`p-2.5 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                      selectedMedium === m
                        ? 'font-semibold ring-2 ring-amber-400 bg-neutral-100'
                        : 'hover:bg-neutral-50 text-neutral-600'
                    }`}
                    style={{ borderColor: theme.borderSubtle }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Mood */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                3. Nordische Farbstimmung
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: 'Nordisch Sanft (Salbei & Sand)', colors: ['#7E8E7E', '#D4C7B5', '#9BA2A6'] },
                  { name: 'Warme Erdtöne & Ocker', colors: ['#C49A6C', '#8C5E47', '#E5D6C5'] },
                  { name: 'Fjordblau & Schiefer', colors: ['#3A4651', '#728892', '#D0DBE0'] },
                  { name: 'Zartes Salbeigrün & Blattgold', colors: ['#8EA08E', '#DFB870', '#F2EFE9'] },
                ].map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => setSelectedColorMood(palette.name)}
                    className={`p-2.5 rounded-xl text-xs text-left border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      selectedColorMood === palette.name
                        ? 'font-semibold ring-2 ring-amber-400 bg-neutral-100'
                        : 'hover:bg-neutral-50 text-neutral-600'
                    }`}
                    style={{ borderColor: theme.borderSubtle }}
                  >
                    <span className="line-clamp-1">{palette.name.split('(')[0]}</span>
                    <div className="flex gap-1 shrink-0">
                      {palette.colors.map((c, i) => (
                        <span key={i} className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text / Quote input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700">
                  4. Wunschtext / Name / Widmung
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const rnd = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
                    setCustomText(rnd);
                  }}
                  className="text-[11px] underline cursor-pointer hover:text-amber-700"
                  style={{ color: theme.primaryColor }}
                >
                  Zufälliges Zitat einfügen
                </button>
              </div>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="z.B. Namen, Hochzeitsdatum oder Lieblingsspruch..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none bg-neutral-50 focus:ring-2 focus:ring-neutral-400"
                style={{ borderColor: theme.borderSubtle, color: theme.textPrimary }}
              />
            </div>

            {/* Format selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                5. Gewünschtes Format
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['A4 (21×30 cm)', 'A3 (30×40 cm)', 'Groß (50×70 cm)'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFormat(f)}
                    className={`py-2 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedFormat === f
                        ? 'font-semibold ring-2 ring-amber-400 bg-neutral-100 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                    style={{ borderColor: theme.borderSubtle }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              id="btn-trigger-ai-concept"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini Atelier KI entwirft Konzept...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Neues Kunstwerk-Konzept generieren</span>
                </>
              )}
            </button>

            {errorMsg && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Interactive Artwork Mockup & Spec Panel (Right, 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Canvas Card */}
            <div
              className="rounded-2xl border shadow-lg overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderSubtle,
              }}
            >
              {/* Top Room Selector Pills */}
              <div className="p-3.5 border-b bg-neutral-100/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Raum-Vorschau:</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'living', label: 'Wohnzimmer' },
                    { id: 'easel', label: 'Staffelei im Atelier' },
                    { id: 'bedroom', label: 'Schlafzimmer' },
                    { id: 'nursery', label: 'Kinderzimmer' },
                  ].map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id as any)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        selectedRoom === room.id
                          ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
                          : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Room Visualizer Stage */}
              <div className="relative p-6 sm:p-10 flex items-center justify-center min-h-[360px] sm:min-h-[440px] overflow-hidden bg-[#EAE6DF]">
                {/* Background Wall Texture */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8C7D6B_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Framed Canvas Mockup */}
                <div
                  className="relative z-10 p-4 sm:p-6 rounded-lg shadow-2xl transition-all duration-500 max-w-sm sm:max-w-md w-full border-[10px] border-[#3B2E24] bg-[#FAF8F5]"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                  }}
                >
                  {/* Passepartout Layer */}
                  <div className="p-4 sm:p-6 bg-[#FAF7F2] border border-[#DDD5CA] rounded shadow-inner">
                    {/* Painted Artwork Canvas */}
                    <div
                      className="aspect-3/4 rounded p-6 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-700"
                      style={{
                        background: generatedIdea.canvasVisual.backgroundGradient,
                      }}
                    >
                      {/* Watercolor Texture Overlays */}
                      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/30 blur-2xl pointer-events-none" />
                      <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-black/10 blur-2xl pointer-events-none" />

                      {/* Top Motif Header */}
                      <div className="relative z-10 text-[10px] tracking-widest uppercase font-serif text-neutral-700/80">
                        Atelier zumano · Richterswil
                      </div>

                      {/* Center Artwork & Hand-Lettering Concept */}
                      <div className="relative z-10 my-auto space-y-4 px-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center border border-white/60 shadow-xs">
                          <Brush className="w-5 h-5 text-neutral-800" />
                        </div>

                        <div className="space-y-1.5">
                          <p className="font-hand text-2xl sm:text-3xl text-neutral-900 leading-tight drop-shadow-xs">
                            {generatedIdea.letteringSuggestion || customText}
                          </p>
                          <p className="text-[11px] font-serif italic text-neutral-700">
                            {generatedIdea.canvasVisual.brushMotif}
                          </p>
                        </div>
                      </div>

                      {/* Signature on bottom right */}
                      <div className="relative z-10 w-full flex items-center justify-between text-[10px] text-neutral-600 border-t border-neutral-700/20 pt-2 font-serif">
                        <span>Original-Unikat</span>
                        <span className="font-hand text-sm text-neutral-800">Zäzilia Jenni</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specification Card Below Mockup */}
              <div className="p-6 space-y-5 border-t" style={{ borderColor: theme.borderSubtle }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
                      {generatedIdea.subTitle}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-light text-neutral-900">
                      {generatedIdea.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xs text-neutral-500">Geschätzter Richtpreis</div>
                    <div className="text-lg font-bold" style={{ color: theme.primaryColor }}>
                      {generatedIdea.recommendedPriceChf}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  {generatedIdea.description}
                </p>

                {/* Color Swatches */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-neutral-500" />
                    Generierte Farbharmonie:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {generatedIdea.colorPalette.map((color, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 text-xs border border-neutral-200"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-2xs border border-black/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-medium text-[11px]">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Framing & Crafting Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="font-semibold text-neutral-800 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-neutral-500" />
                      Rahmen-Empfehlung:
                    </span>
                    <p className="text-neutral-600">{generatedIdea.framingRecommendation}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="font-semibold text-neutral-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      Atelier-Anfertigung:
                    </span>
                    <p className="text-neutral-600">{generatedIdea.estimatedCreationTime}</p>
                  </div>
                </div>

                {/* Natural Language Refinement Input (man soll bildideen anpassen können) */}
                <form onSubmit={handleRefine} className="pt-3 border-t space-y-2" style={{ borderColor: theme.borderSubtle }}>
                  <label className="text-xs font-semibold text-neutral-800 block">
                    💬 Bildidee weiter anpassen (z.B. «Mehr Goldtupfer», «Herbstlichere Töne»):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={refinementInput}
                      onChange={(e) => setRefinementInput(e.target.value)}
                      placeholder="Deine Wunsch-Änderung beschreiben..."
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm border outline-none bg-neutral-50 focus:ring-2 focus:ring-neutral-400"
                      style={{ borderColor: theme.borderSubtle }}
                    />
                    <button
                      type="submit"
                      disabled={isRefining || !refinementInput.trim()}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isRefining ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Anpassen</span>
                    </button>
                  </div>
                </form>

                {/* Direct Commission Request Button */}
                <div className="pt-2">
                  <button
                    id="btn-customizer-order-inquiry"
                    onClick={() => {
                      confetti({
                        particleCount: 70,
                        spread: 70,
                        origin: { y: 0.7 },
                      });
                      onSendAsCommissionInquiry(generatedIdea, `Thema: ${selectedTheme} | Format: ${selectedFormat} | Text: ${customText}`);
                    }}
                    className="w-full py-3.5 px-5 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Dieses Konzept unverbindlich als Auftragsarbeit anfragen</span>
                  </button>
                  <p className="text-[11px] text-center text-neutral-500 mt-2">
                    Zuzu Jenni prüft dein Konzept persönlich im Atelier Richterswil und meldet sich mit einem Angebot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
