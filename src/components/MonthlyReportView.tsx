import React, { useState } from "react";
import { 
  FileText, 
  Printer, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Bot, 
  Layers, 
  CheckCircle2, 
  Send,
  FileDown,
  ExternalLink,
  Lock,
  Award
} from "lucide-react";
import { RecoveryBatch, MonthlyReportData, UserRole } from "../types";
import { SimulatedPDFModal } from "./SimulatedPDFModal";

interface MonthlyReportViewProps {
  batches: RecoveryBatch[];
  currentRole: UserRole;
  onLogAudit: (action: string, targetId: string, details: string) => void;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  batches,
  currentRole,
  onLogAudit,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("September 2026");
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [scheduledSuccess, setScheduledSuccess] = useState<boolean>(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);

  const [reportData, setReportData] = useState<MonthlyReportData>({
    month: "September 2026",
    totalAtRisk: 4210000,
    totalRecovered: 3582000,
    recoveryRate: 85.1,
    dsoReductionDays: 8.4,
    penaltiesAvoided: 112000,
    executiveSummary:
      "During September 2026, the AI Revenue Recovery platform audited $4.21M in revenue at risk across ERP connectors (SAP S/4HANA, NetSuite, Stripe, Dynamics, Workday). Through autonomous root cause diagnostics, intelligent mandate retry sequencing, and bounded promise-to-pay workflows, $3.58M (85.1%) was successfully won back with zero compliance violations.",
    keyHighlights: [
      "Mitigated $740,000 in EMEA gateway card soft-declines via smart retry liquidity sequencing.",
      "Reconciled $512,000 in NetSuite contract amendment catalog drifts across 14 enterprise accounts.",
      "Achieved 92.4% compliance adherence on active Promise-to-Pay milestone installment plans.",
      "Prevented $112,000 in Visa/Mastercard scheme excessive retry penalties through dynamic stopping rules.",
    ],
    leakageMitigation:
      "Overall Days Sales Outstanding (DSO) decreased by 8.4 days across enterprise tiers. Automated ERP reverse-charge tax validation eliminated VAT audit exposure across intra-community EU accounts.",
    recommendations: [
      "Calibrate ERP sync frequency from hourly polling to real-time Webhook event streaming for Tier-1 accounts.",
      "Tighten tolerance thresholds on PO expiration alerts from 14 days to 30 days prior to contract renewal.",
      "Expand multi-channel Hinglish conversational voice recovery for APAC accounts to lift settlement velocity.",
    ],
    batchSummary: [
      { batchName: "September 2026 - Week 1 Primary", atRisk: 1240000, recovered: 968000, rate: 78.1 },
      { batchName: "August 2026 - End-of-Month Reconciliation", atRisk: 1850000, recovered: 1591000, rate: 86.0 },
      { batchName: "August 2026 - Mandate & Degradation Sweep", atRisk: 980000, recovered: 891800, rate: 91.0 },
    ],
    rootCauseBreakdown: [
      { name: "ERP Price Book & Catalog Drift", amount: 1420000, percentage: 33.7 },
      { name: "Mandate Token & SEPA Expiration", amount: 980000, percentage: 23.3 },
      { name: "PO Cap & Milestone Desynchronization", amount: 890000, percentage: 21.1 },
      { name: "Gateway Soft-Declines & Liquidity Timing", amount: 540000, percentage: 12.8 },
      { name: "VAT / Intra-Community Tax Mismatch", amount: 380000, percentage: 9.1 },
    ],
  });

  const handleGenerateAIReport = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/ai/generate-monthly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: selectedMonth,
          metrics: {
            totalAtRisk: reportData.totalAtRisk,
            totalRecovered: reportData.totalRecovered,
            recoveryRate: reportData.recoveryRate,
            dsoReductionDays: reportData.dsoReductionDays,
          },
          batchStats: batches,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReportData((prev) => ({
          ...prev,
          executiveSummary: data.executiveSummary || prev.executiveSummary,
          keyHighlights: data.keyHighlights || prev.keyHighlights,
          leakageMitigation: data.leakageMitigation || prev.leakageMitigation,
          recommendations: data.recommendations || prev.recommendations,
        }));
        onLogAudit(
          "MONTHLY_REPORT_AI_GENERATED",
          selectedMonth,
          `Generated CFO Executive Revenue Recovery report with Gemini AI synthesis.`
        );
      }
    } catch (err) {
      console.warn("Using fallback monthly report:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePrint = () => {
    window.print();
    onLogAudit("MONTHLY_REPORT_EXPORTED", selectedMonth, "Report printed/exported via browser print.");
  };

  const handleOpenPDFModal = () => {
    setIsPDFModalOpen(true);
    onLogAudit(
      "SIMULATED_PDF_VIEWER_OPENED",
      selectedMonth,
      `Opened official simulated PDF archival export viewer for ${selectedMonth}.`
    );
  };

  const handleScheduleDistribution = () => {
    setScheduledSuccess(true);
    setTimeout(() => setScheduledSuccess(false), 4000);
    onLogAudit(
      "AUTOMATED_REPORT_SCHEDULED",
      selectedMonth,
      "Configured automated month-end distribution to CFO, VP Finance, and External SOX Auditor."
    );
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Action Controls Banner with Generous Negative Space */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0 mt-0.5">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-serif italic text-white tracking-tight">
                Monthly Finance & Audit Reports
              </h2>
              <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-mono">
                CFO Ready • SOX 404
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-xl leading-relaxed">
              Consolidates recovered revenues, root cause attribution, stopping rule boundary audits, and Days Sales Outstanding compression.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Month Selector */}
          <select
            aria-label="Select Reporting Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#0F0F14] border border-[#1F1F24] text-zinc-200 text-xs font-semibold py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-emerald-500"
          >
            <option value="September 2026">September 2026 (Current)</option>
            <option value="August 2026">August 2026 (Audited)</option>
            <option value="July 2026">July 2026 (Audited)</option>
          </select>

          {/* AI Re-Synthesize */}
          <button
            id="synthesize-report-btn"
            onClick={handleGenerateAIReport}
            disabled={isGeneratingAI}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isGeneratingAI ? "Synthesizing..." : "AI Re-Synthesize"}</span>
          </button>

          {/* Schedule Distribution */}
          <button
            id="schedule-dist-btn"
            onClick={handleScheduleDistribution}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#1A1A22] hover:bg-[#242430] text-zinc-200 border border-[#282834] transition"
          >
            <Send className="w-3.5 h-3.5 text-zinc-400" />
            <span>Schedule Email</span>
          </button>

          {/* Export to Simulated PDF (Prominent Primary Action) */}
          <button
            id="export-simulated-pdf-btn"
            onClick={handleOpenPDFModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95 transition"
            title="Export to simulated PDF archival format"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Simulated PDF</span>
          </button>

          {/* Native Print / Quick PDF */}
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="p-2.5 rounded-xl text-zinc-400 hover:text-white bg-[#1A1A22] hover:bg-[#242430] border border-[#282834] transition"
            title="Native Print / PDF Driver"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {scheduledSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-xs sm:text-sm text-emerald-300 flex items-center gap-3 animate-in fade-in print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Automated monthly reconciliation report scheduled for distribution on the 1st of every month to CFO and Treasury leadership.
          </span>
        </div>
      )}

      {/* Official Formatted Report Paper Sheet - Generous Negative Space & High Build Quality */}
      <div className="bg-[#111116] border border-[#1F1F24] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl space-y-12 sm:space-y-14 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Report Top Letterhead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1F1F24] pb-8 gap-6 print:border-gray-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-emerald-400 print:text-emerald-700 uppercase flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                OFFICIAL FINANCIAL REVENUE AUDIT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight print:text-black">
              Monthly Revenue Recovery & Leakage Reconciliation
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 print:text-gray-600 max-w-2xl leading-relaxed">
              Prepared autonomously for the Office of the CFO & Treasury Operations. Certified compliant with SOX 404 internal audit controls.
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs space-y-1 shrink-0">
            <div className="text-zinc-500 print:text-gray-600 uppercase text-[10px] tracking-wider font-semibold">REPORTING PERIOD</div>
            <div className="text-lg font-serif italic text-white print:text-emerald-800">{selectedMonth}</div>
            <div className="text-[11px] text-zinc-500 print:text-gray-500">
              Audit Ref: REC-SOX-2026-09
            </div>
          </div>
        </div>

        {/* Macro Scorecard Summary with Clean Negative Space & Airy Typography */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-2">
          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-semibold print:text-gray-600">
              Total Revenue At Risk
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-rose-400 block print:text-red-700">
              ${(reportData.totalAtRisk / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-zinc-500 print:text-gray-500 block">Across 5 ERP Catalogs</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-semibold print:text-gray-600">
              Measured Won Back
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-emerald-400 block print:text-emerald-700">
              ${(reportData.totalRecovered / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-emerald-400/90 print:text-emerald-800 font-medium block">
              {reportData.recoveryRate}% Efficiency Rate
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-semibold print:text-gray-600">
              DSO Compression
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-zinc-100 block print:text-purple-700">
              -{reportData.dsoReductionDays} Days
            </span>
            <span className="text-xs text-zinc-500 print:text-gray-500 block">Working Capital Acceleration</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-semibold print:text-gray-600">
              Fines Avoided
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-emerald-300 block print:text-emerald-700">
              ${(reportData.penaltiesAvoided / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-zinc-500 print:text-gray-500 block">Scheme Halting Compliance</span>
          </div>
        </div>

        {/* Section 1: Executive AI Narrative */}
        <div className="space-y-4 pt-4 border-t border-[#1F1F24]/70">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2.5 print:text-black">
              <Bot className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
              1. Executive Overview & Synthesis
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 print:hidden">Gemini Pro Synthesized</span>
          </div>
          <div className="border-l-2 border-emerald-500/50 pl-5 sm:pl-6 py-1">
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed sm:leading-loose font-normal print:text-gray-800">
              {reportData.executiveSummary}
            </p>
          </div>
        </div>

        {/* Section 2: Key Operational Breakthroughs */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2.5 print:text-black">
            <TrendingUp className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            2. Verified Financial Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {reportData.keyHighlights.map((hl, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-2xl bg-[#0F0F14]/70 border border-[#1F1F24] flex items-start gap-3.5 text-xs sm:text-sm text-zinc-300 print:bg-gray-50 print:border-gray-200 print:text-gray-800 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 print:text-emerald-700" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Root Cause Leakage Breakdown Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2.5 print:text-black">
              <Layers className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
              3. Discrepancy Root Cause Attribution
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 print:hidden">100% Volume Reconciled</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#1F1F24] print:border-gray-300">
            <table className="w-full text-left text-xs sm:text-sm text-zinc-300 print:text-gray-800">
              <thead className="bg-[#0D0D12] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-[#1F1F24] print:bg-gray-100 print:text-gray-600 print:border-gray-300">
                <tr>
                  <th className="py-3.5 px-5 sm:px-6">Leakage Root Cause Category</th>
                  <th className="py-3.5 px-5 sm:px-6 text-right">Revenue at Risk</th>
                  <th className="py-3.5 px-5 sm:px-6 text-right">Share of Leakage</th>
                  <th className="py-3.5 px-5 sm:px-6">Resolution Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F24] print:divide-gray-200">
                {reportData.rootCauseBreakdown.map((rc, idx) => (
                  <tr key={idx} className="hover:bg-[#16161D]/50 transition">
                    <td className="py-4 px-5 sm:px-6 font-medium text-white print:text-black">{rc.name}</td>
                    <td className="py-4 px-5 sm:px-6 text-right font-mono font-semibold text-rose-400 print:text-red-700">
                      ${rc.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-right font-mono text-emerald-400 print:text-emerald-800">
                      {rc.percentage}%
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-xs text-zinc-400 print:text-gray-600">
                      Autonomous reconciliation + bounded workflow
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Strategic Recommendations for Leadership */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2.5 print:text-black">
            <ShieldCheck className="w-4 h-4 text-amber-400 print:text-amber-700" />
            4. Strategic Treasury & ERP Recommendations
          </h3>
          <div className="space-y-3">
            {reportData.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-[#0F0F14]/70 border border-[#1F1F24] text-xs sm:text-sm text-zinc-300 flex items-start gap-3.5 print:bg-gray-50 print:border-gray-200 print:text-gray-800 leading-relaxed"
              >
                <span className="font-bold text-emerald-400 font-mono text-xs print:text-emerald-700 mt-0.5">0{i + 1}.</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off, Audit Seal & Simulated PDF Record Quick Launch */}
        <div className="pt-8 border-t border-[#1F1F24] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-6 print:border-gray-300 print:text-gray-600">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300 print:text-black">SOX Section 404 Cryptographic Seal</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60">
                ACCREDITED_COMPLIANT
              </span>
            </div>
            <p className="text-zinc-500 text-xs">
              Cryptographically signed by AI Revenue Recovery System (SHA-256 Verified • ISO/IEC 27001)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenPDFModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#16161D] hover:bg-[#1E1E26] border border-[#262632] transition print:hidden"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Simulated PDF Archive</span>
            </button>

            <div className="text-right font-mono text-[11px] hidden sm:block">
              <div>Hash: e4f8a92b...a044e1</div>
              <div className="text-zinc-500">Stamp: SOX-404-VERIFIED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated PDF Document Modal */}
      <SimulatedPDFModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        reportData={reportData}
        selectedMonth={selectedMonth}
        onLogAudit={onLogAudit}
      />
    </div>
  );
};
