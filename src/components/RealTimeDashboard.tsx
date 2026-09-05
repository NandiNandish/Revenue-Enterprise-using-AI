import React from "react";
import { 
  TrendingUp, 
  DollarSign, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowUpRight, 
  Layers, 
  CalendarClock, 
  Zap, 
  ArrowRight,
  Filter,
  BarChart3,
  Bot
} from "lucide-react";
import { DiscrepancyItem, RecoveryBatch, DashboardPreferences, UserRole } from "../types";
import { RecoveryBatchCard } from "./RecoveryBatchCard";

interface RealTimeDashboardProps {
  discrepancies: DiscrepancyItem[];
  batches: RecoveryBatch[];
  preferences: DashboardPreferences;
  currentRole: UserRole;
  onSelectDiscrepancy: (item: DiscrepancyItem) => void;
  onNavigateTab: (tab: string) => void;
  onSimulateBatchRecovery: () => void;
  isSimulating: boolean;
  onInterveneBatch?: (batchId: string) => void;
  interveningBatchId?: string | null;
}

export const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({
  discrepancies,
  batches,
  preferences,
  currentRole,
  onSelectDiscrepancy,
  onNavigateTab,
  onSimulateBatchRecovery,
  isSimulating,
  onInterveneBatch,
  interveningBatchId,
}) => {
  // Compute aggregated numbers
  const totalMeasuredRecovered = batches.reduce((acc, b) => acc + b.totalRecovered, 0);
  const totalBatchAtRisk = batches.reduce((acc, b) => acc + b.totalAtRisk, 0);
  const overallBatchRecoveryRate = totalBatchAtRisk > 0 ? (totalMeasuredRecovered / totalBatchAtRisk) * 100 : 0;

  const currentActiveAtRisk = discrepancies
    .filter((d) => d.status !== "recovered")
    .reduce((acc, d) => acc + d.amountAtRisk, 0);

  const currentActiveRecovered = discrepancies
    .filter((d) => d.status === "recovered" || (d.recoveredAmount && d.recoveredAmount > 0))
    .reduce((acc, d) => acc + (d.recoveredAmount || 0), 0);

  // Group by category for Root Cause Analysis
  const rootCauseGroups = React.useMemo(() => {
    const map: Record<string, { label: string; atRisk: number; recovered: number; count: number }> = {
      price_book_drift: { label: "ERP Price Book Drift", atRisk: 0, recovered: 0, count: 0 },
      expired_mandate: { label: "Expired Mandates & e-Tokens", atRisk: 0, recovered: 0, count: 0 },
      po_milestone_desync: { label: "PO Cap & Milestone Desync", atRisk: 0, recovered: 0, count: 0 },
      payment_degradation: { label: "Gateway Soft-Declines", atRisk: 0, recovered: 0, count: 0 },
      vat_tax_mismatch: { label: "VAT & Tax Recalibration", atRisk: 0, recovered: 0, count: 0 },
      failed_subscription: { label: "Subscription Renewal Returns", atRisk: 0, recovered: 0, count: 0 },
      checkout_dropoff: { label: "Checkout Drop-Off Recovery", atRisk: 0, recovered: 0, count: 0 },
    };

    discrepancies.forEach((d) => {
      if (map[d.category]) {
        map[d.category].atRisk += d.amountAtRisk;
        map[d.category].recovered += d.recoveredAmount || 0;
        map[d.category].count += 1;
      }
    });

    return Object.entries(map).map(([key, val]) => ({
      key,
      ...val,
      recoveryRate: val.atRisk > 0 ? Math.min(100, Math.round((val.recovered / val.atRisk) * 100)) : 0,
    }));
  }, [discrepancies]);

  const targetRate = preferences.targetRecoveryRate;
  const isTargetMet = overallBatchRecoveryRate >= targetRate;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome / Mission Bar */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 font-mono">
                <Bot className="w-3 h-3 text-emerald-400" />
                Autonomous Engine
              </span>
              <span className="text-xs text-zinc-400">
                Monitoring 5 ERP Connectors: SAP • NetSuite • Stripe • Dynamics • Workday
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tight">
              Enterprise Revenue Recovery & Oversight
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Closed-loop detection, root cause diagnosis, and bounded interventions recovering slipping revenue across payment failures, checkout drop-offs, and overdue enterprise receivables.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              id="simulate-batch-btn"
              onClick={onSimulateBatchRecovery}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95 transition disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
              <span>{isSimulating ? "Reconciling Batches..." : "Execute Batch Interventions"}</span>
            </button>
            <button
              id="goto-discrepancies-btn"
              onClick={() => onNavigateTab("discrepancies")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1A1A22] hover:bg-[#242430] text-zinc-200 border border-[#282834] transition"
            >
              <span>View Discrepancies</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {preferences.visibleWidgets.kpiCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Measured Money Recovered */}
          <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-5 shadow-sm relative group hover:border-[#2F2F3A] transition">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Measured Recovered
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white font-serif tracking-tight">
                ${totalMeasuredRecovered.toLocaleString()}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
                <TrendingUp className="w-3 h-3" />
                +$245,000 this week
              </span>
              <span className="text-zinc-500 font-mono">
                {batches.length} audited cohorts
              </span>
            </div>
            <div className="w-full bg-[#1C1C24] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, overallBatchRecoveryRate)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Active Revenue at Risk */}
          <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-5 shadow-sm hover:border-[#2F2F3A] transition">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Revenue At Risk
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white font-serif tracking-tight">
                ${currentActiveAtRisk.toLocaleString()}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-rose-400 font-medium font-mono">
                {discrepancies.filter((d) => d.status !== "recovered").length} active cases
              </span>
              <span className="text-zinc-500">
                Threshold: &gt;${(preferences.largeDiscrepancyThreshold / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="w-full bg-[#1C1C24] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-rose-500/70 h-full rounded-full"
                style={{ width: "35%" }}
              />
            </div>
          </div>

          {/* Card 3: Recovery Efficiency vs Target */}
          <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-5 shadow-sm hover:border-[#2F2F3A] transition">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Recovery Efficiency
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white font-serif tracking-tight">
                {overallBatchRecoveryRate.toFixed(1)}%
              </span>
              <span className="text-xs text-zinc-500 font-mono">/ Target {targetRate}%</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span
                className={`font-medium flex items-center gap-1 ${
                  isTargetMet ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {isTargetMet ? "✓ Benchmark Exceeded" : "▲ Calibration in Progress"}
              </span>
              <span className="text-zinc-500">Closed-loop</span>
            </div>
            <div className="w-full bg-[#1C1C24] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isTargetMet ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, overallBatchRecoveryRate)}%` }}
              />
            </div>
          </div>

          {/* Card 4: Financial Impact & Fines Avoided */}
          <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-5 shadow-sm hover:border-[#2F2F3A] transition">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Operational Impact
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white font-serif tracking-tight">
                -8.4 Days
              </span>
              <span className="text-xs text-emerald-400 font-medium">DSO</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium">
                $112,000 Fines Avoided
              </span>
              <span className="text-zinc-500">Card & BACS Rules</span>
            </div>
            <div className="w-full bg-[#1C1C24] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500/80 h-full rounded-full w-[82%]" />
            </div>
          </div>
        </div>
      )}

      {/* Grid Section: Measured Batch Performance & Root Cause Leakage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7/12): Measured Money Recovered Across Batches */}
        {preferences.visibleWidgets.batchTracker && (
          <div className="lg:col-span-7 bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic text-white tracking-tight">
                      Measured Money Recovered Across Batches
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Audit-verified financial reconciliation per ERP billing cohort
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                  Total: ${(totalMeasuredRecovered / 1000000).toFixed(2)}M
                </span>
              </div>

              {/* Batches Table / Cards */}
              <div className="space-y-3">
                {batches.map((batch) => (
                  <RecoveryBatchCard
                    key={batch.id}
                    batch={batch}
                    targetRate={targetRate}
                    currentRole={currentRole}
                    onIntervene={onInterveneBatch}
                    isIntervening={isSimulating || interveningBatchId === batch.id}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#1F1F24] flex items-center justify-between text-xs text-zinc-400">
              <span>Audited under SOX 404 & IFRS 15 revenue recognition principles</span>
              <button
                onClick={() => onNavigateTab("reports")}
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
              >
                Generate Monthly Reconciled Report <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Right Col (5/12): Root Cause Leakage Breakdown */}
        {preferences.visibleWidgets.leakageWaterfall && (
          <div className="lg:col-span-5 bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic text-white tracking-tight">
                      Revenue Leakage by Root Cause
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Why revenue slipped & recovery efficiency
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-400 bg-[#181820] border border-[#262630] px-2 py-0.5 rounded">
                  7 Categories
                </span>
              </div>

              {/* Categorized root causes */}
              <div className="space-y-3.5">
                {rootCauseGroups.map((rc) => (
                  <div key={rc.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-300 truncate max-w-[200px]">
                        {rc.label}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-zinc-500">${(rc.atRisk / 1000).toFixed(0)}k at risk</span>
                        <span className="font-bold text-emerald-400">{rc.recoveryRate}% rec.</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#1C1C24] h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full rounded-l-full"
                        style={{ width: `${rc.recoveryRate}%` }}
                      />
                      <div
                        className="bg-rose-500/30 h-full"
                        style={{ width: `${100 - rc.recoveryRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#1F1F24] bg-[#0F0F14] border border-[#1C1C22] rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-200">Mandate Retry Sequencer</span>
                <button
                  onClick={() => onNavigateTab("sequencer")}
                  className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition"
                >
                  Configure Retries <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                AI predicts bank liquidity sweeps to schedule retries without incurring card scheme excessive retry fees ($15/charge).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Live Discrepancies Quick Action Feed */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-serif italic text-white tracking-tight flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              High-Risk Discrepancy Queue Awaiting Resolution
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identified discrepancies across ERP price books, mandates, and PO milestones
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("discrepancies")}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            Open Full Discrepancy Workspace ({discrepancies.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {discrepancies.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDiscrepancy(item)}
              className="p-4 rounded-xl bg-[#0F0F14] border border-[#1C1C22] hover:border-emerald-500/40 cursor-pointer transition group relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400">{item.invoiceId}</span>
                <span className="text-[10px] bg-[#181820] text-zinc-300 px-2 py-0.5 rounded font-mono border border-[#262630]">
                  {item.erpSource}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                {item.clientName}
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                {item.rootCauseDiagnosis || "Analyzing catalog drift & banking rails..."}
              </p>
              <div className="mt-3.5 pt-2.5 border-t border-[#1F1F24] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">AT RISK</span>
                  <span className="font-bold text-rose-400 font-mono">
                    ${item.amountAtRisk.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">OVERDUE</span>
                  <span className="font-semibold text-zinc-300 font-mono">{item.daysOverdue} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
