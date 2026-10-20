import React from 'react';
import { Shield, Zap, Terminal, LogOut } from 'lucide-react';

interface SidebarProps {
  onOpenExtractor: () => void;
  activeItem?: string;
  onNavigateHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenExtractor, onNavigateHome }) => {
  return (
    <aside className="hidden lg:flex flex-col justify-between items-center w-16 py-6 bg-white rounded-full border border-gray-200/80 shadow-soft fixed left-6 top-8 bottom-8 z-30">
      {/* Top action: Menu / Logo dot */}
      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={onNavigateHome}
          className="w-10 h-10 rounded-full bg-brand-orangeLight border border-brand-orangeBorder flex items-center justify-center text-brand-orange hover:scale-105 transition-transform"
          title="Return to Landing Page"
        >
          <Shield className="w-5 h-5" />
        </button>

        {/* Capsule Navigation Icons */}
        <nav className="flex flex-col items-center space-y-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-textMuted hover:text-textDark transition-colors"
            title="Overview (Scroll to Top)"
          >
            <Zap className="w-4 h-4 text-brand-orange" />
          </button>
          <button
            onClick={onOpenExtractor}
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-textMuted hover:text-textDark transition-colors"
            title="Python AST Scanner"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Bottom exit icon */}
      <div>
        <button
          onClick={onNavigateHome || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
          className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-textMuted hover:text-textDark transition-colors"
          title="Return to Landing Page"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
