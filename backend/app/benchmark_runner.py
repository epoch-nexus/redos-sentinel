"""benchmark_runner.py - Process-Isolated Safe Regex Benchmark Runner

Safely benchmarks regular expressions against bounded candidate input lengths.
Matches are executed in a strictly isolated child process with a hard 1.0-second timeout
to guarantee that catastrophic backtracking never stalls or crashes the main server process.
"""
import multiprocessing
import queue
import re
import time
from typing import List, Dict, Any


def isolated_worker(pattern: str, test_string: str, result_queue: multiprocessing.Queue) -> None:
    """
    Worker function executed inside an isolated child process.
    Defined at the module level so it is picklable across process boundaries.
    Executes re.match and puts elapsed execution time and outcome status into result_queue.
    """
    try:
        start_time = time.perf_counter()
        re.match(pattern, test_string)
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        result_queue.put({
            "status": "completed",
            "elapsed_time_ms": elapsed_ms,
        })
    except Exception as exc:
        result_queue.put({
            "status": "error",
            "elapsed_time_ms": 0.0,
            "error_message": str(exc),
        })


def _generate_test_strings(base_string: str) -> List[str]:
    """Generates an array of 5 progressively longer test strings based on base_string."""
    if not base_string:
        base_string = "aaaaaaaaaaaaaaaaaaaa!"

    # If base string has a non-alphanumeric sentinel suffix (e.g. '!')
    if len(base_string) > 1 and not base_string[-1].isalnum():
        repeat_char = base_string[0]
        suffix = base_string[-1]
    else:
        repeat_char = base_string[0]
        suffix = base_string[1:] if len(base_string) > 1 else ""

    # 5 progressively longer multipliers
    steps = [8, 14, 20, 26, 32]
    return [(repeat_char * count) + suffix for count in steps]


def run_isolated_benchmark(pattern: str, base_string: str) -> List[Dict[str, Any]]:
    """
    Runs bounded benchmark measurements against 5 progressively longer test inputs
    in an isolated child process with a strict 1.0-second timeout per test.
    
    Guarantees no zombie processes remain upon timeout, error, or completion.
    """
    test_strings = _generate_test_strings(base_string)
    benchmark_results: List[Dict[str, Any]] = []

    for test_str in test_strings:
        input_len = len(test_str)
        mp_context = multiprocessing.get_context("spawn")
        result_queue = mp_context.Queue()

        process = mp_context.Process(
            target=isolated_worker,
            args=(pattern, test_str, result_queue),
        )
        process.start()

        try:
            # Enforce strict 1.0-second timeout
            worker_payload = result_queue.get(timeout=1.0)
            process.join(timeout=0.5)

            status = worker_payload.get("status", "completed")
            elapsed_ms = worker_payload.get("elapsed_time_ms", 0.0)

            benchmark_results.append({
                "input_length": input_len,
                "elapsed_time_ms": round(elapsed_ms, 2),
                "status": status,
            })

        except queue.Empty:
            # Hard timeout exceeded: terminate child process and wait
            process.terminate()
            process.join(timeout=0.5)
            if process.is_alive():
                process.kill()
                process.join(timeout=0.5)

            benchmark_results.append({
                "input_length": input_len,
                "elapsed_time_ms": 1000.0,
                "status": "timeout",
            })

        except Exception:
            # Any process-level or communication exception
            if process.is_alive():
                process.terminate()
                process.join(timeout=0.5)
                if process.is_alive():
                    process.kill()
                    process.join(timeout=0.5)

            benchmark_results.append({
                "input_length": input_len,
                "elapsed_time_ms": 0.0,
                "status": "error",
            })

        finally:
            # Guarantee child process is cleaned up and queue resources released
            if process.is_alive():
                process.kill()
                process.join(timeout=0.2)
            result_queue.close()
            result_queue.join_thread()

    return benchmark_results
