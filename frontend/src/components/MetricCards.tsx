import React from 'react';
import { Card } from './ui/Card';
import { Signal, BenchmarkResult } from '../types';
import {
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Layers,
  TrendingDown,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';

interface MetricCardsProps {
  riskLevel: string | null;
  signals: Signal[];
  benchmark: BenchmarkResult[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  riskLevel,
  signals,
  benchmark,
}) => {
  const isHighRisk = riskLevel === 'high';
  const hasTimeouts = benchmark.some((b) => b.status === 'timeout');

  return (
    <div className="space-y-4">
      {/* 4-Grid Metric Cards Replicating References (Images 1, 2, 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Vibrant Orange / Dark Inverted Card (Reference Image 3 Total Earnings / Image 1 Owes) */}
        <div
          className={`p-5 rounded-3xl flex flex-col justify-between transition-all duration-300 shadow-sm relative overflow-hidden min-h-[160px] ${
            isHighRisk
              ? 'bg-gradient-to-br from-brand-orange to-red-600 text-white shadow-orange-glow'
              : 'bg-white border border-gray-200/90 text-textDark'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isHighRisk ? 'text-white/80' : 'text-textMuted'
                }`}
              >
                Vulnerability Risk
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isHighRisk ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {isHighRisk ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-black tracking-tight">
                {riskLevel ? (isHighRisk ? 'HIGH RISK' : 'LOW RISK') : 'AWAITING'}
              </h3>
            </div>

            <div className="mt-1 flex items-center space-x-1.5 text-[11px] font-semibold">
              {isHighRisk ? (
                <span className="flex items-center gap-1 text-white/90 bg-black/20 px-2 py-0.5 rounded-full font-mono">
                  <TrendingDown className="w-3 h-3 text-white" />
                  O(2^N) Exponential
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  O(N) Deterministic
                </span>
              )}
            </div>
          </div>

          {/* Smooth Bottom Wave */}
          <svg className="w-full h-7 mt-3 overflow-visible" viewBox="0 0 100 25" fill="none">
            <path
              d="M0 20C15 20 22 8 36 14C50 20 65 5 78 12C88 18 94 10 100 12"
              stroke={isHighRisk ? '#FFFFFF' : '#10B981'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 2: Dot-Matrix Scaling Step Indicator (Reference Images 1 & 2 Dot Grids) */}
        <Card variant="white" className="p-5 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                Scaling Steps
              </span>
              <div className="w-7 h-7 rounded-full bg-brand-orangeLight text-brand-orange flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-textDark tracking-tight">
              {benchmark.length > 0 ? `${benchmark.length} Bounded` : '5 Planned'}
            </h3>

            <span className="text-[11px] text-textMuted mt-1 block">
              Candidate Near-Miss Matrix
            </span>
          </div>

          {/* Dot Matrix Grid Replicating Reference Images 1 & 2 */}
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[0, 1, 2, 3, 4].map((stepIdx) => {
                const stepResult = benchmark[stepIdx];
                const isCompleted = stepResult?.status === 'completed';
                const isTimeout = stepResult?.status === 'timeout';

                return (
                  <div
                    key={stepIdx}
                    className="flex flex-col items-center gap-1"
                    title={
                      stepResult
                        ? `Step ${stepIdx + 1}: ${stepResult.input_length} chars (${stepResult.status})`
                        : `Step ${stepIdx + 1} queued`
                    }
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        isTimeout
                          ? 'bg-red-500 shadow-sm'
                          : isCompleted
                          ? 'bg-brand-orange shadow-sm'
                          : 'bg-gray-200'
                      }`}
                    >
                      <span className="text-[8px] text-white font-bold">{stepIdx + 1}</span>
                    </div>
                  </div>
                );
              })}
              <span className="text-[10px] font-mono text-textMuted ml-auto">
                {hasTimeouts ? 'Halt @ Timeout' : 'Linear Growth'}
              </span>
            </div>
          </div>
        </Card>

        {/* Card 3: Concentric Ring / Backtracking Ambiguity Meter (Reference Images 1 & 2 Ring Progress) */}
        <Card variant="white" className="p-5 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                Ambiguity Degree
              </span>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-textDark tracking-tight font-mono">
                  {isHighRisk ? '2^N' : 'O(N)'}
                </h3>
                <span className="text-[11px] text-textMuted">
                  {signals.length} Signal{signals.length !== 1 ? 's' : ''} Flagged
                </span>
              </div>

              {/* Concentric Circular Progress Ring matching Reference Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background ring */}
                  <path
                    className="text-gray-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active progress arc */}
                  <path
                    className={isHighRisk ? 'text-brand-orange' : 'text-emerald-500'}
                    strokeDasharray={isHighRisk ? '85, 100' : '25, 100'}
                    strokeLinecap="round"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold font-mono text-textDark">
                  {isHighRisk ? '85%' : '15%'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-textMuted">
            <span>Branching Factor:</span>
            <span className="font-mono font-semibold text-textDark">
              {isHighRisk ? 'Exponential' : 'Bounded'}
            </span>
          </div>
        </Card>

        {/* Card 4: Subprocess Isolation Budget (Reference Image Receipts / Paid) */}
        <Card variant="white" className="p-5 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                Safety Sandbox
              </span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-textDark tracking-tight font-mono">
              1,000 ms
            </h3>

            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
              Hard SIGKILL Timeout
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-textMuted">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-brand-orange" />
              Process Isolation:
            </span>
            <span className="font-mono text-emerald-700 font-bold">Active</span>
          </div>
        </Card>
      </div>

      {/* Heuristic Explanation Detail Cards */}
      {signals.length > 0 && (
        <Card variant="white" className="p-5 border-l-4 border-l-brand-orange">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-brand-orange" />
              <h4 className="text-sm font-bold text-textDark">
                Active ReDoS Vulnerability Signals ({signals.length})
              </h4>
            </div>
            <span className="text-[11px] font-mono text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
              Catastrophic Backtracking Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {signals.map((sig, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-orange-50/60 border border-brand-orangeBorder text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-orange uppercase font-mono text-[11px]">
                    {sig.rule.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-orange text-white font-bold">
                    Heuristic Match
                  </span>
                </div>
                <p className="text-textDark/90 text-xs leading-relaxed">{sig.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
