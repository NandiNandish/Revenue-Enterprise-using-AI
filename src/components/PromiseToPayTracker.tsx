import React, { useState } from "react";
import { 
  Handshake, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  ShieldCheck, 
  DollarSign, 
  Calendar,
  Building,
  UserCheck
} from "lucide-react";
import { PromiseToPayRecord, UserRole } from "../types";
import { INITIAL_PROMISES_TO_PAY, ROLE_PERMISSIONS } from "../data/mockData";

interface PromiseToPayTrackerProps {
  currentRole: UserRole;
  onLogAudit: (action: string, targetId: string, details: string) => void;
}

export const PromiseToPayTracker: React.FC<PromiseToPayTrackerProps> = ({
  currentRole,
  onLogAudit,
}) => {
  const [commitments, setCommitments] = useState<PromiseToPayRecord[]>(INITIAL_PROMISES_TO_PAY);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newInvoice, setNewInvoice] = useState("");
  const [newAmount, setNewAmount] = useState<number>(50000);
  const [newInstallmentCount, setNewInstallmentCount] = useState<number>(2);

  const roleConfig = ROLE_PERMISSIONS[currentRole];

  const totalCommitted = commitments.reduce((acc, c) => acc + c.totalAgreed, 0);
  const totalCollectedFromP2P = commitments.reduce((acc, c) => {
    const paidInstallments = c.installments.filter((i) => i.status === "paid");
    return acc + paidInstallments.reduce((sum, i) => sum + i.amount, 0);
  }, 0);

  const handleMarkPaid = (recordId: string, installmentNumber: number) => {
    let collectedAmount = 0;
    let clientName = "";
    setCommitments((prev) =>
      prev.map((c) => {
        if (c.id === recordId) {
          clientName = c.clientName;
          const updatedInstallments = c.installments.map((inst) => {
            if (inst.installmentNumber === installmentNumber) {
              collectedAmount = inst.amount;
              return { ...inst, status: "paid" as const };
            }
            return inst;
          });
          return { ...c, installments: updatedInstallments };
        }
        return c;
      })
    );

    onLogAudit(
      "PROMISE_TO_PAY_INSTALLMENT_SETTLED",
      `${recordId} (${clientName})`,
      `Installment #${installmentNumber} ($${collectedAmount.toLocaleString()}) settled and reconciled in ERP general ledger.`
    );
  };

  const handleCreatePromise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient || !newInvoice) return;

    const installmentAmount = Math.round(newAmount / newInstallmentCount);
    const installments = Array.from({ length: newInstallmentCount }, (_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() + (idx + 1) * 14);
      return {
        installmentNumber: idx + 1,
        amount: installmentAmount,
        dueDate: d.toISOString().split("T")[0],
        status: "pending" as const,
      };
    });

    const newRecord: PromiseToPayRecord = {
      id: `P2P-${Date.now().toString().slice(-3)}`,
      discrepancyId: `DISC-AUTO`,
      invoiceId: newInvoice,
      clientName: newClient,
      totalAgreed: newAmount,
      installments,
      commitmentDate: new Date().toISOString().split("T")[0],
      cfoApprovalStatus: "auto_bounded",
      riskScore: "low",
      notes: "Negotiated via AI Revenue Recovery workflow. Bound by standard 14-day cadence.",
    };

    setCommitments([newRecord, ...commitments]);
    setIsAddingNew(false);
    setNewClient("");
    setNewInvoice("");
    onLogAudit(
      "PROMISE_TO_PAY_REGISTERED",
      `${newRecord.id} (${newRecord.clientName})`,
      `Created promise-to-pay agreement for $${newAmount.toLocaleString()} across ${newInstallmentCount} installments.`
    );
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Promise-to-Pay Commitment Tracker
                </h2>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-mono">
                  Autonomous Adherence Monitoring
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured installment agreements, milestone commitments, and breach escalation rules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 block text-[10px]">TOTAL COMMITTED</span>
              <span className="font-bold text-white font-mono">
                ${totalCommitted.toLocaleString()}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 block text-[10px]">RECONCILED TO DATE</span>
              <span className="font-bold text-emerald-400 font-mono">
                ${totalCollectedFromP2P.toLocaleString()}
              </span>
            </div>

            {roleConfig.canApproveSettlement && (
              <button
                id="add-p2p-btn"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Log Agreement</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal / Add form */}
        {isAddingNew && (
          <form
            onSubmit={handleCreatePromise}
            className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 animate-in fade-in"
          >
            <div className="font-bold text-slate-200">Log New Promise-to-Pay Agreement</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Health Corp"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Invoice ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INV-2026-9912"
                  value={newInvoice}
                  onChange={(e) => setNewInvoice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Agreed Total ($)</label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Installment Count</label>
                <select
                  aria-label="Installment Count"
                  value={newInstallmentCount}
                  onChange={(e) => setNewInstallmentCount(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200"
                >
                  <option value={1}>Single Final Wire (14 days)</option>
                  <option value={2}>2 Installments (50% / 50%)</option>
                  <option value={3}>3 Installments (33% / 33% / 34%)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              >
                Save & Enforce Tracking
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Commitments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commitments.map((record) => {
          const totalPaid = record.installments
            .filter((i) => i.status === "paid")
            .reduce((sum, i) => sum + i.amount, 0);
          const percentPaid = Math.round((totalPaid / record.totalAgreed) * 100);

          return (
            <div
              key={record.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-purple-400">
                    {record.id}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      record.riskScore === "low"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}
                  >
                    Risk: {record.riskScore}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">
                  {record.clientName}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Ref: {record.invoiceId} • Committed: {record.commitmentDate}
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-mono">${totalPaid.toLocaleString()} paid</span>
                    <span className="font-bold text-white font-mono">
                      ${record.totalAgreed.toLocaleString()} ({percentPaid}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentPaid}%` }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <p className="text-[11px] text-slate-400 mt-2.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  {record.notes}
                </p>

                {/* Installments Breakdown */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Installment Milestones
                  </span>
                  {record.installments.map((inst) => (
                    <div
                      key={inst.installmentNumber}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {inst.status === "paid" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span className="text-slate-300 font-medium">
                          Part {inst.installmentNumber} • Due {inst.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          ${inst.amount.toLocaleString()}
                        </span>
                        {inst.status !== "paid" && roleConfig.canApproveSettlement && (
                          <button
                            onClick={() => handleMarkPaid(record.id, inst.installmentNumber)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 font-semibold"
                          >
                            Mark Settled
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-cyan-400" />
                  Status: {record.cfoApprovalStatus}
                </span>
                <span>Auto-reminder active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
