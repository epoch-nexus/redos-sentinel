/**
 * Exact API Contracts for ReDoS Sentinel
 */

export interface AnalyzeRequest {
  pattern: string;
  test_string: string;
  run_benchmark: boolean;
}

export interface Signal {
  rule: string;
  message: string;
}

export interface BenchmarkResult {
  input_length: number;
  elapsed_time_ms: number;
  status: 'completed' | 'timeout' | 'error';
}

export interface AnalyzeResponse {
  pattern: string;
  risk_level: string;
  signals: Signal[];
  benchmark: BenchmarkResult[];
  limitations: string[];
}

export interface ExtractRequest {
  source_code: string;
}

export interface ExtractResponse {
  patterns: string[];
}
