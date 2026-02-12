import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
  Img,
  staticFile,
} from "remotion";

// ─── Color Palette ───
const BG = "#0a0e17";
const PURPLE = "#8b5cf6";
const CYAN = "#06b6d4";
const GREEN = "#22c55e";
const WHITE = "#ffffff";
const MUTED = "#94a3b8";

// ─── Scene 1: Hook with Glow ───
const SceneHook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Line 1: "Stop Using Spreadsheets"
  const line1Op = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Strikethrough animation on "Spreadsheets"
  const strikeWidth = interpolate(frame, [25, 45], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Line 2: "Your MCAT Prep Deserves Better"
  const line2Op = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [30, 50], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Pulsing glow
  const glowPulse = interpolate(frame, [0, 90], [0, Math.PI * 3]);
  const glowOp = 0.12 + Math.sin(glowPulse) * 0.06;

  // Particles floating up
  const particles = Array.from({ length: 8 }, (_, i) => {
    const x = 100 + i * 120;
    const startY = 1100 + (i % 3) * 200;
    const y = startY - frame * (1.5 + (i % 4) * 0.5);
    const size = 3 + (i % 3) * 2;
    // Use monotonically increasing inputRange (reversed y scale)
    const op = interpolate(y, [-50, 200, 800, 1100], [0, 0.4, 0.4, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const displayY = ((y % 1200) + 1200) % 1200;
    return { x, y: displayY, size, op };
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, #131830 0%, ${BG} 70%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${PURPLE} 0%, transparent 70%)`,
          opacity: glowOp,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 2 === 0 ? CYAN : PURPLE,
            opacity: p.op,
          }}
        />
      ))}

      <div style={{ textAlign: "center", zIndex: 1, padding: 60 }}>
        {/* Line 1 */}
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 600,
            color: MUTED,
            letterSpacing: "3px",
            textTransform: "uppercase",
            opacity: line1Op,
            transform: `translateY(${line1Y}px)`,
            marginBottom: 24,
            position: "relative",
            display: "inline-block",
          }}
        >
          Stop Using{" "}
          <span style={{ position: "relative" }}>
            Spreadsheets
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: `${strikeWidth}%`,
                height: 3,
                background: `linear-gradient(90deg, ${CYAN}, ${PURPLE})`,
                transform: "translateY(-50%)",
              }}
            />
          </span>
        </div>

        {/* Line 2 */}
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 76,
            fontWeight: 800,
            color: WHITE,
            lineHeight: 1.15,
            opacity: line2Op,
            transform: `translateY(${line2Y}px)`,
          }}
        >
          Your MCAT Prep
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Deserves Better
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Dashboard Screenshot Showcase ───
const SceneDashboard: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Zoom in from slightly pulled back to close-up
  const scale = interpolate(frame, [0, 120], [1.0, 1.25], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // Slow pan from center to slightly right and up
  const panX = interpolate(frame, [0, 120], [0, -40], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 120], [0, -20], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // Fade in
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  // Subtle 3D tilt
  const rotateX = interpolate(frame, [0, 60, 120], [2, 0, -1], {
    extrapolateRight: "clamp",
  });
  const rotateY = interpolate(frame, [0, 60, 120], [-2, 0, 1], {
    extrapolateRight: "clamp",
  });

  // Label that appears
  const labelOp = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [15, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        justifyContent: "center",
        alignItems: "center",
        perspective: 1200,
      }}
    >
      {/* Gradient top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${CYAN}, ${PURPLE}, ${CYAN})`,
          zIndex: 10,
        }}
      />

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          opacity: labelOp,
          transform: `translateY(${labelY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: CYAN,
            letterSpacing: "3px",
            textTransform: "uppercase",
            background: `${BG}cc`,
            padding: "8px 24px",
            borderRadius: 8,
          }}
        >
          Your Command Center
        </span>
      </div>

      {/* Dashboard image with zoom/pan/tilt */}
      <div
        style={{
          width: 1080,
          height: 1080,
          overflow: "hidden",
          opacity,
        }}
      >
        <Img
          src={staticFile("dashboard.png")}
          style={{
            width: 1280,
            height: 900,
            objectFit: "cover",
            transform: `scale(${scale}) translate(${panX}px, ${panY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformOrigin: "center center",
            borderRadius: 8,
          }}
        />
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(transparent, ${BG})`,
          zIndex: 5,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 3: Tab Montage (crossfading between tabs) ───
const SceneTabMontage: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const tabs = [
    { file: "study-log.png", label: "Study Log" },
    { file: "scores.png", label: "Score Tracker" },
    { file: "content.png", label: "Content Mastery" },
    { file: "timer.png", label: "Pomodoro Timer" },
    { file: "achievements.png", label: "Achievements" },
  ];

  const FRAMES_PER_TAB = 24; // ~0.8s per tab
  const totalFrames = tabs.length * FRAMES_PER_TAB;

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Gradient top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${PURPLE}, ${CYAN}, ${GREEN})`,
          zIndex: 10,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: WHITE,
            background: `${BG}dd`,
            padding: "8px 28px",
            borderRadius: 8,
          }}
        >
          Everything in{" "}
          <span style={{ color: CYAN }}>One Dashboard</span>
        </span>
      </div>

      {/* Tab images with crossfade */}
      {tabs.map((tab, i) => {
        const tabStart = i * FRAMES_PER_TAB;
        const tabEnd = tabStart + FRAMES_PER_TAB;

        // Fade in for first 6 frames, hold, fade out last 6 frames
        const fadeIn = interpolate(frame, [tabStart, tabStart + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(frame, [tabEnd - 6, tabEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = Math.min(fadeIn, fadeOut);

        // Slight zoom during display
        const scale = interpolate(
          frame,
          [tabStart, tabEnd],
          [1.05, 1.15],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }
        );

        // Tab label animation
        const labelOp = interpolate(
          frame,
          [tabStart + 3, tabStart + 10, tabEnd - 8, tabEnd - 3],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <div
              style={{
                width: 1080,
                height: 1080,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Img
                src={staticFile(tab.file)}
                style={{
                  width: 1280,
                  height: 900,
                  objectFit: "cover",
                  transform: `scale(${scale})`,
                  transformOrigin: "center top",
                }}
              />
            </div>
            {/* Tab label */}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 10,
                opacity: labelOp,
              }}
            >
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: WHITE,
                  background: `linear-gradient(135deg, ${CYAN}cc, ${PURPLE}cc)`,
                  padding: "12px 36px",
                  borderRadius: 12,
                  backdropFilter: "blur(10px)",
                }}
              >
                {tab.label}
              </span>
            </div>
          </AbsoluteFill>
        );
      })}

      {/* Bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          background: `linear-gradient(transparent, ${BG}cc)`,
          zIndex: 5,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 4: Price & CTA ───
const SceneCTA: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const scaleIn = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6 },
  });
  const priceScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 200 },
  });
  const ctaOp = interpolate(frame, [30, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [30, 45], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const glowPulse = interpolate(frame, [0, 90], [0, Math.PI * 4]);
  const btnGlow = 0.5 + Math.sin(glowPulse) * 0.3;

  // Brand name fade in
  const brandOp = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + frame * 0.02;
    const radius = 350 + Math.sin(frame * 0.05 + i) * 50;
    const x = 540 + Math.cos(angle) * radius;
    const y = 540 + Math.sin(angle) * radius;
    const size = 2 + (i % 3) * 2;
    const op = 0.15 + Math.sin(frame * 0.1 + i) * 0.1;
    return { x, y, size, op };
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #131830 0%, ${BG} 70%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Orbiting particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 2 === 0 ? CYAN : PURPLE,
            opacity: p.op,
          }}
        />
      ))}

      {/* Circular glow ring */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `2px solid ${CYAN}15`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 80px ${CYAN}08, inset 0 0 80px ${CYAN}08`,
        }}
      />

      <div
        style={{
          textAlign: "center",
          zIndex: 1,
          transform: `scale(${scaleIn})`,
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 30,
            color: MUTED,
            marginBottom: 16,
          }}
        >
          One file. Works offline. Yours forever.
        </div>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
            transform: `scale(${Math.max(0, priceScale)})`,
          }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            $10
          </span>
        </div>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 20,
            color: MUTED,
            marginTop: 10,
            marginBottom: 40,
          }}
        >
          No subscriptions. No hidden fees. Pay once.
        </div>
        <div
          style={{
            opacity: ctaOp,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
              color: WHITE,
              fontFamily: "system-ui, sans-serif",
              fontSize: 30,
              fontWeight: 700,
              padding: "22px 64px",
              borderRadius: 16,
              boxShadow: `0 0 ${50 * btnGlow}px ${CYAN}50, 0 0 ${100 * btnGlow}px ${PURPLE}30`,
            }}
          >
            Get Instant Access
          </div>
        </div>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 44,
            fontWeight: 800,
            color: WHITE,
            marginTop: 50,
            opacity: brandOp,
          }}
        >
          MCAT{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Command
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───
export const McatAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Scene 1: Hook (0-90 frames = 0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <SceneHook frame={frame} fps={fps} />
      </Sequence>

      {/* Scene 2: Dashboard Showcase (90-240 frames = 3-8s) */}
      <Sequence from={90} durationInFrames={150}>
        <SceneDashboard frame={frame - 90} fps={fps} />
      </Sequence>

      {/* Scene 3: Tab Montage (240-360 frames = 8-12s) */}
      <Sequence from={240} durationInFrames={120}>
        <SceneTabMontage frame={frame - 240} fps={fps} />
      </Sequence>

      {/* Scene 4: CTA (360-450 frames = 12-15s) */}
      <Sequence from={360} durationInFrames={90}>
        <SceneCTA frame={frame - 360} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
