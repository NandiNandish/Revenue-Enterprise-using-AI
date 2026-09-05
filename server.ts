import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI: Diagnose Discrepancy Root Cause & Prescribe Bounded Recovery Action
app.post("/api/ai/diagnose-discrepancy", async (req, res) => {
  try {
    const { item } = req.body;
    const ai = getAi();

    if (!ai) {
      // High-quality deterministic fallback if no API key
      return res.json({
        rootCause: "ERP Master Catalog Rate desynchronization against Contract Amendment Annex B.",
        recoveryAction: "Issue credit note delta of $1,420, recalibrate NetSuite billing schedule, trigger mandate re-auth.",
        confidenceScore: 94,
        stoppingRule: "Do not exceed 10% goodwill discount. Escalate to VP Finance if no client confirmation within 5 business days.",
        retryRecommendation: "Execute bank transfer ACH pull on Tuesday morning at 09:15 EST post-clearing cycle.",
      });
    }

    const prompt = `You are an elite Enterprise AI Revenue Recovery Agent working with ERP systems (SAP, NetSuite, Dynamics 365, Stripe Billing).
Analyze this billing discrepancy & revenue at risk case:
${JSON.stringify(item, null, 2)}

Provide a structured response formatted as JSON with the following fields:
- rootCause: Detailed technical diagnosis of why revenue leaked or payment failed (e.g. ERP price book drift, tax code mismatch, expired SEPA/ACH mandate, PO milestone desync, payment gateway degradation).
- recoveryAction: Concrete, bounded intervention step to recover the money immediately.
- confidenceScore: Integer between 70 and 99 reflecting likelihood of successful collection.
- stoppingRule: Strict compliance guardrail or bounding condition (e.g. max fee waiver, max retry attempts, legal escalation threshold).
- retryRecommendation: Recommended retry time, channel, or settlement method.

Return ONLY raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    console.error("AI diagnosis error:", error);
    res.status(500).json({
      error: "Failed to generate AI diagnosis",
      details: error?.message || "Unknown error",
    });
  }
});

// AI: Generate Bounded Multi-Channel Follow-Up Communication
app.post("/api/ai/generate-followup", async (req, res) => {
  try {
    const { item, channel, tone, language } = req.body;
    const ai = getAi();

    if (!ai) {
      return res.json({
        subject: `ACTION REQUIRED: Payment Reconciliation Notice - Invoice #${item?.invoiceId || "INV-8924"}`,
        message: `Dear ${item?.contactName || "Finance Controller"},\n\nOur automated ERP reconciliation between ${item?.erpSource || "SAP"} and payment gateway identified an unresolved balance of $${(item?.amountAtRisk || 12450).toLocaleString()} regarding Invoice #${item?.invoiceId || "INV-8924"} (${item?.clientName || "Enterprise Client"}).\n\nTo ensure uninterrupted service and avoid credit holds, please review the breakdown and execute the single-click reconciliation portal link below.\n\nStopping Rule & Terms: Valid through 5 business days. Maximum waiver of accrued late penalties is pre-authorized.\n\nPortal: https://recovery.finops.internal/pay/${item?.id || "REC-101"}`,
        recommendedChannel: channel || "Email + Automated Portal Link",
        stoppingRuleEnforced: "Max discount 5%, 3 retry attempts maximum before credit freeze.",
      });
    }

    const prompt = `You are an automated enterprise revenue recovery communication agent.
Generate a professional, compliant follow-up intervention for:
Client: ${item.clientName}
Invoice: ${item.invoiceId}
Amount at risk: $${item.amountAtRisk}
Discrepancy Category: ${item.category}
Channel: ${channel || "Email"}
Tone: ${tone || "Professional yet firm"}
Language: ${language || "English"} (if Hinglish is requested, mix business English with natural, respectful Hindi conversational connectors commonly used in Indian enterprise tech finance)

Requirements:
- Clearly state the discrepancy / overdue receivable.
- Specify precise bounded options (e.g. immediate ACH link, promise-to-pay instalment schedule, or dispute upload).
- State the compliant stopping rule (e.g. 7-day cure window before ERP credit hold).
- Provide a ready-to-dispatch subject and body.

Return JSON with:
- subject: string
- message: string
- recommendedChannel: string
- stoppingRuleEnforced: string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    console.error("AI followup error:", error);
    res.status(500).json({
      error: "Failed to generate follow-up",
      details: error?.message || "Unknown error",
    });
  }
});

// AI: Generate Automated Monthly Finance & Audit Report
app.post("/api/ai/generate-monthly-report", async (req, res) => {
  try {
    const { month, metrics, batchStats } = req.body;
    const ai = getAi();

    if (!ai) {
      return res.json({
        executiveSummary: `During ${month || "Current Period"}, the AI Revenue Recovery agent processed $3.84M in revenue at risk across ERP connectors (SAP, NetSuite, Stripe). Through automated discrepancy detection, intelligent retry sequencing, and bounded promise-to-pay workflows, $3.12M (81.3%) was successfully recovered with zero regulatory violations.`,
        keyHighlights: [
          "Payment gateway degradation in EMEA recovered $740,000 via mandate re-routing.",
          "NetSuite contract amendment rate drift resolved across 14 enterprise accounts ($512,000).",
          "Automated promise-to-pay tracker achieved 92.4% compliance rate on deferred terms.",
          "Tamper-evident audit trail recorded 1,280 automated actions with SOX-compliant verification.",
        ],
        leakageMitigation: "Reduced DSO (Days Sales Outstanding) by 8.4 days; avoided $42,000 in card scheme retry penalties via dynamic issuer cadence.",
        recommendations: [
          "Calibrate ERP sync frequency from hourly to real-time webhook for tier-1 strategic clients.",
          "Tighten tolerance thresholds on PO expiration alerts from 14 days to 30 days prior to renewal.",
          "Expand multi-channel Hinglish & regionalized SMS notifications for APAC enterprise accounts.",
        ],
      });
    }

    const prompt = `You are the Lead Financial Controller & Audit Director AI.
Synthesize an official Monthly Revenue Recovery & Discrepancy Audit Report for the CFO and Board of Directors.
Month: ${month || "September 2026"}
Metrics: ${JSON.stringify(metrics, null, 2)}
Batch Performance: ${JSON.stringify(batchStats, null, 2)}

Provide a structured JSON output with:
- executiveSummary: Formal paragraph summarizing total recovered, recovery efficiency, and financial impact.
- keyHighlights: Array of 4 crisp, high-impact bullet points with exact dollar values and operational breakthroughs.
- leakageMitigation: Paragraph detailing root cause elimination, DSO reduction, and penalty prevention.
- recommendations: Array of 3 actionable financial operations & ERP integration recommendations.

Return ONLY raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    console.error("AI report error:", error);
    res.status(500).json({
      error: "Failed to generate monthly report",
      details: error?.message || "Unknown error",
    });
  }
});

// Vite middleware or static serving
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
    console.log(`AI Revenue Recovery Server running on port ${PORT}`);
  });
}

startServer();
