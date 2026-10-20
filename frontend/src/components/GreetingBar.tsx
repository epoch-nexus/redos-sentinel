import React from 'react';
import { PillButton } from './ui/PillButton';
import { Play, Loader2, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface GreetingBarProps {
  onLoadPreset: (type: 'nested' | 'overlapping' | 'safe') => void;
  onRunAnalysis: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const GreetingBar: React.FC<GreetingBarProps> = ({
  onLoadPreset,
  onRunAnalysis,
  isLoading,
  disabled,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-2">
      {/* Left Headline */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-textDark">
          ReDoS Sentinel
        </h1>
        <p className="text-sm text-textMuted mt-1">
          Statically analyze and benchmark regular expressions.
        </p>
      </div>

      {/* Right Action Bar Pill Buttons (Replicating Filters, Exports, + Add card) */}
      <div className="flex flex-wrap items-center gap-2.5">
        <PillButton
          variant="outline"
          size="md"
          icon={<Sparkles className="w-3.5 h-3.5 text-brand-orange" />}
          onClick={() => onLoadPreset('nested')}
          type="button"
        >
          Load Nested
        </PillButton>

        <PillButton
          variant="outline"
          size="md"
          icon={<Layers className="w-3.5 h-3.5 text-amber-600" />}
          onClick={() => onLoadPreset('overlapping')}
          type="button"
        >
          Load Overlapping
        </PillButton>

        <PillButton
          variant="outline"
          size="md"
          icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
          onClick={() => onLoadPreset('safe')}
          type="button"
        >
          Load Safe
        </PillButton>

        {/* Primary Vibrant Orange CTA Button */}
        <PillButton
          variant="primary"
          size="lg"
          icon={
            isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white text-white" />
            )
          }
          onClick={onRunAnalysis}
          disabled={isLoading || disabled}
          type="button"
          className="shadow-orange-glow font-bold text-sm tracking-tight"
        >
          {isLoading ? 'Analyzing...' : 'Run Analysis'}
        </PillButton>
      </div>
    </div>
  );
};
