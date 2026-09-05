import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  DollarSign, 
  ShieldCheck, 
  Lock, 
  Key, 
  UserCheck, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { DEFAULT_USER_PROFILES, ROLE_PERMISSIONS } from "../data/mockData";

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<"personas" | "credentials">("personas");
  const [emailInput, setEmailInput] = useState<string>("elena.vance@revai-corp.com");
  const [passwordInput, setPasswordInput] = useState<string>("••••••••••••");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("CFO");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authStepMessage, setAuthStepMessage] = useState<string>("");

  const handleSelectPersona = (profile: UserProfile) => {
    setIsAuthenticating(true);
    setAuthStepMessage(`Authenticating ${profile.name} via ${profile.authProvider}...`);
    
    setTimeout(() => {
      setAuthStepMessage("Validating SOX 404 security tokens & ERP role policies...");
    }, 600);

    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin(profile);
    }, 1200);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthStepMessage("Verifying enterprise credentials with directory service...");

    setTimeout(() => {
      setAuthStepMessage("Establishing encrypted mTLS connection to SAP & Stripe...");
    }, 700);

    setTimeout(() => {
      // Find matching default profile or construct custom user
      const existing = DEFAULT_USER_PROFILES.find(
        (p) => p.email.toLowerCase() === emailInput.toLowerCase() || p.role === selectedRole
      );
      const user: UserProfile = existing || {
        id: `usr-custom-${Date.now().toString().slice(-4)}`,
        name: emailInput.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        email: emailInput,
        role: selectedRole,
        department: ROLE_PERMISSIONS[selectedRole].department,
        lastLogin: "Just now",
        authProvider: "Enterprise Credentials",
      };
      setIsAuthenticating(false);
      onLogin(user);
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-200 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-6 sm:px-12 flex items-center justify-between border-b border-[#1A1A22] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-serif italic text-lg border border-emerald-500/30">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-serif italic font-semibold text-white tracking-tight">
                Rev-AI Enterprise
              </span>
              <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono uppercase">
                SOX 404
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Autonomous Revenue Recovery & Reconciliation
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121218] border border-[#20202C]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit TLS 1.3 Active</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121218] border border-[#20202C]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOC-2 Type II Certified</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="max-w-4xl w-full bg-[#0F0F14] border border-[#1F1F28] rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80 space-y-8">
          
          {/* Header Title Section */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-xs font-mono text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Secure Enterprise Gateway
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
              Sign In to Rev-AI Enterprise
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Select an authorized executive persona or provide corporate directory credentials to access live revenue recovery workflows.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center">
            <div className="bg-[#15151D] border border-[#22222E] p-1 rounded-xl flex items-center gap-1 max-w-sm w-full">
              <button
                type="button"
                onClick={() => setAuthMode("personas")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  authMode === "personas"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                1-Click Enterprise Roles
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("credentials")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  authMode === "credentials"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Corporate SSO / Password
              </button>
            </div>
          </div>

          {/* Authenticating Loading Overlay */}
          {isAuthenticating ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                <ShieldCheck className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif italic text-white">
                  Establishing Verified Session...
                </h3>
                <p className="text-xs font-mono text-emerald-400">
                  {authStepMessage}
                </p>
              </div>
            </div>
          ) : authMode === "personas" ? (
            /* Mode 1: 1-Click Authorized Personas */
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Select an executive or operational role to evaluate permissions:</span>
                <span className="font-mono text-[11px] text-zinc-500">4 Active Personas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFAULT_USER_PROFILES.map((profile) => {
                  const perm = ROLE_PERMISSIONS[profile.role];
                  return (
                    <div
                      key={profile.id}
                      onClick={() => handleSelectPersona(profile)}
                      className="p-4 sm:p-5 rounded-2xl bg-[#14141B] border border-[#20202A] hover:border-emerald-500/50 hover:bg-[#181822] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600/40 to-teal-500/20 text-emerald-300 font-serif font-bold text-sm flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition">
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 transition">
                                {profile.name}
                              </h3>
                              <span className="text-[10px] bg-[#1C1C26] text-zinc-300 font-mono px-2 py-0.2 rounded border border-[#282836]">
                                {profile.role}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400">{perm.label}</p>
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-lg bg-[#1C1C26] text-zinc-400 group-hover:text-white group-hover:bg-emerald-600 flex items-center justify-center transition">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-400 space-y-1 pt-1 border-t border-[#1C1C26]">
                        <div className="flex items-center justify-between">
                          <span>Department:</span>
                          <span className="text-zinc-300 font-medium">{profile.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Auth Protocol:</span>
                          <span className="text-emerald-400 font-mono text-[10px]">{profile.authProvider}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500 font-mono">
                        <span>Can Sync ERP: {perm.canTriggerERPSync ? "Yes" : "No"}</span>
                        <span>Export Audit: {perm.canExportAudit ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Mode 2: Corporate Directory & Password Form */
            <form onSubmit={handleCredentialsSubmit} className="space-y-5 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#14141B] border border-[#20202A] text-zinc-100 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                    placeholder="user@enterprise.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Directory Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#14141B] border border-[#20202A] text-zinc-100 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition font-mono"
                  placeholder="Password"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Assigned Security Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-[#14141B] border border-[#20202A] text-zinc-100 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="CFO">Chief Financial Officer (Full Access)</option>
                  <option value="COLLECTIONS_LEAD">Collections Lead (Operations)</option>
                  <option value="AR_AUDITOR">Senior AR Compliance Auditor</option>
                  <option value="SALES_AE">Enterprise Account Executive</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#262634] text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Remember device (30 days)</span>
                </label>
                <span className="text-zinc-500">SSO Enforced</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition"
              >
                <Lock className="w-4 h-4" />
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[11px] text-zinc-500">
                Protected by corporate MFA and SOX 404 access control audit trails.
              </div>
            </form>
          )}

          {/* Bottom Security Seals */}
          <div className="pt-6 border-t border-[#1C1C24] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Identity Provider: Active Directory & Okta FedRAMP High</span>
            </div>
            <div className="font-mono text-[11px]">
              System Version: 2026.9.1-SOX
            </div>
          </div>

        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="p-6 text-center text-xs text-zinc-600 relative z-10">
        © 2026 Rev-AI Enterprise Systems Inc. Unauthorized access is subject to civil and criminal penalties under federal law.
      </footer>
    </div>
  );
};
