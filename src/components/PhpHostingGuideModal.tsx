import React, { useState } from 'react';
import {
  X,
  Server,
  FileCode,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Download,
  FolderTree,
  Terminal,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';
import { DesignTheme } from '../types';

interface PhpHostingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: DesignTheme;
}

export const PhpHostingGuideModal: React.FC<PhpHostingGuideModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'config' | 'deploy'>(
    'overview'
  );

  if (!isOpen) return null;

  return (
    <div
      id="modal-php-guide"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.borderSubtle,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
            }}
          >
            <Server className="w-3.5 h-3.5" />
            <span>PHP 8.x & Apache/Nginx Kompatibel</span>
          </div>

          <h3
            className="text-2xl sm:text-3xl font-serif font-light tracking-tight"
            style={{ color: theme.textPrimary }}
          >
            PHP-Architektur & Schweizer Webhosting Leitfaden
          </h3>

          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Diese Webseite ist vollständig für traditionelles PHP-Webhosting (Hostpoint,
            Infomaniak, Cyon, Hoststar, Hetzner, etc.) vorbereitet inklusive Mailversand,
            Warenkorb-Bestellungen und Datei-Uploads.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b pb-2 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            1. Enthaltene PHP-Module
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'structure'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            2. Dateistruktur & .htaccess
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            3. E-Mail & Konfiguration
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'deploy'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            4. In 3 Schritten hochladen
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border bg-neutral-50/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>public/php/contact.php</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Verarbeitet Kontaktanfragen, generiert ansprechende HTML-Mails an Zuzu (zzjenni@gmail.com)
                  und sendet automatische Bestätigungen an Kunden.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-neutral-50/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <FileCode className="w-4 h-4 text-amber-600" />
                  <span>public/php/order.php</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Shop-Bestellabwicklung für TWINT, QR-Rechnung & Barzahlung. Generiert
                  Bestellnummern (ZUMANO-2026-XXXX) und archiviert in orders.json.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-neutral-50/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>public/php/testimonials.php</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Ermöglicht Besuchern, Kundenmeinungen direkt einzureichen. Speichert Bewertungen
                  persistent in einer JSON-Datei ohne Notwendigkeit einer MySQL-Datenbank.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-neutral-50/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <Server className="w-4 h-4 text-purple-600" />
                  <span>public/php/upload.php</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Upload-Handler für Werkstatt-Kurzfilme (MP4, MOV) und Kunstwerk-Fotos (JPG, PNG, WebP)
                  mit Sicherheitschecks und Dateigrößenbegrenzung.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Keine Datenbank erforderlich:</strong> Alle Bestellungen und Kundenstimmen
                funktionieren direkt dateibasiert auf jedem Schweizer Standard-Webspace (PHP 7.4, 8.0, 8.1, 8.2, 8.3).
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Structure */}
        {activeTab === 'structure' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto space-y-1">
              <div className="text-amber-400 font-bold mb-2"># Webspace Root-Verzeichnis (z.B. public_html / httpdocs / www)</div>
              <div>├── .htaccess                 <span className="text-neutral-500"># Apache Rewrite & Routing zu PHP</span></div>
              <div>├── index.php                 <span className="text-neutral-500"># PHP-Startpunkt & Social Meta-Tags</span></div>
              <div>├── index.html                <span className="text-neutral-500"># Kompilierte React Single-Page-App</span></div>
              <div>├── assets/                   <span className="text-neutral-500"># JavaScript & CSS Bundles</span></div>
              <div>├── php/                      <span className="text-neutral-500"># Serverseitige PHP Skripte</span></div>
              <div>│   ├── config.php            <span className="text-neutral-500"># Atelier E-Mail, Telefon, Keys</span></div>
              <div>│   ├── contact.php           <span className="text-neutral-500"># Kontakt-Mail Handler</span></div>
              <div>│   ├── order.php             <span className="text-neutral-500"># Bestelleingang & TWINT</span></div>
              <div>│   ├── testimonials.php      <span className="text-neutral-500"># Kundenbewertungen</span></div>
              <div>│   ├── customizer.php        <span className="text-neutral-500"># KI Bildideen Generator</span></div>
              <div>│   └── upload.php            <span className="text-neutral-500"># Video- & Foto-Upload</span></div>
              <div>├── data/                     <span className="text-neutral-500"># Automatisch erstellte JSON Daten</span></div>
              <div>└── uploads/                  <span className="text-neutral-500"># Hochgeladene Videos & Fotos</span></div>
            </div>
          </div>
        )}

        {/* Tab 3: Config */}
        {activeTab === 'config' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <p className="text-neutral-600">
              In der Datei <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-neutral-800">public/php/config.php</code> sind alle Kontaktdaten zentral hinterlegt:
            </p>

            <div className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto space-y-1">
              <span className="text-neutral-500">// public/php/config.php</span>
              <br />
              <span className="text-emerald-400">define</span>(<span className="text-amber-300">'ATELIER_EMAIL'</span>, <span className="text-amber-300">'zzjenni@gmail.com'</span>);
              <br />
              <span className="text-emerald-400">define</span>(<span className="text-amber-300">'ATELIER_NAME'</span>, <span className="text-amber-300">'Atelier ZUMANO · Zäzilia Jenni'</span>);
              <br />
              <span className="text-emerald-400">define</span>(<span className="text-amber-300">'ATELIER_PHONE'</span>, <span className="text-amber-300">'078 818 06 36'</span>);
              <br />
              <span className="text-emerald-400">define</span>(<span className="text-amber-300">'ATELIER_ADDRESS'</span>, <span className="text-amber-300">'8805 Richterswil am Zürichsee, Schweiz'</span>);
            </div>
          </div>
        )}

        {/* Tab 4: Deploy */}
        {activeTab === 'deploy' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <ol className="list-decimal list-inside space-y-3 text-neutral-700">
              <li className="p-3 rounded-xl border bg-neutral-50">
                <strong>1. Projekt exportieren / ZIP herunterladen:</strong>
                <p className="text-xs text-neutral-500 mt-1">
                  Über das Drei-Punkte-Menü oben rechts oder mit dem Befehl <code>npm run build</code> das Projekt zusammenstellen.
                </p>
              </li>

              <li className="p-3 rounded-xl border bg-neutral-50">
                <strong>2. Auf Hostpoint / Infomaniak / Cyon Webspace hochladen:</strong>
                <p className="text-xs text-neutral-500 mt-1">
                  Den Inhalt des <code>dist/</code> Ordners zusammen mit dem <code>php/</code> Ordner und der <code>.htaccess</code> Datei per FTP (z.B. FileZilla oder Web-FTP) in den Ordner <code>public_html</code> oder <code>www</code> deines Webhostings kopieren.
                </p>
              </li>

              <li className="p-3 rounded-xl border bg-neutral-50">
                <strong>3. Fertig!</strong>
                <p className="text-xs text-neutral-500 mt-1">
                  Die Website läuft sofort unter deiner Domain (z.B. <strong>zumano.ch</strong>). Formulare, TWINT-Bestellungen und E-Mail-Benachrichtigungen funktionieren automatisch ohne weitere Installation.
                </p>
              </li>
            </ol>
          </div>
        )}

        {/* Footer info & close */}
        <div
          className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center gap-1.5 text-neutral-500">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Alle PHP-Dateien liegen einsatzbereit im Ordner <code>/public/php/</code></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-white font-medium cursor-pointer shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Verstanden & Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
