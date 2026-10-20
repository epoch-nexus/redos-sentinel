"""analysis_rules.py - Core Static ReDoS Heuristic Engine

Fast, safe static analysis for identifying common catastrophic backtracking structures
without formal NFA/automaton parsing. Operates deterministically in linear O(N) time.
"""
from typing import List, Dict, Tuple
import re


def _extract_parenthesized_groups(pattern: str) -> List[Tuple[int, int, str, str]]:
    """
    Extracts top-level and nested parenthesized groups along with their trailing quantifiers.
    Returns list of tuples: (start_idx, end_idx, inner_content, quantifier)
    Uses a safe stack-based traversal that cannot backtrack.
    """
    n = len(pattern)
    i = 0
    stack: List[int] = []
    groups: List[Tuple[int, int, str, str]] = []

    while i < n:
        char = pattern[i]
        # Skip escaped characters safely
        if char == "\\":
            i += 2
            continue
        elif char == "(":
            stack.append(i)
        elif char == ")" and stack:
            start = stack.pop()
            end = i
            # Lookahead for immediate trailing quantifier (+, *, ?, or {n,m})
            quantifier = ""
            j = i + 1
            if j < n and pattern[j] in "+*?":
                quantifier = pattern[j]
            elif j < n and pattern[j] == "{":
                close_brace = pattern.find("}", j)
                if close_brace != -1:
                    quantifier = pattern[j : close_brace + 1]

            inner_content = pattern[start + 1 : end]
            groups.append((start, end, inner_content, quantifier))
        i += 1

    return groups


def _is_repetition_quantifier(quant: str) -> bool:
    """Checks if a quantifier implies repeated matching (+, *, or {n,m} with max > 1)."""
    if quant in ("+", "*"):
        return True
    if quant.startswith("{"):
        digits = re.findall(r"\d+", quant)
        if digits:
            # {n,} or {n,m} where m > 1 or {n} where n > 1
            if "," in quant:
                return True
            if int(digits[0]) > 1:
                return True
    return False


def _has_inner_repetition(content: str) -> bool:
    """Checks whether the inner content contains unescaped repetition operators outside character classes."""
    in_bracket = False
    k = 0
    n = len(content)

    while k < n:
        c = content[k]
        if c == "\\":
            k += 2
            continue
        elif c == "[":
            in_bracket = True
        elif c == "]":
            in_bracket = False
        elif not in_bracket and c in ("+", "*"):
            return True
        elif not in_bracket and c == "{":
            close_brace = content.find("}", k)
            if close_brace != -1 and re.findall(r"\d+", content[k : close_brace + 1]):
                return True
        k += 1

    return False


def _split_alternation_branches(content: str) -> List[str]:
    """Splits top-level alternation branches '|' while respecting nested parens and brackets."""
    branches: List[str] = []
    curr: List[str] = []
    p_depth = 0
    b_depth = 0
    idx = 0
    n = len(content)

    while idx < n:
        c = content[idx]
        if c == "\\":
            curr.append(content[idx : idx + 2])
            idx += 2
            continue
        elif c == "[":
            b_depth += 1
        elif c == "]":
            b_depth = max(0, b_depth - 1)
        elif c == "(":
            p_depth += 1
        elif c == ")":
            p_depth = max(0, p_depth - 1)
        elif c == "|" and p_depth == 0 and b_depth == 0:
            branches.append("".join(curr).strip())
            curr = []
            idx += 1
            continue
        curr.append(c)
        idx += 1

    if curr:
        branches.append("".join(curr).strip())

    return branches


def _branches_overlap(b1: str, b2: str) -> bool:
    """Checks if two alternation branches exhibit obvious structural overlap."""
    if not b1 or not b2:
        return False
    # 1. Identical branches: (a|a)
    if b1 == b2:
        return True
    # 2. Prefix overlap: (a|aa) or (aa|a) or (foo|foobar)
    if b1.startswith(b2) or b2.startswith(b1):
        return True
    # 3. Optional variations: e.g., 'a' and 'a?'
    if b1.rstrip("?*") == b2.rstrip("?*"):
        return True
    return False


def analyze_pattern(pattern: str) -> List[Dict[str, str]]:
    """
    Analyzes a regex pattern for structural ReDoS vulnerabilities.
    
    Checks for:
    1. Nested repetition: repeated groups that themselves contain repetition (e.g. (a+)+, (a*)*, ([b-d]+)*)
    2. Overlapping alternation with repetition: repeated groups containing overlapping alternatives (e.g. (a|a)+, (a|aa)+)
    
    Returns a list of dictionaries with 'rule' and 'message' keys.
    """
    signals: List[Dict[str, str]] = []
    groups = _extract_parenthesized_groups(pattern)

    nested_found = False
    overlap_found = False

    for _start, _end, content, quant in groups:
        if not _is_repetition_quantifier(quant):
            continue

        # Check a) Nested repetition
        if not nested_found and _has_inner_repetition(content):
            nested_found = True
            signals.append({
                "rule": "nested_quantifier",
                "message": "A repeated group contains another repetition operator, creating exponential backtracking risk.",
            })

        # Check b) Overlapping alternation with repetition
        if not overlap_found:
            branches = _split_alternation_branches(content)
            if len(branches) > 1:
                has_overlap = False
                for i in range(len(branches)):
                    for j in range(i + 1, len(branches)):
                        if _branches_overlap(branches[i], branches[j]):
                            has_overlap = True
                            overlap_found = True
                            signals.append({
                                "rule": "overlapping_alternation",
                                "message": (
                                    f'Repeated alternation with overlapping branches ("{branches[i]}" and '
                                    f'"{branches[j]}") detected, risking exponential ambiguity.'
                                ),
                            })
                            break
                    if has_overlap:
                        break

    return signals


if __name__ == "__main__":
    # Test 3 known risky patterns (must yield signals)
    risky_patterns = [
        "(a+)+",
        "(a*)*",
        "(a|aa)+",
    ]
    for p in risky_patterns:
        res = analyze_pattern(p)
        print(f"[RISKY] '{p}' -> {res}")
        assert len(res) > 0, f"Expected signals for risky pattern: {p}"

    # Additional risky checks
    assert len(analyze_pattern("([b-d]+)*")) > 0
    assert len(analyze_pattern("(a|a)+")) > 0

    # Test 3 safe patterns (must yield empty list)
    safe_patterns = [
        "^[a-z]+$",
        r"^\d{4}-\d{2}-\d{2}$",
        "^(apple|banana|cherry)$",
    ]
    for p in safe_patterns:
        res = analyze_pattern(p)
        print(f"[SAFE]  '{p}' -> {res}")
        assert len(res) == 0, f"Expected no signals for safe pattern: {p}"

    # Additional safe check
    assert len(analyze_pattern(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")) == 0

    print("\nAll ReDoS heuristic assertions passed successfully!")
