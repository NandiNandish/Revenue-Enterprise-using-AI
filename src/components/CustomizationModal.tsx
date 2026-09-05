import React from "react";
import { X, Check, Sliders, Bell, LayoutGrid, Clock } from "lucide-react";
import { DashboardPreferences } from "../types";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: DashboardPreferences;
  onSavePreferences: (newPrefs: DashboardPreferences) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [localPrefs, setLocalPrefs] = React.useState<DashboardPreferences>(preferences);

  React.useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences, isOpen]);

  if (!isOpen) return null;

  const handleToggleWidget = (key: keyof DashboardPreferences["visibleWidgets"]) => {
    setLocalPrefs((prev) => ({
      ...prev,
      visibleWidgets: {
        ...prev.visibleWidgets,
        [key]: !prev.visibleWidgets[key],
      },
    }));
  };

  const handleSave = () => {
    onSavePreferences(localPrefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-[#1F1F24] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1F1F24] bg-[#0F0F14] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-serif italic text-white">Dashboard & Audit Customization</h2>
          </div>
          <button
            id="close-customize-modal-btn"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1A1A22] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-zinc-300 scrollbar-thin">
          {/* Timeframe selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-zinc-200 text-xs">
              <Clock className="w-4 h-4 text-emerald-400" />
              Default Audit & Recovery Timeframe
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: "7d", label: "Last 7 Days" },
                  { id: "30d", label: "Last 30 Days" },
                  { id: "qtd", label: "Q3 2026 (QTD)" },
                  { id: "ytd", label: "Fiscal 2026 (YTD)" },
                ] as const
              ).map((tf) => (
                <button
                  key={tf.id}
                  id={`timeframe-btn-${tf.id}`}
                  type="button"
                  onClick={() => setLocalPrefs((p) => ({ ...p, timeframe: tf.id }))}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                    localPrefs.timeframe === tf.id
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm"
                      : "bg-[#0F0F14] border-[#1F1F24] text-zinc-400 hover:border-[#282834]"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Targets & Thresholds */}
          <div className="space-y-4 pt-4 border-t border-[#1F1F24]">
            <label className="flex items-center gap-2 font-medium text-zinc-200 text-xs">
              <Bell className="w-4 h-4 text-amber-400" />
              Finance Operations KPI Thresholds
            </label>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400">Target Recovery Efficiency Rate:</span>
                <span className="font-bold text-emerald-400 font-mono">{localPrefs.targetRecoveryRate}%</span>
              </div>
              <input
                id="target-recovery-slider"
                type="range"
                min={65}
                max={98}
                step={1}
                value={localPrefs.targetRecoveryRate}
                onChange={(e) =>
                  setLocalPrefs((p) => ({
                    ...p,
                    targetRecoveryRate: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-emerald-500 bg-[#0F0F14] rounded-lg h-2"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Trigger CFO warning notifications when batch recovery falls below this target.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400">High-Value Discrepancy Escalation Ceiling:</span>
                <span className="font-bold text-amber-400 font-mono">
                  ${localPrefs.largeDiscrepancyThreshold.toLocaleString()}
                </span>
              </div>
              <select
                id="discrepancy-threshold-select"
                aria-label="High-Value Discrepancy Escalation Ceiling"
                value={localPrefs.largeDiscrepancyThreshold}
                onChange={(e) =>
                  setLocalPrefs((p) => ({
                    ...p,
                    largeDiscrepancyThreshold: parseInt(e.target.value),
                  }))
                }
                className="w-full bg-[#0F0F14] border border-[#1F1F24] rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value={25000}>$25,000 (Strict monitoring)</option>
                <option value={50000}>$50,000 (Standard Enterprise)</option>
                <option value={100000}>$100,000 (Tier 1 Global Focus)</option>
                <option value={250000}>$250,000 (Strategic Accounts Only)</option>
              </select>
            </div>
          </div>

          {/* Widget Visibility Toggles */}
          <div className="space-y-3 pt-4 border-t border-[#1F1F24]">
            <label className="flex items-center gap-2 font-medium text-zinc-200 text-xs">
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
              Configure Dashboard Modules & Views
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: "kpiCards" as const, label: "Real-Time KPI Metric Cards" },
                { key: "leakageWaterfall" as const, label: "Root Cause Leakage Chart" },
                { key: "batchTracker" as const, label: "Measured Batch Recovery Tracker" },
                { key: "retrySequencer" as const, label: "Mandate Retry Sequencer Card" },
                { key: "discrepancyTable" as const, label: "Live Billing Discrepancy Table" },
                { key: "erpSyncMonitor" as const, label: "ERP Connector Health Panel" },
                { key: "auditLog" as const, label: "SOX 404 Audit Stream" },
              ].map(({ key, label }) => {
                const checked = localPrefs.visibleWidgets[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleWidget(key)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      checked
                        ? "bg-[#0F0F14] border-emerald-500/40 text-zinc-200"
                        : "bg-[#0F0F14]/40 border-[#1F1F24] text-zinc-500"
                    }`}
                  >
                    <span>{label}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        checked
                          ? "bg-emerald-500 border-emerald-400 text-black"
                          : "border-[#282834] bg-[#16161D]"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Density */}
          <div className="pt-4 border-t border-[#1F1F24] flex items-center justify-between">
            <div>
              <span className="font-medium text-zinc-200 text-xs block">Compact Data Density</span>
              <span className="text-[11px] text-zinc-500">Optimized for high-volume enterprise accounting</span>
            </div>
            <button
              id="toggle-compact-density-btn"
              type="button"
              onClick={() => setLocalPrefs((p) => ({ ...p, compactView: !p.compactView }))}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                localPrefs.compactView ? "bg-emerald-500" : "bg-[#1E1E28]"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                  localPrefs.compactView ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0F0F14] border-t border-[#1F1F24] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition"
          >
            Cancel
          </button>
          <button
            id="save-preferences-btn"
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm active:scale-95 transition"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
