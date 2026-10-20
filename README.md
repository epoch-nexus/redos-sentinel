# ReDoS Sentinel

> **Defend Against Regular Expression Denial of Service.**  
> Real-time static heuristics, Python AST extraction, and process-isolated runtime benchmarking to detect and demonstrate catastrophic backtracking vulnerabilities before they crash production systems.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.14-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind%20CSS-61DAFB.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Enforced-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Motion](https://img.shields.io/badge/Animations-Framer%20Motion%20%7C%20View%20Transitions-F08F90.svg)](https://www.framer.com/motion/)
[![Security](https://img.shields.io/badge/Security-Isolated%20Child%20Process%20Sandbox-red.svg)](#)

---

## Architecture and Project Structure

```text
redos-sentinel/
├── backend/
│   ├── main.py                     # FastAPI application with CORS & error shielding
│   ├── schemas.py                  # Strict Pydantic models (AnalyzeRequest, Signal, etc.)
│   ├── analysis_rules.py           # Linear O(N) deterministic static heuristic engine
│   ├── benchmark_runner.py         # Process-isolated worker with 1.0s parent timeout
│   ├── ast_extractor.py            # Python AST scanner for regex string literals
│   ├── requirements.txt            # Python dependencies (fastapi, uvicorn, pydantic, pytest)
│   └── tests/
│       └── test_suite.py           # Pytest integration & unit test suite
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Root coordinator with AnimatePresence view transitions
│   │   ├── Landing.tsx             # Fullscreen video landing page (Space Grotesk + Inter)
│   │   ├── api.ts                  # Typed client with AbortController signal handling
│   │   ├── types.ts                # TypeScript API contract mirrors
│   │   ├── index.css               # Design tokens, view transition keyframes, & gradients
│   │   ├── main.tsx                # React DOM entry point
│   │   └── components/
│   │       ├── Header.tsx          # Top nav with search pill, date capsule, & API health status
│   │       ├── Sidebar.tsx         # Floating vertical capsule nav with home navigation
│   │       ├── GreetingBar.tsx     # Quick preset loaders (Nested, Overlapping, Safe)
│   │       ├── ScannerInputCard.tsx# Pattern input, custom test string, & benchmark toggle
│   │       ├── SignalsCardGroup.tsx# Static heuristic findings, risk badges, & explanations
│   │       ├── MetricCards.tsx     # Bento metric cards (Risk Level, Signal Count, Budget)
│   │       ├── BenchmarkHistoryCard.tsx # Recharts empirical growth curves & timeout flags
│   │       ├── ExtractorModal.tsx  # AST regex extraction modal for Python code
│   │       ├── PageTransition.tsx  # Smooth cubic-bezier page transitions via Framer Motion
│   │       └── ui/
│   │           ├── Card.tsx        # Styled surface primitive (white, orange, dark variants)
│   │           └── PillButton.tsx  # Standardized pill action buttons
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── fixtures/
│   ├── risky_patterns.json         # Curated vulnerable regex patterns
│   └── control_patterns.json       # Curated safe control patterns (RFC emails, ISO dates)
├── pytest.ini                      # Pytest configuration
└── .gitignore
```

---

## Core Capabilities

1. **Deterministic Static Heuristics (Linear $\mathcal{O}(N)$)**:
   - Identifies nested repetition structures: `(a+)+`, `(a*)*`, `([b-d]+)*`
   - Identifies overlapping alternation under repetition: `(a|aa)+`, `(a|a)+`
   - Zero false-positives on standard control patterns (`^[a-zA-Z0-9]+$`, RFC 5322 emails, ISO 8601 timestamps).

2. **Process-Isolated Safe Benchmarking**:
   - Matches are executed inside a standalone child process spawned via `multiprocessing.get_context("spawn")`.
   - The parent process enforces an unyielding **1.0-second timeout** per benchmark step.
   - If a catastrophic pattern hangs, the parent executes `process.terminate()` followed by `process.kill()`, guaranteeing **zero zombies and zero API thread freezes**.

3. **Python AST Literal Regex Extractor**:
   - Safely parses arbitrary Python source code using the standard library `ast` module.
   - Discovers literal regular expressions passed to `re.compile()`, `re.search()`, `re.match()`, and `re.fullmatch()`.

4. **Dual-Mode Cyber-Security Interface**:
   - **Video Landing Page**: Dark theme with high-contrast metallic typography (**Space Grotesk** headlines, **Inter** body), concentric radar rings, and HTML5 looping background video.
   - **Bento Grid Dashboard**: Soft-radius cards, Recharts empirical scaling curves distinguishing completed steps from timeouts, and raw JSON inspectors.
   - **Seamless Transitions**: Fluid cross-fades between the Landing Page and Dashboard orchestrated with Framer Motion and View Transitions API rules.

---

## Quickstart Guide

### Prerequisites
- Python 3.10+ (tested with Python 3.14)
- Node.js 18+ & npm

---

### Step 1: Start the Backend (Port 8000)

```bash
# From the repository root
cd backend

# Create and activate virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- **Health check**: [http://localhost:8000/health](http://localhost:8000/health)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Step 2: Start the Frontend (Port 5173)

```bash
# In a new terminal window
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Running the Automated Test Suite

### Backend Pytest Suite
From the repository root:
```bash
pytest
```
*(Runs 7/7 tests covering health checks, static heuristics, isolated timeouts, safe benchmarks, and AST extraction).*

### Frontend Production Build & Type Checking
```bash
cd frontend
npm run build
```
*(Runs TypeScript compiler `tsc -b` and Vite production bundler).*

---

## API Contract Reference

### `POST /analyze`
**Request Payload:**
```json
{
  "pattern": "^(a+)+$",
  "test_string": "aaaaaaaaaaaaaaaaaaaa!",
  "run_benchmark": true
}
```

**Response Payload:**
```json
{
  "pattern": "^(a+)+$",
  "risk_level": "high",
  "signals": [
    {
      "rule": "nested_quantifier",
      "message": "A repeated group contains another repetition operator, creating exponential backtracking risk."
    }
  ],
  "benchmark": [
    { "input_length": 9,  "elapsed_time_ms": 0.04,   "status": "completed" },
    { "input_length": 15, "elapsed_time_ms": 0.36,   "status": "completed" },
    { "input_length": 21, "elapsed_time_ms": 21.24,  "status": "completed" },
    { "input_length": 27, "elapsed_time_ms": 1000.0, "status": "timeout" },
    { "input_length": 33, "elapsed_time_ms": 1000.0, "status": "timeout" }
  ],
  "limitations": [
    "Heuristic result; not a formal complexity proof."
  ]
}
```

### `POST /extract`
**Request Payload:**
```json
{
  "source_code": "import re\np1 = re.compile(r'^(a+)+$')"
}
```

**Response Payload:**
```json
{
  "patterns": ["^(a+)+$"]
}
```

---

## License
MIT License. Built for security engineers, DevOps professionals, and backend developers.
