import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please ensure it is set in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: Prakriti analysis
  app.post("/api/prakriti/analyze", async (req, res) => {
    const { scores, lang, profile } = req.body;
    if (!scores) {
      return res.status(400).json({ error: "Ayurvedic scores are required for analysis." });
    }

    try {
      const ai = getGenAI();
      const profileStr = profile 
        ? `Patient Demographics: Name=${profile.name || "User"}, Age=${profile.age || "Unknown"}, Height=${profile.height || "Unknown"} cm, Gender=${profile.gender || "Unknown"}.`
        : "";

      const prompt = `Ayurvedic Prakriti scores: Vata=${scores.vata || 0}, Pitta=${scores.pitta || 0}, Kapha=${scores.kapha || 0}. Language=${lang || 'en'}.
${profileStr}
Based on these physical, physiological, and behavioral parameters, conduct a pristine, holistic clinical analysis of this person's Ayurvedic constitution (Prakriti).
Tailor all guidelines, especially exercises, yoga, and risk scores, specifically to their demographic profile (Age: ${profile?.age || 'N/A'}, Gender: ${profile?.gender || 'N/A'}, Height: ${profile?.height || 'N/A'}cm) and constitutional balance.

Provide:
1. The dominant dosha(s) (e.g. Vata, Pitta, Kapha, Vata-Pitta, Pitta-Kapha, etc.)
2. A beautiful, cohesive, user-friendly 2-3 sentence overview (summary).
3. A detailed insightful explanation reflecting their physiological and psycho-emotional qualities.
4. A list of distinguished key traits or strengths.
5. Specific tendencies or symptoms to look out for when out of balance (risks).
6. Actionable daily wellness routine recommendations.
7. Foods to avoid (specific foods that aggravate their dominant dosha).
8. Essential precautions and lifestyle rules to maintain balance.
9. Practical wellness suggestions and daily tips.
10. Quick exercises and specific yoga asanas/poses suited for their age, gender, and constitution.
11. Causes & reasons behind their doshic imbalances, constitutional triggers, or current state.
12. A calculated constitutional health risk percentage (0 to 100) representing their susceptibility to developing health imbalances, as a whole number.

Please translate all output text fields and array strings elegantly into the requested language: ${lang === 'mr' ? 'Marathi' : 'English'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dosha: { type: Type.STRING, description: "The constitutional diagnosis. Example: Vata-Pitta, Kapha, etc." },
              summary: { type: Type.STRING, description: "An elegant, cohesive, user-friendly 2-3 sentence overview." },
              detailed_explanation: { type: Type.STRING, description: "Deep clinical and psycho-physiological insights." },
              traits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Distinguished traits or strengths of this constitution." },
              risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific tendencies or conditions they are prone to when out of balance." },
              advice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable dietary, lifestyle, or routine advice." },
              foods_to_avoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific foods to avoid to prevent aggravating this constitution." },
              precautions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clinical lifestyle precautions and habits to avoid." },
              suggestions_tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "General daily wellness recommendations and tips." },
              exercises_yoga: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended quick physical exercises and specific yoga poses/asanas." },
              causes_reasons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Root causes and metabolic/environmental reasons for imbalances in this dosha." },
              risk_percentage: { type: Type.INTEGER, description: "Constitutional imbalance/health risk percentage (integer from 0 to 100) based on age, gender, and doshas." }
            },
            required: [
              "dosha", "summary", "detailed_explanation", "traits", "risks", "advice", 
              "foods_to_avoid", "precautions", "suggestions_tips", "exercises_yoga", 
              "causes_reasons", "risk_percentage"
            ]
          },
          temperature: 0.2
        }
      });

      if (!response.text) {
        throw new Error("Unable to elicit an Ayurvedic profile layout from internal networks.");
      }

      const parsedData = JSON.parse(response.text.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Analyze error:", error);
      res.status(500).json({ error: error.message || "Failed to process Ayurvedic clinical diagnostics." });
    }
  });

  // API Route: Prakriti text-to-speech audio generation
  app.post("/api/prakriti/tts", async (req, res) => {
    const { text, lang } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text compilation is required for vocalization." });
    }

    try {
      const ai = getGenAI();
      const voiceName = lang === 'mr' ? 'Kore' : 'Zephyr';

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("Voice synthesis returns empty binary space.");
      }

      res.json({ audio: base64Audio });
    } catch (error: any) {
      console.error("TTS generation error:", error);
      res.status(500).json({ error: error.message || "Voice synthesis pipeline fault." });
    }
  });

  // Serve static UI assets or connect Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prakriti live server started on port ${PORT}`);
  });
}

startServer();
