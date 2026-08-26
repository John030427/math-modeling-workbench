#!/usr/bin/env python3
"""czy_runner.py — JSON bridge into the pinned math-model-agent algorithm library.

stdin:  {"module": "evaluation", "function": "topsis", "params": {...}}
stdout: {"ok": true, "result": {...json-serializable...}} | {"ok": false, "error": "..."}

Callable parameters: pass {"__preset__": "sphere"} to use a built-in objective,
or {"__expr__": "x[0]**2 + x[1]"} for a restricted math expression of variables x[i].
"""
import sys, json, math
import numpy as np

UPSTREAM_DEFAULT = r"C:\Users\Administrator\.dsh\upstream\math-model-agent\code"


def make_callable(spec):
    """Restricted callable factory: presets or single-variable math expressions."""
    if isinstance(spec, str):
        spec = {"__expr__": spec}
    if "__preset__" in spec:
        name = spec["__preset__"]

        def obj(x):
            s = 0.0
            for i, v in enumerate(x):
                s += float(v) ** 2
            return s
        presets = {
            "sphere": lambda x: float(np.sum(np.asarray(x, dtype=float) ** 2)),
            "rastrigin": lambda x: float(np.sum(np.asarray(x, dtype=float) ** 2 - 10 * np.cos(2 * np.pi * np.asarray(x, dtype=float)) + 10)),
            "rosenbrock": lambda x: float(np.sum(100 * (np.asarray(x, dtype=float)[1:] - np.asarray(x, dtype=float)[:-1] ** 2) ** 2 + (1 - np.asarray(x, dtype=float)[:-1]) ** 2)),
        }
        if name in presets:
            return presets[name]
        return obj
    if "__expr__" in spec:
        expr = spec["__expr__"]
        allowed = set("0123456789+-*/(). ,x[]")
        if not set(expr) <= allowed:
            raise ValueError(f"expression contains disallowed characters: {expr!r}")
        code = compile(expr, "<objective>", "eval")

        def fn(x):
            return float(eval(code, {"__builtins__": {"abs": abs, "min": min, "max": max, "sum": sum}}, {"x": list(map(float, x))}))
        return fn
    raise ValueError("callable spec requires __preset__ or __expr__")


def to_callable_if_spec(v):
    if isinstance(v, dict) and ("__preset__" in v or "__expr__" in v):
        return make_callable(v)
    return v


def convert(value):
    import dataclasses
    if hasattr(value, "_asdict"):  # namedtuple
        return {"_tuple": convert(tuple(value)), "_fields": list(getattr(value, "_fields", []))}
    if dataclasses.is_dataclass(value) and not isinstance(value, type):
        return {k: convert(v) for k, v in dataclasses.asdict(value).items()}
    if isinstance(value, dict):
        return {str(k): convert(x) for k, x in value.items()}
    if isinstance(value, (list, tuple)):
        return [convert(x) for x in value]
    if isinstance(value, (np.ndarray,)):
        return convert(value.tolist())
    if isinstance(value, (np.floating,)):
        v = float(value)
        return round(v, 10) if math.isfinite(v) else str(v)
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)
    if isinstance(value, (float, int)):
        return round(value, 10) if isinstance(value, float) and math.isfinite(value) else value
    return str(value)


def main():
    sys.path.insert(0, UPSTREAM_DEFAULT)
    req = json.loads(sys.stdin.read() or "{}")
    module_name = req.get("module")
    fn_name = req.get("function")
    params = req.get("params") or {}
    try:
        mod = __import__(f"algorithms.{module_name}", fromlist=[module_name])
        fn = getattr(mod, fn_name)
        args = []
        kwargs = {}
        for k, v in params.items():
            v2 = to_callable_if_spec(v)
            if isinstance(v, list) or isinstance(v, dict):
                try:
                    arr = np.asarray(v)
                    if arr.dtype != object:
                        v2 = arr
                except Exception:
                    pass
            if k.startswith("__"):
                continue
            kwargs[k] = v2
        result = fn(*args, **kwargs)
        out = {"ok": True, "result": convert(result)}
    except Exception as e:
        out = {"ok": False, "error": f"{type(e).__name__}: {e}"}
    # upstream functions print to stdout; emit our JSON after a sentinel so the
    # Node side can split reliably.
    sys.stdout.write("\n===CZY_RESULT===\n")
    sys.stdout.write(json.dumps(out, ensure_ascii=False, default=str))


if __name__ == "__main__":
    main()
