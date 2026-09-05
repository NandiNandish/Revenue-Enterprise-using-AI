import React from "react";
import { 
  ShieldCheck, 
  RefreshCw, 
  SlidersHorizontal, 
  DollarSign, 
  Activity, 
  FileText, 
  Layers, 
  Database, 
  CalendarClock, 
  Handshake, 
  AlertTriangle,
  UserCheck
} from "lucide-react";
import { UserRole } from "../types";
import { ROLE_PERMISSIONS } from "../data/mockData";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenCustomization: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  totalAtRisk: number;
  totalRecovered: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  onOpenCustomization,
  onTriggerSync,
  isSyncing,
  totalAtRisk,
  totalRecovered,
}) => {
  const roleConfig = ROLE_PERMISSIONS[currentRole];

  const navTabs = [
    { id: "dashboard", label: "Recovery Hub", icon: Activity },
    { id: "discrepancies", label: "Billing Discrepancies", icon: AlertTriangle, badge: "8 at risk" },
    { id: "sequencer", label: "Mandate Sequencer", icon: CalendarClock },
    { id: "promise", label: "Promise-to-Pay", icon: Handshake },
    { id: "erp", label: "ERP Integration & APIs", icon: Database },
    { id: "audit", label: "Financial Audit Trail", icon: ShieldCheck },
    { id: "reports", label: "Monthly Reports", icon: FileText },
  ];

  return (
    <header className="border-b border-[#1F1F24] bg-[#0A0A0B]/90 backdrop-blur sticky top-0 z-40">
      {/* Top Banner / Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-[#1F1F24] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-500/10 text-white font-serif italic text-lg border border-emerald-500/30">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                  Autonomous Ops
                </span>
                <h1 className="text-lg font-serif italic font-semibold text-white tracking-tight">
                  Rev-AI Enterprise
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/50 px-2 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ERP Autonomous Agent Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                AI revenue recovery identifying billing discrepancies & executing bounded payment follow-ups
              </p>
            </div>
          </div>

          {/* Right Controls: RBAC Switcher, ERP Sync, Customization */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Measured Quick Ticker */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#121217] border border-[#1F1F24] text-xs">
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-semibold">RECOVERED</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ${totalRecovered.toLocaleString()}
                </span>
              </div>
              <div className="h-6 w-px bg-[#1F1F24]" />
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-semibold">AT RISK</span>
                <span className="font-bold text-rose-400 font-mono">
                  ${totalAtRisk.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Role-Based Access Control (RBAC) Selector */}
            <div className="flex items-center gap-1.5 bg-[#121217] border border-[#1F1F24] rounded-xl p-1">
              <div className="flex items-center gap-1 px-2 text-zinc-400 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] font-medium text-zinc-300">Role:</span>
              </div>
              <select
                id="rbac-role-select"
                aria-label="Select User Role"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-[#18181F] text-zinc-200 text-xs font-semibold py-1 px-2.5 rounded-lg border border-[#282830] focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="CFO">CFO (Executive / Full)</option>
                <option value="COLLECTIONS_LEAD">Collections Lead (Ops)</option>
                <option value="AR_AUDITOR">AR Auditor (SOX / Privacy)</option>
                <option value="SALES_AE">Sales AE (Masked Client View)</option>
              </select>
            </div>

            {/* Trigger Sync Button */}
            <button
              id="header-sync-btn"
              onClick={onTriggerSync}
              disabled={isSyncing || !roleConfig.canTriggerERPSync}
              title={roleConfig.canTriggerERPSync ? "Trigger real-time ERP sync" : "Role not authorized to trigger ERP sync"}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
                roleConfig.canTriggerERPSync
                  ? "bg-[#18181F] hover:bg-[#202028] text-zinc-200 border-[#25252E] active:scale-95 shadow-sm"
                  : "bg-[#121217] text-zinc-600 border-[#1F1F24] cursor-not-allowed"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-400" : "text-zinc-400"}`} />
              <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync ERP"}</span>
            </button>

            {/* Dashboard Customization Modal Trigger */}
            <button
              id="header-customize-btn"
              onClick={onOpenCustomization}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl bg-[#18181F] hover:bg-[#202028] text-zinc-200 border border-[#25252E] transition shadow-sm"
              title="Customize dashboard widgets, targets & thresholds"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#18181F] text-white border border-emerald-500/40 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#14141A] border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Notice & Masking Alert Banner if Sales AE */}
      {currentRole === "SALES_AE" && (
        <div className="bg-amber-950/25 border-t border-amber-900/40 px-4 py-1 text-[11px] text-amber-300 text-center flex items-center justify-center gap-2">
          <span>🔒 Sales AE Mode Active: Customer bank account & sensitive tax identifiers are automatically masked per departmental privacy rules.</span>
        </div>
      )}
      {currentRole === "AR_AUDITOR" && (
        <div className="bg-[#121217] border-t border-[#1F1F24] px-4 py-1 text-[11px] text-zinc-300 text-center flex items-center justify-center gap-2">
          <span className="text-emerald-400 font-mono text-xs">🛡️</span>
          <span>AR Auditor Mode: Read-only ledger verification, SOX 404 compliance stamps, and cryptographic hash verification active.</span>
        </div>
      )}
    </header>
  );
};
