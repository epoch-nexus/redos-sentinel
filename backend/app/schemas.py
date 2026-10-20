from typing import List, Literal
from pydantic import BaseModel


class Signal(BaseModel):
    rule: str
    message: str


class BenchmarkResult(BaseModel):
    input_length: int
    elapsed_time_ms: float
    status: Literal["completed", "timeout", "error"]


class AnalyzeRequest(BaseModel):
    pattern: str
    test_string: str = "aaaaaaaaaaaaaaaaaaaa!"
    run_benchmark: bool = False


class AnalyzeResponse(BaseModel):
    pattern: str
    risk_level: str
    signals: List[Signal]
    benchmark: List[BenchmarkResult]
    limitations: List[str]


class ExtractRequest(BaseModel):
    source_code: str
