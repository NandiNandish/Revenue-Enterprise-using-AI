export type UserRole = "CFO" | "COLLECTIONS_LEAD" | "AR_AUDITOR" | "SALES_AE";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  department: string;
  lastLogin: string;
  authProvider: "SSO (Okta)" | "Google Workspace" | "Azure AD" | "Enterprise Credentials";
}

export interface RolePermission {
  role: UserRole;
  label: string;
  department: string;
  canEditRules: boolean;
  canApproveSettlement: boolean;
  canViewMaskedBanking: boolean;
  canExportAudit: boolean;
  canTriggerERPSync: boolean;
}

export type DiscrepancyCategory = 
  | "price_book_drift"
  | "payment_degradation"
  | "failed_subscription"
  | "checkout_dropoff"
  | "po_milestone_desync"
  | "vat_tax_mismatch"
  | "expired_mandate";

export type RecoveryStatus = 
  | "detected"
  | "diagnosing"
  | "in_workflow"
  | "promise_to_pay"
  | "recovered"
  | "escalated"
  | "stopped_by_rule";

export type ERPSource = "SAP S/4HANA" | "Oracle NetSuite" | "Dynamics 365" | "Stripe Billing" | "Workday Financials";

export interface DiscrepancyItem {
  id: string;
  invoiceId: string;
  clientName: string;
  clientTier: "Tier 1 Enterprise" | "Tier 2 Mid-Market" | "Strategic Global";
  erpSource: ERPSource;
  category: DiscrepancyCategory;
  amountAtRisk: number;
  expectedAmount: number;
  actualAmount: number;
  currency: string;
  daysOverdue: number;
  status: RecoveryStatus;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  detectedAt: string;
  lastActionAt?: string;
  failureCode?: string;
  rootCauseDiagnosis?: string;
  recommendedAction?: string;
  confidenceScore?: number;
  stoppingRule?: string;
  recoveredAmount?: number;
  channelUsed?: string;
  promiseToPayDate?: string;
  batchId?: string;
}

export interface PromiseToPayRecord {
  id: string;
  discrepancyId: string;
  invoiceId: string;
  clientName: string;
  totalAgreed: number;
  installments: {
    installmentNumber: number;
    amount: number;
    dueDate: string;
    status: "paid" | "pending" | "overdue";
  }[];
  commitmentDate: string;
  cfoApprovalStatus: "approved" | "pending" | "auto_bounded";
  riskScore: "low" | "medium" | "high";
  notes: string;
}

export interface MandateRetryItem {
  id: string;
  mandateId: string;
  invoiceId: string;
  clientName: string;
  gateway: "Stripe Enterprise" | "Adyen" | "JPMorgan Chase ACH" | "SEPA Core";
  originalFailureCode: string;
  reasonDescription: string;
  amount: number;
  attemptsMade: number;
  maxAllowedAttempts: number;
  optimalRetryTimestamp: string;
  recommendedRoute: string;
  predictedSuccessProbability: number;
  status: "scheduled" | "executing" | "succeeded" | "failed_halted";
}

export interface RecoveryBatch {
  id: string;
  batchName: string;
  batchDate: string;
  erpSource: ERPSource;
  totalCases: number;
  totalAtRisk: number;
  totalRecovered: number;
  recoveryRate: number;
  activeInterventions: number;
  stoppedByRules: number;
  status: "completed" | "active" | "scheduled";
}

export interface ERPConnector {
  id: string;
  name: ERPSource;
  systemCode: string;
  status: "connected" | "syncing" | "degraded" | "error";
  lastSyncTimestamp: string;
  syncedRecordsCount: number;
  pendingDiscrepancies: number;
  apiVersion: string;
  webhookLatencyMs: number;
  authType: "OAuth 2.0 mTLS" | "HMAC Secret" | "Bearer API Key";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetId: string;
  erpSource: ERPSource;
  complianceRule: string;
  tamperHash: string;
  details: string;
  verified: boolean;
}

export interface MonthlyReportData {
  month: string;
  totalAtRisk: number;
  totalRecovered: number;
  recoveryRate: number;
  dsoReductionDays: number;
  penaltiesAvoided: number;
  executiveSummary: string;
  keyHighlights: string[];
  leakageMitigation: string;
  recommendations: string[];
  batchSummary: {
    batchName: string;
    atRisk: number;
    recovered: number;
    rate: number;
  }[];
  rootCauseBreakdown: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

export interface DashboardPreferences {
  timeframe: "7d" | "30d" | "qtd" | "ytd";
  targetRecoveryRate: number; // e.g. 85%
  largeDiscrepancyThreshold: number; // e.g. $50,000
  visibleWidgets: {
    kpiCards: boolean;
    leakageWaterfall: boolean;
    batchTracker: boolean;
    retrySequencer: boolean;
    discrepancyTable: boolean;
    erpSyncMonitor: boolean;
    auditLog: boolean;
  };
  compactView: boolean;
}
