import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { RecoveryBatch, UserRole } from "../types";

interface RecoveryBatchCardProps {
  batch: RecoveryBatch;
  targetRate: number;
  currentRole: UserRole;
  onIntervene?: (batchId: string) => void;
  isIntervening?: boolean;
}

export const RecoveryBatchCard: React.FC<RecoveryBatchCardProps> = ({
  batch,
  targetRate,
  currentRole,
  onIntervene,
  isIntervening = false,
}) => {
  const prevRateRef = useRef<number>(batch.recoveryRate);
  const [rateDelta, setRateDelta] = useState<number | null>(null);
  const [justUpdated, setJustUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (batch.recoveryRate !== prevRateRef.current) {
      const delta = +(batch.recoveryRate - prevRateRef.current).toFixed(1);
      if (delta !== 0) {
        setRateDelta(delta);
        setJustUpdated(true);
        const timer = setTimeout(() => {
          setJustUpdated(false);
          setRateDelta(null);
        }, 3500);
        prevRateRef.current = batch.recoveryRate;
        return () => clearTimeout(timer);
      }
    }
  }, [batch.recoveryRate]);

  const isTargetMet = batch.recoveryRate >= targetRate;
  const canIntervene = currentRole === "CFO" || currentRole === "COLLECTIONS_LEAD";

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0F0F14] border border-[#1E1E26] hover:border-[#2C2C38] transition-all shadow-sm relative overflow-hidden group">
      {/* Background glow when recently intervened */}
      <AnimatePresence>
        {justUpdated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-500 pointer-events-none blur-xl"
          />
        )}
      </AnimatePresence>

      {/* Header Row: Batch Name & Source */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 transition">
            {batch.batchName}
          </span>
          <span className="text-[10px] bg-[#181822] text-zinc-300 font-mono px-2 py-0.5 rounded-md border border-[#272736]">
            {batch.erpSource}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {rateDelta !== null && rateDelta > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600/70 px-2 py-0.5 rounded-md shadow-sm"
              >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                +{rateDelta}%
              </motion.span>
            )}
          </AnimatePresence>

          <span
            className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 ${
              batch.status === "active"
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {batch.status === "active" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Active Ingestion
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Reconciled
              </>
            )}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 pb-2">
        <div className="bg-[#14141B]/60 p-2 rounded-xl border border-[#1E1E28]">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">
            CASES AUDITED
          </span>
          <span className="font-semibold text-zinc-200 mt-0.5 block">
            {batch.totalCases} Invoices
          </span>
        </div>

        <div className="bg-[#14141B]/60 p-2 rounded-xl border border-[#1E1E28]">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">
            AT RISK
          </span>
          <span className="font-semibold text-rose-400 font-mono mt-0.5 block">
            ${(batch.totalAtRisk / 1000).toFixed(0)}k
          </span>
        </div>

        <div className="bg-[#14141B]/60 p-2 rounded-xl border border-[#1E1E28]">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">
            RECOVERED
          </span>
          <motion.span
            key={batch.totalRecovered}
            initial={{ scale: 1.15, color: "#34d399" }}
            animate={{ scale: 1, color: "#10b981" }}
            transition={{ duration: 0.5 }}
            className="font-bold text-emerald-400 font-mono mt-0.5 block"
          >
            ${(batch.totalRecovered / 1000).toFixed(0)}k
          </motion.span>
        </div>

        <div className="bg-[#14141B]/60 p-2 rounded-xl border border-[#1E1E28]">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">
            RECOVERY EFFICIENCY
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <motion.span
              key={batch.recoveryRate}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`font-black font-mono text-sm ${
                isTargetMet ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {batch.recoveryRate.toFixed(1)}%
            </motion.span>
            <span className="text-[10px] text-zinc-500 font-mono">
              / {targetRate}% tgt
            </span>
          </div>
        </div>
      </div>

      {/* Framer Motion Animated Progress Bar */}
      <div className="pt-2 pb-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Intervention Recovery Progress
          </span>
          <span className="font-mono text-xs font-semibold text-zinc-300">
            {batch.recoveryRate.toFixed(1)}% of cohort recovered
          </span>
        </div>

        <div className="w-full bg-[#1A1A24] h-3 rounded-full overflow-hidden relative p-0.5 border border-[#242432]">
          {/* Target line indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-zinc-500/70 z-10"
            style={{ left: `${targetRate}%` }}
            title={`Target: ${targetRate}%`}
          />

          {/* Framer Motion Spring Animated Fill */}
          <motion.div
            className={`h-full rounded-full relative overflow-hidden ${
              isTargetMet
                ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                : "bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(2, batch.recoveryRate))}%` }}
            transition={{
              type: "spring",
              stiffness: 45,
              damping: 12,
              mass: 0.8,
            }}
          >
            {/* Shimmer sweep effect */}
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Footer Details & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] text-zinc-400 border-t border-[#1C1C24] mt-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1 text-zinc-400">
            <Zap className="w-3 h-3 text-amber-400" />
            <strong className="text-zinc-200">{batch.activeInterventions}</strong> live interventions
          </span>
          <span className="flex items-center gap-1 text-zinc-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <strong className="text-zinc-200">{batch.stoppedByRules}</strong> bounds enforced
          </span>
          <span className="text-zinc-500 font-mono text-[10px]">
            Cohort Ref: {batch.id}
          </span>
        </div>

        {onIntervene && (
          <button
            id={`intervene-batch-${batch.id}`}
            onClick={() => onIntervene(batch.id)}
            disabled={isIntervening || !canIntervene || batch.recoveryRate >= 99}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              batch.recoveryRate >= 99
                ? "bg-[#14141A] text-zinc-600 border border-[#1E1E28] cursor-not-allowed"
                : canIntervene
                ? "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "bg-[#14141A] text-zinc-500 border border-[#1E1E28] cursor-not-allowed"
            }`}
            title={
              !canIntervene
                ? "Intervention requires CFO or Collections Lead role"
                : "Execute AI bounded intervention for this batch"
            }
          >
            <Zap className={`w-3.5 h-3.5 ${isIntervening ? "animate-spin text-emerald-400" : "text-emerald-400"}`} />
            <span>
              {batch.recoveryRate >= 99
                ? "Fully Reconciled"
                : isIntervening
                ? "Executing..."
                : "Run Intervention"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
