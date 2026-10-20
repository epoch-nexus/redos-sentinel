import React from 'react';
import { Card } from './ui/Card';
import { BenchmarkResult } from '../types';
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
import { SlidersHorizontal, Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface BenchmarkHistoryCardProps {
  benchmark: BenchmarkResult[];
  hasRun: boolean;
}

export const BenchmarkHistoryCard: React.FC<BenchmarkHistoryCardProps> = ({
  benchmark,
  hasRun,
}) => {
  // Only plot numeric time for completed runs to avoid skewing Y-axis with dummy timeout values
  const chartData = benchmark.map((item) => ({
    input_length: item.input_length,
    elapsed_ms: item.status === 'completed' ? item.elapsed_time_ms : null,
    status: item.status,
    raw_item: item,
  }));

  const hasTimeouts = benchmark.some((b) => b.status === 'timeout');

  // Custom dot rendering: completed is orange, timeout is distinct red
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.status === 'timeout') {
      return (
        <svg key={`dot-${payload.input_length}`} x={cx - 6} y={cy - 6} width={12} height={12}>
          <circle cx="6" cy="6" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );
    }
    return (
      <Dot
        key={`dot-${payload.input_length}`}
        cx={cx}
        cy={cy}
        r={4.5}
        fill="#EA580C"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
    );
  };

  return (
    <Card variant="white" className="p-6 sm:p-7 w-full">
      {/* Header matching Transactions History */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-textDark tracking-tight">Benchmark History</h2>
          <p className="text-xs text-textMuted mt-0.5">
            Empirical runtime scaling across bounded input lengths.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {hasRun && (
            <div className="flex items-center space-x-2 mr-2">
              {hasTimeouts ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Hard Timeout Triggered
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Steps Completed
                </span>
              )}
            </div>
          )}

          <button
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-textMuted hover:text-textDark shadow-sm"
            title="Filter History"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Section */}
      {!hasRun || benchmark.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center rounded-2xl bg-gray-50/70 border border-gray-200/80 mb-6">
          <Clock className="w-8 h-8 text-gray-400 mb-2 animate-pulse" />
          <h4 className="text-sm font-semibold text-textDark mb-1">No Benchmark Executed</h4>
          <p className="text-xs text-textMuted max-w-sm">
            Enable "Run Benchmark" and click "Run Analysis" to measure real execution times in an isolated child process.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <div className="h-56 sm:h-64 w-full bg-gray-50/70 rounded-2xl p-3 border border-gray-200/80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 25, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="input_length"
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  label={{
                    value: 'Input String Length (chars)',
                    position: 'insideBottom',
                    offset: -5,
                    fill: '#6B7280',
                    fontSize: 10,
                  }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  label={{
                    value: 'Elapsed Time (ms)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#6B7280',
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-card text-xs font-mono">
                          <p className="text-textMuted mb-1 font-sans">
                            Length: <span className="text-textDark font-bold">{data.input_length} chars</span>
                          </p>
                          <p className="flex items-center gap-1.5 mb-1">
                            Status:
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                data.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {data.status}
                            </span>
                          </p>
                          {data.status === 'completed' ? (
                            <p className="text-brand-orange font-bold font-sans">
                              Elapsed: {data.elapsed_ms?.toFixed(2)} ms
                            </p>
                          ) : (
                            <p className="text-red-600 font-bold font-sans">
                              &gt; 1,000.00 ms (Hard Timeout)
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Vibrant Orange Line matching reference accent */}
                <Line
                  type="monotone"
                  dataKey="elapsed_ms"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  dot={renderCustomDot}
                  activeDot={{ r: 6, fill: '#EA580C', stroke: '#FFFFFF', strokeWidth: 2 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table Replicating Reference "Transactions history" Table */}
      {hasRun && benchmark.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 text-textMuted text-[11px] font-semibold">
                <th className="py-2.5 px-3">Test Step</th>
                <th className="py-2.5 px-3">Input Length</th>
                <th className="py-2.5 px-3">Process Status</th>
                <th className="py-2.5 px-3 text-right">Elapsed Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {benchmark.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                  {/* Step Name with icon replicating user avatar in reference */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-orangeLight border border-brand-orangeBorder flex items-center justify-center font-bold text-brand-orange text-[10px]">
                        #{idx + 1}
                      </div>
                      <span className="font-semibold text-textDark">
                        Benchmark Case {idx + 1}
                      </span>
                    </div>
                  </td>

                  {/* ID / Length */}
                  <td className="py-3 px-3 font-mono text-textMuted">
                    {item.input_length} characters
                  </td>

                  {/* Status Pill (Replicating green • Completed and red • Pending) */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'timeout'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'completed'
                            ? 'bg-emerald-500'
                            : item.status === 'timeout'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span className="capitalize">{item.status}</span>
                    </span>
                  </td>

                  {/* Amount / Elapsed Time in Orange/Red font */}
                  <td className="py-3 px-3 text-right font-bold font-mono">
                    {item.status === 'timeout' ? (
                      <span className="text-red-600">&gt; 1,000.00 ms</span>
                    ) : (
                      <span className="text-brand-orange">
                        {item.elapsed_time_ms.toFixed(2)} ms
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer notice */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-textMuted">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-brand-orange" />
          Subprocess Isolation: Executed in separate PID with SIGKILL timeout
        </span>
        <span className="font-mono text-textMuted">Safety budget: 1.0s / step</span>
      </div>
    </Card>
  );
};
