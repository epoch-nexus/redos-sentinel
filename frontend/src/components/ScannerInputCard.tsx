import React from 'react';
import { Card } from './ui/Card';
import { Code, Terminal, Clock, ShieldAlert } from 'lucide-react';

interface ScannerInputCardProps {
  pattern: string;
  setPattern: (val: string) => void;
  testString: string;
  setTestString: (val: string) => void;
  runBenchmark: boolean;
  setRunBenchmark: (val: boolean) => void;
  onRunAnalysis: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ScannerInputCard: React.FC<ScannerInputCardProps> = ({
  pattern,
  setPattern,
  testString,
  setTestString,
  runBenchmark,
  setRunBenchmark,
}) => {
  return (
    <Card variant="white" className="p-6 sm:p-7 flex flex-col justify-between h-full">
      <div>
        {/* Header matching Summary card */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-textDark tracking-tight">Scanner Input</h2>
            <p className="text-xs text-textMuted mt-0.5">Configure regex pattern & test string.</p>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-textMuted">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="font-mono text-[11px]">PCRE / Python</span>
          </div>
        </div>

        {/* Split Stat Blocks (Exact structure of Total Income / Total Paid from reference) */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-textMuted shadow-sm">
              <Code className="w-4 h-4 text-brand-orange" />
            </div>
            <div>
              <span className="text-[10px] text-textMuted uppercase font-semibold block">
                Pattern Length
              </span>
              <span className="text-sm font-bold text-textDark font-mono">
                {pattern.length} chars
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-textMuted shadow-sm">
              <Terminal className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-[10px] text-textMuted uppercase font-semibold block">
                Payload Base
              </span>
              <span className="text-sm font-bold text-textDark font-mono truncate max-w-[120px] block">
                {testString ? `${testString.length} chars` : 'Default'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Regex Input Field */}
          <div>
            <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1.5 font-mono">
              Regex Pattern
            </label>
            <div className="relative">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. ^(a+)+$"
                required
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-mono text-textDark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 shadow-soft transition-all"
              />
            </div>
          </div>

          {/* Test String Input Field */}
          <div>
            <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1.5 font-mono">
              Test String (Candidate Witness)
            </label>
            <input
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="e.g. aaaaaaaaaaaaaaaaaaaa!"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-mono text-textDark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 shadow-soft transition-all"
            />
          </div>

          {/* Run Benchmark Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/70">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-brand-orange shadow-sm">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-textDark block">
                  Run Benchmark
                </span>
                <span className="text-[11px] text-textMuted">
                  5 isolated child runs &middot; 1.0s timeout
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={runBenchmark}
                onChange={(e) => setRunBenchmark(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Decorative Bar Graphic Replicating Reference Summary Orange/Grey Bar Columns */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-end justify-between gap-1.5 h-12">
        <div className="w-3 bg-brand-orange rounded-full h-6" />
        <div className="w-3 bg-brand-orange rounded-full h-10" />
        <div className="w-3 bg-brand-orange rounded-full h-8" />
        <div className="w-3 bg-brand-orange rounded-full h-12" />
        <div className="w-3 bg-brand-orange rounded-full h-9" />
        <div className="w-3 bg-gray-200 rounded-full h-7" />
        <div className="w-3 bg-gray-200 rounded-full h-11" />
        <div className="w-3 bg-gray-200 rounded-full h-5" />
        <div className="w-3 bg-gray-200 rounded-full h-8" />
        <span className="text-[10px] font-mono text-textMuted ml-auto flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-brand-orange" />
          Linear O(N) Heuristics
        </span>
      </div>
    </Card>
  );
};
