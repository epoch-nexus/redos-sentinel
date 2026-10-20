import React from 'react';
import { Card } from './ui/Card';
import { Signal } from '../types';
import {
  AlertTriangle,
  ShieldCheck,
  Layers,
  Cpu,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface SignalsCardGroupProps {
  riskLevel: string | null;
  signals: Signal[];
  pattern: string;
}

export const SignalsCardGroup: React.FC<SignalsCardGroupProps> = ({
  riskLevel,
  signals,
}) => {
  const isHighRisk = riskLevel === 'high';

  return (
    <Card variant="white" className="p-6 sm:p-7 flex flex-col justify-between h-full">
      <div>
        {/* Section Header matching Activity card */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-textDark tracking-tight">Activity</h2>
            <p className="text-xs text-textMuted mt-0.5">Track your regex risk & structural heuristics.</p>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-textMuted">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px]">Static Scanner</span>
          </div>
        </div>

        {/* 3-Column Sub-Cards (Direct Replica of Receipts, Contributions, Owes) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
          {/* Sub-Card 1: Risk Level Card (INVERTED DARK THEME WHEN HIGH RISK, like Owes card!) */}
          <div
            className={`p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 min-h-[148px] ${
              isHighRisk
                ? 'bg-inverted text-white border border-inverted-border shadow-md'
                : 'bg-white border border-gray-200/90 shadow-sm text-textDark'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isHighRisk
                        ? 'bg-brand-orange/20 text-brand-orange'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {isHighRisk ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isHighRisk ? 'text-gray-200' : 'text-textDark'
                    }`}
                  >
                    Risk Level
                  </span>
                </div>
              </div>

              {/* Status pill badge */}
              <div className="flex items-center space-x-1 mb-1">
                {isHighRisk ? (
                  <span className="text-[10px] font-bold text-red-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> -EXPONENTIAL
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +SAFE
                  </span>
                )}
              </div>

              {/* Big bold stat number */}
              <div
                className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                  isHighRisk ? 'text-brand-orange' : 'text-textDark'
                }`}
              >
                {riskLevel ? riskLevel.toUpperCase() : 'PENDING'}
              </div>
            </div>

            {/* Sparkline curve replicating the reference bottom wave */}
            <svg
              className="w-full h-8 mt-2 -mb-2 overflow-visible"
              viewBox="0 0 100 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 25C15 25 20 10 35 18C50 26 60 5 75 14C85 20 92 12 100 16"
                stroke={isHighRisk ? '#EA580C' : '#10B981'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Sub-Card 2: Signals Count Card (White card like Contributions) */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-sm flex flex-col justify-between min-h-[148px]">
            <div>
              <div className="flex items-center space-x-1.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-brand-orangeLight text-brand-orange flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-textDark">Signals</span>
              </div>

              <div className="flex items-center space-x-1 mb-1">
                <span className="text-[10px] font-bold text-textMuted font-mono">
                  AST PATTERNS
                </span>
              </div>

              <div className="text-lg sm:text-xl font-extrabold text-textDark tracking-tight">
                {signals.length} {signals.length === 1 ? 'Rule' : 'Rules'}
              </div>
            </div>

            {/* Wave sparkline */}
            <svg
              className="w-full h-8 mt-2 -mb-2 overflow-visible"
              viewBox="0 0 100 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 20C12 20 18 12 30 15C42 18 55 8 68 18C78 24 88 10 100 12"
                stroke="#EA580C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Sub-Card 3: Isolation Worker Budget (White card like Receipts) */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-sm flex flex-col justify-between min-h-[148px]">
            <div>
              <div className="flex items-center space-x-1.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-textDark">Isolation</span>
              </div>

              <div className="flex items-center space-x-1 mb-1">
                <span className="text-[10px] font-bold text-emerald-600 font-mono">
                  SPAWNED PID
                </span>
              </div>

              <div className="text-lg sm:text-xl font-extrabold text-textDark tracking-tight font-mono">
                1.000 ms
              </div>
            </div>

            {/* Wave sparkline */}
            <svg
              className="w-full h-8 mt-2 -mb-2 overflow-visible"
              viewBox="0 0 100 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 16C15 16 25 8 40 18C55 26 70 12 85 10C92 8 96 14 100 15"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Mapped Signals Explanations List */}
        <div className="space-y-2 mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted font-mono block">
            Analysis Details:
          </span>

          {signals.length > 0 ? (
            signals.map((sig, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3 text-xs text-textDark transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-textDark uppercase font-mono text-[11px]">
                      {sig.rule.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-red-100 text-red-700 font-bold font-mono">
                      EXPONENTIAL
                    </span>
                  </div>
                  <p className="text-textMuted text-xs leading-relaxed">{sig.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start space-x-3 text-xs text-textDark">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900 block mb-0.5">
                  Static Check Passed
                </span>
                <p className="text-emerald-700 text-xs">
                  No structural nested quantifiers or overlapping alternation detected in this pattern.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
