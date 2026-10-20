import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Landing } from './Landing';
import { PageTransition } from './components/PageTransition';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GreetingBar } from './components/GreetingBar';
import { ScannerInputCard } from './components/ScannerInputCard';
import { SignalsCardGroup } from './components/SignalsCardGroup';
import { MetricCards } from './components/MetricCards';
import { BenchmarkHistoryCard } from './components/BenchmarkHistoryCard';
import { ExtractorModal } from './components/ExtractorModal';
import { Card } from './components/ui/Card';
import { analyzePattern, checkBackendHealth } from './api';
import { AnalyzeResponse } from './types';
import { AlertCircle, Code, Copy, Check, ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation state between Landing Page and Dashboard
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Input form state (defaults per specification)
  const [pattern, setPattern] = useState<string>('^(a+)+$');
  const [testString, setTestString] = useState<string>('aaaaaaaaaaaaaaaaaaaa!');
  const [runBenchmark, setRunBenchmark] = useState<boolean>(true);
  const [patternSearch, setPatternSearch] = useState<string>('');

  // Execution & API states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<AnalyzeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  // Modal & Raw JSON drawer
  const [isExtractorOpen, setIsExtractorOpen] = useState<boolean>(false);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // AbortController ref
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initial health check on mount
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      const healthy = await checkBackendHealth();
      if (isMounted) setIsBackendHealthy(healthy);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Preset loaders
  const handleLoadPreset = (type: 'nested' | 'overlapping' | 'safe') => {
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

  // Main Submit Action
  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pattern.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await analyzePattern(
        {
          pattern: pattern.trim(),
          test_string: testString.trim() || 'aaaaaaaaaaaaaaaaaaaa!',
          run_benchmark: runBenchmark,
        },
        controller.signal
      );
      setApiResponse(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to connect to backend at http://localhost:8000. Is the server running?';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!apiResponse) return;
    navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'landing' ? (
        <PageTransition key="landing-view">
          <Landing onLaunchDashboard={() => setCurrentView('dashboard')} />
        </PageTransition>
      ) : (
        <PageTransition key="dashboard-view">
          <div className="min-h-screen bg-canvas flex text-textDark">
      {/* Floating Left Vertical Capsule Sidebar (Mirrored from reference images) */}
      <Sidebar
        onOpenExtractor={() => setIsExtractorOpen(true)}
        onNavigateHome={() => setCurrentView('landing')}
      />

      {/* Main Layout Canvas */}
      <div className="flex-1 lg:pl-28 pr-4 sm:pr-8 pl-4 py-6 max-w-[1440px] mx-auto w-full flex flex-col justify-between">
        <div>
          {/* Top Header with Search Pill and Date Capsule */}
          <Header
            onOpenExtractor={() => setIsExtractorOpen(true)}
            isBackendHealthy={isBackendHealthy}
            patternSearch={patternSearch}
            setPatternSearch={setPatternSearch}
            onNavigateHome={() => setCurrentView('landing')}
          />

          {/* Action Bar Greeting & Preset Buttons */}
          <GreetingBar
            onLoadPreset={handleLoadPreset}
            onRunAnalysis={handleRunAnalysis}
            isLoading={isLoading}
            disabled={!pattern.trim()}
          />

          {/* Global Error Banner if API is down */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3 text-xs shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-red-900 block mb-0.5">API Connection Error</span>
                <p className="text-red-700">{errorMessage}</p>
                <div className="mt-1 text-[11px] text-red-600 font-mono">
                  Make sure backend is running: <code className="bg-white px-1.5 py-0.5 rounded border border-red-200">uvicorn main:app --reload --port 8000</code>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-500 hover:text-red-800 font-semibold text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Bento Grid Content */}
          <div className="space-y-6">
            {/* Row 1: 4-Grid Metric Cards (Orange Card, Dot Matrix, Concentric Ring, Sandbox Budget) */}
            <MetricCards
              riskLevel={apiResponse?.risk_level ?? null}
              signals={apiResponse?.signals ?? []}
              benchmark={apiResponse?.benchmark ?? []}
            />

            {/* Row 2: Scanner Input (5 cols) & Activity Sub-Cards (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <ScannerInputCard
                  pattern={pattern}
                  setPattern={setPattern}
                  testString={testString}
                  setTestString={setTestString}
                  runBenchmark={runBenchmark}
                  setRunBenchmark={setRunBenchmark}
                  onRunAnalysis={handleRunAnalysis}
                  isLoading={isLoading}
                />
              </div>

              <div className="lg:col-span-7">
                <SignalsCardGroup
                  riskLevel={apiResponse?.risk_level ?? null}
                  signals={apiResponse?.signals ?? []}
                  pattern={apiResponse?.pattern ?? pattern}
                />
              </div>
            </div>

            {/* Row 3: Bottom Full-Width Benchmark History & Chart (Transactions History format) */}
            <div>
              <BenchmarkHistoryCard
                benchmark={apiResponse?.benchmark ?? []}
                hasRun={!!apiResponse}
              />
            </div>

            {/* Collapsible Raw API Output & Limitations */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs font-semibold text-textMuted hover:text-textDark flex items-center gap-1.5 transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showRawJson ? 'Hide Raw API Response' : 'View Raw API Response & Limitations'}</span>
                </button>

                {showRawJson && apiResponse && (
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-textMuted flex items-center gap-1 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
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

              {showRawJson && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
                  <Card variant="white" className="p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted font-mono block mb-2">
                      Raw JSON Response
                    </span>
                    <pre className="h-44 overflow-y-auto p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-textDark">
                      {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// No response yet'}
                    </pre>
                  </Card>

                  <Card variant="white" className="p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted font-mono block mb-2 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-brand-orange" />
                      Scope & Limitations
                    </span>
                    <div className="h-44 overflow-y-auto p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-textMuted space-y-2">
                      <p>
                        <strong className="text-textDark">Static Heuristic Engine:</strong> Detects common catastrophic nested repetitions and overlapping alternations in linear O(N) time.
                      </p>
                      <p>
                        <strong className="text-textDark">Empirical Benchmark:</strong> Matches run in an isolated subprocess with a 1.0s hard timeout to protect server threads.
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 mt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-textMuted gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-textDark">ReDoS Sentinel</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span>&middot; Designed after Orbix Studio & InvestIQ Reference Architecture</span>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px]">
            <span>FastAPI Backend (Port 8000)</span>
            <span>&middot;</span>
            <span>React 18 &middot; Recharts &middot; Tailwind</span>
          </div>
        </footer>
      </div>

      {/* Python AST Extractor Modal */}
      <ExtractorModal
        isOpen={isExtractorOpen}
        onClose={() => setIsExtractorOpen(false)}
        onSelectPattern={(newPat) => {
          setPattern(newPat);
          setTestString('aaaaaaaaaaaaaaaaaaaa!');
        }}
      />
          </div>
        </PageTransition>
      )}
    </AnimatePresence>
  );
};
