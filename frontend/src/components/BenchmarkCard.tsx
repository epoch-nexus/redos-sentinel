import React from 'react';
import { BenchmarkResult } from '../types';
import { IsometricStopwatch } from './IsometricIcons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Dot,
} from 'recharts';
import { Clock, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

interface BenchmarkCardProps {
  benchmark: BenchmarkResult[];
  hasRun: boolean;
}

export const BenchmarkCard: React.FC<BenchmarkCardProps> = ({ benchmark, hasRun }) => {
  // Chart data formatting: only plot numeric times for completed runs to avoid skewing Y-axis
  const chartData = benchmark.map((item) => ({
    input_length: item.input_length,
    elapsed_ms: item.status === 'completed' ? item.elapsed_time_ms : null,
    status: item.status,
    raw_item: item,
  }));

  const hasTimeouts = benchmark.some((b) => b.status === 'timeout');

  // Custom Dot renderer for completed vs timeout
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.status === 'timeout') {
      return (
        <svg key={`dot-${payload.input_length}`} x={cx - 6} y={cy - 6} width={12} height={12}>
          <circle cx="6" cy="6" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );
    }
    return <Dot key={`dot-${payload.input_length}`} cx={cx} cy={cy} r={4} fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />;
  };

  return (
    <div className="bento-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <IsometricStopwatch size={36} />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tighter lowercase text-white">
                runtime benchmark
              </h2>
              <p className="text-xs text-text-muted">Process-isolated execution scaling analysis</p>
            </div>
          </div>

          {/* Status summary pill */}
          {hasRun && (
            <div className="flex items-center gap-2">
              {hasTimeouts ? (
                <div className="pill-btn px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-glow-error">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Hard Timeout Triggered</span>
                </div>
              ) : (
                <div className="pill-btn px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-glow-accent">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Steps Completed</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chart Area */}
        {!hasRun || benchmark.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center rounded-3xl bg-surface-solid/30 border border-border/40 p-6">
            <Clock className="w-10 h-10 text-text-muted/60 mb-2.5 animate-pulse" />
            <h4 className="text-sm font-semibold text-text-primary mb-1">No Benchmark Measurements</h4>
            <p className="text-xs text-text-muted max-w-sm">
              Enable "Execute Process-Isolated Benchmark" and run analysis to measure real runtime growth across increasing candidate string lengths.
            </p>
          </div>
        ) : (
          <div>
            <div className="h-56 sm:h-64 w-full bg-surface-solid/40 rounded-3xl p-3 border border-border/60 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                  <XAxis
                    dataKey="input_length"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: 'Input Length (chars)', position: 'insideBottom', offset: -5, fill: '#94A3B8', fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: 'Elapsed (ms)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-surface-solid border border-border p-3 rounded-2xl shadow-xl text-xs font-mono">
                            <p className="text-text-muted mb-1 font-sans">
                              Length: <span className="text-white font-bold">{data.input_length} chars</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              Status:
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                  data.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                                }`}
                              >
                                {data.status}
                              </span>
                            </p>
                            {data.status === 'completed' ? (
                              <p className="text-primary-tint mt-1">
                                Time: <span className="font-bold">{data.elapsed_ms?.toFixed(2)} ms</span>
                              </p>
                            ) : (
                              <p className="text-red-400 mt-1">
                                &gt; 1,000.00 ms (Hard Timeout)
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="elapsed_ms"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={renderCustomDot}
                    activeDot={{ r: 6, fill: '#3B82F6', stroke: '#FFFFFF', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Table Breakdown of Test Runs */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-border/70 text-text-muted uppercase text-[10px] tracking-wider">
                    <th className="py-2 px-3">Step</th>
                    <th className="py-2 px-3">Input Length</th>
                    <th className="py-2 px-3">Elapsed Time</th>
                    <th className="py-2 px-3 text-right">Process Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {benchmark.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-solid/30 transition-colors">
                      <td className="py-2 px-3 text-text-muted">#{idx + 1}</td>
                      <td className="py-2 px-3 text-white font-bold">{item.input_length} chars</td>
                      <td className="py-2 px-3">
                        {item.status === 'timeout' ? (
                          <span className="text-red-400 font-semibold">&gt; 1,000 ms</span>
                        ) : (
                          <span className="text-primary-tint">{item.elapsed_time_ms.toFixed(2)} ms</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'timeout'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-glow-error animate-pulse'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-accent" />
          Safety: Worker runs in separate child process with SIGKILL timeout
        </span>
        <span className="font-mono text-text-muted/70">Budget: 1.0s / step</span>
      </div>
    </div>
  );
};
