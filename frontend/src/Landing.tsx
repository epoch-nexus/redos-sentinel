import React, { useEffect, useRef } from 'react';
import {
  Shield,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Terminal,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface LandingProps {
  onLaunchDashboard?: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLaunchDashboard }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Guarantee seamless video playback across all browsers & mobile devices
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: unknown) => {
          // Autoplay policy prevented playback, video will play on first interaction
          console.warn('Autoplay prevented:', err);
        });
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden selection:bg-white/20 selection:text-white font-sans">
      {/* =========================================================================
          1. FULLSCREEN HTML5 BACKGROUND VIDEO (Guaranteed visible at z-0)
          ========================================================================= */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4"
          type="video/mp4"
        />
      </video>

      {/* =========================================================================
          2. HIGH-CONTRAST DARK OVERLAY (z-[1], ensures text contrast over video)
          ========================================================================= */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-[1]" />

      {/* =========================================================================
          3. RADAR CONCENTRIC RINGS & LASER AXIS (z-[2], Visual replica of reference)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[2] overflow-hidden">
        {/* Vertical laser beam running through center behind hero */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent" />
        <div className="absolute top-0 bottom-0 w-[60px] bg-gradient-to-b from-transparent via-white/5 to-transparent blur-xl" />

        {/* Concentric radar rings matching reference */}
        <div className="w-[300px] h-[300px] rounded-full border border-white/10 absolute animate-pulse duration-1000" />
        <div className="w-[520px] h-[520px] rounded-full border border-white/5 absolute" />
        <div className="w-[780px] h-[780px] rounded-full border border-white/[0.03] absolute" />
        <div className="w-[1080px] h-[1080px] rounded-full border border-white/[0.02] absolute" />

        {/* Subtle horizontal radar axis */}
        <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* =========================================================================
          4. FOREGROUND INTERACTIVE CONTENT (z-10)
          ========================================================================= */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen w-full">
        {/* TOP NAVIGATION BAR (Floating Pill Glassmorphism) */}
        <header className="w-full pt-6 px-4 sm:px-8">
          <nav className="max-w-5xl mx-auto rounded-full bg-zinc-950/60 backdrop-blur-xl border border-white/10 px-5 sm:px-7 py-3 flex items-center justify-between shadow-2xl shadow-black/80">
            {/* Logo Left */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base font-bold tracking-tight text-white font-heading">
                ReDoS Sentinel
              </span>
            </div>

            {/* Center Navigation Links (All fully functional) */}
            <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-zinc-400">
              <button
                onClick={onLaunchDashboard}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Overview
              </button>
              <button
                onClick={onLaunchDashboard}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={onLaunchDashboard}
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Engine
              </button>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-150 cursor-pointer"
              >
                API Docs
              </a>

              {/* Security Pill Badge linking to CWE-1333 */}
              <a
                href="https://cwe.mitre.org/data/definitions/1333.html"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold border border-white/15 flex items-center gap-1 transition-colors cursor-pointer"
                title="View CWE-1333 (ReDoS Specification)"
              >
                <span>Security</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-300" />
              </a>
            </div>

            {/* Right Action: Open Scanner CTA Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onLaunchDashboard}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-all duration-150 flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Open Scanner</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </nav>
        </header>

        {/* HERO SECTION (Dead-Center Alignment & High Contrast) */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 my-auto">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Subtle Protocol Pill Tag */}
            <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono tracking-wide backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Vulnerability Protection &middot; v0.1</span>
            </div>

            {/* Main Imposing Headline (Space Grotesk + White-to-Grey Gradient) */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] max-w-3xl font-heading text-gradient-headline filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Defend Against Regex Denial of Service.
            </h1>

            {/* Muted Subtext (Inter) */}
            <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed drop-shadow font-sans">
              Real-time static heuristics and safely isolated runtime benchmarking to detect exponential matching vulnerabilities before they crash your systems.
            </p>

            {/* Prominent White Pill-Shaped CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onLaunchDashboard}
                className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all duration-200 shadow-2xl shadow-white/20 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <span>Launch Dashboard</span>
                <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </main>

        {/* BOTTOM TECH-RAIL / PROTOCOL TICKER */}
        <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 text-xs font-mono text-zinc-400">
            {/* Badge 1: Heuristic Engine */}
            <div className="py-4 px-6 flex items-center justify-center space-x-2.5 hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span className="tracking-wide uppercase font-semibold">Heuristic Engine</span>
            </div>

            {/* Badge 2: Isolated Execution */}
            <div className="py-4 px-6 flex items-center justify-center space-x-2.5 hover:text-white transition-colors">
              <Cpu className="w-4 h-4 text-zinc-400" />
              <span className="tracking-wide uppercase font-semibold">Isolated Execution</span>
            </div>

            {/* Badge 3: AST Extraction */}
            <div className="py-4 px-6 flex items-center justify-center space-x-2.5 hover:text-white transition-colors">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span className="tracking-wide uppercase font-semibold">AST Extraction</span>
            </div>

            {/* Badge 4: Bounded Benchmarks */}
            <div className="py-4 px-6 flex items-center justify-center space-x-2.5 hover:text-white transition-colors">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="tracking-wide uppercase font-semibold">Bounded Benchmarks</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
