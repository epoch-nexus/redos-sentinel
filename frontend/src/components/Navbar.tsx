import React from 'react';
import { IsometricShield } from './IsometricIcons';
import { ShieldCheck, Cpu, TerminalSquare } from 'lucide-react';

interface NavbarProps {
  isBackendHealthy: boolean | null;
  onOpenExtractor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isBackendHealthy, onOpenExtractor }) => {
  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-full bg-surface-solid/80 backdrop-blur-xl border border-border/80 px-4 sm:px-6 py-3 shadow-glass flex items-center justify-between">
        {/* Glow trace line at top edge */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none" />

        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-surface-solid border border-primary/40 flex items-center justify-center shadow-glow-primary">
            <IsometricShield size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter lowercase leading-tight text-white flex items-center gap-1.5">
              redos sentinel
              <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            </span>
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono font-medium">
              Vulnerability Engine v0.1
            </span>
          </div>
        </div>

        {/* Center Pill / Quick Info */}
        <div className="hidden md:flex items-center space-x-1 bg-surface/60 rounded-full px-3 py-1.5 border border-border/50 text-xs text-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-accent mr-1" />
          <span>Static AST & Isolated Subprocess Benchmark</span>
        </div>

        {/* Right actions: Backend status & AST Extractor */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenExtractor}
            className="pill-btn px-3.5 py-1.5 bg-surface/70 hover:bg-primary/20 hover:border-primary/50 border border-border/70 text-xs font-medium text-text-primary flex items-center gap-1.5"
            title="Scan Python source file for regex literals"
          >
            <TerminalSquare className="w-3.5 h-3.5 text-primary-tint" />
            <span className="hidden sm:inline">Python AST Extractor</span>
            <span className="sm:hidden">AST</span>
          </button>

          {/* Backend Status indicator badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 border border-border/80 text-xs">
            <Cpu className="w-3.5 h-3.5 text-text-muted" />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendHealthy === true
                    ? 'bg-accent shadow-glow-accent'
                    : isBackendHealthy === false
                    ? 'bg-error shadow-glow-error animate-ping'
                    : 'bg-warning'
                }`}
              />
              <span className="font-mono text-[11px] text-text-muted hidden sm:inline">
                {isBackendHealthy === true
                  ? 'API: 8000'
                  : isBackendHealthy === false
                  ? 'API OFFLINE'
                  : 'CONNECTING...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
