"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.12] blur-[150px]" />
        <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.07] blur-[150px]" />
        <div className="absolute -right-40 top-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/[0.05] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3 text-sm text-gray-400 transition hover:text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition group-hover:border-white/20 group-hover:bg-white/[0.06]">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </div>
          <span className="hidden sm:inline">Back to home</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
            Secure access
          </span>
        </div>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-5 pb-16">
        <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1fr_460px]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/[0.08]">
                <Shield className="h-5 w-5 text-blue-400" />
                <div className="absolute inset-0 rounded-2xl bg-blue-400/10 blur-xl" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">Women Safety</p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-gray-600">
                  Analytics
                </p>
              </div>
            </div>

            <h1 className="max-w-xl text-6xl font-medium leading-[0.92] tracking-[-0.055em] xl:text-7xl">
              Your safety.
              <br />
              <span className="text-gray-600">Always connected.</span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-7 text-gray-500">
              Access your personal safety intelligence, monitor risk signals,
              manage emergency contacts and stay connected to the people and
              places that matter.
            </p>

            <div className="mt-10 flex items-center gap-3 text-xs text-gray-600">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>
                Intelligent protection powered by real-time safety analytics.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-[40px] bg-blue-500/[0.06] blur-3xl" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
              <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[70px]" />

              <div className="relative">
                <div className="mb-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <LockKeyhole className="h-5 w-5 text-blue-400" />
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.28em] text-blue-400">
                    Welcome back
                  </p>

                  <h2 className="mt-2 text-3xl font-medium tracking-[-0.035em]">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Enter your details to access your safety dashboard.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-xs font-medium text-gray-400">
                      Email address
                    </label>

                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 transition group-focus-within:text-blue-400" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-700 focus:border-blue-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-blue-500/[0.06]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="password" className="text-xs font-medium text-gray-400">
                        Password
                      </label>

                      <button type="button" className="text-[11px] text-gray-600 transition hover:text-blue-400">
                        Forgot password?
                      </button>
                    </div>

                    <div className="group relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 transition group-focus-within:text-blue-400" />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-gray-700 focus:border-blue-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-blue-500/[0.06]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-white/20 bg-black/20 accent-blue-500"
                    />
                    <span className="text-xs text-gray-600">Keep me signed in</span>
                  </label>

                  {error ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center gap-4 py-1">
                    <div className="h-px flex-1 bg-white/[0.08]" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-700">
                      or
                    </span>
                    <div className="h-px flex-1 bg-white/[0.08]" />
                  </div>

                  <button
                    type="button"
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                      G
                    </span>
                    Continue with Google
                  </button>
                </form>

                <p className="mt-7 text-center text-xs text-gray-600">
                  Don’t have an account?{" "}
                  <Link href="/signup" className="font-medium text-gray-300 transition hover:text-blue-400">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}