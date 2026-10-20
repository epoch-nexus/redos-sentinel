import React, { useState } from 'react';
import { AnalyzeResponse } from '../types';
import { Copy, Check, Code, ShieldAlert, FileText } from 'lucide-react';

interface RawOutputCardProps {
  response: AnalyzeResponse | null;
  onSelectExtractedPattern?: (pattern: string) => void;
}

export const RawOutputCard: React.FC<RawOutputCardProps> = ({ response }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'json' | 'limitations'>('json');

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bento-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Header with Joined Capsule Switcher */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 bg-surface-solid rounded-full p-1 border border-border/80">
            <button
              onClick={() => setActiveTab('json')}
              className={`pill-btn px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'json'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Raw API Contract</span>
            </button>
            <button
              onClick={() => setActiveTab('limitations')}
              className={`pill-btn px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'limitations'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Limitations</span>
            </button>
          </div>

          {response && activeTab === 'json' && (
            <button
              onClick={handleCopy}
              className="pill-btn px-3 py-1 bg-surface-solid hover:bg-surface-solid/80 border border-border text-xs text-text-muted hover:text-white flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-accent" />
                  <span className="text-accent">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Tab 1: Raw JSON view */}
        {activeTab === 'json' && (
          <div>
            {!response ? (
              <div className="h-44 flex flex-col items-center justify-center text-center rounded-2xl bg-surface-solid/30 border border-border/40 p-4">
                <FileText className="w-8 h-8 text-text-muted/50 mb-2" />
                <span className="text-xs text-text-muted font-mono">No API response payload yet</span>
              </div>
            ) : (
              <pre className="h-44 overflow-y-auto p-4 rounded-2xl bg-surface-solid/70 border border-border/80 font-mono text-xs text-primary-tint/90 leading-relaxed custom-scrollbar">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Tab 2: Honest Limitations Statement */}
        {activeTab === 'limitations' && (
          <div className="h-44 overflow-y-auto p-4 rounded-2xl bg-surface-solid/70 border border-border/80 space-y-2.5 text-xs text-text-muted leading-relaxed font-sans">
            <div className="flex items-start gap-2 text-amber-300 font-semibold mb-1">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Scope & Complexity Disclaimer</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-text-primary/90">
              <li>
                <strong className="text-white">Static Heuristics:</strong> Signals are structural heuristics, not formal ambiguity complexity proofs.
              </li>
              <li>
                <strong className="text-white">Hard Timeouts:</strong> Timeouts serve as empirical evidence of pathological delays rather than exact microsecond measurements.
              </li>
              <li>
                <strong className="text-white">Process Isolation:</strong> Backtracking execution is safely restricted to a child subprocess to guarantee server availability.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
        <span>Payload validation: Strict Pydantic v2</span>
        <span className="font-mono text-text-muted/70">JSON Schema Validated</span>
      </div>
    </div>
  );
};
