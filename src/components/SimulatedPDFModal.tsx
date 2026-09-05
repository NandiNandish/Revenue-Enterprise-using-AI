import React, { useState } from "react";
import { 
  X, 
  Download, 
  Printer, 
  Check, 
  Copy, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Hash, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  Lock,
  Award,
  ExternalLink
} from "lucide-react";
import { MonthlyReportData } from "../types";

interface SimulatedPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: MonthlyReportData;
  selectedMonth: string;
  onLogAudit: (action: string, targetId: string, details: string) => void;
}

export const SimulatedPDFModal: React.FC<SimulatedPDFModalProps> = ({
  isOpen,
  onClose,
  reportData,
  selectedMonth,
  onLogAudit,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [watermark, setWatermark] = useState<string>("CONFIDENTIAL • SOX 404");
  const [showSignatures, setShowSignatures] = useState<boolean>(true);
  const [showCryptoHash, setShowCryptoHash] = useState<boolean>(true);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Generate deterministic-looking SHA-256 hash for the document
  const documentHash = "e4f8a92bc719028e3401fa55b8921cc74401a044e13d92095f9a6541f7e09923";
  const documentId = `REC-REV-${selectedMonth.replace(/\s+/g, "").toUpperCase()}-9401`;
  const generationTimestamp = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  const handleCopyHash = () => {
    navigator.clipboard.writeText(documentHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadFile = () => {
    // Generate standalone printable document blob
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${documentId} - Monthly Revenue Recovery Report</title>
  <style>
    @page { size: ${pageSize === "a4" ? "A4" : "letter"}; margin: 20mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      line-height: 1.5;
      margin: 0;
      padding: 24px;
    }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 24px; font-weight: 700; color: #064e3b; margin: 0 0 4px 0; font-family: Georgia, serif; }
    .subtitle { font-size: 13px; color: #6b7280; margin: 0; }
    .meta-box { font-family: monospace; font-size: 11px; text-align: right; color: #4b5563; }
    .scorecard { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .metric-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; }
    .metric-label { font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-bottom: 4px; }
    .metric-value { font-size: 18px; font-weight: 700; color: #111827; }
    .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #065f46; margin: 24px 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .narrative { font-size: 13px; color: #374151; line-height: 1.6; background: #f9fafb; padding: 14px; border-radius: 6px; border-left: 3px solid #10b981; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
    th { text-align: left; padding: 8px; background: #f3f4f6; border-bottom: 1px solid #d1d5db; font-size: 10px; text-transform: uppercase; color: #4b5563; }
    td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
    .sign-box { border: 1px dashed #cbd5e1; border-radius: 6px; padding: 14px; font-size: 11px; }
    .watermark { position: fixed; top: 40%; left: 15%; transform: rotate(-35deg); font-size: 52px; font-weight: 800; color: rgba(16, 185, 129, 0.08); pointer-events: none; text-transform: uppercase; letter-spacing: 4px; z-index: 1000; }
  </style>
</head>
<body>
  ${watermark !== "NONE" ? `<div class="watermark">${watermark}</div>` : ""}
  <div class="header">
    <div>
      <div style="font-size: 10px; font-weight: 700; color: #10b981; letter-spacing: 1px; text-transform: uppercase;">OFFICIAL AUDITED RECORD</div>
      <h1 class="title">Monthly Revenue Recovery & Reconciliation</h1>
      <p class="subtitle">Autonomous AI Revenue Recovery Agent • Internal Audit & CFO Record</p>
    </div>
    <div class="meta-box">
      <div><strong>DOC REF:</strong> ${documentId}</div>
      <div><strong>PERIOD:</strong> ${selectedMonth}</div>
      <div><strong>GENERATED:</strong> ${generationTimestamp}</div>
      <div><strong>HASH:</strong> ${documentHash.slice(0, 18)}...</div>
    </div>
  </div>

  <div class="scorecard">
    <div class="metric-card">
      <div class="metric-label">Revenue at Risk</div>
      <div class="metric-value">$${(reportData.totalAtRisk / 1000000).toFixed(2)}M</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Measured Won Back</div>
      <div class="metric-value" style="color: #059669;">$${(reportData.totalRecovered / 1000000).toFixed(2)}M</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">DSO Compression</div>
      <div class="metric-value">-${reportData.dsoReductionDays} Days</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Fines Mitigated</div>
      <div class="metric-value" style="color: #059669;">$${(reportData.penaltiesAvoided / 1000).toFixed(0)}k</div>
    </div>
  </div>

  <div class="section-title">1. Executive Overview & Synthesis</div>
  <div class="narrative">${reportData.executiveSummary}</div>

  <div class="section-title">2. Root Cause Leakage Attribution</div>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th style="text-align: right;">Amount at Risk</th>
        <th style="text-align: right;">Share</th>
        <th>Intervention Mechanism</th>
      </tr>
    </thead>
    <tbody>
      ${reportData.rootCauseBreakdown.map(rc => `
        <tr>
          <td><strong>${rc.name}</strong></td>
          <td style="text-align: right; font-family: monospace;">$${rc.amount.toLocaleString()}</td>
          <td style="text-align: right; font-family: monospace;">${rc.percentage}%</td>
          <td>Autonomous reconciliation & bounded workflow</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="section-title">3. Strategic Treasury Recommendations</div>
  <ol style="font-size: 12px; color: #374151; padding-left: 20px; line-height: 1.6;">
    ${reportData.recommendations.map(r => `<li>${r}</li>`).join("")}
  </ol>

  <div class="signature-grid">
    <div class="sign-box">
      <div style="font-weight: 700; color: #111827;">Elena Vance, CFA</div>
      <div style="color: #6b7280; font-size: 10px;">Chief Financial Officer</div>
      <div style="margin-top: 12px; font-family: monospace; font-size: 10px; color: #059669;">[Digitally Signed via Corporate SSO]</div>
      <div style="font-family: monospace; font-size: 9px; color: #9ca3af;">Timestamp: ${generationTimestamp}</div>
    </div>
    <div class="sign-box">
      <div style="font-weight: 700; color: #111827;">Marcus Brody, CIA</div>
      <div style="color: #6b7280; font-size: 10px;">Head of Internal Audit & SOX Compliance</div>
      <div style="margin-top: 12px; font-family: monospace; font-size: 10px; color: #059669;">[Verified SOX 404 Accredited]</div>
      <div style="font-family: monospace; font-size: 9px; color: #9ca3af;">Hash Checksum: ${documentHash.slice(0, 24)}...</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Monthly_Revenue_Recovery_Report_${selectedMonth.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);

    onLogAudit(
      "SIMULATED_PDF_RECORD_EXPORTED",
      documentId,
      `Exported certified simulated PDF record for ${selectedMonth} with watermark "${watermark}" (Hash: ${documentHash.slice(0, 16)}...)`
    );
  };

  const handlePrintDocument = () => {
    window.print();
    onLogAudit("SIMULATED_PDF_PRINTED", documentId, `Sent simulated PDF ${documentId} to printer / native PDF print driver.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Modal Controls Header */}
        <div className="px-6 py-4 border-b border-[#1F1F24] bg-[#0E0E13] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif italic text-white tracking-tight">
                  Simulated PDF Record & Archival Export
                </h2>
                <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                  {documentId}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Certified audit snapshot formatted for archival record-keeping and board governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="close-pdf-modal-btn"
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-[#1A1A22] transition"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Toolbar */}
        <div className="px-6 py-3 bg-[#16161D] border-b border-[#1F1F24] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Page Navigation */}
            <div className="flex items-center gap-1 bg-[#0F0F14] p-1 rounded-xl border border-[#1F1F24]">
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  currentPage === 1 ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Page 1 • Summary
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  currentPage === 2 ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Page 2 • Discrepancies & Seal
              </button>
            </div>

            {/* Paper Size */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium text-[11px]">Format:</span>
              <select
                aria-label="PDF Page Size"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as "a4" | "letter")}
                className="bg-[#0F0F14] border border-[#1F1F24] text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="a4">ISO A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
              </select>
            </div>

            {/* Watermark Selector */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium text-[11px]">Watermark:</span>
              <select
                aria-label="Security Watermark"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                className="bg-[#0F0F14] border border-[#1F1F24] text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="CONFIDENTIAL • SOX 404">CONFIDENTIAL • SOX 404</option>
                <option value="OFFICIAL TREASURY ARCHIVE">OFFICIAL TREASURY ARCHIVE</option>
                <option value="INTERNAL AUDIT ONLY">INTERNAL AUDIT ONLY</option>
                <option value="BOARD OF DIRECTORS COPY">BOARD OF DIRECTORS COPY</option>
                <option value="NONE">No Watermark</option>
              </select>
            </div>
          </div>

          {/* Export / Download Actions */}
          <div className="flex items-center gap-2">
            <button
              id="copy-doc-hash-btn"
              onClick={handleCopyHash}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F0F14] hover:bg-[#1C1C26] text-zinc-300 border border-[#1F1F24] text-xs transition"
              title="Copy cryptographic verification hash"
            >
              {copiedHash ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Hash Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy SHA-256</span>
                </>
              )}
            </button>

            <button
              id="print-simulated-pdf-btn"
              onClick={handlePrintDocument}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F1F28] hover:bg-[#282834] text-zinc-200 border border-[#2B2B38] text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Native Print</span>
            </button>

            <button
              id="download-simulated-pdf-btn"
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Simulated PDF (.pdf)</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-950/40 border-b border-emerald-800/60 px-6 py-2 text-xs text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Certified PDF record generated and downloaded: <strong>Monthly_Revenue_Recovery_Report_{selectedMonth.replace(/\s+/g, "_")}.pdf</strong>
            </span>
            <span className="font-mono text-[11px] text-emerald-400/80">Archived to Audit Ledger</span>
          </div>
        )}

        {/* Scrollable PDF Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#0A0A0E] flex justify-center scrollbar-thin">
          {/* Simulated Paper Sheet */}
          <div className="relative w-full max-w-3xl bg-[#FCFDFD] text-[#16161A] rounded-xl shadow-2xl border border-zinc-300 p-8 sm:p-12 transition-all min-h-[800px] flex flex-col justify-between">
            
            {/* Watermark Diagonal Overlay */}
            {watermark !== "NONE" && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
              >
                <span className="text-zinc-200/50 text-4xl sm:text-5xl font-black uppercase tracking-[0.25em] -rotate-30 text-center font-mono">
                  {watermark}
                </span>
              </div>
            )}

            {/* Document Content Layer */}
            <div className="relative z-10 space-y-7">
              
              {/* PAGE 1 CONTENT */}
              {currentPage === 1 && (
                <>
                  {/* Top Archival Letterhead */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-emerald-700 pb-5 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 tracking-widest uppercase font-mono">
                        <Award className="w-3.5 h-3.5" />
                        CERTIFIED REVENUE RECOVERY LEDGER • SOX 404
                      </div>
                      <h1 className="text-2xl font-serif font-bold text-zinc-900 tracking-tight mt-1">
                        Monthly Revenue Recovery & Leakage Audit
                      </h1>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        Office of the CFO & Treasury Operations • Executive Archival Copy
                      </p>
                    </div>

                    <div className="text-left sm:text-right font-mono text-[11px] text-zinc-600 space-y-0.5 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                      <div><strong className="text-zinc-800">RECORD ID:</strong> {documentId}</div>
                      <div><strong className="text-zinc-800">PERIOD:</strong> {selectedMonth}</div>
                      <div><strong className="text-zinc-800">EXPORTED:</strong> {generationTimestamp}</div>
                      <div><strong className="text-zinc-800">PAGE:</strong> 1 of 2</div>
                    </div>
                  </div>

                  {/* Core Metrics Scorecard */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Total at Risk</span>
                      <span className="text-xl font-bold font-serif text-rose-700 block mt-0.5">
                        ${(reportData.totalAtRisk / 1000000).toFixed(2)}M
                      </span>
                      <span className="text-[9px] text-zinc-500">Across 5 ERP Connectors</span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Won Back</span>
                      <span className="text-xl font-bold font-serif text-emerald-800 block mt-0.5">
                        ${(reportData.totalRecovered / 1000000).toFixed(2)}M
                      </span>
                      <span className="text-[9px] text-emerald-700 font-medium">
                        {reportData.recoveryRate}% Efficiency Rate
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold block">DSO Compression</span>
                      <span className="text-xl font-bold font-serif text-zinc-900 block mt-0.5">
                        -{reportData.dsoReductionDays} Days
                      </span>
                      <span className="text-[9px] text-zinc-500">Working Capital Velocity</span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Fines Prevented</span>
                      <span className="text-xl font-bold font-serif text-emerald-700 block mt-0.5">
                        ${(reportData.penaltiesAvoided / 1000).toFixed(0)}k
                      </span>
                      <span className="text-[9px] text-zinc-500">Scheme Halting Rules</span>
                    </div>
                  </div>

                  {/* Section 1: Executive Overview */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-1">
                      1. Executive Overview & Synthesis
                    </h3>
                    <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50/80 p-4 rounded-lg border border-zinc-200">
                      {reportData.executiveSummary}
                    </p>
                  </div>

                  {/* Section 2: Verified Highlights */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-1">
                      2. Verified Operational Milestones
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {reportData.keyHighlights.map((hl, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-start gap-2"
                        >
                          <span className="text-emerald-700 font-bold font-mono">✓</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Page 1 Bottom Metadata */}
                  <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Document Serial: {documentId}</span>
                    <span>Continued on Page 2 →</span>
                  </div>
                </>
              )}

              {/* PAGE 2 CONTENT */}
              {currentPage === 2 && (
                <>
                  {/* Page 2 Header */}
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-3 text-xs text-zinc-500 font-mono">
                    <span className="text-emerald-800 font-bold">MONTHLY REVENUE RECOVERY REPORT • {selectedMonth}</span>
                    <span>PAGE 2 OF 2</span>
                  </div>

                  {/* Section 3: Root Cause Breakdown Table */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-1">
                      3. Root Cause Leakage Attribution
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-zinc-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-100 text-zinc-700 uppercase text-[10px] tracking-wider border-b border-zinc-200">
                          <tr>
                            <th className="py-2.5 px-3">Leakage Root Cause</th>
                            <th className="py-2.5 px-3 text-right">Amount at Risk</th>
                            <th className="py-2.5 px-3 text-right">Share</th>
                            <th className="py-2.5 px-3">Resolution Mechanism</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-zinc-700 font-sans">
                          {reportData.rootCauseBreakdown.map((rc, idx) => (
                            <tr key={idx} className="hover:bg-zinc-50">
                              <td className="py-2 px-3 font-medium text-zinc-900">{rc.name}</td>
                              <td className="py-2 px-3 text-right font-mono font-semibold text-rose-700">
                                ${rc.amount.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-emerald-800">
                                {rc.percentage}%
                              </td>
                              <td className="py-2 px-3 text-[11px] text-zinc-500">
                                Automated remediation + bounded outreach
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 4: Strategic Recommendations */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-1">
                      4. Strategic Recommendations for Finance Leadership
                    </h3>
                    <div className="space-y-1.5">
                      {reportData.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-start gap-2"
                        >
                          <span className="font-bold text-emerald-700 font-mono">0{i + 1}.</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cryptographic Seal & Signatures */}
                  <div className="pt-4 border-t-2 border-emerald-700 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* CFO Sign Box */}
                      <div className="p-3.5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-xs">
                        <div className="font-bold text-zinc-900">Elena Vance, CFA</div>
                        <div className="text-[11px] text-zinc-600">Chief Financial Officer</div>
                        <div className="mt-2 text-[10px] font-mono text-emerald-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Digitally Verified Signature</span>
                        </div>
                        <div className="text-[9px] font-mono text-zinc-400 mt-0.5">
                          ID: SIG-CFO-20260905-884
                        </div>
                      </div>

                      {/* Internal Auditor Sign Box */}
                      <div className="p-3.5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-xs">
                        <div className="font-bold text-zinc-900">Marcus Brody, CIA</div>
                        <div className="text-[11px] text-zinc-600">Head of Internal Audit & SOX 404</div>
                        <div className="mt-2 text-[10px] font-mono text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Accredited Compliant Seal</span>
                        </div>
                        <div className="text-[9px] font-mono text-zinc-400 mt-0.5">
                          ID: AUD-SOX-20260905-102
                        </div>
                      </div>
                    </div>

                    {/* SHA-256 Stamp */}
                    <div className="bg-zinc-100 p-2.5 rounded-lg border border-zinc-200 text-[10px] font-mono text-zinc-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Hash className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span>SHA-256: {documentHash}</span>
                      </div>
                      <span className="text-emerald-800 font-bold shrink-0">AUTHENTICATED LEDGER COPY</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Document Footer */}
            <div className="pt-6 mt-6 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>Automated Revenue Recovery System v2.4</span>
              <span>Generated for Internal Financial Record-Keeping</span>
              <span>Page {currentPage} of 2</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-[#0E0E13] border-t border-[#1F1F24] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Record cryptographically locked & tamper-evident</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition"
            >
              Done Viewing
            </button>
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PDF Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
