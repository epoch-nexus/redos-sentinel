import logging
from typing import List, Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Defensive imports supporting both root execution and backend/ subdirectory execution
try:
    from backend.schemas import (
        AnalyzeRequest,
        AnalyzeResponse,
        BenchmarkResult,
        Signal,
        ExtractRequest,
    )
    from backend.analysis_rules import analyze_pattern
    from backend.benchmark_runner import run_isolated_benchmark
    from backend.ast_extractor import extract_regexes_from_code
except ImportError:
    try:
        from schemas import (
            AnalyzeRequest,
            AnalyzeResponse,
            BenchmarkResult,
            Signal,
            ExtractRequest,
        )
        from analysis_rules import analyze_pattern
        from benchmark_runner import run_isolated_benchmark
        from ast_extractor import extract_regexes_from_code
    except ImportError:
        from app.schemas import (
            AnalyzeRequest,
            AnalyzeResponse,
            BenchmarkResult,
            Signal,
            ExtractRequest,
        )
        from app.analysis_rules import analyze_pattern
        from app.benchmark_runner import run_isolated_benchmark
        from app.ast_extractor import extract_regexes_from_code

# Configure logger
logger = logging.getLogger("redos_sentinel")
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="ReDoS Sentinel API",
    description="Regular Expression Denial of Service (ReDoS) Detection & Safe Benchmarking API",
    version="0.1.0",
)

# Unblock frontend integration via CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_regex(request: AnalyzeRequest):
    # 1. Run static heuristic analysis
    raw_signals = analyze_pattern(request.pattern)
    signals = [
        Signal(rule=s["rule"], message=s["message"])
        for s in raw_signals
    ]

    # Assign risk level based on detected signals
    risk_level = "high" if signals else "low"

    # 2. Execute bounded runtime benchmark if requested
    benchmark_results: List[BenchmarkResult] = []
    if request.run_benchmark:
        try:
            raw_benchmark = run_isolated_benchmark(request.pattern, request.test_string)
            benchmark_results = [
                BenchmarkResult(
                    input_length=item["input_length"],
                    elapsed_time_ms=item["elapsed_time_ms"],
                    status=item["status"],
                )
                for item in raw_benchmark
            ]
        except Exception as exc:
            # Shield the server: never allow multiprocessing or child errors to crash the API
            logger.exception("Benchmark execution failed unexpectedly for pattern '%s': %s", request.pattern, exc)
            benchmark_results = [
                BenchmarkResult(
                    input_length=len(request.test_string),
                    elapsed_time_ms=0.0,
                    status="error",
                )
            ]

    return AnalyzeResponse(
        pattern=request.pattern,
        risk_level=risk_level,
        signals=signals,
        benchmark=benchmark_results,
        limitations=["Heuristic result; not a formal complexity proof."],
    )


@app.post("/extract")
def extract_patterns(request: ExtractRequest) -> Dict[str, List[str]]:
    """Extracts regex string literals from Python source code AST."""
    patterns = extract_regexes_from_code(request.source_code)
    return {"patterns": patterns}
