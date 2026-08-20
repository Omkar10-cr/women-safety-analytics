"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

type BentoCardProps = {
  className?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  graphic?: ReactNode;
  accent?: string;
  fade?: ("top" | "bottom")[];
  onClick?: () => void;
};

export function BentoCard({
  className = "",
  eyebrow,
  title,
  description,
  graphic,
  accent = "#7b2d3b",
  fade = [],
  onClick,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer bg-[#0f0508] shadow-xl ${className}`}
      style={{
        boxShadow:
          "0 0 0 0.5px rgba(123,45,59,0.25), 0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div className="relative h-52 shrink-0 overflow-hidden">
        {graphic}

        {fade.includes("top") && (
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0f0508] to-transparent opacity-60" />
        )}

        {fade.includes("bottom") && (
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0f0508] to-transparent opacity-80" />
        )}
      </div>

      <div
        className="relative z-20 isolate mt-[-60px] p-6 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(to top, rgba(15,5,8,0.98) 60%, transparent)",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </p>

        <p
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#faf6ef",
            lineHeight: 1.3,
            marginBottom: 6,
          }}
        >
          {title}
        </p>

        <p
          style={{
            fontSize: 12,
            color: "rgba(250,246,239,0.5)",
            lineHeight: 1.65,
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* =========================================================
   SOS CARD
========================================================= */

function SOSCard() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const fire = async () => {
    if (state !== "idle") return;

    setState("loading");

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1800);
    });

    setState("done");

    setTimeout(() => {
      setState("idle");
    }, 6000);
  };

  const background =
    state === "done"
      ? "#166534"
      : state === "loading"
        ? "#7b2d3b"
        : "#c0392b";

  const label =
    state === "done"
      ? "✓ Alert sent — contacts notified"
      : state === "loading"
        ? "Sending emergency alert..."
        : "⚡ SOS EMERGENCY";

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.005 }}
      className="group relative col-span-full overflow-hidden rounded-2xl"
      style={{
        background: "#0f0508",
        boxShadow:
          "0 0 0 0.5px rgba(123,45,59,0.3), 0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 120%, rgba(192,57,43,0.25) 0%, transparent 65%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(123,45,59,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(123,45,59,0.06) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-6 p-8 md:flex-row">
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(250,246,239,0.35)",
              marginBottom: 6,
            }}
          >
            Emergency SOS
          </p>

          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(1.4rem,3vw,2rem)",
              fontWeight: 900,
              color: "#faf6ef",
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            One tap to alert everyone
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "rgba(250,246,239,0.45)",
              maxWidth: 420,
            }}
          >
            Sends your GPS location to emergency contacts and helps notify the
            nearest police station.
          </p>

          <p
            style={{
              fontSize: 10,
              marginTop: 8,
              color: "rgba(250,246,239,0.2)",
              letterSpacing: "0.06em",
            }}
          >
            TEST MODE · No real emergency call is made
          </p>
        </div>

        <button
          type="button"
          onClick={fire}
          disabled={state === "loading"}
          style={{
            minWidth: 220,
            padding: "18px 36px",
            background,
            border: "0.5px solid rgba(255,255,255,0.15)",
            borderRadius: 16,
            color: "#fff",
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: "0.06em",
            cursor: state === "loading" ? "wait" : "pointer",
            transition: "background .3s",
            boxShadow: "0 8px 32px rgba(192,57,43,0.4)",
            flexShrink: 0,
          }}
        >
          {label}
        </button>
      </div>
    </motion.div>
  );
}

/* =========================================================
   DANGER SCORE
========================================================= */

function DangerGraphic({
  score = 72,
  level = "HIGH",
}: {
  score?: number;
  level?: string;
}) {
  const color =
    level === "HIGH"
      ? "#E24B4A"
      : level === "MEDIUM"
        ? "#F59E0B"
        : "#22C55E";

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(226,75,74,0.12) 0%, transparent 70%)",
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 32px ${color}40`,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>

        <span
          style={{
            fontSize: 10,
            color: "rgba(250,246,239,0.4)",
          }}
        >
          / 100
        </span>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {[
          ["Theft", "40"],
          ["Harassment", "25"],
          ["Assault", "18"],
        ].map(([name, value]) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "rgba(250,246,239,0.8)",
              }}
            >
              {value}
            </div>

            <div
              style={{
                fontSize: 9,
                color: "rgba(250,246,239,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   POLICE
========================================================= */

function PoliceGraphic() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 65%)",
      }}
    >
      <div style={{ fontSize: 40 }}>🚔</div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(250,246,239,0.8)",
          }}
        >
          Central Police Station
        </div>

        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#60A5FA",
          }}
        >
          0.8 km
        </div>

        <div
          style={{
            fontSize: 10,
            color: "rgba(250,246,239,0.35)",
          }}
        >
          away · 022-22621855
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HISTORY
========================================================= */

function HistoryGraphic() {
  const rows = [
    {
      icon: "⚡",
      label: "SOS Button",
      date: "10 Aug",
      status: "sent",
    },
    {
      icon: "🎤",
      label: "Voice Trigger",
      date: "28 Jul",
      status: "test",
    },
    {
      icon: "⚡",
      label: "SOS Button",
      date: "12 Jul",
      status: "sent",
    },
  ];

  return (
    <div
      className="absolute inset-0 flex flex-col justify-center gap-2 px-5 py-4"
      style={{ background: "rgba(0,0,0,0.2)" }}
    >
      {rows.map((row) => (
        <div
          key={`${row.label}-${row.date}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            background: "rgba(250,246,239,0.05)",
            borderRadius: 8,
            border: "0.5px solid rgba(250,246,239,0.07)",
          }}
        >
          <span style={{ fontSize: 14 }}>{row.icon}</span>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(250,246,239,0.75)",
              }}
            >
              {row.label}
            </div>

            <div
              style={{
                fontSize: 9,
                color: "rgba(250,246,239,0.3)",
              }}
            >
              {row.date}
            </div>
          </div>

          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 99,
              background:
                row.status === "sent"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(245,158,11,0.15)",
              color:
                row.status === "sent"
                  ? "#4ade80"
                  : "#fbbf24",
            }}
          >
            {row.status === "sent" ? "SMS sent" : "Test mode"}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   CONTACTS
========================================================= */

function ContactsGraphic() {
  const contacts = [
    {
      init: "M",
      name: "Mum",
      phone: "+91 98765 43210",
    },
    {
      init: "P",
      name: "Priya",
      phone: "+91 91234 56789",
    },
  ];

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 px-5">
      {contacts.map((contact) => (
        <div
          key={contact.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: "rgba(250,246,239,0.05)",
            borderRadius: 10,
            border: "0.5px solid rgba(123,45,59,0.2)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(123,45,59,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#faf6ef",
            }}
          >
            {contact.init}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(250,246,239,0.85)",
              }}
            >
              {contact.name}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "rgba(250,246,239,0.35)",
              }}
            >
              {contact.phone}
            </div>
          </div>

          <span style={{ fontSize: 16 }}>📞</span>
        </div>
      ))}

      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "rgba(123,45,59,0.6)",
          marginTop: 2,
        }}
      >
        + Add contact
      </div>
    </div>
  );
}

/* =========================================================
   VOICE
========================================================= */

function VoiceGraphic() {
  const phrases = [
    '"Help me"',
    '"Emergency"',
    '"Save me"',
  ];

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      style={{
        background:
          "radial-gradient(circle at 50% 60%, rgba(123,45,59,0.2) 0%, transparent 65%)",
      }}
    >
      <div style={{ fontSize: 44 }}>🎤</div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            color: "rgba(250,246,239,0.4)",
            marginBottom: 8,
          }}
        >
          Say any of these phrases:
        </div>

        {phrases.map((phrase) => (
          <span
            key={phrase}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(250,246,239,0.65)",
              background: "rgba(123,45,59,0.2)",
              borderRadius: 99,
              padding: "3px 12px",
              margin: "2px 4px",
              display: "inline-block",
            }}
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function BentoDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060104",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
        rel="stylesheet"
      />

      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(123,45,59,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(123,45,59,0.1) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(123,45,59,0.7)",
              marginBottom: 8,
            }}
          >
            Women Safety Analytics
          </p>

          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(1.8rem,5vw,3.2rem)",
              fontWeight: 900,
              color: "#faf6ef",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Your safety,
            <br />

            <span
              style={{
                fontStyle: "italic",
                color: "rgba(192,100,120,0.9)",
              }}
            >
              at a glance.
            </span>
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "rgba(250,246,239,0.4)",
              maxWidth: 480,
            }}
          >
            Real-time protection, analytics, and emergency tools — all in one
            place.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {/* SOS */}
          <div
            style={{
              gridColumn: "span 6",
            }}
          >
            <SOSCard />
          </div>

          {/* Danger */}
          <div
            className="col-span-6 md:col-span-3"
          >
            <BentoCard
              eyebrow="Area danger score"
              title="Downtown Mumbai — High risk zone"
              description="72/100 based on historical theft, harassment and assault data."
              accent="#E24B4A"
              graphic={<DangerGraphic score={72} level="HIGH" />}
              fade={["bottom"]}
            />
          </div>

          {/* Police */}
          <div
            className="col-span-6 md:col-span-3"
          >
            <BentoCard
              eyebrow="Nearest police station"
              title="Central Police Station — 0.8 km"
              description="MG Road, Fort, Mumbai. Tap to call or get directions."
              accent="#60A5FA"
              graphic={<PoliceGraphic />}
              fade={["bottom"]}
            />
          </div>

          {/* History */}
          <div className="col-span-6 md:col-span-2">
            <BentoCard
              eyebrow="Emergency history"
              title="2 alerts sent"
              description="Last alert on 10 Aug 2026 via SOS button."
              accent="#F59E0B"
              graphic={<HistoryGraphic />}
              fade={["bottom"]}
            />
          </div>

          {/* Contacts */}
          <div className="col-span-6 md:col-span-2">
            <BentoCard
              eyebrow="Emergency contacts"
              title="2 contacts ready"
              description="Emergency contacts receive your location when SOS is triggered."
              accent="#7b2d3b"
              graphic={<ContactsGraphic />}
              fade={["bottom"]}
            />
          </div>

          {/* Voice */}
          <div className="col-span-6 md:col-span-2">
            <BentoCard
              eyebrow="Voice trigger"
              title="Hands-free emergency"
              description='Say "Help me", "Emergency" or "Save me".'
              accent="#A78BFA"
              graphic={<VoiceGraphic />}
              fade={["bottom"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}