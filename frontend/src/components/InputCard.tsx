import React from 'react';
import { IsometricTerminal } from './IsometricIcons';
import { Play, Sparkles, CheckCircle2, AlertOctagon, Layers, Loader2 } from 'lucide-react';

interface InputCardProps {
  pattern: string;
  setPattern: (val: string) => void;
  testString: string;
  setTestString: (val: string) => void;
  runBenchmark: boolean;
  setRunBenchmark: (val: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const InputCard: React.FC<InputCardProps> = ({
  pattern,
  setPattern,
  testString,
  setTestString,
  runBenchmark,
  setRunBenchmark,
  isLoading,
  onSubmit,
}) => {
  const loadExample = (type: 'nested' | 'overlapping' | 'safe') => {
    if (type === 'nested') {
      setPattern('^(a+)+$');
      setTestString('aaaaaaaaaaaaaaaaaaaa!');
      setRunBenchmark(true);
    } else if (type === 'overlapping') {
      setPattern('^(a|aa)+$');
      setTestString('aaaaaaaaaaaaaaaaaaaa!');
      setRunBenchmark(true);
    } else {
      setPattern('^[a-zA-Z0-9]+$');
      setTestString('safeString123');
      setRunBenchmark(false);
    }
  };

  return (
    <div className="bento-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative ambient background gradient */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with joined capsule tags */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <IsometricTerminal size={36} />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tighter lowercase text-white">
                pattern input
              </h2>
              <p className="text-xs text-text-muted">Enter target regex and candidate test string</p>
            </div>
          </div>

          {/* Quick presets capsule */}
          <div className="hidden sm:flex items-center gap-1.5 bg-surface-solid/90 rounded-full p-1 border border-border/80">
            <span className="text-[10px] text-text-muted px-2 font-mono uppercase font-semibold">Presets:</span>
            <button
              type="button"
              onClick={() => loadExample('nested')}
              className="pill-btn px-2.5 py-1 text-[11px] bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 flex items-center gap-1"
            >
              <AlertOctagon className="w-3 h-3" />
              Nested
            </button>
            <button
              type="button"
              onClick={() => loadExample('overlapping')}
              className="pill-btn px-2.5 py-1 text-[11px] bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              Overlap
            </button>
            <button
              type="button"
              onClick={() => loadExample('safe')}
              className="pill-btn px-2.5 py-1 text-[11px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Safe
            </button>
          </div>
        </div>

        {/* Mobile Presets bar */}
        <div className="flex sm:hidden items-center gap-1.5 mb-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => loadExample('nested')}
            className="pill-btn px-2.5 py-1 text-[11px] bg-red-500/15 text-red-400 border border-red-500/30 whitespace-nowrap"
          >
            Nested (Risky)
          </button>
          <button
            type="button"
            onClick={() => loadExample('overlapping')}
            className="pill-btn px-2.5 py-1 text-[11px] bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap"
          >
            Overlap (Risky)
          </button>
          <button
            type="button"
            onClick={() => loadExample('safe')}
            className="pill-btn px-2.5 py-1 text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap"
          >
            Safe Pattern
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Regex Pattern Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
              Regular Expression Pattern
            </label>
            <div className="relative">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. ^(a+)+$"
                required
                className="w-full bg-surface-solid/70 border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl px-4 py-3 text-sm font-mono text-white placeholder-text-muted/50 transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted/40 font-mono text-xs">
                PCRE / Python
              </div>
            </div>
          </div>

          {/* Test String Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5 font-mono">
              Base Test String (Near-Miss Payload)
            </label>
            <input
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="e.g. aaaaaaaaaaaaaaaaaaaa!"
              className="w-full bg-surface-solid/70 border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl px-4 py-3 text-sm font-mono text-white placeholder-text-muted/50 transition-all outline-none"
            />
            <span className="block mt-1 text-[11px] text-text-muted">
              Auto-scaled across 5 bounded test steps in an isolated subprocess.
            </span>
          </div>

          {/* Benchmark Toggle Pill */}
          <div className="flex items-center justify-between p-3.5 bg-surface-solid/40 border border-border/60 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-primary">
                Execute Process-Isolated Benchmark
              </span>
              <span className="text-[11px] text-text-muted">
                Measures runtime across 5 steps with a 1.0s hard safety timeout.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={runBenchmark}
                onChange={(e) => setRunBenchmark(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-solid border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Primary CTA Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !pattern.trim()}
            className="w-full pill-btn py-3.5 px-6 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-tight shadow-glow-primary flex items-center justify-center gap-2 mt-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Running Static Analysis & Isolated Worker...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Run Analysis</span>
                <Sparkles className="w-3.5 h-3.5 text-primary-tint ml-1 opacity-75" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
