"""ast_extractor.py - Static AST Extractor for Regex Literals in Python Code

Parses Python source code into an Abstract Syntax Tree (AST) to identify
calls to re.compile, re.search, re.match, and re.fullmatch, extracting string literal patterns.
"""
import ast
from typing import List


def extract_regexes_from_code(source_code: str) -> List[str]:
    """
    Parses Python source code and extracts literal regex pattern strings passed to:
    - re.compile(...)
    - re.search(...)
    - re.match(...)
    - re.fullmatch(...)

    Skips dynamic variables or complex expressions gracefully.
    Returns a list of extracted literal regex strings.
    """
    patterns: List[str] = []
    if not source_code or not source_code.strip():
        return patterns

    try:
        tree = ast.parse(source_code)
    except SyntaxError:
        # Fail gracefully on unparseable or malformed source code
        return []

    target_funcs = {"compile", "search", "match", "fullmatch"}

    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue

        is_re_target = False

        # Case 1: re.<function>(...)
        if isinstance(node.func, ast.Attribute):
            if (
                isinstance(node.func.value, ast.Name)
                and node.func.value.id == "re"
                and node.func.attr in target_funcs
            ):
                is_re_target = True

        # Case 2: direct call if imported (e.g., from re import compile, search, match, fullmatch)
        elif isinstance(node.func, ast.Name) and node.func.id in target_funcs:
            is_re_target = True

        if not is_re_target:
            continue

        # Extract regex pattern (1st positional argument or keyword argument 'pattern')
        pattern_node = None
        if node.args:
            pattern_node = node.args[0]
        elif node.keywords:
            for kw in node.keywords:
                if kw.arg == "pattern":
                    pattern_node = kw.value
                    break

        # Only extract string literals (ast.Constant where value is str)
        if pattern_node is not None and isinstance(pattern_node, ast.Constant):
            if isinstance(pattern_node.value, str):
                patterns.append(pattern_node.value)

    return patterns


if __name__ == "__main__":
    sample_code = r'''
import re

email_re = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
search_res = re.search(r"^(a+)+$", user_input)
match_res = re.match(r"(a|aa)+", user_input)
fullmatch_res = re.fullmatch(r"^\d{4}-\d{2}-\d{2}$", date_str)

# Dynamic calls that must be safely skipped:
dynamic_pattern = get_dynamic_regex()
skipped_call = re.compile(dynamic_pattern)
'''
    extracted = extract_regexes_from_code(sample_code)
    print("Extracted patterns:", extracted)
    assert len(extracted) == 4
    assert "^(a+)+$" in extracted
    assert "(a|aa)+" in extracted
    print("ast_extractor self-test passed!")
