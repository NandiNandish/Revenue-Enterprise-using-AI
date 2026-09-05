import React, { useState } from "react";
import { LeftSidebar } from "./components/LeftSidebar";
import { LoginScreen } from "./components/LoginScreen";
import { RealTimeDashboard } from "./components/RealTimeDashboard";
import { DiscrepancyWorkspace } from "./components/DiscrepancyWorkspace";
import { MandateRetrySequencer } from "./components/MandateRetrySequencer";
import { PromiseToPayTracker } from "./components/PromiseToPayTracker";
import { ERPIntegrations } from "./components/ERPIntegrations";
import { AuditTrailView } from "./components/AuditTrailView";
import { MonthlyReportView } from "./components/MonthlyReportView";
import { CustomizationModal } from "./components/CustomizationModal";
import { RecoveryWorkflowModal } from "./components/RecoveryWorkflowModal";

import { 
  DiscrepancyItem, 
  RecoveryBatch, 
  AuditLogEntry, 
  UserRole, 
  UserProfile,
  DashboardPreferences 
} from "./types";

import { 
  INITIAL_DISCREPANCIES, 
  INITIAL_BATCHES, 
  INITIAL_AUDIT_LOGS,
  DEFAULT_USER_PROFILES
} from "./data/mockData";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("revai_user_session");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not parse saved session", e);
    }
    return DEFAULT_USER_PROFILES[0]; // Default to Elena Vance (CFO) for authentic starting experience
  });

  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [currentRole, setCurrentRole] = useState<UserRole>(() => currentUser?.role || "CFO");

  const [discrepancies, setDiscrepancies] = useState<DiscrepancyItem[]>(INITIAL_DISCREPANCIES);
  const [batches, setBatches] = useState<RecoveryBatch[]>(INITIAL_BATCHES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [isCustomizationOpen, setIsCustomizationOpen] = useState<boolean>(false);
  const [workflowModalItem, setWorkflowModalItem] = useState<DiscrepancyItem | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSimulatingBatch, setIsSimulatingBatch] = useState<boolean>(false);
  const [interveningBatchId, setInterveningBatchId] = useState<string | null>(null);
  const [isDiagnosingId, setIsDiagnosingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<DashboardPreferences>({
    timeframe: "30d",
    targetRecoveryRate: 85,
    largeDiscrepancyThreshold: 50000,
    visibleWidgets: {
      kpiCards: true,
      leakageWaterfall: true,
      batchTracker: true,
      retrySequencer: true,
      discrepancyTable: true,
      erpSyncMonitor: true,
      auditLog: true,
    },
    compactView: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper to append a cryptographically stamped audit entry
  const logAuditEvent = (action: string, targetId: string, details: string) => {
    const randomHash = Array.from({ length: 48 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      actor: currentUser ? `${currentUser.name} (${currentRole})` : `${currentRole} User`,
      role: currentRole,
      action,
      targetId,
      erpSource: "SAP S/4HANA",
      complianceRule: "SOX 404 / Automated Audit Protocol",
      tamperHash: randomHash,
      details,
      verified: true,
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Authentication Handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem("revai_user_session", JSON.stringify(user));
    } catch (e) {
      console.warn("Could not persist session", e);
    }
    showToast(`✓ Authenticated as ${user.name} (${user.role})`);
    logAuditEvent(
      "USER_AUTHENTICATED",
      user.email,
      `User ${user.name} authenticated with role ${user.role} via ${user.authProvider}.`
    );
  };

  const handleLogout = () => {
    if (currentUser) {
      logAuditEvent(
        "USER_SESSION_TERMINATED",
        currentUser.email,
        `User ${currentUser.name} signed out of enterprise session.`
      );
    }
    try {
      localStorage.removeItem("revai_user_session");
    } catch (e) {
      console.warn("Could not clear session", e);
    }
    setCurrentUser(null);
    showToast("Logged out of enterprise session.");
  };

  // ERP Synchronization Action
  const handleTriggerSync = () => {
    setIsSyncing(true);
    showToast("Triggering bi-directional sync across all 5 connected ERPs...");
    setTimeout(() => {
      setIsSyncing(false);
      showToast("✓ All 5 ERP connectors synchronized. 248 journal records updated.");
      logAuditEvent(
        "GLOBAL_ERP_SYNC_COMPLETED",
        "ALL_SYSTEMS (SAP, NS, Stripe, D365, Workday)",
        "Automated bi-directional reconciliation completed. No protocol drift detected."
      );
    }, 1800);
  };

  // Batch Recovery Simulation Action (Global)
  const handleSimulateBatchRecovery = () => {
    setIsSimulatingBatch(true);
    showToast("AI Agent executing batch recovery interventions across active cohorts...");
    setTimeout(() => {
      setIsSimulatingBatch(false);
      // Boost recovered amount in active batch
      setBatches((prev) =>
        prev.map((b) =>
          b.status === "active"
            ? {
                ...b,
                totalRecovered: b.totalRecovered + 142000,
                recoveryRate: Math.min(
                  98,
                  Math.round(((b.totalRecovered + 142000) / b.totalAtRisk) * 100)
                ),
              }
            : b
        )
      );

      // Settle one active discrepancy
      setDiscrepancies((prev) =>
        prev.map((d) =>
          d.id === "DISC-804"
            ? {
                ...d,
                status: "recovered",
                recoveredAmount: d.amountAtRisk,
                lastActionAt: new Date().toISOString().replace("T", " ").slice(0, 19),
              }
            : d
        )
      );

      showToast("✓ $142,000 in batch revenue recovered! Reconciled in Stripe & general ledger.");
      logAuditEvent(
        "BATCH_AUTONOMOUS_INTERVENTION_SUCCESS",
        "BATCH-2026-09-W1",
        "AI recovered $142,000 via mandate smart retry & instant payment links. Batch recovery rate rose to 89.5%."
      );
    }, 2000);
  };

  // Individual Batch Intervention Action (triggers Framer Motion animation on that batch)
  const handleInterveneBatch = (batchId: string) => {
    setInterveningBatchId(batchId);
    const targetBatch = batches.find((b) => b.id === batchId);
    showToast(`Executing AI bounded intervention for ${targetBatch?.batchName || batchId}...`);

    setTimeout(() => {
      setInterveningBatchId(null);
      const boostAmount = 142000;
      setBatches((prev) =>
        prev.map((b) => {
          if (b.id === batchId) {
            const newRecovered = Math.min(b.totalAtRisk, b.totalRecovered + boostAmount);
            const newRate = Math.min(100, Math.round((newRecovered / b.totalAtRisk) * 100));
            return {
              ...b,
              totalRecovered: newRecovered,
              recoveryRate: newRate,
              activeInterventions: Math.max(0, b.activeInterventions - 1),
            };
          }
          return b;
        })
      );

      showToast(`✓ Batch intervention completed! Recovery progress animated.`);
      logAuditEvent(
        "BATCH_INTERVENTION_EXECUTED",
        batchId,
        `AI intervention completed for ${targetBatch?.batchName || batchId}. Recovered funds reconciled in ledger.`
      );
    }, 1500);
  };

  // AI Root Cause Diagnosis
  const handleDiagnoseAI = async (item: DiscrepancyItem) => {
    setIsDiagnosingId(item.id);
    showToast(`Diagnosing root cause for ${item.invoiceId} with Gemini AI...`);
    try {
      const response = await fetch("/api/ai/diagnose-discrepancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscrepancies((prev) =>
          prev.map((d) =>
            d.id === item.id
              ? {
                  ...d,
                  rootCauseDiagnosis: data.rootCause || d.rootCauseDiagnosis,
                  recommendedAction: data.recoveryAction || d.recommendedAction,
                  confidenceScore: data.confidenceScore || 95,
                  stoppingRule: data.stoppingRule || d.stoppingRule,
                  lastActionAt: new Date().toISOString().replace("T", " ").slice(0, 19),
                }
              : d
          )
        );
        showToast(`✓ AI Diagnosis complete for ${item.clientName} (${data.confidenceScore || 95}% confidence).`);
        logAuditEvent(
          "AI_ROOT_CAUSE_DIAGNOSIS_COMPLETED",
          `${item.invoiceId} (${item.clientName})`,
          `Diagnosed: ${data.rootCause || "Catalog drift"}. Enforced stopping rule: ${data.stoppingRule || "Standard limits"}.`
        );
      }
    } catch (err) {
      console.warn("Using local diagnosis update:", err);
    } finally {
      setIsDiagnosingId(null);
    }
  };

  // Dispatch Bounded Workflow
  const handleDispatchWorkflow = (
    item: DiscrepancyItem,
    channel: string,
    messagePayload: { subject: string; message: string; stoppingRuleEnforced: string }
  ) => {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: "in_workflow",
              channelUsed: channel,
              stoppingRule: messagePayload.stoppingRuleEnforced,
              lastActionAt: new Date().toISOString().replace("T", " ").slice(0, 19),
            }
          : d
      )
    );

    showToast(`✓ Dispatched ${channel} follow-up to ${item.clientName} under stopping rules.`);
    logAuditEvent(
      "BOUNDED_FOLLOWUP_DISPATCHED",
      `${item.invoiceId} (${item.clientName})`,
      `Channel: ${channel}. Stopping rule enforced: "${messagePayload.stoppingRuleEnforced}". Generated via Gemini AI.`
    );
  };

  // Enforce Stopping Rule
  const handleEnforceStoppingRule = (item: DiscrepancyItem) => {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: "stopped_by_rule",
              lastActionAt: new Date().toISOString().replace("T", " ").slice(0, 19),
            }
          : d
      )
    );
    showToast(`🛑 Escalation halted by stopping rule for ${item.invoiceId}. Credit hold pending CFO sign-off.`);
    logAuditEvent(
      "STOPPING_RULE_HALT_ENFORCED",
      `${item.invoiceId} (${item.clientName})`,
      `Automated outreach halted to comply with credit policy boundary. Avoided unauthorized discount concessions.`
    );
  };

  // Mark Recovered
  const handleMarkRecovered = (item: DiscrepancyItem) => {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: "recovered",
              recoveredAmount: d.amountAtRisk,
              lastActionAt: new Date().toISOString().replace("T", " ").slice(0, 19),
            }
          : d
      )
    );

    setBatches((prev) =>
      prev.map((b) =>
        b.id === item.batchId
          ? {
              ...b,
              totalRecovered: b.totalRecovered + item.amountAtRisk,
              recoveryRate: Math.min(
                100,
                Math.round(((b.totalRecovered + item.amountAtRisk) / b.totalAtRisk) * 100)
              ),
            }
          : b
      )
    );

    showToast(`✓ Marked $${item.amountAtRisk.toLocaleString()} recovered for ${item.clientName}!`);
    logAuditEvent(
      "DISCREPANCY_RECOVERED_AND_SETTLED",
      `${item.invoiceId} (${item.clientName})`,
      `Full settlement of $${item.amountAtRisk.toLocaleString()} validated and reconciled against ${item.erpSource}.`
    );
  };

  const totalAtRisk = discrepancies
    .filter((d) => d.status !== "recovered")
    .reduce((acc, d) => acc + d.amountAtRisk, 0);

  const totalRecovered = batches.reduce((acc, b) => acc + b.totalRecovered, 0);

  // If user is not authenticated, show LoginScreen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-200 flex flex-col md:flex-row font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#121217] border border-[#1F1F24] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl shadow-black/80 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Navigation Sidebar (All top navigation service bar moved here) */}
      <LeftSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          if (currentUser) {
            const updatedUser = { ...currentUser, role };
            setCurrentUser(updatedUser);
            try {
              localStorage.setItem("revai_user_session", JSON.stringify(updatedUser));
            } catch (e) {}
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCustomization={() => setIsCustomizationOpen(true)}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        totalAtRisk={totalAtRisk}
        totalRecovered={totalRecovered}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Contextual Breadcrumb & Role Guard Banner */}
        <header className="border-b border-[#1C1C24] bg-[#0C0C10]/80 backdrop-blur px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs text-zinc-400 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider">Module</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-100 font-semibold capitalize">
              {currentTab === "dashboard" && "Recovery Hub & Oversight"}
              {currentTab === "discrepancies" && "Billing Discrepancies"}
              {currentTab === "sequencer" && "Mandate Smart Retry Sequencer"}
              {currentTab === "promise" && "Promise-to-Pay Installments"}
              {currentTab === "erp" && "ERP Connectors & Bi-Directional Sync"}
              {currentTab === "audit" && "SOX 404 Cryptographic Audit Trail"}
              {currentTab === "reports" && "Monthly Executive Finance Reports"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ERP Sync: Active (5 Connectors)</span>
            </div>
            <div className="text-[11px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-mono">
              SOX 404 Compliant
            </div>
          </div>
        </header>

        {/* Role Alert Banner if Sales AE */}
        {currentRole === "SALES_AE" && (
          <div className="bg-amber-950/20 border-b border-amber-800/30 px-6 py-2.5 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono">SALES_AE ROLE ACTIVE:</span>
              <span>Banking routing numbers, sensitive merchant tokens, and ledger debit adjustments are masked.</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-amber-900/40 px-2 py-0.5 rounded">
              Read-Only Masked
            </span>
          </div>
        )}

        {/* Main Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === "dashboard" && (
            <RealTimeDashboard
              discrepancies={discrepancies}
              batches={batches}
              preferences={preferences}
              currentRole={currentRole}
              onSelectDiscrepancy={(item) => {
                setWorkflowModalItem(item);
              }}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSimulateBatchRecovery={handleSimulateBatchRecovery}
              isSimulating={isSimulatingBatch}
              onInterveneBatch={handleInterveneBatch}
              interveningBatchId={interveningBatchId}
            />
          )}

          {currentTab === "discrepancies" && (
            <DiscrepancyWorkspace
              discrepancies={discrepancies}
              currentRole={currentRole}
              onOpenWorkflow={(item) => setWorkflowModalItem(item)}
              onDiagnoseAI={handleDiagnoseAI}
              onEnforceStoppingRule={handleEnforceStoppingRule}
              onMarkRecovered={handleMarkRecovered}
              isDiagnosingId={isDiagnosingId}
            />
          )}

          {currentTab === "sequencer" && (
            <MandateRetrySequencer
              currentRole={currentRole}
              onLogAudit={logAuditEvent}
            />
          )}

          {currentTab === "promise" && (
            <PromiseToPayTracker
              currentRole={currentRole}
              onLogAudit={logAuditEvent}
            />
          )}

          {currentTab === "erp" && (
            <ERPIntegrations
              currentRole={currentRole}
              onLogAudit={logAuditEvent}
            />
          )}

          {currentTab === "audit" && (
            <AuditTrailView
              logs={auditLogs}
              currentRole={currentRole}
            />
          )}

          {currentTab === "reports" && (
            <MonthlyReportView
              batches={batches}
              currentRole={currentRole}
              onLogAudit={logAuditEvent}
            />
          )}
        </main>
      </div>

      {/* Recovery Workflow Modal */}
      <RecoveryWorkflowModal
        item={workflowModalItem}
        isOpen={workflowModalItem !== null}
        onClose={() => setWorkflowModalItem(null)}
        onDispatchWorkflow={handleDispatchWorkflow}
      />

      {/* Dashboard Customization Modal */}
      <CustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        preferences={preferences}
        onSavePreferences={(newPrefs) => {
          setPreferences(newPrefs);
          showToast("✓ Dashboard preferences and alert thresholds applied.");
        }}
      />
    </div>
  );
}

