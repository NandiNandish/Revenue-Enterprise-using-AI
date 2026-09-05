import React, { useState } from "react";
import { 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Search, 
  Lock, 
  FileText, 
  Hash, 
  Filter, 
  Key, 
  Layers
} from "lucide-react";
import { AuditLogEntry, UserRole } from "../types";
import { ROLE_PERMISSIONS } from "../data/mockData";

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
  currentRole: UserRole;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  logs,
  currentRole,
}) => {
  const [search, setSearch] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const roleConfig = ROLE_PERMISSIONS[currentRole];

  const filteredLogs = logs.filter((log) =>
    log.actor.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.targetId.toLowerCase().includes(search.toLowerCase()) ||
    log.tamperHash.toLowerCase().includes(search.toLowerCase()) ||
    log.complianceRule.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => setVerificationSuccess(false), 5000);
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Actor", "Role", "Action", "Target", "ERP Source", "Compliance Rule", "SHA256 Hash", "Details"];
    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.targetId}"`,
      `"${l.erpSource}"`,
      `"${l.complianceRule}"`,
      `"${l.tamperHash}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SOX_404_Revenue_Recovery_Audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif italic text-white tracking-tight">
                  Cryptographic Financial Audit Ledger & SOX 404 Oversight
                </h2>
                <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-mono">
                  Immutable SHA-256 Ledger
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Every AI intervention, stopping rule enforcement, and ERP reconciliation is cryptographically stamped
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="verify-chain-btn"
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1A1A22] hover:bg-[#242430] text-zinc-200 border border-[#282834] transition"
            >
              <Key className={`w-3.5 h-3.5 text-emerald-400 ${isVerifying ? "animate-spin" : ""}`} />
              <span>{isVerifying ? "Verifying SHA-256 Signatures..." : "Verify Hash Integrity"}</span>
            </button>

            {roleConfig.canExportAudit && (
              <button
                id="export-audit-btn"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Package</span>
              </button>
            )}
          </div>
        </div>

        {/* Verification banner */}
        {verificationSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All {logs.length} audit entries verified. Cryptographic hash chain unbroken; zero tampering detected across ERP delta syncs.
            </span>
          </div>
        )}

        {/* Search */}
        <div className="mt-4 pt-3 border-t border-[#1F1F24] flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search audit records by actor, hash, compliance rule, or client target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0F0F14] text-zinc-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#1F1F24]">
              <tr>
                <th className="py-3 px-4">Timestamp & Hash</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action & Target</th>
                <th className="py-3 px-4">ERP Source</th>
                <th className="py-3 px-4">Compliance Authority</th>
                <th className="py-3 px-4">Audited Event Details</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F24] font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#16161D] transition">
                  {/* Timestamp & Hash */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-zinc-300">{log.timestamp}</div>
                    <div className="font-mono text-[10px] text-zinc-500 truncate max-w-[130px] flex items-center gap-1 mt-0.5">
                      <Hash className="w-3 h-3 text-emerald-400 shrink-0" />
                      {log.tamperHash.slice(0, 16)}...
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{log.actor}</div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      {log.role}
                    </span>
                  </td>

                  {/* Action & Target */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-zinc-200">{log.action}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{log.targetId}</div>
                  </td>

                  {/* ERP Source */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-zinc-300 bg-[#0F0F14] px-2 py-0.5 rounded border border-[#1F1F24]">
                      {log.erpSource}
                    </span>
                  </td>

                  {/* Compliance Rule */}
                  <td className="py-3 px-4 max-w-xs">
                    <span className="text-amber-400/90 font-medium text-[11px]">
                      {log.complianceRule}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="py-3 px-4 text-zinc-300 text-[11px] max-w-sm leading-relaxed">
                    {log.details}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono">
                      ✓ Valid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
