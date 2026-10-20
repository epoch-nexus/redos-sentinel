import React from 'react';
import { Signal } from '../types';
import { IsometricShield, IsometricWarning } from './IsometricIcons';
import { AlertTriangle, ShieldCheck, CheckCircle, Info } from 'lucide-react';

interface FindingsCardProps {
  riskLevel: string | null;
  signals: Signal[];
  pattern: string;
}

export const FindingsCard: React.FC<FindingsCardProps> = ({
  riskLevel,
  signals,
  pattern,
}) => {
  const isHighRisk = riskLevel === 'high';

  return (
    <div className="bento-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Card Title Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isHighRisk ? (
              <IsometricWarning size={36} />
            ) : (
              <IsometricShield size={36} />
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tighter lowercase text-white">
                static findings
              </h2>
              <p className="text-xs text-text-muted">Structural complexity & ReDoS signal detector</p>
            </div>
          </div>

          {/* Risk Level Badge */}
          {riskLevel && (
            <div
              className={`pill-btn px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                isHighRisk
                  ? 'bg-error/20 text-red-400 border-error/50 shadow-glow-error animate-pulse'
                  : 'bg-accent/20 text-emerald-400 border-accent/50 shadow-glow-accent'
              }`}
            >
              {isHighRisk ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Risk: High</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Risk: Low / Safe</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        {!riskLevel ? (
          <div className="py-10 flex flex-col items-center justify-center text-center rounded-3xl bg-surface-solid/30 border border-border/40 p-6">
            <div className="w-12 h-12 rounded-full bg-surface-solid border border-border flex items-center justify-center mb-3 text-text-muted">
              <Info className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-text-primary mb-1">Awaiting Analysis</h4>
            <p className="text-xs text-text-muted max-w-xs">
              Load an example or enter a regular expression above and click "Run Analysis" to inspect structural risks.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Pattern echo pill */}
            <div className="p-3 bg-surface-solid/60 border border-border/70 rounded-2xl flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted">Target Pattern:</span>
              <span className="text-primary-tint font-bold bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                {pattern}
              </span>
            </div>

            {/* List of Detected Signals */}
            {signals.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted font-mono block">
                  Detected Vulnerability Signals ({signals.length}):
                </span>
                {signals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 transition-all hover:bg-red-500/15"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-red-300 uppercase tracking-wide">
                          {sig.rule.replace(/_/g, ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-red-500/20 text-red-200 border border-red-500/40 uppercase font-mono">
                          Exponential Risk
                        </span>
                      </div>
                      <p className="text-xs text-text-primary leading-relaxed">{sig.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-1">
                    No Catastrophic Backtracking Detected
                  </h4>
                  <p className="text-xs text-text-primary leading-relaxed">
                    This pattern passed static heuristic checks. No unbounded nested quantifiers or overlapping alternation under repetition were found.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info Pill */}
      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
        <span>Engine: Static AST Walker + Heuristics</span>
        <span className="font-mono">Time Complexity: O(N)</span>
      </div>
    </div>
  );
};
