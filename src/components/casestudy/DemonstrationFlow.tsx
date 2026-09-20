import { useState } from "react";

interface FlowStage {
  id: string;
  label: string;
  sub: string;
  phase: "capture" | "learned";
  info: { type: string; role: string; topics: string[] };
}

const NODE_W = 200;
const NODE_H = 44;
const X = 30;

const STAGES: FlowStage[] = [
  {
    id: "leader",
    label: "Leader",
    sub: "teleop input",
    phase: "capture",
    info: {
      type: "teleoperation — operator side",
      role: "The operator holds the leader: a second SO101 arm. Its joint encoders stream target poses at a fixed rate while the human does the task.",
      topics: ["leader joints → follower mirror"],
    },
  },
  {
    id: "demos",
    label: "Demonstrations",
    sub: "teleop episodes",
    phase: "capture",
    info: {
      type: "synchronized capture",
      role: "One episode = reset → perform → end. Leader joints, gripper state and camera frames are recorded together — a demonstration is a time-aligned stream, not a video.",
      topics: ["episodes × timesteps"],
    },
  },
  {
    id: "dataset",
    label: "Dataset",
    sub: "obs → action pairs",
    phase: "capture",
    info: {
      type: "versioned, regenerable",
      role: "Demonstrations land as (observation, action) pairs, stored episode by episode. Split discipline and preprocessing live here — the contract between data and result.",
      topics: ["episodes", "fixed splits"],
    },
  },
  {
    id: "training",
    label: "Training",
    sub: "ACT · PyTorch",
    phase: "learned",
    info: {
      type: "action chunking objective",
      role: "The Action Chunking Transformer learns to predict a chunk of future actions from a short observation history. The dataset above is the only teacher.",
      topics: ["loss", "checkpoints"],
    },
  },
  {
    id: "policy",
    label: "ACT policy",
    sub: "inference",
    phase: "learned",
    info: {
      type: "transformer policy",
      role: "Camera observations and current joint state go in; a coordinated chunk of future actions comes out. Chunking is what keeps the motion coherent instead of twitchy.",
      topics: ["obs → action chunk"],
    },
  },
  {
    id: "follower",
    label: "Follower",
    sub: "execution",
    phase: "learned",
    info: {
      type: "real-world execution",
      role: "The physical arm executes the queued chunk one step at a time. No operator — the demonstration data is now driving the joints.",
      topics: ["motor commands"],
    },
  },
  {
    id: "task",
    label: "Physical task",
    sub: "outcome",
    phase: "learned",
    info: {
      type: "closed loop",
      role: "The desk task either completes or it doesn't — and the scene's new state flows back in as the next observation. Physics is the evaluator.",
      topics: ["episode end → reset"],
    },
  },
];

const Y0 = 16;
const NODE_STEP = 74;
const SPINE_X = X + NODE_W / 2;

export default function DemonstrationFlow() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = STAGES.find((s) => s.id === selected) ?? null;
  const idx = STAGES.findIndex((s) => s.id === selected);
  const linked =
    selected === null
      ? null
      : new Set(
          [STAGES[idx - 1]?.id, STAGES[idx + 1]?.id].filter(Boolean) as string[],
        );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="max-w-sm lg:col-span-5 lg:max-w-none">
        <div className="blueprint overflow-x-auto border border-line-strong/80">
          <svg
            className="block w-full min-w-[260px]"
            viewBox="0 0 260 534"
            role="group"
            aria-label="Demonstration pipeline: leader arm, demonstrations, dataset, training, ACT policy, follower arm, physical task"
          >
            <defs>
              <marker id="df-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7" fill="var(--color-ink-muted)"></path>
              </marker>
              <marker id="df-arr-acc" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7" fill="var(--color-accent)"></path>
              </marker>
            </defs>

            {STAGES.slice(0, -1).map((s, i) => {
              const y = Y0 + i * NODE_STEP + NODE_H;
              const active =
                !selected || linked?.has(s.id) || linked?.has(STAGES[i + 1].id);
              return (
                <g key={`${s.id}-${i}`}>
                  <line
                    x1={SPINE_X}
                    y1={y + 3}
                    x2={SPINE_X}
                    y2={y + NODE_STEP - NODE_H - 3}
                    stroke={active ? "var(--color-accent)" : "var(--color-line-strong)"}
                    strokeWidth={active && selected ? 1.5 : 1}
                    strokeOpacity={active ? 1 : 0.4}
                    strokeDasharray={active ? "5 4" : "3 4"}
                    markerEnd={active ? (selected ? "url(#df-arr-acc)" : "url(#df-arr)") : "url(#df-arr)"}
                  />
                  {i === 0 && (
                    <rect
                      x={SPINE_X - 2.5}
                      y={Y0 + NODE_H / 2}
                      width="5"
                      height="5"
                      fill="var(--color-accent)"
                    ></rect>
                  )}
                </g>
              );
            })}

            <circle r="3.5" className="flow-packet-df" fill="var(--color-accent)"></circle>

            {STAGES.map((s, i) => {
              const isSel = s.id === selected;
              const dim = selected !== null && !isSel && !(linked?.has(s.id) ?? false);
              const y = Y0 + i * NODE_STEP;
              const learned = s.phase === "learned";
              return (
                <g
                  key={s.id}
                  transform={`translate(${X} ${y})`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${s.label} — ${s.sub}`}
                  className="cursor-pointer focus-visible:outline-none"
                  onClick={() => setSelected(isSel ? null : s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(isSel ? null : s.id);
                    }
                  }}
                  opacity={dim ? 0.45 : 1}
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx="1"
                    fill={isSel ? "var(--color-accent-soft)" : "var(--color-paper)"}
                    stroke={
                      isSel
                        ? "var(--color-accent)"
                        : learned
                          ? "var(--color-accent)"
                          : "var(--color-line-strong)"
                    }
                    strokeWidth={isSel ? 1.5 : learned ? 1.25 : 1}
                    strokeDasharray={learned && !isSel ? "4 3" : undefined}
                  />
                  <text x="10" y="19" className="flow-node-label">
                    {s.label}
                  </text>
                  <text x="10" y="33" className="flow-node-sub">
                    {s.sub}
                  </text>
                  <text x={NODE_W - 10} y="19" textAnchor="end" className="flow-node-sub">
                    {String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mono-label mt-3 flex flex-wrap gap-x-6 gap-y-1 text-ink-muted">
          <span>Fig. 02 — demonstration → behavior</span>
          <span>solid = capture · dashed = learned</span>
          <span>select a stage to inspect</span>
        </p>
      </div>

      <aside
        aria-live="polite"
        className="self-start border border-line bg-paper-raised/60 px-5 py-5 lg:col-span-7"
      >
        {current ? (
          <div>
            <p className="mono-label text-accent">{current.label}</p>
            <p className="mono-data mt-2 text-ink-soft">{current.info.type}</p>
            <p className="mt-3 max-w-prose font-body text-sm text-ink-soft sm:text-base">
              {current.info.role}
            </p>
            <p className="mono-label mt-4 text-ink-muted">Data on the wire</p>
            <ul className="mt-1.5 space-y-1">
              {current.info.topics.map((t) => (
                <li key={t} className="mono-data text-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p className="mono-label text-ink-muted">Inspect</p>
            <p className="mt-2 max-w-prose font-body text-sm text-ink-soft">
              The whole idea in one line: a human demonstrates through the
              leader arm; the dataset captures it; ACT compresses it into a
              policy; the follower arm replays it — without the human.
            </p>
            <p className="mono-label mt-4 text-ink-muted">Legend</p>
            <p className="mono-data mt-1.5 text-ink-soft">
              solid frames = capture phase · dashed frames = learned behavior
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
