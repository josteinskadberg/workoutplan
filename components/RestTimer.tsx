"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [60, 90, 120, 180];

export function RestTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [target, setTarget] = useState<number>(90);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start(sec: number) {
    setTarget(sec);
    setSecondsLeft(sec);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s == null) return null;
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          beep();
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(null);
  }

  function beep() {
    try {
      const ctx =
        audioCtxRef.current ??
        new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => start(p)}
            className={`btn-ghost flex-1 ${
              target === p && secondsLeft != null ? "border-accent text-accent" : ""
            }`}
          >
            {p}s
          </button>
        ))}
      </div>
      {secondsLeft != null ? (
        <div className="flex items-center justify-between rounded-md border border-accent bg-panel2 px-4 py-3">
          <span className="text-2xl font-semibold tabular-nums text-accent">
            {fmt(secondsLeft)}
          </span>
          <button type="button" className="btn-ghost" onClick={stop}>
            Stop
          </button>
        </div>
      ) : null}
    </div>
  );
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
