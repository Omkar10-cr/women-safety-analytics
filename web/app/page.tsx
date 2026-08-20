"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  MapPin,
  Shield,
  ShieldCheck,
  Sparkles,
  Activity,
  Radio,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Intelligent Risk Detection",
    description:
      "Analyze location-based signals and identify potentially unsafe environments before they become critical.",
    icon: Activity,
    size: "large",
  },
  {
    number: "02",
    title: "Live Location",
    description:
      "Stay connected to your current safety context with intelligent location monitoring.",
    icon: MapPin,
    size: "small",
  },
  {
    number: "03",
    title: "Emergency Response",
    description:
      "Rapidly trigger alerts and connect with trusted emergency contacts when every second matters.",
    icon: Radio,
    size: "small",
  },
  {
    number: "04",
    title: "Privacy First",
    description:
      "Your safety data is treated as sensitive information. Secure architecture is built into the platform.",
    icon: ShieldCheck,
    size: "large",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[140px]" />

        <div className="absolute left-[-10%] top-[45%] h-[400px] w-[400px] rounded-full bg-indigo-500/[0.05] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
      </div>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center px-6 pb-24 pt-32 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid items-end gap-16 lg:grid-cols-[1fr_360px]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 flex items-center gap-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-400/20 bg-blue-400/10">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </span>

                <span className="text-xs font-medium uppercase tracking-[0.28em] text-gray-400">
                  AI Safety Intelligence
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="max-w-5xl text-[clamp(3.8rem,9vw,9rem)] font-medium leading-[0.84] tracking-[-0.065em]"
              >
                Safety
                <br />
                <span className="text-gray-500">reimagined.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-10 max-w-xl text-base leading-7 text-gray-500 sm:text-lg"
              >
                Women Safety Analytics combines intelligent risk analysis,
                location intelligence and emergency response into one
                connected safety platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Link
                  href="/login"
                  className="group flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
                >
                  Enter platform
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <a
                  href="#platform"
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-gray-300 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  Explore
                  <ArrowDownRight className="h-4 w-4" />
                </a>
              </motion.div>
            </div>

            {/* Hero status card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      System online
                    </span>
                  </div>

                  <Shield className="h-5 w-5 text-blue-400" />
                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                  Protection status
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-6xl font-light tracking-[-0.05em]">
                    98
                  </span>
                  <span className="mb-2 text-gray-500">%</span>
                </div>

                <div className="mt-6 h-px bg-white/10" />

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Monitoring</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-24 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
              Scroll to explore
            </span>

            <span className="text-[10px] text-gray-600">
              01 / 04
            </span>
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section id="platform" className="relative px-6 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
                The platform
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
                One system.
                <br />
                <span className="text-gray-600">
                  Multiple layers of protection.
                </span>
              </h2>
            </div>

            <p className="self-end text-sm leading-7 text-gray-500">
              Designed around the moments that matter: understanding risk,
              knowing where you are, staying connected and responding quickly
              when something goes wrong.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const large = feature.size === "large";

              return (
                <motion.div
                  key={feature.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                  }}
                  className={`group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.045] ${
                    large ? "min-h-[380px]" : "min-h-[300px]"
                  }`}
                >
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/[0.06] blur-[80px] transition duration-700 group-hover:bg-blue-500/[0.12]" />

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                        <Icon className="h-5 w-5 text-blue-400" />
                      </div>

                      <span className="font-mono text-xs text-gray-700">
                        {feature.number}
                      </span>
                    </div>

                    <div className="mt-20">
                      <h3 className="text-2xl font-medium tracking-[-0.025em]">
                        {feature.title}
                      </h3>

                      <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.025] px-8 py-20 text-center sm:px-16">
            <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-500/[0.10] blur-[100px]" />

            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
                Ready when you are
              </p>

              <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
                Your safety should
                <br />
                <span className="text-gray-600">never be an afterthought.</span>
              </h2>

              <Link
                href="/login"
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:scale-[1.03]"
              >
                Start protecting yourself
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer for now */}
      <footer className="border-t border-white/10 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              Women Safety Analytics
            </span>
          </div>

          <p className="text-xs text-gray-600">
            AI-powered safety intelligence
          </p>
        </div>
      </footer>
    </main>
  );
}