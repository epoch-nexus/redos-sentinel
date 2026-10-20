# ReDoS Sentinel 🛡️⚡

**ReDoS Sentinel** is a production-grade Regular Expression Denial of Service (ReDoS) vulnerability scanner. It combines fast, safe static AST heuristics with process-isolated empirical runtime benchmarking to detect and demonstrate catastrophic backtracking without risking server availability.

---

## Architecture & System Design

```
redos-sentinel/
├── backend/
│   ├── main.py                 # FastAPI application with CORS & error shielding
│   ├── schemas.py              # Strict Pydantic contracts (AnalyzeRequest, Signal, etc.)
│   ├── analysis_rules.py       # Linear O(N) deterministic static heuristic engine
│   ├── benchmark_runner.py     # Process-isolated child worker with 1.0s hard timeout
│   ├── ast_extractor.py        # Python AST extractor for literal regex patterns
│   ├── requirements.txt        # Backend dependencies (fastapi, uvicorn, pydantic)
│   └── tests/
│       └── test_suite.py       # Full pytest suite
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Bento Grid dashboard shell
│   │   ├── api.ts              # Fetch client with AbortController
│   │   ├── types.ts            # Strict TypeScript API contract interfaces
│   │   ├── index.css           # Design tokens, glassmorphism, & motion tokens
│   │   └── components/
│   │       ├── Navbar.tsx      # Floating nav with status pill & hairline glow
│   │       ├── InputCard.tsx   # Card 1: Pattern input, presets & benchmark toggle
│   │       ├── FindingsCard.tsx# Card 2: Risk badge & explanation cards
│   │       ├── BenchmarkCard.tsx# Card 3: Recharts scaling line & timeout markers
│   │       ├── RawOutputCard.tsx# Card 4: JSON contract viewer & scope disclaimer
│   │       ├── ExtractorModal.tsx# Python AST literal regex scanner modal
│   │       └── IsometricIcons.tsx# Custom extruded 3D isometric SVG icon set
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── fixtures/
    ├── risky_patterns.json     # Curated vulnerable pattern fixtures
    └── control_patterns.json   # Curated safe control pattern fixtures
```

---

## Key Features

1. **Deterministic Static Heuristics**:
   - Detects nested repetitions: `(a+)+`, `(a*)*`, `([b-d]+)*`
   - Detects overlapping alternation under repetition: `(a|aa)+`, `(a|a)+`
   - Zero false-positives on standard control patterns (`^[a-z]+$`, ISO dates, standard RFC 5322 emails).

2. **Process-Isolated Safe Benchmarking**:
   - Matches are executed in a spawned child process (`multiprocessing.get_context("spawn")`).
   - The parent process enforces a strict **1.0-second timeout** per test step (`queue.get(timeout=1.0)`).
   - If a catastrophic regex hangs, the parent calls `process.terminate()` and `process.kill()`, cleanly preventing zombie processes and server lockup.

3. **Modern Bento Grid Cyber-Security Dashboard**:
   - Built with React 18, Vite, TypeScript, TailwindCSS, and Recharts.
   - 4px spacing scale, 36px card radii, concentric padding, pill buttons, and joined capsules.
   - Recharts visualizer distinguishes completed runs from empirical timeout points without skewing Y-axis scales.

4. **Python AST Regex Extractor**:
   - Scans Python source snippets or files to extract literal regex strings passed to `re.compile`, `re.search`, `re.match`, or `re.fullmatch`.

---

## Getting Started

### 1. Start the Backend

```bash
cd backend
python3 -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API Health Check: `http://localhost:8000/health`
- Swagger Docs: `http://localhost:8000/docs`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running the Automated Tests

To run the complete backend integration and unit test suite:
```bash
python3 -m pytest backend/tests/test_suite.py -v
```

To build and type-check the frontend bundle:
```bash
cd frontend
npm run build
```

---

## API Contract

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
