import React, { useState } from "react";
import { 
  CalendarClock, 
  RotateCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { MandateRetryItem, UserRole } from "../types";
import { INITIAL_MANDATE_RETRIES } from "../data/mockData";

interface MandateRetrySequencerProps {
  currentRole: UserRole;
  onLogAudit: (action: string, targetId: string, details: string) => void;
}

export const MandateRetrySequencer: React.FC<MandateRetrySequencerProps> = ({
  currentRole,
  onLogAudit,
}) => {
  const [retries, setRetries] = useState<MandateRetryItem[]>(INITIAL_MANDATE_RETRIES);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const totalAmountQueued = retries.reduce((acc, r) => acc + r.amount, 0);
  const totalAttemptsAvoided = retries.reduce((acc, r) => acc + (r.maxAllowedAttempts - r.attemptsMade), 0);
  const penaltiesSaved = totalAttemptsAvoided * 18.5; // ~$18.50 average card scheme penalty avoided

  const handleExecuteRetry = (item: MandateRetryItem) => {
    setExecutingId(item.id);
    setTimeout(() => {
      setRetries((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? {
                ...r,
                status: "succeeded",
                attemptsMade: r.attemptsMade + 1,
              }
            : r
        )
      );
      setExecutingId(null);
      onLogAudit(
        "MANDATE_RETRY_EXECUTED_SUCCESS",
        `${item.mandateId} (${item.clientName})`,
        `Successfully recovered $${item.amount.toLocaleString()} via ${item.recommendedRoute}. Card scheme retry rule compliant.`
      );
    }, 1200);
  };

  const handleHaltRetry = (item: MandateRetryItem) => {
    setRetries((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: "failed_halted",
            }
          : r
      )
    );
    onLogAudit(
      "MANDATE_RETRY_HALTED_BY_RULE",
      `${item.mandateId} (${item.clientName})`,
      `Stopping rule triggered: Halted automated debit to prevent card scheme penalty fees. Escalated to manual Treasury wire.`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif italic text-white tracking-tight">
                  Mandate Retry Sequencer & Liquidity Timing
                </h2>
                <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  Card Scheme Rule Safe
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Dynamic retry orchestration optimizing bank settlement windows and avoiding excessive decline penalty fines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-[#1F1F24]">
              <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">QUEUED RECOVERY</span>
              <span className="font-bold text-white font-serif text-sm">
                ${totalAmountQueued.toLocaleString()}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-[#1F1F24]">
              <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">FINES MITIGATED</span>
              <span className="font-bold text-emerald-400 font-serif text-sm">
                ${penaltiesSaved.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Informational Guidance Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#0F0F14] border border-[#1F1F24] text-xs text-zinc-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-white">Visa & Mastercard Stopping Rule Compliance:</span>{" "}
            Retrying failed card mandates without checking issuer error codes leads to $15-$25 scheme fines per transaction and merchant velocity blocks. Our AI sequencer models issuer clearing cycles (e.g. Tuesday morning liquidity sweeps) and dynamically halts attempts at the calibrated threshold.
          </div>
        </div>
      </div>

      {/* Grid of Mandate Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {retries.map((item) => {
          const isExecuting = executingId === item.id;
          const isSuccess = item.status === "succeeded";
          const isHalted = item.status === "failed_halted";

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
                isSuccess
                  ? "bg-[#0F1612] border-emerald-500/40"
                  : isHalted
                  ? "bg-[#19140F] border-amber-500/40"
                  : "bg-[#121217] border-[#1F1F24] hover:border-[#2A2A35]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-zinc-200">
                      {item.mandateId}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#0F0F14] px-2 py-0.5 rounded border border-[#1F1F24] text-zinc-400">
                    {item.gateway}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-sm font-bold text-white truncate max-w-[240px]">
                    {item.clientName}
                  </h3>
                  <span className="text-sm font-black text-rose-400 font-mono">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Ref: {item.invoiceId}
                </div>

                {/* Reason & Failure Code */}
                <div className="mt-3 p-3 rounded-lg bg-[#0F0F14] border border-[#1F1F24] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Decline Code:</span>
                    <span className="font-mono text-amber-400 font-semibold">{item.originalFailureCode}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {item.reasonDescription}
                  </p>
                </div>

                {/* Algorithmic Prediction Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0F0F14] border border-[#1F1F24]">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">OPTIMAL WINDOW</span>
                    <span className="font-semibold text-zinc-200 text-[11px]">
                      {item.optimalRetryTimestamp}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0F0F14] border border-[#1F1F24]">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">SUCCESS PROBABILITY</span>
                    <span className="font-bold text-emerald-400 font-mono text-[11px]">
                      {item.predictedSuccessProbability}% Predicted
                    </span>
                  </div>
                </div>

                {/* Recommended Rail */}
                <div className="mt-2.5 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Routing: <strong className="text-zinc-200">{item.recommendedRoute}</strong></span>
                  <span className="font-mono">
                    Attempt {item.attemptsMade}/{item.maxAllowedAttempts}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3.5 border-t border-[#1F1F24] flex items-center justify-between">
                <div>
                  {isSuccess ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Settled & Recovered
                    </span>
                  ) : isHalted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                      <AlertTriangle className="w-4 h-4" /> Halted by Stopping Rule
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-500">
                      Auto-scheduled for optimal window
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isSuccess && !isHalted && (
                    <>
                      <button
                        onClick={() => handleHaltRetry(item)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-950/40 border border-amber-900/60 transition"
                        title="Halt automated retries to prevent penalty fee"
                      >
                        Enforce Stop
                      </button>
                      <button
                        onClick={() => handleExecuteRetry(item)}
                        disabled={isExecuting}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95 transition disabled:opacity-50"
                      >
                        <Zap className={`w-3.5 h-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                        <span>{isExecuting ? "Retrying Rail..." : "Execute Now"}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
