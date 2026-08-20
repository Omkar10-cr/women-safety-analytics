"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
.sf-wrapper {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  --pill-border: rgba(123,45,59,0.18);
  --pill-border-hover: rgba(123,45,59,0.5);
  --pill-shadow: rgba(123,45,59,0.08);
}

@keyframes sf-breathe {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.12);
    opacity: 0.85;
  }
}

@keyframes sf-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes sf-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.3);
    opacity: 0.8;
  }
}

.sf-breathe {
  animation: sf-breathe 9s ease-in-out infinite alternate;
}

.sf-marquee {
  animation: sf-marquee 36s linear infinite;
}

.sf-pulse {
  animation: sf-pulse 1.8s ease-in-out infinite;
}

.sf-grid {
  background-size: 56px 56px;

  background-image:
    linear-gradient(
      to right,
      rgba(123,45,59,0.06) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(123,45,59,0.06) 1px,
      transparent 1px
    );

  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 30%,
    black 70%,
    transparent
  );

  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent,
    black 30%,
    black 70%,
    transparent
  );
}

.sf-glow {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(123,45,59,0.18) 0%,
      rgba(250,246,239,0.08) 45%,
      transparent 70%
    );
}

.sf-pill {
  background: rgba(250,246,239,0.7);
  border: 0.5px solid var(--pill-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow:
    0 4px 24px -6px var(--pill-shadow),
    inset 0 1px 0 rgba(255,255,255,0.6);

  transition:
    all 0.35s cubic-bezier(0.16,1,0.3,1);
}

.sf-pill:hover {
  border-color: var(--pill-border-hover);
  background: rgba(250,246,239,0.92);

  box-shadow:
    0 8px 32px -8px rgba(123,45,59,0.18),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.sf-giant {
  font-size: 22vw;
  line-height: 0.8;
  font-weight: 900;
  letter-spacing: -0.04em;

  color: transparent;

  -webkit-text-stroke:
    1px rgba(123,45,59,0.08);

  background:
    linear-gradient(
      180deg,
      rgba(123,45,59,0.13) 0%,
      transparent 70%
    );

  -webkit-background-clip: text;
  background-clip: text;

  font-family: 'Poppins', sans-serif;
  font-style: italic;
}

.sf-heading-glow {
  background:
    linear-gradient(
      160deg,
      #1c1815 0%,
      #7b2d3b 60%,
      rgba(28,24,21,0.5) 100%
    );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;

function MagneticLink({
  href,
  children,
  className = "",
  style = {},
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left -
        rect.width / 2;

      const y =
        event.clientY -
        rect.top -
        rect.height / 2;

      gsap.to(element, {
        x: x * 0.25,
        y: y * 0.25,
        scale: 1.03,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      });
    };

    element.addEventListener(
      "mousemove",
      handleMove as EventListener
    );

    element.addEventListener(
      "mouseleave",
      handleLeave
    );

    return () => {
      element.removeEventListener(
        "mousemove",
        handleMove as EventListener
      );

      element.removeEventListener(
        "mouseleave",
        handleLeave
      );
    };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={{
        textDecoration: "none",
        ...style,
      }}
    >
      {children}
    </a>
  );
}

function MarqueeItem() {
  return (
    <div className="flex items-center gap-10 px-6 text-[11px] font-bold tracking-[0.22em] uppercase text-[#7b2d3b]/60">
      <span>Women Safety Analytics</span>
      <span className="text-[#7b2d3b]/30">✦</span>

      <span>SOS Emergency System</span>
      <span className="text-[#7b2d3b]/30">✦</span>

      <span>Real-Time Location Sharing</span>
      <span className="text-[#7b2d3b]/30">✦</span>

      <span>Nearest Police Detection</span>
      <span className="text-[#7b2d3b]/30">✦</span>

      <span>Danger Score Analytics</span>
      <span className="text-[#7b2d3b]/30">✦</span>

      <span>Emergency Logs</span>
      <span className="text-[#7b2d3b]/30">✦</span>
    </div>
  );
}

export default function SafetyFooterNew() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const context = gsap.context(() => {
      if (giantRef.current) {
        gsap.fromTo(
          giantRef.current,
          {
            y: "8vh",
            opacity: 0,
            scale: 0.88,
          },
          {
            y: "0vh",
            opacity: 1,
            scale: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 85%",
              end: "bottom bottom",
              scrub: 1.2,
            },
          }
        );
      }

      const contentElements = [
        headingRef.current,
        linksRef.current,
        columnsRef.current,
      ].filter(Boolean);

      if (contentElements.length > 0) {
        gsap.fromTo(
          contentElements,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 45%",
              end: "center bottom",
              scrub: 1,
            },
          }
        );
      }
    }, wrapperRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: STYLES,
        }}
      />

      <div
        ref={wrapperRef}
        className="relative min-h-screen w-full overflow-hidden"
      >
        <footer
          className="sf-wrapper relative flex min-h-screen w-full flex-col justify-between overflow-hidden"
          style={{
            background: "#faf6ef",
            color: "#1c1815",
          }}
        >
          {/* Glow */}
          <div
            className="sf-glow sf-breathe pointer-events-none absolute left-1/2 top-1/2 z-0 h-[55vh] w-[75vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[90px]"
          />

          {/* Grid */}
          <div className="sf-grid pointer-events-none absolute inset-0 z-0" />

          {/* Giant SAFE */}
          <div
            ref={giantRef}
            className="sf-giant pointer-events-none absolute -bottom-[3vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap"
          >
            SAFE
          </div>

          {/* Marquee */}
          <div
            className="absolute left-0 top-10 z-10 w-full -rotate-1 scale-[1.06] overflow-hidden"
            style={{
              borderTop:
                "0.5px solid rgba(123,45,59,0.12)",
              borderBottom:
                "0.5px solid rgba(123,45,59,0.12)",
              background:
                "rgba(250,246,239,0.75)",
              backdropFilter: "blur(10px)",
              padding: "10px 0",
            }}
          >
            <div className="sf-marquee flex w-max">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-20">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#7b2d3b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#faf6ef",
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  ♡
                </span>
              </div>

              <div>
                <p
                  style={{
                    fontFamily:
                      "'Poppins',sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1c1815",
                    lineHeight: 1,
                  }}
                >
                  SafeGuard
                </p>

                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:
                      "rgba(28,24,21,0.45)",
                    marginTop: 2,
                  }}
                >
                  Women Safety Analytics
                </p>
              </div>
            </div>

            {/* Heading */}
            <h2
              ref={headingRef}
              className="sf-heading-glow mb-3 text-center font-black tracking-tight"
              style={{
                fontSize:
                  "clamp(2.4rem,7vw,5rem)",
                lineHeight: 0.95,
              }}
            >
              Stay safe,
              <br />

              <em
                style={{
                  fontStyle: "italic",
                  color: "#7b2d3b",
                  WebkitTextFillColor:
                    "#7b2d3b",
                }}
              >
                always.
              </em>
            </h2>

            <p
              style={{
                fontSize: 14,
                color:
                  "rgba(28,24,21,0.5)",
                marginBottom: 32,
                textAlign: "center",
                maxWidth: 400,
              }}
            >
              Real-time protection, instant alerts,
              and safety analytics — always with you.
            </p>

            {/* CTA */}
            <div
              ref={linksRef}
              className="flex w-full max-w-lg flex-col items-center gap-4"
            >
              <div className="flex flex-wrap justify-center gap-3">
                <MagneticLink
                  href="/dashboard"
                  className="sf-pill flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold"
                  style={{
                    color: "#faf6ef",
                    background: "#7b2d3b",
                    border:
                      "0.5px solid #5e1f2b",
                  }}
                >
                  <span>⚡</span>
                  Open dashboard
                </MagneticLink>

                <MagneticLink
                  href="/login"
                  className="sf-pill flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold"
                  style={{
                    color: "#7b2d3b",
                  }}
                >
                  <span>👤</span>
                  Sign in
                </MagneticLink>
              </div>

              {/* Link pills */}
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                <MagneticLink
                  href="/dashboard"
                  className="sf-pill rounded-full px-5 py-2.5 text-xs font-semibold"
                  style={{
                    color:
                      "rgba(28,24,21,0.6)",
                  }}
                >
                  Dashboard
                </MagneticLink>

                <MagneticLink
                  href="/dashboard"
                  className="sf-pill rounded-full px-5 py-2.5 text-xs font-semibold"
                  style={{
                    color:
                      "rgba(28,24,21,0.6)",
                  }}
                >
                  Danger score
                </MagneticLink>

                <MagneticLink
                  href="/dashboard"
                  className="sf-pill rounded-full px-5 py-2.5 text-xs font-semibold"
                  style={{
                    color:
                      "rgba(28,24,21,0.6)",
                  }}
                >
                  Police stations
                </MagneticLink>

                <MagneticLink
                  href="/dashboard"
                  className="sf-pill rounded-full px-5 py-2.5 text-xs font-semibold"
                  style={{
                    color:
                      "rgba(28,24,21,0.6)",
                  }}
                >
                  Emergency contacts
                </MagneticLink>
              </div>
            </div>
          </div>

          {/* Columns */}
          <div
            ref={columnsRef}
            className="relative z-10 w-full px-8 pb-5 md:px-14"
            style={{
              borderTop:
                "0.5px solid rgba(123,45,59,0.1)",
              paddingTop: 20,
            }}
          >
            <div className="mx-auto mb-5 grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
              {/* Safety */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:
                      "rgba(28,24,21,0.35)",
                    marginBottom: 10,
                  }}
                >
                  Safety
                </p>

                <FooterTextLink href="/dashboard">
                  Dashboard
                </FooterTextLink>

                <FooterTextLink href="/dashboard">
                  Danger score
                </FooterTextLink>

                <FooterTextLink href="/dashboard">
                  Police stations
                </FooterTextLink>

                <FooterTextLink href="/dashboard">
                  Emergency history
                </FooterTextLink>
              </div>

              {/* Account */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:
                      "rgba(28,24,21,0.35)",
                    marginBottom: 10,
                  }}
                >
                  Account
                </p>

                <FooterTextLink href="/login">
                  Sign in
                </FooterTextLink>

                <FooterTextLink href="/login">
                  Create account
                </FooterTextLink>

                <FooterTextLink href="/login">
                  Profile
                </FooterTextLink>

                <FooterTextLink href="/login">
                  Account settings
                </FooterTextLink>
              </div>

              {/* Support */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:
                      "rgba(28,24,21,0.35)",
                    marginBottom: 10,
                  }}
                >
                  Support
                </p>

                <FooterTextLink href="/dashboard">
                  How it works
                </FooterTextLink>

                <FooterTextLink href="/dashboard">
                  Privacy
                </FooterTextLink>

                <FooterTextLink href="/dashboard">
                  Terms
                </FooterTextLink>

                <FooterTextLink href="/dashboard">
                  Contact
                </FooterTextLink>
              </div>

              {/* Tech */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:
                      "rgba(28,24,21,0.35)",
                    marginBottom: 10,
                  }}
                >
                  Technology
                </p>

                <p className="mb-2 text-xs text-black/60">
                  Flask API
                </p>

                <p className="mb-2 text-xs text-black/60">
                  Next.js
                </p>

                <p className="mb-2 text-xs text-black/60">
                  SQLite
                </p>

                <p className="text-xs text-black/60">
                  Emergency Services
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="relative z-20 flex w-full flex-col items-center justify-between gap-4 px-6 pb-6 md:flex-row md:px-12"
            style={{
              borderTop:
                "0.5px solid rgba(123,45,59,0.08)",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:
                  "rgba(28,24,21,0.35)",
              }}
            >
              © 2026 Women Safety Analytics
            </p>

            <div className="sf-pill flex items-center gap-2 rounded-full px-5 py-2.5">
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color:
                    "rgba(28,24,21,0.4)",
                }}
              >
                Built for safety
              </span>

              <span
                className="sf-pulse"
                style={{
                  fontSize: 14,
                  color: "#7b2d3b",
                }}
              >
                ♥
              </span>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color:
                    "rgba(28,24,21,0.4)",
                }}
              >
                with
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#7b2d3b",
                }}
              >
                Flask + Next.js
              </span>
            </div>

            {/* Back to top */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="sf-pill flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                color:
                  "rgba(28,24,21,0.45)",
                cursor: "pointer",
              }}
              aria-label="Back to top"
            >
              ↑
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}

/* =========================================================
   FOOTER TEXT LINK
========================================================= */

function FooterTextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="mb-2 block text-xs no-underline transition-colors"
      style={{
        color: "rgba(28,24,21,0.6)",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.color = "#7b2d3b";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.color =
          "rgba(28,24,21,0.6)";
      }}
    >
      {children}
    </a>
  );
}