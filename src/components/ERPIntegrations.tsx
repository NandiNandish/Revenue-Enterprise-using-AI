import React, { useState } from "react";
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Key, 
  Activity, 
  ArrowRight,
  Code2,
  Lock,
  Zap
} from "lucide-react";
import { ERPConnector, UserRole } from "../types";
import { INITIAL_ERP_CONNECTORS, ROLE_PERMISSIONS } from "../data/mockData";

interface ERPIntegrationsProps {
  currentRole: UserRole;
  onLogAudit: (action: string, targetId: string, details: string) => void;
}

export const ERPIntegrations: React.FC<ERPIntegrationsProps> = ({
  currentRole,
  onLogAudit,
}) => {
  const [connectors, setConnectors] = useState<ERPConnector[]>(INITIAL_ERP_CONNECTORS);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [inspectConnector, setInspectConnector] = useState<ERPConnector | null>(null);

  const roleConfig = ROLE_PERMISSIONS[currentRole];

  const handleTriggerSync = (connector: ERPConnector) => {
    setSyncingId(connector.id);
    setTimeout(() => {
      setConnectors((prev) =>
        prev.map((c) =>
          c.id === connector.id
            ? {
                ...c,
                lastSyncTimestamp: "Just now (Synced)",
                syncedRecordsCount: c.syncedRecordsCount + 42,
              }
            : c
        )
      );
      setSyncingId(null);
      onLogAudit(
        "ERP_SYNC_MANUAL_TRIGGER",
        `${connector.name} (${connector.systemCode})`,
        `Bi-directional sync completed via ${connector.apiVersion}. Verified 42 new journal entries.`
      );
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif italic text-white tracking-tight">
                  Seamless ERP Connectors & Secure API Synchronization
                </h2>
                <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-mono">
                  mTLS 1.3 Encrypted
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Bi-directional synchronization between ERP general ledgers, price catalogs, and payment rails
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 bg-[#0F0F14] px-3 py-1.5 rounded-xl border border-[#1F1F24]">
              5 of 5 Connectors Healthy
            </span>
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((connector) => {
          const isSyncing = syncingId === connector.id;

          return (
            <div
              key={connector.id}
              className="bg-[#121217] border border-[#1F1F24] rounded-2xl p-5 shadow-sm hover:border-[#2A2A35] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0F0F14] border border-[#1F1F24] flex items-center justify-center text-emerald-400 font-bold text-xs">
                      {connector.name.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{connector.name}</h3>
                      <span className="text-[10px] font-mono text-zinc-400 block">
                        {connector.systemCode}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>

                <div className="space-y-2.5 text-xs pt-3 border-t border-[#1F1F24]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">API Standard:</span>
                    <span className="font-mono text-zinc-300 font-medium">{connector.apiVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Authentication:</span>
                    <span className="font-mono text-emerald-400 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {connector.authType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Webhook Latency:</span>
                    <span className="font-mono text-emerald-400 font-medium">
                      {connector.webhookLatencyMs} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Synced Journal Records:</span>
                    <span className="font-mono text-white font-bold">
                      {connector.syncedRecordsCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Last Synced:</span>
                    <span className="font-mono text-zinc-400">{connector.lastSyncTimestamp}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#1F1F24] flex items-center justify-between">
                <button
                  onClick={() => setInspectConnector(connector)}
                  className="text-xs text-zinc-400 hover:text-emerald-300 flex items-center gap-1 transition"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect Payload</span>
                </button>

                <button
                  onClick={() => handleTriggerSync(connector)}
                  disabled={isSyncing || !roleConfig.canTriggerERPSync}
                  title={roleConfig.canTriggerERPSync ? "Trigger real-time sync" : "Role not authorized"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    roleConfig.canTriggerERPSync
                      ? "bg-[#1A1A22] hover:bg-[#242430] text-zinc-200 border border-[#282834] active:scale-95"
                      : "bg-[#0F0F14] text-zinc-600 border border-[#1A1A20] cursor-not-allowed"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-400" : ""}`} />
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payload Inspector Modal */}
      {inspectConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-serif italic text-white">
                  API Sync Schema & Hash Signature • {inspectConnector.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectConnector(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Verified payload exchange structure ensuring tamper-evident data transfer between ERP general ledger and AI revenue recovery agent.
            </p>

            <pre className="p-4 rounded-xl bg-[#0F0F14] border border-[#1F1F24] text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-64 scrollbar-thin">
{`{
  "system": "${inspectConnector.systemCode}",
  "apiVersion": "${inspectConnector.apiVersion}",
  "authProtocol": "${inspectConnector.authType}",
  "syncTimestamp": "${new Date().toISOString()}",
  "integrityVerification": {
    "hashAlgorithm": "SHA-256",
    "signature": "e4f8a92b7c6109e33451b0f1a92e104d49a71b29a1b411d9a044e1f89c",
    "soxComplianceStatus": "VERIFIED_AUDITED"
  },
  "endpoints": {
    "invoiceSync": "/api/v4/financials/invoices/delta",
    "paymentWebhooks": "/api/v4/webhooks/reconciliation",
    "mandateHealth": "/api/v4/mandates/status"
  }
}`}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectConnector(null)}
                className="px-4 py-2 rounded-xl bg-[#1A1A22] hover:bg-[#242430] text-xs font-semibold text-white border border-[#282834]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
