import React from 'react';
import { Shield, Search, Calendar, Code, ShieldCheck, Terminal } from 'lucide-react';

interface HeaderProps {
  onOpenExtractor: () => void;
  isBackendHealthy: boolean | null;
  patternSearch: string;
  setPatternSearch: (val: string) => void;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExtractor,
  isBackendHealthy,
  patternSearch,
  setPatternSearch,
  onNavigateHome,
}) => {
  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 py-3 border-b border-gray-200/70 mb-4">
      {/* Brand Logo & Name (Replicating Orbix Studio / Finexy) */}
      <div
        onClick={onNavigateHome}
        className="flex items-center space-x-3 cursor-pointer group"
        title="Return to Landing Page"
      >
        <div className="w-10 h-10 rounded-2xl bg-textDark flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
          <Shield className="w-5 h-5 text-brand-orange" />
        </div>
        <div>
          <span className="text-base font-extrabold tracking-tight text-textDark block leading-tight">
            ReDoS Sentinel
          </span>
          <span className="text-[11px] text-textMuted font-mono block">
            Vulnerability Dashboard
          </span>
        </div>
      </div>

      {/* Middle: Clean Search Pill (Replicating "Start searching here..." from Image 1 & 2) */}
      <div className="flex-1 max-w-md mx-0 md:mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={patternSearch}
            onChange={(e) => setPatternSearch(e.target.value)}
            placeholder="Quick search pattern or rule..."
            className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-xs text-textDark placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange shadow-soft"
          />
        </div>
      </div>

      {/* Right Controls: Date Pill, AST Extractor, Status Avatar */}
      <div className="flex items-center space-x-2.5">
        {/* Date Pill Capsule (Exact replica of "19 Tue, December" in Image 1 & 2) */}
        <div className="hidden sm:flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 text-xs shadow-soft font-medium text-textDark">
          <Calendar className="w-3.5 h-3.5 text-brand-orange" />
          <span className="font-semibold">20 Oct, Tue</span>
        </div>

        {/* AST Extractor Pill */}
        <button
          onClick={onOpenExtractor}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-textDark shadow-soft transition-colors"
          title="Open Python AST Extractor"
        >
          <Terminal className="w-3.5 h-3.5 text-brand-orange" />
          <span className="hidden sm:inline">AST Scanner</span>
        </button>

        {/* API Docs Button */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-textDark shadow-soft transition-colors"
          title="Open Swagger API Docs"
        >
          <Code className="w-3.5 h-3.5 text-brand-orange" />
          <span className="hidden sm:inline">Docs</span>
        </a>

        {/* Backend Status Avatar Chip */}
        <div
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-soft ${
            isBackendHealthy === true
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : isBackendHealthy === false
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
          title={isBackendHealthy ? 'FastAPI Backend Online (Port 8000)' : 'Backend Offline'}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono hidden md:inline">
            {isBackendHealthy ? 'API 8000' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </header>
  );
};
