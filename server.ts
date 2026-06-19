import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize AI and Email clients lazy-loaded to prevent startup crashes if keys missing
let ai: GoogleGenAI | null = null;
let resend: Resend | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
    ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return ai;
}

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is missing");
    resend = new Resend(apiKey);
  }
  return resend;
}

// API Routes
app.post("/api/ai/analyze-lead", async (req, res) => {
  try {
    const { lead, agency } = req.body;
    const model = getAI().models.get({ model: "gemini-3.5-flash" });
    
    const prompt = `
      You are a high-performance sales strategist. Analyze the following lead for an agency.
      
      AGENCY PROFILE:
      Name: ${agency.name}
      Services: ${agency.services}
      Target Industry: ${agency.targetIndustry}
      Ideal Customer: ${agency.idealCustomer}
      Tone: ${agency.tone}
      
      LEAD DATA:
      Name: ${lead.name}
      Company: ${lead.company}
      Website: ${lead.website}
      Industry: ${lead.industry}
      
      TASK:
      1. Score the lead (0-100) based on fit for the agency.
      2. Categorize as HOT, WARM, or COLD.
      3. Identify 3 specific business pain points this company likely faces.
      4. Suggest a specific "Service Angle" or solution the agency should pitch.
      5. Provide concise reasoning.
      
      RESPONSE FORMAT (JSON only):
      {
        "score": number,
        "category": "HOT" | "WARM" | "COLD",
        "reasoning": "string",
        "serviceAngle": "string",
        "painPoints": ["string", "string", "string"]
      }
    `;

    const result = await getAI().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/generate-pitch", async (req, res) => {
  try {
    const { lead, agency, painPoints, serviceAngle } = req.body;
    const prompt = `
      You are an expert sales copywriter. Write a personalized outreach email.
      
      AGENCY: ${agency.name} (${agency.services})
      LEAD: ${lead.name} from ${lead.company}
      PAIN POINTS: ${painPoints.join(", ")}
      OFFER: ${serviceAngle}
      TONE: ${agency.tone}
      
      REQUIREMENTS:
      - Short, punchy subject line.
      - Start with a low-friction observation about their company.
      - Bridge to a pain point.
      - Offer a clear value proposition based on the service angle.
      - End with a low-friction call to action (e.g., "Worth a 2-min chat?").
      - Use the agency's requested tone.
      
      RESPONSE FORMAT (JSON only):
      {
        "subject": "string",
        "content": "string"
      }
    `;

    const result = await getAI().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/analyze-reply", async (req, res) => {
  try {
    const { reply, lead, agency } = req.body;
    const prompt = `
      You are an expert sales assistant. Analyze this reply from a prospect.
      
      PROSPECT: ${lead.name} from ${lead.company}
      AGENCY: ${agency.name}
      REPLY: "${reply}"
      
      TASK:
      Extract the following information:
      1. Key requirements or questions mentioned.
      2. Budget hints or constraints (if any).
      3. Timeline hints (if any).
      4. Objections raised.
      5. Suggested next action for the agency.
      
      RESPONSE FORMAT (JSON only):
      {
        "requirements": ["string"],
        "budget": "string",
        "timeline": "string",
        "objections": ["string"],
        "nextAction": "string"
      }
    `;

    const result = await getAI().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/email/send", async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    const data = await getResend().emails.send({
      from: "LeadFlow AI <onboarding@resend.dev>", // Default Resend test domain
      to: [to],
      subject: subject,
      html: html,
    });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
