import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.analysis_rules import analyze_pattern
from backend.benchmark_runner import run_isolated_benchmark
from backend.ast_extractor import extract_regexes_from_code

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_analyze_safe():
    res = client.post("/analyze", json={"pattern": "^[a-z]+$", "run_benchmark": False})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "low"
    assert len(data["signals"]) == 0
    assert data["benchmark"] == []


def test_analyze_nested_quantifier():
    res = client.post("/analyze", json={"pattern": "^(a+)+$", "run_benchmark": False})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "high"
    assert any(s["rule"] == "nested_quantifier" for s in data["signals"])


def test_analyze_overlapping_alternation():
    res = client.post("/analyze", json={"pattern": "^(a|aa)+$", "run_benchmark": False})
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "high"
    assert any(s["rule"] == "overlapping_alternation" for s in data["signals"])


def test_benchmark_safe_pattern():
    res = client.post("/analyze", json={"pattern": "^[0-9]+$", "run_benchmark": True, "test_string": "12345"})
    assert res.status_code == 200
    data = res.json()
    assert len(data["benchmark"]) == 5
    assert all(b["status"] == "completed" for b in data["benchmark"])


def test_benchmark_timeout_pattern():
    res = client.post("/analyze", json={"pattern": "^(a+)+$", "run_benchmark": True, "test_string": "aaaaaaaaaaaaaaaaaaaa!"})
    assert res.status_code == 200
    data = res.json()
    assert len(data["benchmark"]) == 5
    assert any(b["status"] == "timeout" for b in data["benchmark"])


def test_extract_python_ast():
    source = r'''
import re

p1 = re.compile(r"^(a+)+$")
p2 = re.search(r"(a|aa)+", text)
dynamic = get_regex()
p3 = re.match(dynamic, text)
'''
    res = client.post("/extract", json={"source_code": source})
    assert res.status_code == 200
    data = res.json()
    assert "patterns" in data
    assert "^(a+)+$" in data["patterns"]
    assert "(a|aa)+" in data["patterns"]
    assert len(data["patterns"]) == 2
