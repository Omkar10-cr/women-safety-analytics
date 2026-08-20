"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface SafetyScoreProps {
  score: number;
  status: string;
}

export default function SafetyScore({
  score,
  status,
}: SafetyScoreProps) {
  const circumference = 2 * Math.PI * 52;
  const progress = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl"
    >
      <div className="absolute right-[-70px] top-[-70px] h-52 w-52 rounded-full bg-emerald-500/[0.08] blur-3xl" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm text-white/40">Safety Intelligence</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Safety Score
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>
      </div>

      <div className="relative mt-8 flex justify-center">
        <svg
          width="150"
          height="150"
          viewBox="0 0 120 120"
          className="-rotate-90"
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />

          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgb(52,211,153)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.2 }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold tracking-tight">
            {score}
          </span>
          <span className="text-xs text-white/35">/ 100</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-emerald-400">{status}</p>
        <p className="mt-1 text-xs text-white/30">
          Your current protection status is healthy.
        </p>
      </div>
    </motion.div>
  );
}