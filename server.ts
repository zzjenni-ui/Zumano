import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      atelier: "zumano.ch | Atelier Zäzilia Jenni",
      geminiAvailable: !!process.env.GEMINI_API_KEY,
      phpReady: true,
    });
  });

  // Contact form submission endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message, commissionDetails } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Pflichtfelder fehlen (Name, E-Mail, Nachricht)" });
    }
    console.log(`[Contact Form Received] From: ${name} (${email}), Subject: ${subject}`);
    res.json({
      success: true,
      message: "Vielen Dank für deine Nachricht an Zuzu! Ich melde mich schnellstmöglich bei dir.",
      timestamp: new Date().toISOString(),
    });
  });

  // Shop order checkout endpoint
  app.post("/api/order", (req, res) => {
    const { customer, items, total, paymentMethod } = req.body;
    if (!customer || !items || !items.length) {
      return res.status(400).json({ error: "Ungültige Bestelldaten" });
    }
    const orderId = `ZUMANO-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    console.log(`[Order Placed] ID: ${orderId}, Customer: ${customer.name}, Total: ${total} CHF (${paymentMethod})`);
    res.json({
      success: true,
      orderId,
      orderDate: new Date().toLocaleDateString("de-CH"),
      total,
      currency: "CHF",
      message: "Deine Bestellung wurde erfolgreich entgegengenommen!",
    });
  });

  // Testimonials endpoint
  app.post("/api/testimonials", (req, res) => {
    const { author, comment, rating, projectType, location } = req.body;
    if (!author || !comment) {
      return res.status(400).json({ error: "Name und Erfahrungsbericht erforderlich" });
    }
    const newTestimonial = {
      id: `testi-node-${Date.now()}`,
      author,
      location: location || "Schweiz",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: rating || 5,
      date: "Heute",
      projectType: projectType || "Atelier-Auftrag",
      comment: `«${comment}»`,
      verifiedBuyer: true,
      artworkPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    };
    res.json({ success: true, testimonial: newTestimonial });
  });

  // Generate customized artwork idea / concept / mockup spec
  app.post("/api/generate-art-idea", async (req, res) => {
    try {
      const {
        theme,
        medium,
        colorMood,
        occasion,
        customText,
        roomSetting,
        format,
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback realistic creative response if key is absent
        return res.json({
          success: true,
          idea: {
            title: customText ? `«${customText}» – Sanfte Horizonte` : "Nordische Nebelwälder & Bergruhe",
            subTitle: "Aquarell & Hand-Lettering Unikat",
            description: `Ein harmonisches, nordisch inspiriertes Kunstwerk mit sanften Verläufen in ${colorMood || "Erd- und Nebeltönen"}. Gemalt mit feinsten Pigmenten auf 300g/m² Büttenpapier.`,
            technique: medium || "Aquarell & Gouache mit feiner Tusche",
            colorPalette: [
              { name: "Salbeigrün", hex: "#7E8E7E" },
              { name: "Nordic Sand", hex: "#D4C7B5" },
              { name: "Kaltes Nebelgrau", hex: "#9BA2A6" },
              { name: "Warme Ockererde", hex: "#C49A6C" },
              { name: "Tiefes Schieferblau", hex: "#3A4651" },
            ],
            letteringSuggestion: customText || "Zuhause ist dort, wo das Herz zur Ruhe kommt",
            fontStyleAdvice: "Fließende moderne Brush-Kalligraphie kombiniert mit minimalistischer serifenloser Antiqua.",
            framingRecommendation: "Schlichter Eichenholzrahmen mit 5cm säurefreiem Schrägschnitt-Passepartout.",
            canvasVisual: {
              backgroundGradient: "linear-gradient(135deg, #E6ECE8 0%, #D8DEC9 50%, #C3B49E 100%)",
              brushMotif: "Botanische Zweige, sanfte Bergkonturen und fließende Wasserfarben-Schichten",
              accentColor: "#7E8E7E",
            },
            estimatedCreationTime: "3-5 Werktage im Atelier Richterswil",
            recommendedPriceChf: "185.– bis 290.– CHF (je nach Format)",
          },
        });
      }

      const prompt = `Du bist die Schweizer Künstlerin Zäzilia 'Zuzu' Jenni vom Kunst-Atelier zumano.ch in Richterswil am Zürichsee.
Du kreierst individuelle Kunstwerke: Aquarelle, Hand-Lettering, Schilder & Tafeln im eleganten nordisch-minimalistischen Stil (natürliche Erdtöne, Salbei, Nebelgrau, Sand, Holz, skandinavische Schlichtheit).

Erstelle ein maßgeschneidertes, inspirierendes Kunstwerk-Konzept für folgende Kundenwünsche:
- Thema / Motiv: ${theme || "Nordische Natur & Ruhe"}
- Medium / Technik: ${medium || "Aquarell auf 300g Büttenpapier"}
- Farbstimmung: ${colorMood || "Nordisch sanft (Salbei, Sand, Nebelblau)"}
- Anlass: ${occasion || "Persönliches Wohnzimmer / Geschenk"}
- Wunschtext / Widmung / Name: ${customText || "Individuelle Kalligraphie"}
- Raumtyp: ${roomSetting || "Modernes Wohnzimmer"}
- Format: ${format || "A3 (30x40cm)"}

Antworte im JSON Format mit:
- title: Poetischer, ansprechender Werktitel
- subTitle: Kurze Stilbezeichnung
- description: Einfühlsame, sympathische Beschreibung des Bildaufbaus und der Wirkung (2-3 Sätze auf Deutsch/Schweizer Ton)
- technique: Genaue Atelier-Technik
- colorPalette: Array von 5 Farben { name: string, hex: string }
- letteringSuggestion: Passender Spruch oder Formulierung des Wunschtexts
- fontStyleAdvice: Kalligraphie-Stilhinweis
- framingRecommendation: Empfehlung für Rahmen/Präsentation (z.B. Eiche, Passepartout, Schweberahmen)
- canvasVisual: { backgroundGradient: string (CSS gradient e.g. "linear-gradient(135deg, #... 0%, #... 100%)"), brushMotif: string, accentColor: string (hex) }
- estimatedCreationTime: z.B. "3-5 Tage"
- recommendedPriceChf: Preisrahmen in CHF`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subTitle: { type: Type.STRING },
              description: { type: Type.STRING },
              technique: { type: Type.STRING },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                  },
                  required: ["name", "hex"],
                },
              },
              letteringSuggestion: { type: Type.STRING },
              fontStyleAdvice: { type: Type.STRING },
              framingRecommendation: { type: Type.STRING },
              canvasVisual: {
                type: Type.OBJECT,
                properties: {
                  backgroundGradient: { type: Type.STRING },
                  brushMotif: { type: Type.STRING },
                  accentColor: { type: Type.STRING },
                },
                required: ["backgroundGradient", "brushMotif", "accentColor"],
              },
              estimatedCreationTime: { type: Type.STRING },
              recommendedPriceChf: { type: Type.STRING },
            },
            required: [
              "title",
              "subTitle",
              "description",
              "technique",
              "colorPalette",
              "letteringSuggestion",
              "fontStyleAdvice",
              "framingRecommendation",
              "canvasVisual",
              "estimatedCreationTime",
              "recommendedPriceChf",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, idea: parsed });
    } catch (err: any) {
      console.error("Error in /api/generate-art-idea:", err);
      res.status(500).json({ error: err.message || "Failed to generate art idea" });
    }
  });

  // Customize existing artwork with user feedback
  app.post("/api/customize-artwork", async (req, res) => {
    try {
      const { currentIdea, modificationRequest } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: true,
          updatedIdea: {
            ...currentIdea,
            title: `${currentIdea.title || "Individuelle Kreation"} (Angepasst)`,
            description: `${currentIdea.description} [Anpassung: ${modificationRequest}]`,
          },
        });
      }

      const prompt = `Passe das bestehende Kunstwerk-Konzept von Zäzilia Jenni (zumano.ch) basierend auf dem Kundenwunsch an.
Bestehendes Konzept: ${JSON.stringify(currentIdea)}
Kundenwunsch für die Anpassung: "${modificationRequest}"

Behalte die nordische Eleganz und hohe künstlerische Qualität bei. Antworte mit dem aktualisierten JSON-Objekt im gleichen Schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subTitle: { type: Type.STRING },
              description: { type: Type.STRING },
              technique: { type: Type.STRING },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                  },
                  required: ["name", "hex"],
                },
              },
              letteringSuggestion: { type: Type.STRING },
              fontStyleAdvice: { type: Type.STRING },
              framingRecommendation: { type: Type.STRING },
              canvasVisual: {
                type: Type.OBJECT,
                properties: {
                  backgroundGradient: { type: Type.STRING },
                  brushMotif: { type: Type.STRING },
                  accentColor: { type: Type.STRING },
                },
                required: ["backgroundGradient", "brushMotif", "accentColor"],
              },
              estimatedCreationTime: { type: Type.STRING },
              recommendedPriceChf: { type: Type.STRING },
            },
            required: [
              "title",
              "subTitle",
              "description",
              "technique",
              "colorPalette",
              "letteringSuggestion",
              "fontStyleAdvice",
              "framingRecommendation",
              "canvasVisual",
              "estimatedCreationTime",
              "recommendedPriceChf",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, updatedIdea: parsed });
    } catch (err: any) {
      console.error("Error in /api/customize-artwork:", err);
      res.status(500).json({ error: err.message || "Failed to customize artwork" });
    }
  });

  // Lettering quote / calligraphy ideas generator
  app.post("/api/lettering-generator", async (req, res) => {
    try {
      const { category, recipient, language } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          quotes: [
            {
              text: "Zuhause ist kein Ort, sondern ein Gefühl.",
              author: "Nordische Weisheit",
              styleVibe: "Sanfte Brush-Kalligraphie mit feinen Serifen-Details",
            },
            {
              text: "Das Leben ist die Kunst, das Schöne im Kleinen zu finden.",
              author: "Atelier Zuzu",
              styleVibe: "Organisches Hand-Lettering mit Eukalyptus-Aquarellzweigen",
            },
            {
              text: "Wo Liebe wächst, blüht das Leben.",
              author: "Traditionell",
              styleVibe: "Moderne Faux-Kalligraphie auf dunkler Holzoptik",
            },
          ],
        });
      }

      const prompt = `Erstelle 4 wunderschöne, berührende Zitate und Sprüche für Hand-Lettering und Aquarellkarten im Atelier zumano.ch.
Kategorie: ${category || "Wohnen & Gemütlichkeit"}
Empfänger: ${recipient || "Familie / Freunde"}
Sprache: ${language || "Deutsch"}

Gib ein JSON Array zurück mit { text: string, author: string, styleVibe: string }.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                author: { type: Type.STRING },
                styleVibe: { type: Type.STRING },
              },
              required: ["text", "author", "styleVibe"],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      return res.json({ quotes: parsed });
    } catch (err: any) {
      console.error("Error in /api/lettering-generator:", err);
      res.status(500).json({ error: err.message || "Failed to generate quotes" });
    }
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`zumano.ch backend running on port ${PORT}`);
  });
}

startServer();
