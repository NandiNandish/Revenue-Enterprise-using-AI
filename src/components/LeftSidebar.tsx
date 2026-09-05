import React, { useState } from "react";
import { 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  CalendarClock, 
  Handshake, 
  Database, 
  ShieldCheck, 
  FileText, 
  RefreshCw, 
  SlidersHorizontal, 
  LogOut, 
  UserCheck, 
  Menu, 
  X,
  Lock,
  ChevronDown
} from "lucide-react";
import { UserRole, UserProfile } from "../types";
import { ROLE_PERMISSIONS } from "../data/mockData";

interface LeftSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenCustomization: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  totalAtRisk: number;
  totalRecovered: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  currentUser,
  onLogout,
  onOpenCustomization,
  onTriggerSync,
  isSyncing,
  totalAtRisk,
  totalRecovered,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
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

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 overflow-y-auto">
      {/* Top Brand Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-500/15 text-white font-serif italic text-lg border border-emerald-500/30 shrink-0">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-serif italic font-semibold text-white tracking-tight">
                  Rev-AI Enterprise
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono font-medium uppercase tracking-wider">
                  Autonomous Ops Active
                </span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white bg-[#14141A] border border-[#20202A]"
            aria-label="Close Navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Measured Financial Ticker Widget */}
        <div className="bg-[#121217] border border-[#1E1E26] rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
            <span>Portfolio Ticker</span>
            <span className="text-emerald-400 font-mono">Live ERP</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="bg-[#0A0A0E] p-2 rounded-lg border border-[#1A1A22]">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">
                RECOVERED
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono block truncate">
                ${(totalRecovered / 1000000).toFixed(2)}M
              </span>
            </div>

            <div className="bg-[#0A0A0E] p-2 rounded-lg border border-[#1A1A22]">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">
                AT RISK
              </span>
              <span className="text-xs sm:text-sm font-bold text-rose-400 font-mono block truncate">
                ${(totalAtRisk / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Service Items */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 px-3 pb-1">
            Service Modules
          </div>
          <nav className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`left-nav-tab-${tab.id}`}
                  onClick={() => handleNavClick(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? "bg-emerald-500/15 text-white border border-emerald-500/40 shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-[#14141C] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-mono shrink-0 ml-1.5">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Operational Quick Actions */}
        <div className="space-y-1 pt-2">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 px-3 pb-1">
            Actions & Controls
          </div>

          {/* Sync ERP Button */}
          <button
            id="left-nav-sync-btn"
            onClick={onTriggerSync}
            disabled={isSyncing || !roleConfig.canTriggerERPSync}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
              roleConfig.canTriggerERPSync
                ? "bg-[#14141B] hover:bg-[#1C1C24] text-zinc-200 border-[#22222E] active:scale-98"
                : "bg-[#0E0E12] text-zinc-600 border-[#181820] cursor-not-allowed"
            }`}
            title={roleConfig.canTriggerERPSync ? "Trigger real-time ERP sync" : "Role unauthorized for ERP sync"}
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isSyncing ? "animate-spin text-emerald-400" : "text-zinc-400"}`} />
            <span className="truncate">{isSyncing ? "Syncing ERPs..." : "Trigger ERP Sync"}</span>
          </button>

          {/* Customization Settings Button */}
          <button
            id="left-nav-customize-btn"
            onClick={onOpenCustomization}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-[#14141B] hover:bg-[#1C1C24] text-zinc-200 border border-[#22222E] transition active:scale-98 text-left"
          >
            <SlidersHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="truncate">Preferences & Targets</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Active User, Role Switcher & Logout */}
      <div className="pt-6 border-t border-[#1C1C24] space-y-3 mt-4">
        {/* Role Switcher Dropdown */}
        <div className="bg-[#121217] border border-[#1E1E26] rounded-xl p-2">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1 mb-1 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              RBAC Persona
            </span>
            <span className="text-zinc-500 font-mono">SOX 404</span>
          </div>
          <select
            id="left-nav-role-select"
            aria-label="Switch User Role"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="w-full bg-[#181822] text-zinc-200 text-xs font-semibold py-1.5 px-2 rounded-lg border border-[#262634] focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="CFO">CFO (Executive / Full)</option>
            <option value="COLLECTIONS_LEAD">Collections Lead (Ops)</option>
            <option value="AR_AUDITOR">AR Auditor (SOX / Privacy)</option>
            <option value="SALES_AE">Sales AE (Masked Client View)</option>
          </select>
        </div>

        {/* User Card with Logout Button */}
        <div className="bg-[#121217] border border-[#1E1E26] rounded-2xl p-3 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600/50 to-teal-500/30 text-emerald-300 font-serif font-bold text-xs flex items-center justify-center border border-emerald-500/40 shrink-0">
              {currentUser?.name
                ? currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "EV"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-200 truncate">
                {currentUser?.name || "Elena Vance"}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono truncate">
                {currentUser?.role || currentRole}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            id="user-logout-btn"
            onClick={onLogout}
            title="Sign out of enterprise session"
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Security watermark footer */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1 font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-emerald-400" />
            256-Bit Encrypted
          </span>
          <span>v2026.9</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar with Hamburger Menu */}
      <div className="md:hidden border-b border-[#1E1E26] bg-[#0A0A0E] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center text-white font-serif italic text-base">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif italic font-semibold text-white text-sm">
              Rev-AI Enterprise
            </span>
            <span className="text-[10px] text-emerald-400 font-mono ml-2">
              ● Active
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl text-zinc-300 bg-[#14141B] border border-[#20202A] hover:text-white"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Permanent Left Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 border-r border-[#1E1E26] bg-[#0A0A0E] shrink-0 h-screen sticky top-0 flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#0A0A0E] border-r border-[#1E1E26] h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
