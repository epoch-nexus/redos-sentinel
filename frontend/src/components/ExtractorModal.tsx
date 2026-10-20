import React, { useState } from 'react';
import { extractPatternsFromPython } from '../api';
import { X, Terminal, Loader2, ArrowRight, Code } from 'lucide-react';
import { PillButton } from './ui/PillButton';

interface ExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPattern: (pattern: string) => void;
}

const SAMPLE_PYTHON = `import re

# Authentication email validation
email_validator = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")

# Vulnerable query parser (nested quantifier)
tag_matcher = re.search(r"^(a+)+$", user_input)

# Ambiguous branch matcher (overlapping alternation)
path_cleaner = re.match(r"(a|aa)+", file_path)
`;

export const ExtractorModal: React.FC<ExtractorModalProps> = ({
  isOpen,
  onClose,
  onSelectPattern,
}) => {
  const [sourceCode, setSourceCode] = useState(SAMPLE_PYTHON);
  const [extracted, setExtracted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const patterns = await extractPatternsFromPython(sourceCode);
      setExtracted(patterns);
      if (patterns.length === 0) {
        setError('No regex literals found in re.compile, re.search, re.match, or re.fullmatch calls.');
      }
    } catch (err: any) {
      setError(err.message || 'Extraction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-orangeLight border border-brand-orangeBorder flex items-center justify-center text-brand-orange">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-textDark tracking-tight">
                Python AST Regex Extractor
              </h3>
              <p className="text-xs text-textMuted">
                Extract literal patterns from re.compile, re.search, re.match, or re.fullmatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-textMuted hover:text-textDark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-2 font-mono">
              Paste Python Source Code
            </label>
            <textarea
              rows={8}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-mono text-xs text-textDark placeholder-gray-400 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              placeholder="Paste Python script here..."
            />
          </div>

          <div className="flex justify-end">
            <PillButton
              variant="primary"
              size="md"
              onClick={handleExtract}
              disabled={isLoading || !sourceCode.trim()}
              icon={
                isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Code className="w-4 h-4 text-white" />
                )
              }
            >
              {isLoading ? 'Scanning AST...' : 'Extract Literals'}
            </PillButton>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700">
              {error}
            </div>
          )}

          {extracted.length > 0 && (
            <div className="space-y-2 mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-textMuted font-mono block">
                Found {extracted.length} Regex Pattern{extracted.length > 1 ? 's' : ''} (Click to Load):
              </span>
              <div className="space-y-2">
                {extracted.map((pat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectPattern(pat);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-gray-50 hover:bg-brand-orangeLight border border-gray-200 hover:border-brand-orangeBorder text-xs font-mono text-textDark flex items-center justify-between group transition-all"
                  >
                    <span className="truncate pr-2">{pat}</span>
                    <span className="px-3 py-1 rounded-full bg-white group-hover:bg-brand-orange group-hover:text-white border border-gray-200 group-hover:border-transparent text-[11px] font-semibold text-textMuted shrink-0 flex items-center gap-1 shadow-sm transition-all">
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
