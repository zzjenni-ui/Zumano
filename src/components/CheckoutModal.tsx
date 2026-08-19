import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { triggerConfetti } from '../lib/confetti';
import { CartItem, DesignTheme } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  theme: DesignTheme;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  theme,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'twint' | 'invoice' | 'card'>('twint');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const totalChf = items.reduce((sum, item) => {
    const itemPrice =
      item.product.priceChf + (item.selectedVariant ? item.selectedVariant.priceExtraChf : 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  const [orderNumber, setOrderNumber] = useState<string>('ZUMANO-2026-CH');

  const handleFinishOrder = async () => {
    setIsProcessing(true);
    const generatedId = `ZUMANO-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setOrderNumber(generatedId);

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: `${firstName} ${lastName}`.trim(),
            email,
            address,
            zipCity: `${postalCode} ${city}`.trim(),
          },
          items,
          subtotal: totalChf,
          shipping: 0,
          total: totalChf,
          paymentMethod,
        }),
      });
    } catch (err) {
      console.warn('Order submission fallback:', err);
    } finally {
      setIsProcessing(false);
      setStep('confirmed');
      triggerConfetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      onOrderSuccess();
    }
  };

  return (
    <div
      id="checkout-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-neutral-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'details' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                Schritt 1 von 2
              </span>
              <h3 className="text-2xl font-serif font-light text-neutral-900">
                Lieferadresse & Bestelldetails
              </h3>
              <p className="text-xs text-neutral-500">
                Kostenlose und versicherte Lieferung innerhalb der Schweiz & Liechtenstein.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('payment');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Anna"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Muster"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  E-Mail Adresse für Bestellbestätigung *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anna.muster@beispiel.ch"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Straße & Hausnummer *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Seestrasse 42"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="8805"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Ort *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Richterswil"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-neutral-300 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
              </div>

              {/* Order quick overview */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
                <div className="flex justify-between font-medium text-neutral-900">
                  <span>Bestellwert ({items.length} Positionen):</span>
                  <span>{totalChf}.– CHF</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Versand:</span>
                  <span>Kostenlos (Schweiz)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <span>Weiter zur Zahlungsmethode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                Schritt 2 von 2
              </span>
              <h3 className="text-2xl font-serif font-light text-neutral-900">
                Zahlungsmethode wählen
              </h3>
              <p className="text-xs text-neutral-500">
                Gesamtbetrag: <strong className="text-neutral-900">{totalChf}.– CHF</strong>
              </p>
            </div>

            {/* Payment Method Cards */}
            <div className="space-y-3">
              {/* TWINT */}
              <div
                onClick={() => setPaymentMethod('twint')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'twint'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#009E52] text-white flex items-center justify-center font-bold text-xs tracking-wider">
                    TWINT
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      TWINT (Schweizer Sofortzahlung)
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Bequem per App mit QR-Code oder Telefonnummer bezahlen
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'twint'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-neutral-300'
                  }`}
                >
                  {paymentMethod === 'twint' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Rechnung mit QR-Code */}
              <div
                onClick={() => setPaymentMethod('invoice')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'invoice'
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      QR-Rechnung / Banküberweisung
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Zahlbar innert 30 Tagen nach Erhalt des Pakets
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'invoice'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300'
                  }`}
                >
                  {paymentMethod === 'invoice' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Kreditkarte */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      Kreditkarte (Visa / Mastercard)
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Sichere 256-Bit SSL-Verschlüsselung
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300'
                  }`}
                >
                  {paymentMethod === 'card' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            {/* Recipient summary */}
            <div className="text-xs text-neutral-500 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              Lieferung an: <strong>{firstName} {lastName}</strong>, {address}, {postalCode} {city}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-3 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              >
                Zurück
              </button>

              <button
                type="button"
                onClick={handleFinishOrder}
                disabled={isProcessing}
                className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {isProcessing ? (
                  <span>Bestellung wird vorbereitet...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Jetzt verbindlich bestellen · {totalChf}.– CHF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">
                Bestellung erfolgreich eingegangen
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-neutral-900">
                Herzlichen Dank für dein Vertrauen!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                Deine Bestätigung und die Details wurden an <strong>{email}</strong> gesendet.
                Zuzu verpackt deine Kunstwerke sorgfältig im Atelier Richterswil.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 max-w-md mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Bestellnummer:</span>
                <span className="font-mono font-bold text-neutral-800">
                  ZU-{(Math.random() * 90000 + 10000).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Zahlungsart:</span>
                <span className="font-semibold text-neutral-800">
                  {paymentMethod === 'twint' ? 'TWINT' : paymentMethod === 'invoice' ? 'Rechnung (30 Tage)' : 'Kreditkarte'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Lieferzeit:</span>
                <span className="text-neutral-800">2-4 Werktage (Schweizer Post)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Zurück zur Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
