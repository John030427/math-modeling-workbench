"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number; cluster: number };

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function genPoints(seed: number, k: number): Point[] {
  const rnd = mulberry32(seed);
  const centers = Array.from({ length: k }, () => ({
    x: 80 + rnd() * 440,
    y: 60 + rnd() * 280,
  }));
  const pts: Point[] = [];
  for (let i = 0; i < 90; i++) {
    const c = centers[i % k];
    pts.push({
      x: c.x + (rnd() - 0.5) * 90,
      y: c.y + (rnd() - 0.5) * 90,
      cluster: -1,
    });
  }
  return pts;
}

export function KMeansCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(3);
  const [seed, setSeed] = useState(7);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const points = useMemo(() => genPoints(seed, k), [seed, k]);
  const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
  const [assigned, setAssigned] = useState<Point[]>([]);
  const [phase, setPhase] = useState<"init" | "assign" | "update" | "done">("init");

  useEffect(() => {
    const rnd = mulberry32(seed + 99);
    const cs = Array.from({ length: k }, () => ({
      x: 60 + rnd() * 480,
      y: 40 + rnd() * 320,
    }));
    setCentroids(cs);
    setAssigned(points.map((p) => ({ ...p, cluster: -1 })));
    setPhase("init");
    setStep(0);
  }, [k, seed, points]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    // grid
    ctx.strokeStyle = "rgba(16,35,63,0.06)";
    for (let x = 0; x < c.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, c.height);
      ctx.stroke();
    }
    for (let y = 0; y < c.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }
    const colors = ["#c45c26", "#1f7a6c", "#2a5085", "#8a4f2a", "#5b4b8a"];
    assigned.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = p.cluster < 0 ? "rgba(16,35,63,0.35)" : colors[p.cluster % colors.length];
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    centroids.forEach((ct, i) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.moveTo(ct.x - 8, ct.y);
      ctx.lineTo(ct.x + 8, ct.y);
      ctx.moveTo(ct.x, ct.y - 8);
      ctx.lineTo(ct.x, ct.y + 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ct.x, ct.y, 10, 0, Math.PI * 2);
      ctx.stroke();
    });
  }, [assigned, centroids]);

  function assignStep() {
    const next = assigned.map((p) => {
      let best = 0;
      let bestD = Infinity;
      centroids.forEach((c, i) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return { ...p, cluster: best };
    });
    setAssigned(next);
    setPhase("assign");
    setStep((s) => s + 1);
  }

  function updateStep() {
    const next = centroids.map((_, i) => {
      const members = assigned.filter((p) => p.cluster === i);
      if (!members.length) return centroids[i];
      return {
        x: members.reduce((a, p) => a + p.x, 0) / members.length,
        y: members.reduce((a, p) => a + p.y, 0) / members.length,
      };
    });
    const moved = next.some((c, i) => Math.hypot(c.x - centroids[i].x, c.y - centroids[i].y) > 0.5);
    setCentroids(next);
    setPhase(moved ? "update" : "done");
    setStep((s) => s + 1);
  }

  function next() {
    if (phase === "init" || phase === "update") assignStep();
    else if (phase === "assign") updateStep();
  }

  useEffect(() => {
    if (!auto || phase === "done") return;
    const t = setTimeout(next, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, phase, step]);

  return (
    <div className="panel">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="text-sm">
          K=
          <input
            type="number"
            min={2}
            max={5}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="ml-2 w-14 border border-[var(--line)] px-1"
          />
        </label>
        <button className="btn ghost" type="button" onClick={() => setSeed((s) => s + 1)}>
          随机初始化
        </button>
        <button className="btn ghost" type="button" onClick={next} disabled={phase === "done"}>
          下一步
        </button>
        <button className="btn" type="button" onClick={() => setAuto((a) => !a)}>
          {auto ? "暂停" : "自动运行"}
        </button>
        <span className="chip">step {step} · {phase}</span>
      </div>
      <canvas ref={canvasRef} width={600} height={400} className="w-full max-w-full bg-white/50" />
      <p className="muted text-xs mt-2">
        流程：随机初始中心 → 分配最近簇 → 更新中心 → 重复至收敛。叉号为质心。
      </p>
    </div>
  );
}
