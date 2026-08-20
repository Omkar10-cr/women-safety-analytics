"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import SafetyScore from "@/components/ui/safety-score";
import RiskCard from "@/components/ui/risk-card";
import SOSButton from "@/components/ui/sos-button";
import LocationCard from "@/components/ui/location-card";

export default function DashboardPage() {
  const [emergencyStatus, setEmergencyStatus] =
    useState("No active emergency");

  const [callProgress, setCallProgress] =
    useState(0);

  const [emergencyStep, setEmergencyStep] =
    useState("Standby");

  /*
   * ============================================================
   * EMERGENCY ACTIVATION
   * ============================================================
   */

  const activateEmergency = (
    source: string
  ) => {
    console.log(
      `🚨 Emergency trigger from ${source}`
    );

    setEmergencyStatus(
      "Emergency active — siren started, contacts notified, police alert sent"
    );

    setCallProgress(0);

    setEmergencyStep(
      "Initiating emergency response"
    );
  };

  const handleEmergencyState = (
    active: boolean,
    source: string = "manual"
  ) => {
    if (active) {
      activateEmergency(source);
      return;
    }

    setEmergencyStatus(
      "No active emergency"
    );

    setCallProgress(0);

    setEmergencyStep(
      "Standby"
    );
  };

  /*
   * ============================================================
   * EMERGENCY EVENTS
   * ============================================================
   */

  useEffect(() => {
    const handleEmergencyEvent =
      (event: Event) => {
        const customEvent =
          event as CustomEvent<{
            source?: string;
          }>;

        const source =
          customEvent.detail
            ?.source ||
          "manual";

        handleEmergencyState(
          true,
          source
        );
      };

    const handleEmergencyStop =
      () => {
        handleEmergencyState(
          false
        );
      };

    window.addEventListener(
      "emergency-trigger",
      handleEmergencyEvent
    );

    window.addEventListener(
      "emergency-stop",
      handleEmergencyStop
    );

    return () => {
      window.removeEventListener(
        "emergency-trigger",
        handleEmergencyEvent
      );

      window.removeEventListener(
        "emergency-stop",
        handleEmergencyStop
      );
    };
  }, []);

  /*
   * ============================================================
   * EMERGENCY PROGRESS
   * ============================================================
   */

  useEffect(() => {
    if (
      emergencyStatus ===
      "No active emergency"
    ) {
      return;
    }

    const stepSequence = [
      "Contacting emergency contacts",
      "Notifying nearest police station",
      "Activating siren",
      "Sharing live location",
      "Sending route guidance",
      "Emergency response active",
    ];

    let index = 0;

    const timer =
      window.setInterval(() => {
        index += 1;

        setEmergencyStep(
          stepSequence[
            Math.min(
              index,
              stepSequence.length - 1
            )
          ]
        );

        setCallProgress(
          Math.min(
            index * 20,
            100
          )
        );

        if (
          index >=
          stepSequence.length - 1
        ) {
          window.clearInterval(
            timer
          );
        }
      }, 1100);

    return () =>
      window.clearInterval(
        timer
      );
  }, [emergencyStatus]);

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[140px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[450px] w-[450px] rounded-full bg-indigo-500/[0.05] blur-[140px]" />

      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">

        {/* HEADER */}

        <motion.header
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8 flex items-center justify-between"
        >

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
              </div>

              <span className="text-sm font-medium text-white/40">
                Women Safety Analytics
              </span>

            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your safety,
              <span className="text-white/40">
                {" "}
                always connected.
              </span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              Monitor your surroundings,
              location and safety status from
              one secure dashboard.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

              GPS Active

            </div>

            <button
              type="button"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] transition hover:bg-white/[0.09]"
            >

              <Bell className="h-5 w-5 text-white/65" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-400" />

            </button>

          </div>

        </motion.header>

        {/* EMERGENCY STATUS */}

        <div className="mb-5 rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm text-red-100/80">

          <span className="font-medium">
            Emergency status:
          </span>{" "}

          {emergencyStatus}

        </div>

        {/* EMERGENCY DISPATCH */}

        <motion.section
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="mb-5 rounded-[28px] border border-red-500/15 bg-red-500/[0.04] p-5 backdrop-blur-2xl"
        >

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10">
                <PhoneCall className="h-5 w-5 text-red-400" />
              </div>

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-red-300/60">
                  Emergency dispatch
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Emergency response
                </h2>

              </div>

            </div>

            <div className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-100">

              {emergencyStatus ===
              "No active emergency"
                ? "Standby"
                : "Live"}

            </div>

          </div>

          <div className="mt-5 rounded-2xl border border-red-500/10 bg-black/15 px-4 py-3 text-sm text-red-100/80">

            <span className="font-medium">
              Current step:
            </span>{" "}

            {emergencyStep}

          </div>

          <div className="mt-5">

            <div className="mb-2 flex items-center justify-between text-xs text-white/50">

              <span>
                Emergency call progress
              </span>

              <span>
                {callProgress}%
              </span>

            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">

              <div
                className="h-full rounded-full bg-gradient-to-r from-red-400 via-red-500 to-orange-400 transition-all duration-500"
                style={{
                  width:
                    `${callProgress}%`,
                }}
              />

            </div>

          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">

            <StatusRow
              title="Emergency contacts"
              text={
                emergencyStatus ===
                "No active emergency"
                  ? "Waiting for trigger"
                  : "Calling and notifying emergency contacts"
              }
              status={
                emergencyStatus ===
                "No active emergency"
                  ? "Idle"
                  : "In progress"
              }
            />

            <StatusRow
              title="Police alert"
              text={
                emergencyStatus ===
                "No active emergency"
                  ? "Nearest station ready"
                  : "Nearest police station dispatch notified"
              }
              status={
                emergencyStatus ===
                "No active emergency"
                  ? "Ready"
                  : "Contacting"
              }
            />

            <StatusRow
              title="Siren"
              text={
                emergencyStatus ===
                "No active emergency"
                  ? "Waiting for trigger"
                  : "Emergency siren activated"
              }
              status={
                emergencyStatus ===
                "No active emergency"
                  ? "Idle"
                  : "Active"
              }
            />

          </div>

        </motion.section>

        {/* MAIN DASHBOARD */}

        <section className="mt-5 grid gap-5 lg:grid-cols-12">

          {/* SAFETY SCORE */}

          <div className="lg:col-span-4">
            <SafetyScore
              score={92}
              status="You're Safe"
            />
          </div>

          {/* RISK */}

          <div className="lg:col-span-4">
            <RiskCard
              level="LOW"
              score={18}
            />
          </div>

          {/* SOS */}

          <div className="lg:col-span-4">

            <SOSButton
              onEmergencyChange={
                handleEmergencyState
              }
            />

          </div>

          {/* LOCATION */}

          <div className="lg:col-span-8">

            <LocationCard />

          </div>

          {/* QUICK STATUS */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.35,
            }}
            className="grid gap-5 sm:grid-cols-2 lg:col-span-4"
          >

            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">

                  <MapPin className="h-5 w-5 text-blue-400" />

                </div>

                <span className="text-xs text-emerald-400">
                  Active
                </span>

              </div>

              <p className="mt-6 text-sm text-white/40">
                Location Tracking
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                Protected
              </p>

            </div>

            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">

                  <Users className="h-5 w-5 text-violet-400" />

                </div>

                <span className="text-xs text-white/30">
                  3 contacts
                </span>

              </div>

              <p className="mt-6 text-sm text-white/40">
                Emergency Contacts
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                Ready
              </p>

            </div>

          </motion.div>

        </section>

        {/* RECENT ACTIVITY */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.45,
          }}
          className="mt-5 rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-white/40">
                Protection System
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Recent Safety Activity
              </h2>

            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-sm text-blue-400 transition hover:text-blue-300"
            >

              View all

              <ChevronRight className="h-4 w-4" />

            </button>

          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <Activity
              title="Location tracking"
              description="Your live GPS location is being monitored"
              status="Active"
            />

            <Activity
              title="Nearby analysis"
              description="Nearby police and safe places are analyzed from your GPS position"
              status="Active"
            />

            <Activity
              title="Emergency network"
              description="Trusted contacts are available"
              status="Ready"
            />

          </div>

        </motion.section>

      </div>

    </main>
  );
}

/*
 * ============================================================
 * ACTIVITY
 * ============================================================
 */

function Activity({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">

      <div className="flex items-center justify-between gap-3">

        <div>

          <p className="text-sm font-medium text-white">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-white/35">
            {description}
          </p>

        </div>

        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
          {status}
        </span>

      </div>

    </div>
  );
}

/*
 * ============================================================
 * STATUS ROW
 * ============================================================
 */

function StatusRow({
  title,
  text,
  status,
}: {
  title: string;
  text: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-red-500/10 bg-black/15 p-4">

      <div className="flex items-center justify-between gap-3">

        <p className="text-sm font-medium text-white">
          {title}
        </p>

        <span className="rounded-full border border-red-400/15 bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-200">
          {status}
        </span>

      </div>

      <p className="mt-3 text-xs leading-5 text-white/45">
        {text}
      </p>

    </div>
  );
}