"use client";

import { motion } from "framer-motion";
import { Siren, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SOSButton({
  onEmergencyChange,
}: {
  onEmergencyChange: (active: boolean, source?: string) => void;
}) {
  const [pressed, setPressed] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const secondOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sirenTimerRef = useRef<number | null>(null);
  const sirenPhaseRef = useRef<"low" | "high">("low");
  const emergencyLockRef = useRef(false);

  const stopSiren = () => {
    if (sirenTimerRef.current) {
      window.clearInterval(sirenTimerRef.current);
      sirenTimerRef.current = null;
    }

    const audioContext = audioContextRef.current;
    const gain = gainRef.current;

    if (audioContext && gain) {
      const now = audioContext.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0.0001, now, 0.08);
    }
  };

  const startSiren = () => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtor) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtor();
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }

    if (!oscillatorRef.current || !gainRef.current) {
      const oscillator = audioContext.createOscillator();
      const secondary = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sawtooth";
      secondary.type = "square";
      oscillator.frequency.value = 1200;
      secondary.frequency.value = 1750;
      gain.gain.value = 0.0001;

      oscillator.connect(gain);
      secondary.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      secondary.start();

      oscillatorRef.current = oscillator;
      secondOscillatorRef.current = secondary;
      gainRef.current = gain;
    }

    const oscillator = oscillatorRef.current;
    const secondary = secondOscillatorRef.current;
    const gain = gainRef.current;

    if (!oscillator || !secondary || !gain) {
      return;
    }

    const sweepSiren = () => {
      const isHigh = sirenPhaseRef.current === "high";
      const lowFreq = 650;
      const highFreq = 1800;
      const now = audioContext.currentTime;

      sirenPhaseRef.current = isHigh ? "low" : "high";

      oscillator.frequency.cancelScheduledValues(now);
      secondary.frequency.cancelScheduledValues(now);

      oscillator.frequency.setValueAtTime(isHigh ? lowFreq : highFreq, now);
      secondary.frequency.setValueAtTime(isHigh ? lowFreq * 1.35 : highFreq * 1.05, now);

      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(1.0, now + 0.015);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.1);
    };

    if (sirenTimerRef.current) {
      window.clearInterval(sirenTimerRef.current);
    }

    sirenTimerRef.current = window.setInterval(sweepSiren, 130);
    sweepSiren();
  };

  useEffect(() => {
    return () => {
      if (sirenTimerRef.current) {
        window.clearInterval(sirenTimerRef.current);
      }

      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }

      if (secondOscillatorRef.current) {
        secondOscillatorRef.current.stop();
        secondOscillatorRef.current.disconnect();
        secondOscillatorRef.current = null;
      }

      if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
      }

      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleTrigger = (event?: Event) => {
      if (emergencyLockRef.current) {
        return;
      }

      const source = (event as CustomEvent<{ source?: string }> | undefined)?.detail?.source || "manual";

      emergencyLockRef.current = true;
      setPressed((current) => {
        if (current) {
          return current;
        }

        startSiren();
        onEmergencyChange(true, source);
        return true;
      });

      window.setTimeout(() => {
        emergencyLockRef.current = false;
      }, 2000);
    };

    window.addEventListener("emergency-trigger", handleTrigger);
    window.addEventListener("siren-start", handleTrigger);

    return () => {
      window.removeEventListener("emergency-trigger", handleTrigger);
      window.removeEventListener("siren-start", handleTrigger);
    };
  }, [onEmergencyChange]);

  const handleSOS = () => {
    if (pressed) {
      setPressed(false);
      stopSiren();
      onEmergencyChange(false, "manual");
      window.dispatchEvent(new CustomEvent("emergency-stop", { detail: { source: "manual" } }));
      return;
    }

    setPressed(true);
    startSiren();
    onEmergencyChange(true, "manual");
    window.dispatchEvent(new CustomEvent("emergency-trigger", { detail: { source: "manual" } }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative overflow-hidden rounded-[28px] border border-red-500/20 bg-red-500/[0.06] p-6 backdrop-blur-2xl"
    >
      <motion.div
        animate={{
          scale: pressed ? [1, 1.4, 1] : [1, 1.15, 1],
          opacity: pressed ? [0.15, 0.3, 0.15] : [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: pressed ? 0.8 : 2.5,
          repeat: Infinity,
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 blur-3xl"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-red-300/60">
              Emergency Assistance
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
              Need Help?
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10">
            <ShieldAlert className="h-5 w-5 text-red-400" />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.25, 0, 0.25],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-[-14px] rounded-full border border-red-500/30"
            />

            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
              className="absolute inset-[-28px] rounded-full border border-red-500/15"
            />

            <motion.button
              type="button"
              onClick={handleSOS}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className={`relative flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 transition-all duration-300 ${
                pressed
                  ? "border-red-300 bg-red-500 shadow-[0_0_70px_rgba(239,68,68,0.65)]"
                  : "border-red-500/40 bg-red-500/90 shadow-[0_0_45px_rgba(239,68,68,0.25)]"
              }`}
            >
              <Siren className="h-8 w-8 text-white" />
              <span className="mt-2 text-lg font-bold tracking-[0.15em] text-white">
                {pressed ? "SENT" : "SOS"}
              </span>
            </motion.button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-white/70">
            {pressed
              ? "Emergency alert activated"
              : "Tap to activate emergency assistance"}
          </p>

          <p className="mx-auto mt-2 max-w-[280px] text-xs leading-5 text-white/35">
            Your location and emergency information will be shared with your
            trusted contacts.
          </p>
        </div>
      </div>
    </motion.div>
  );
}