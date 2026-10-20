import { AnalyzeRequest, AnalyzeResponse, ExtractResponse } from './types';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Analyzes a regex pattern with optional isolated benchmarking.
 */
export async function analyzePattern(
  request: AnalyzeRequest,
  signal?: AbortSignal
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Server error');
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Extracts literal regex patterns from Python source code AST.
 */
export async function extractPatternsFromPython(
  sourceCode: string,
  signal?: AbortSignal
): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ source_code: sourceCode }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Extraction failed (${response.status})`);
  }

  const data: ExtractResponse = await response.json();
  return data.patterns;
}

/**
 * Pings backend health endpoint.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
