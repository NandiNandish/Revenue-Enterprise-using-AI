# AI Revenue Recovery Enterprise

> Autonomous enterprise revenue recovery platform detecting billing discrepancies, automating payment follow-ups, synchronizing ERPs, and providing financial oversight with SOX 404 audit compliance.

---

## Overview

**AI Revenue Recovery Enterprise** is a full-stack platform engineered for CFOs, treasury leaders, and accounts receivable (AR) teams. It bridges financial billing gaps across enterprise ERP and payment ecosystems (SAP S/4HANA, Oracle NetSuite, Microsoft Dynamics 365, Stripe Billing, and Workday Financials).

By combining autonomous root-cause diagnostics, intelligent liquidity retry scheduling, bounded customer communication sequences, and real-time ledger reconciliation, the platform systematically recovers at-risk revenue while enforcing strict compliance guardrails.

---

## Key Features

### 1. Left-Hand Service Navigation & Command Center
- **Consolidated Sidebar**: Full operational suite organized into a high-contrast, responsive left-hand navigation pane with a mobile slide-out drawer.
- **Portfolio Ticker**: Real-time display of total measured recovered revenue and current capital at risk across all connected ERPs.
- **Quick Controls**: Instant triggers for bi-directional ERP data synchronization, target threshold customization, and theme preferences.

### 2. Enterprise Authentication & Role-Based Access Control (RBAC)
- **Executive Gateway**: Secure login screen supporting corporate directory credentials (SSO/Okta/Azure AD) and 1-click persona simulation.
- **4 Granular Security Roles**:
  - **CFO (Chief Financial Officer)**: Full executive oversight, ERP synchronization triggers, and board-level report sign-offs.
  - **Collections Lead**: Operational management of active cohorts, interventions, and promise-to-pay adjustments.
  - **AR Compliance Auditor**: SOX 404 audit inspection, tamper-evident hash verification, and archival export.
  - **Sales AE**: Masked client account view with protected banking routing numbers and merchant tokens.
- **Tamper-Evident Session Tracking**: Every login, role switch, and logout is automatically logged to the cryptographic audit trail.

### 3. Recovery Batch Engine with Framer Motion Visualizations
- **Cohort Performance Tracking**: Inspect at-risk receivables organized by enterprise ERP ingestion batches.
- **Framer Motion Progress Bars**: Smooth spring-animated progress bars that recalibrate and shimmer when an AI intervention updates cohort recovery rates.
- **Granular Intervention Controls**: Trigger individual cohort recoveries or execute system-wide recovery sweeps with automated compliance stopping rules.

### 4. Billing Discrepancy Workspace
- **Multi-Factor Detection**: Uncovers catalog rate drifts, PO cap expirations, SEPA/ACH mandate invalidations, VAT tax mismatches, and gateway soft-declines.
- **AI Root Cause Diagnosis**: Powered by Google Gemini (with deterministic offline fallbacks) to pinpoint discrepancies and prescribe bounded corrective steps.
- **Stopping Rule Guardrails**: Automatically caps maximum settlement discounts and halts excessive collection attempts before card scheme penalties occur.

### 5. Mandate Smart Retry Sequencer
- **Liquidity-Aware Retry Timing**: Analyzes issuer authorization cycles, payroll liquidity windows, and holiday settlement schedules to maximize approval rates.
- **Excessive Retry Penalty Prevention**: Halts retries before violating Visa/Mastercard scheme thresholds.

### 6. Promise-to-Pay (PTP) Tracker
- **Milestone Installment Plans**: Tracks enterprise payment restructuring with real-time adherence scoring and milestone status tracking.
- **Automated Grace Alerts**: Dispatches gentle reminders before grace periods expire.

### 7. Bi-Directional ERP Connectors & Webhooks
- **Unified Sync**: Seamless integrations with SAP S/4HANA, NetSuite SuiteTalk, Dynamics 365, Stripe, and Workday.
- **Health Monitoring**: Real-time connector latency, webhook status, and synchronization interval management.

### 8. SOX 404 Cryptographic Audit Trail
- **Tamper-Evident Ledger**: Logs all user actions, AI interventions, and ledger writes with SHA-256 hash digests and sequential audit identifiers.
- **Search & Filter**: Fast inspection by actor, role, action type, or verification status.

### 9. Monthly Financial Reports & Simulated PDF Archival Export
- **Executive Synthesis**: Generates comprehensive month-end revenue recovery summaries, key operational milestones, and strategic recommendations.
- **Simulated Archival PDF Modal**: Multi-page document preview with corporate letterhead, pagination, official watermarks, dual sign-off seals, and direct `.pdf` export.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tooling** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Motion (`motion/react` / Framer Motion) |
| **Icons** | Lucide React |
| **Backend Server** | Express (Node.js runtime with `tsx` / `esbuild`) |
| **AI Engine** | Google Gemini API (`@google/genai` SDK via server-side proxy) |

---

## Project Structure

```
├── .env.example                # Environment variable declarations
├── index.html                  # HTML entry point with meta tags
├── metadata.json               # Application metadata and capabilities
├── package.json                # Project dependencies and build scripts
├── server.ts                   # Express server with Vite middleware & Gemini API routes
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration with Tailwind CSS plugin
├── public/                     # Static assets
└── src/
    ├── App.tsx                 # Root application component and global state
    ├── index.css               # Tailwind CSS entry point
    ├── main.tsx                # Application mounting entry point
    ├── types.ts                # TypeScript definitions, interfaces, and user models
    ├── data/
    │   └── mockData.ts         # Initial batches, discrepancies, personas, and audit entries
    └── components/
        ├── AuditTrailView.tsx         # SOX 404 audit log table and verification
        ├── CustomizationModal.tsx     # Dashboard targets, thresholds, and preferences
        ├── DiscrepancyWorkspace.tsx   # Itemized invoice discrepancies & AI diagnosis
        ├── ERPIntegrations.tsx        # ERP connectors, health checks, and API webhooks
        ├── LeftSidebar.tsx            # Left-hand persistent navigation, stats, and auth controls
        ├── LoginScreen.tsx            # Enterprise sign-in gateway (SSO / 1-click personas)
        ├── MandateRetrySequencer.tsx  # Liquidity-sequenced card and ACH retry schedules
        ├── MonthlyReportView.tsx      # Month-end executive report with AI synthesis
        ├── PromiseToPayTracker.tsx    # Installment plan schedules and tracking
        ├── RealTimeDashboard.tsx      # Top-level KPI scorecard, batches, and recent alerts
        ├── RecoveryBatchCard.tsx      # Animated Framer Motion progress batch card
        ├── RecoveryWorkflowModal.tsx  # Multi-channel follow-up dispatcher with tone options
        └── SimulatedPDFModal.tsx      # Simulated archival PDF document viewer & exporter
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd ai-revenue-recovery
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (Optional):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your Gemini API key if you want live generative AI diagnostics (the app features comprehensive deterministic fallback logic when running without an API key):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the Development Server:
   ```bash
   npm run dev
   ```
   The dev server starts on `http://localhost:3000`.

---

## Build & Deployment

### Production Build
Compile client static assets and bundle the backend server:
```bash
npm run build
```
This runs:
- `vite build` (compiles React frontend into `dist/`)
- `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`

### Production Run
Launch the compiled CommonJS server:
```bash
npm start
```
The server serves static assets from `dist/` and mounts server-side `/api/*` endpoints on port 3000.

### Code Quality / Linting
Check TypeScript compilation without emitting files:
```bash
npm run lint
```

---

## API Endpoints

All external API interactions and AI processing are proxied through server-side endpoints:

- `GET /api/health` — Service health check and current timestamp.
- `POST /api/ai/diagnose-discrepancy` — Generates root-cause diagnosis, confidence score, and bounded recovery action for an invoice discrepancy.
- `POST /api/ai/generate-followup` — Drafts compliant, multi-channel customer communication (Email, SMS, Portal Link) with configurable tone (firm, collaborative, executive) and languages (English, Hinglish).
- `POST /api/ai/generate-monthly-report` — Synthesizes an executive month-end report summarizing revenue recovered, DSO reduction, and operational highlights.

---

## License

Enterprise Confidential & Proprietary. Compliant with SOX Section 404 internal accounting controls.
