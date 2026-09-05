import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Bot, 
  Send, 
  ShieldAlert, 
  CheckCircle, 
  ArrowUpDown, 
  Eye, 
  AlertTriangle,
  FileCheck,
  Building,
  DollarSign
} from "lucide-react";
import { DiscrepancyItem, ERPSource, DiscrepancyCategory, RecoveryStatus, UserRole } from "../types";
import { ROLE_PERMISSIONS } from "../data/mockData";

interface DiscrepancyWorkspaceProps {
  discrepancies: DiscrepancyItem[];
  currentRole: UserRole;
  onOpenWorkflow: (item: DiscrepancyItem) => void;
  onDiagnoseAI: (item: DiscrepancyItem) => void;
  onEnforceStoppingRule: (item: DiscrepancyItem) => void;
  onMarkRecovered: (item: DiscrepancyItem) => void;
  isDiagnosingId: string | null;
}

export const DiscrepancyWorkspace: React.FC<DiscrepancyWorkspaceProps> = ({
  discrepancies,
  currentRole,
  onOpenWorkflow,
  onDiagnoseAI,
  onEnforceStoppingRule,
  onMarkRecovered,
  isDiagnosingId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedERP, setSelectedERP] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"amount" | "overdue" | "confidence">("amount");
  const [selectedDetailItem, setSelectedDetailItem] = useState<DiscrepancyItem | null>(null);

  const roleConfig = ROLE_PERMISSIONS[currentRole];
  const isMaskedView = currentRole === "SALES_AE";

  // Filtered and sorted discrepancies
  const filteredItems = discrepancies.filter((item) => {
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.failureCode && item.failureCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesERP = selectedERP === "ALL" || item.erpSource === selectedERP;
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;

    return matchesSearch && matchesERP && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "amount") return b.amountAtRisk - a.amountAtRisk;
    if (sortBy === "overdue") return b.daysOverdue - a.daysOverdue;
    if (sortBy === "confidence") return (b.confidenceScore || 0) - (a.confidenceScore || 0);
    return 0;
  });

  const getCategoryLabel = (cat: DiscrepancyCategory) => {
    switch (cat) {
      case "price_book_drift": return "ERP Price Book Drift";
      case "expired_mandate": return "Expired e-Mandate";
      case "po_milestone_desync": return "PO Milestone Desync";
      case "payment_degradation": return "Payment Degradation";
      case "vat_tax_mismatch": return "VAT / Tax Mismatch";
      case "failed_subscription": return "Subscription Return";
      case "checkout_dropoff": return "Checkout Drop-Off";
      default: return cat;
    }
  };

  const getStatusBadge = (status: RecoveryStatus) => {
    switch (status) {
      case "detected":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">Detected</span>;
      case "in_workflow":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">In Workflow</span>;
      case "promise_to_pay":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">Promise-to-Pay</span>;
      case "recovered":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Recovered</span>;
      case "stopped_by_rule":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">Stopped by Rule</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#181820] text-zinc-300 border border-[#252530]">{status}</span>;
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Title & Filter Bar */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-serif italic text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-emerald-400" />
              Billing Discrepancy Resolution Workspace
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Identifies ERP rate mismatches, banking returns, PO expirations, and executes bounded recovery
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Sort by:</span>
            <select
              aria-label="Sort Discrepancies"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0F0F14] border border-[#1F1F24] text-zinc-200 rounded-lg py-1.5 px-3 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="amount">Amount at Risk (Highest)</option>
              <option value="overdue">Days Overdue (Oldest)</option>
              <option value="confidence">AI Confidence Score</option>
            </select>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-[#1F1F24] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search client, invoice, failure code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0F0F14] border border-[#1F1F24] rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* ERP Filter */}
          <div>
            <select
              aria-label="Filter by ERP Connector"
              value={selectedERP}
              onChange={(e) => setSelectedERP(e.target.value)}
              className="w-full py-1.5 px-3 bg-[#0F0F14] border border-[#1F1F24] rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All ERP Systems (5 Connected)</option>
              <option value="SAP S/4HANA">SAP S/4HANA</option>
              <option value="Oracle NetSuite">Oracle NetSuite</option>
              <option value="Stripe Billing">Stripe Billing</option>
              <option value="Dynamics 365">Dynamics 365</option>
              <option value="Workday Financials">Workday Financials</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              aria-label="Filter by Discrepancy Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-3 bg-[#0F0F14] border border-[#1F1F24] rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Discrepancy Root Causes</option>
              <option value="price_book_drift">ERP Price Book Drift</option>
              <option value="expired_mandate">Expired e-Mandates</option>
              <option value="po_milestone_desync">PO Milestone Desync</option>
              <option value="payment_degradation">Payment Degradation</option>
              <option value="vat_tax_mismatch">VAT / Tax Mismatches</option>
              <option value="failed_subscription">Failed Subscriptions</option>
              <option value="checkout_dropoff">Checkout Drop-Offs</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              aria-label="Filter by Recovery Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-3 bg-[#0F0F14] border border-[#1F1F24] rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Recovery Stages</option>
              <option value="detected">Detected (Unacted)</option>
              <option value="in_workflow">In Bounded Workflow</option>
              <option value="promise_to_pay">Promise-to-Pay Scheduled</option>
              <option value="recovered">Recovered (Settled)</option>
              <option value="stopped_by_rule">Stopped by Compliance Rule</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0F0F14] text-zinc-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#1F1F24]">
              <tr>
                <th className="py-3.5 px-4">Invoice & Client</th>
                <th className="py-3.5 px-4">ERP Source</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Amount at Risk</th>
                <th className="py-3.5 px-4">Overdue</th>
                <th className="py-3.5 px-4">AI Diagnosis & Stopping Rule</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F24]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 text-xs">
                    No billing discrepancies found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isDiagnosing = isDiagnosingId === item.id;
                  const maskedInvoice = isMaskedView ? `INV-****-${item.invoiceId.slice(-4)}` : item.invoiceId;
                  const maskedEmail = isMaskedView ? `***@${item.contactEmail.split("@")[1] || "client.com"}` : item.contactEmail;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#16161D] transition group"
                    >
                      {/* Invoice & Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-400">
                          {maskedInvoice}
                        </div>
                        <div className="font-semibold text-white mt-0.5">
                          {item.clientName}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {item.clientTier} • {maskedEmail}
                        </div>
                      </td>

                      {/* ERP Source */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-[#0F0F14] px-2 py-0.5 rounded border border-[#1F1F24] text-zinc-300">
                          <Building className="w-3 h-3 text-zinc-500" />
                          {item.erpSource}
                        </span>
                        {item.failureCode && (
                          <div className="text-[10px] text-zinc-500 font-mono mt-1 truncate max-w-[140px]" title={item.failureCode}>
                            {item.failureCode}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-zinc-200">
                          {getCategoryLabel(item.category)}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-black text-rose-400 text-sm">
                          ${item.amountAtRisk.toLocaleString()}
                        </div>
                        {item.recoveredAmount && item.recoveredAmount > 0 ? (
                          <div className="text-[10px] text-emerald-400 font-medium">
                            Rec: ${item.recoveredAmount.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-[10px] text-zinc-500">
                            Exp: ${item.expectedAmount.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Overdue */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-semibold ${
                            item.daysOverdue > 30 ? "text-rose-400" : "text-amber-400"
                          }`}
                        >
                          {item.daysOverdue}d
                        </span>
                        <div className="text-[10px] text-zinc-500">
                          {item.detectedAt.split(" ")[0]}
                        </div>
                      </td>

                      {/* AI Diagnosis & Stopping Rule */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {item.rootCauseDiagnosis ? (
                          <div>
                            <div className="text-[11px] text-zinc-300 line-clamp-2" title={item.rootCauseDiagnosis}>
                              {item.rootCauseDiagnosis}
                            </div>
                            {item.stoppingRule && (
                              <div className="text-[10px] text-amber-400/90 font-medium mt-1 truncate" title={item.stoppingRule}>
                                🛑 {item.stoppingRule}
                              </div>
                            )}
                            {item.confidenceScore && (
                              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                                AI Confidence: {item.confidenceScore}%
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-[11px] italic">
                            Awaiting root cause scan
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* AI Diagnose button */}
                          <button
                            id={`diagnose-btn-${item.id}`}
                            onClick={() => onDiagnoseAI(item)}
                            disabled={isDiagnosing}
                            title="Trigger Gemini AI Root Cause Diagnosis"
                            className="p-1.5 rounded-lg bg-[#181820] hover:bg-[#22222C] text-emerald-400 hover:text-emerald-300 border border-[#252530] transition"
                          >
                            <Bot className={`w-3.5 h-3.5 ${isDiagnosing ? "animate-spin text-emerald-300" : ""}`} />
                          </button>

                          {/* Bounded Workflow button */}
                          <button
                            id={`workflow-btn-${item.id}`}
                            onClick={() => onOpenWorkflow(item)}
                            title="Execute Bounded Multi-Channel Follow-up"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition"
                          >
                            <Send className="w-3 h-3" />
                            <span>Intervene</span>
                          </button>

                          {/* Stopping Rule Enforce button */}
                          {roleConfig.canEditRules && item.status !== "stopped_by_rule" && (
                            <button
                              id={`stopping-btn-${item.id}`}
                              onClick={() => onEnforceStoppingRule(item)}
                              title="Enforce Compliance Stopping Rule / Freeze Escalation"
                              className="p-1.5 rounded-lg bg-[#181820] hover:bg-amber-950/60 text-amber-400 hover:text-amber-300 border border-[#252530] hover:border-amber-700 transition"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Mark Recovered button */}
                          {roleConfig.canApproveSettlement && item.status !== "recovered" && (
                            <button
                              id={`mark-rec-btn-${item.id}`}
                              onClick={() => onMarkRecovered(item)}
                              title="Mark as Settled / Reconciled in ERP"
                              className="p-1.5 rounded-lg bg-[#181820] hover:bg-emerald-950/60 text-emerald-400 hover:text-emerald-300 border border-[#252530] hover:border-emerald-700 transition"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
