"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SpeechResult = {
  transcript: string;
};

type SpeechRecognitionEventLike = Event & {
  results: {
    length: number;
    [index: number]: {
      [index: number]: SpeechResult;
    };
  };
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;

  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function VoiceTrigger() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [lastCommand, setLastCommand] = useState("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const emergencyTriggeredRef = useRef(false);
  const isMountedRef = useRef(true);

  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    if (recognitionRef.current) {
      return;
    }

    shouldListenRef.current = true;

    try {
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;

      /*
       * Indian English mode.
       * Recognizes English & Hindi words ("bachao", "help", etc.)
       */
      recognition.lang = "en-IN";

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let transcript = "";

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i] && event.results[i][0]) {
            transcript += event.results[i][0].transcript + " ";
          }
        }

        const text = transcript.toLowerCase().trim();
        setLastCommand(text);

        console.log("🎤 Heard:", text);

        /* Only these two words can trigger SOS. */
        const detected = /\b(help|bachao)\b/i.test(text);

        if (detected && !emergencyTriggeredRef.current) {
          emergencyTriggeredRef.current = true;

          console.log("🚨 VOICE SOS TRIGGERED:", text);

          /*
           * Trigger dashboard emergency event.
           */
          window.dispatchEvent(
            new CustomEvent("emergency-trigger", {
              detail: {
                source: "voice",
                command: text,
              },
            })
          );

          /*
           * Trigger siren event.
           */
          window.dispatchEvent(new CustomEvent("siren-start"));

          /*
           * Prevent repeated triggering for 10s.
           */
          window.setTimeout(() => {
            emergencyTriggeredRef.current = false;
          }, 10000);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Voice recognition error:", event);
      };

      recognition.onend = () => {
        recognitionRef.current = null;

        if (isMountedRef.current && shouldListenRef.current) {
          window.setTimeout(() => {
            if (isMountedRef.current && shouldListenRef.current) {
              startListening();
            }
          }, 500);
        } else {
          setListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

      setListening(true);
      console.log("🎤 Voice SOS listening started...");
    } catch (error) {
      console.warn("Unable to start speech recognition:", error);
      recognitionRef.current = null;
      setListening(false);
      shouldListenRef.current = false;
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Error stopping voice recognition:", e);
      }
      recognitionRef.current = null;
    }

    setListening(false);
    console.log("🎤 Voice SOS stopped");
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      isMountedRef.current = true;

      if (typeof window !== "undefined") {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
          setSupported(false);
        }
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      isMountedRef.current = false;
      shouldListenRef.current = false;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  if (!supported) {
    return (
      <div className="rounded-[24px] border border-yellow-500/20 bg-yellow-500/[0.05] p-5 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <MicOff className="h-5 w-5 text-yellow-400" />

          <div>
            <p className="font-medium text-yellow-300 text-sm">
              Voice SOS unavailable
            </p>

            <p className="mt-1 text-xs text-white/40">
              Please use Google Chrome or Edge for voice activation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-violet-500/15 bg-violet-500/[0.04] p-5 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              listening ? "bg-emerald-500/10" : "bg-violet-500/10"
            }`}
          >
            <Mic
              className={`h-5 w-5 ${
                listening ? "text-emerald-400" : "text-violet-400"
              }`}
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300/60">
              Voice trigger
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              Voice SOS trigger
            </h3>
          </div>
        </div>

        <span
          className={`h-3 w-3 rounded-full ${
            listening ? "animate-pulse bg-emerald-400" : "bg-white/20"
          }`}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-white/40">
        Say <strong className="text-white/80">&quot;Bachao&quot;</strong> or{" "}
        <strong className="text-white/80">&quot;Help&quot;</strong> or{" "}
        <strong className="text-white/80">&quot;Bachao&quot;</strong> to activate the police siren.
      </p>

      {!listening ? (
        <button
          type="button"
          onClick={startListening}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
        >
          <Mic className="h-4 w-4" />
          Enable Voice Trigger
        </button>
      ) : (
        <button
          type="button"
          onClick={stopListening}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
        >
          <MicOff className="h-4 w-4" />
          Stop Voice Trigger
        </button>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-white/30">Status</span>

        <span
          className={`text-xs font-medium ${
            listening ? "text-emerald-400" : "text-white/40"
          }`}
        >
          {listening ? "Listening" : "Standby"}
        </span>
      </div>

      {lastCommand && (
        <div className="mt-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-white/25">
            Last detected speech
          </p>

          <p className="mt-1 text-xs text-white/50">{lastCommand}</p>
        </div>
      )}
    </div>
  );
}
