"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowUpRight } from "lucide-react";

interface RiskCardProps {
  level?: "LOW" | "MEDIUM" | "HIGH";
  score?: number;
}

export default function RiskCard({
  level = "LOW",
  score = 18,
}: RiskCardProps) {
  const riskConfig = {
    LOW: {
      label: "Low Risk",
      description: "Your current surroundings appear relatively safe.",
      indicator: "Low",
      width: "18%",
      text: "text-emerald-400",
      bg: "bg-emerald-400",
      glow: "bg-emerald-400/10",
    },
    MEDIUM: {
      label: "Medium Risk",
      description: "Stay aware of your surroundings and route.",
      indicator: "Moderate",
      width: "52%",
      text: "text-amber-400",
      bg: "bg-amber-400",
      glow: "bg-amber-400/10",
    },
    HIGH: {
      label: "High Risk",
      description: "Consider moving to a safer location.",
      indicator: "High",
      width: "88%",
      text: "text-red-400",
      bg: "bg-red-400",
      glow: "bg-red-400/10",
    },
  };

  const risk = riskConfig[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl"
    >
      {/* Ambient glow */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${risk.glow} blur-3xl transition-all duration-700`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/45">
              Environmental Analysis
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
              Current Risk
            </h2>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] ${risk.text}`}
          >
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        {/* Risk score */}
        <div className="mt-8 flex items-end justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-5xl font-semibold tracking-tighter ${risk.text}`}
            >
              {score}
            </motion.div>

            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
              Risk Index
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${risk.bg} animate-pulse`}
            />

            <span className={`text-xs font-medium ${risk.text}`}>
              {risk.indicator}
            </span>
          </div>
        </div>

        {/* Risk meter */}
        <div className="mt-7">
          <div className="mb-2 flex justify-between text-[11px] text-white/30">
            <span>SAFE</span>
            <span>CRITICAL</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: risk.width }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${risk.bg}`}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="max-w-[260px] text-sm leading-5 text-white/40">
            {risk.description}
          </p>

          <motion.div
            whileHover={{ x: 3 }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] ${risk.text}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}