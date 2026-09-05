import React, { useState } from "react";
import { 
  X, 
  Bot, 
  Send, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Sliders
} from "lucide-react";
import { DiscrepancyItem, UserRole } from "../types";

interface RecoveryWorkflowModalProps {
  item: DiscrepancyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchWorkflow: (
    item: DiscrepancyItem,
    channel: string,
    messagePayload: { subject: string; message: string; stoppingRuleEnforced: string }
  ) => void;
}

export const RecoveryWorkflowModal: React.FC<RecoveryWorkflowModalProps> = ({
  item,
  isOpen,
  onClose,
  onDispatchWorkflow,
}) => {
  if (!isOpen || !item) return null;

  const [channel, setChannel] = useState<string>("Executive Email + Portal");
  const [tone, setTone] = useState<string>("Collaborative Commercial Partner");
  const [language, setLanguage] = useState<string>("English");
  const [maxDiscountWaiver, setMaxDiscountWaiver] = useState<number>(5);
  const [cureDays, setCureDays] = useState<number>(5);
  const [allowInstallments, setAllowInstallments] = useState<boolean>(true);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSubject, setGeneratedSubject] = useState<string>(
    `ACTION REQUIRED: Payment Reconciliation Notice - Invoice #${item.invoiceId}`
  );
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [stoppingRuleApplied, setStoppingRuleApplied] = useState<string>(
    item.stoppingRule || `Maximum waiver: ${maxDiscountWaiver}%. Cure limit: ${cureDays} business days.`
  );

  // Generate Follow-up via server-side Gemini API or intelligent template
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item,
          channel,
          tone,
          language: language === "Hinglish" ? "Hinglish (Mix of professional English and respectful conversational Hindi terms used in Indian enterprise tech finance)" : "English",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedSubject(data.subject || `Reconciliation Notice #${item.invoiceId}`);
        setGeneratedMessage(data.message || "");
        if (data.stoppingRuleEnforced) {
          setStoppingRuleApplied(data.stoppingRuleEnforced);
        }
      } else {
        throw new Error("Server response error");
      }
    } catch (err) {
      console.warn("Using deterministic fallback followup:", err);
      if (language === "Hinglish") {
        setGeneratedSubject(`Immediate Attention: Invoice #${item.invoiceId} Settlement & Mandate Update`);
        setGeneratedMessage(
          `Namaste ${item.contactName},\n\nHope you are having a productive week. Regarding ${item.clientName}'s Invoice #${item.invoiceId} of $${item.amountAtRisk.toLocaleString()} registered in ${item.erpSource}: hamare automated system ne mandate failure flag kiya hai. \n\nAapki convenience ke liye, we have enabled a single-click direct mandate renewal with zero disruption to your active enterprise SLA.\n\nOption 1: Complete 1-minute OTP re-authorization here: https://finops.internal/mandate/${item.id}\nOption 2: Clear full invoice via RTGS/NEFT with pre-approved 5% goodwill credit adjustment.\n\nStopping Rule: Valid till Friday 5:00 PM IST before automated credit limit hold. Shukriya!\n\nEnterprise Finance Team`
        );
      } else {
        setGeneratedSubject(`Payment Reconciliation Notice: Invoice #${item.invoiceId} - ${item.clientName}`);
        setGeneratedMessage(
          `Dear ${item.contactName},\n\nOur automated ERP reconciliation engine has identified an open balance of $${item.amountAtRisk.toLocaleString()} concerning Invoice #${item.invoiceId}, currently ${item.daysOverdue} days past term under ${item.erpSource}.\n\nRoot Cause Identified: ${item.rootCauseDiagnosis || "Discrepancy in billing catalog conditions"}.\n\nBounded Settlement Proposal:\n1. Execute direct single-click payment via secure ACH/Wire portal: https://finops.internal/pay/${item.id}\n2. Or opt into our 2-stage Promise-to-Pay installment schedule (50% upfront, 50% in ${cureDays} business days).\n\nStopping Rule Guardrail: A maximum goodwill waiver of ${maxDiscountWaiver}% has been pre-authorized by Treasury. Unresolved balances after ${cureDays} business days will trigger automated service tier suspension per MSA Clause 12.4.\n\nSincerely,\nAI Revenue Recovery Operations`
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial load auto-generate if empty
  React.useEffect(() => {
    if (!generatedMessage) {
      handleGenerateAI();
    }
  }, [item.id]);

  const handleDispatch = () => {
    onDispatchWorkflow(item, channel, {
      subject: generatedSubject,
      message: generatedMessage,
      stoppingRuleEnforced: stoppingRuleApplied,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1F1F24] bg-[#0F0F14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif italic text-white tracking-tight">
                  Autonomous Bounded Recovery Workflow
                </h2>
                <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                  {item.invoiceId}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {item.clientName} • ${item.amountAtRisk.toLocaleString()} at risk • {item.erpSource}
              </p>
            </div>
          </div>
          <button
            id="close-workflow-modal-btn"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1A1A22] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-zinc-300">
          {/* Channel Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-zinc-200 block text-xs">
              Select Automated Outreach Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "Executive Email + Portal", label: "Executive Email", icon: Mail },
                { id: "WhatsApp / SMS Instant Re-auth", label: "WhatsApp / SMS", icon: MessageSquare },
                { id: "Hinglish Voice Recovery AI", label: "Hinglish Voice AI", icon: PhoneCall },
                { id: "B2B Legal Escalation Notice", label: "Formal Demand", icon: FileText },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = channel === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setChannel(c.id);
                      if (c.id === "Hinglish Voice Recovery AI") {
                        setLanguage("Hinglish");
                      } else {
                        setLanguage("English");
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-200 shadow-sm"
                        : "bg-[#0F0F14] border-[#1F1F24] text-zinc-400 hover:border-[#282834]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-zinc-500"}`} />
                    <span className="font-medium text-[11px]">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone & Language Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0F0F14] p-3.5 rounded-xl border border-[#1F1F24]">
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Intervention Tone
              </label>
              <select
                aria-label="Intervention Tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#16161D] border border-[#252530] rounded-lg p-2 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Collaborative Commercial Partner">Collaborative Commercial Partner</option>
                <option value="Executive Firm & Contractual">Executive Firm & Contractual</option>
                <option value="Urgent Escalation with Credit Freeze">Urgent Escalation (Pre-Credit Hold)</option>
                <option value="Conversational Regional / Tech Finance">Conversational Regional (Tech Finance)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Language & Localization
              </label>
              <select
                aria-label="Language and Localization"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#16161D] border border-[#252530] rounded-lg p-2 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="English">English (Global Corporate)</option>
                <option value="Hinglish">Hinglish (India Tech / APAC Enterprise)</option>
                <option value="German">German (Formal B2B DIN 5008)</option>
                <option value="French">French (Formal Commerce)</option>
              </select>
            </div>
          </div>

          {/* Compliant Stopping Rules & Bounds */}
          <div className="bg-amber-950/15 border border-amber-900/30 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                SOX & Treasury Stopping Rules (Guardrails)
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">
                CFO Enforced Policy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-zinc-400 block">Max Fee Waiver / Discount:</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={maxDiscountWaiver}
                    onChange={(e) => setMaxDiscountWaiver(parseInt(e.target.value) || 0)}
                    className="w-16 bg-[#0F0F14] border border-amber-800/60 rounded px-2 py-0.5 text-amber-300 font-mono font-bold"
                  />
                  <span className="text-zinc-400">% (Cap: 10%)</span>
                </div>
              </div>

              <div>
                <span className="text-zinc-400 block">Cure Window Limit:</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    min={2}
                    max={15}
                    value={cureDays}
                    onChange={(e) => setCureDays(parseInt(e.target.value) || 5)}
                    className="w-16 bg-[#0F0F14] border border-amber-800/60 rounded px-2 py-0.5 text-amber-300 font-mono font-bold"
                  />
                  <span className="text-zinc-400">Business Days</span>
                </div>
              </div>

              <div>
                <span className="text-zinc-400 block">Offer Installments:</span>
                <button
                  type="button"
                  onClick={() => setAllowInstallments(!allowInstallments)}
                  className={`mt-1 px-2.5 py-1 rounded font-semibold text-xs transition border ${
                    allowInstallments
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-[#181820] text-zinc-400 border-[#262632]"
                  }`}
                >
                  {allowInstallments ? "✓ 2-Part Milestone" : "Full Wire Only"}
                </button>
              </div>
            </div>
          </div>

          {/* AI Generator Action Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-zinc-200">Generated Follow-Up Communication</span>
            <button
              id="regenerate-ai-followup-btn"
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin text-emerald-400" : ""}`} />
              <span>{isGenerating ? "Synthesizing with Gemini..." : "Re-Generate with AI Agent"}</span>
            </button>
          </div>

          {/* Subject Line */}
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Subject / Header:</label>
            <input
              type="text"
              value={generatedSubject}
              onChange={(e) => setGeneratedSubject(e.target.value)}
              className="w-full bg-[#0F0F14] border border-[#1F1F24] rounded-lg p-2 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">
              Communication Content (Editable):
            </label>
            <textarea
              rows={6}
              value={generatedMessage}
              onChange={(e) => setGeneratedMessage(e.target.value)}
              className="w-full bg-[#0F0F14] border border-[#1F1F24] rounded-lg p-3 text-xs text-zinc-200 font-sans leading-relaxed focus:outline-none focus:border-emerald-500 scrollbar-thin"
              placeholder="Generating compliant follow-up message..."
            />
          </div>

          {/* Stopping Rule Stamp */}
          <div className="text-[11px] text-zinc-400 bg-[#0F0F14] p-3 rounded-lg border border-[#1F1F24] flex items-center justify-between">
            <span className="text-amber-400 font-medium">Enforced Boundary:</span>
            <span className="text-zinc-300 font-mono">{stoppingRuleApplied}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0F0F14] border-t border-[#1F1F24] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Dispatching automatically logs cryptographic hash to financial audit trail
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              id="dispatch-recovery-btn"
              type="button"
              onClick={handleDispatch}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch & Log to Audit Trail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
