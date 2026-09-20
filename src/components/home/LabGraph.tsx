import { useState } from "react";
import type { LabArea, LabConnection } from "../../data/systems";

interface Props {
  areas: readonly LabArea[];
  connections: readonly LabConnection[];
}

const NODE_W = 170;
const NODE_H = 64;

const POS: Record<string, { x: number; y: number }> = {
  robotics: { x: 20, y: 10 },
  perception: { x: 20, y: 130 },
  learning: { x: 20, y: 250 },
  data: { x: 20, y: 370 },
  embedded: { x: 230, y: 190 },
  software: { x: 230, y: 330 },
};

const EDGE_PATH: Record<string, string> = {
  "data-learning": "M105 370 L105 318",
  "learning-perception": "M105 250 L105 198",
  "perception-robotics": "M105 130 L105 78",
  "embedded-robotics": "M315 190 L315 42 L196 42",
  "software-robotics": "M230 362 L212 362 L212 58 L196 58",
};

export default function LabGraph({ areas, connections }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeId = hovered ?? selected;
  const current = areas.find((a) => a.id === selected) ?? null;

  const linked = new Set<string>();
  if (activeId) {
    for (const c of connections) {
      if (c.from === activeId) linked.add(c.to);
      if (c.to === activeId) linked.add(c.from);
    }
  }

  const byId = (id: string) => areas.find((a) => a.id === id)!;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="max-w-md lg:col-span-5 lg:max-w-none">
        <div className="blueprint border border-line-strong/80 p-2 sm:p-3">
          <svg
            className="block w-full"
            viewBox="0 0 420 452"
            role="group"
            aria-label="Technical areas graph: data feeds learning, learning feeds perception; perception, embedded and software feed robotics"
          >
            <defs>
              <marker id="lg-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7" fill="var(--color-ink-muted)"></path>
              </marker>
              <marker id="lg-arr-acc" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7" fill="var(--color-accent)"></path>
              </marker>
            </defs>

            {connections.map((c) => {
              const key = `${c.from}-${c.to}`;
              const isActive =
                activeId !== null && (c.from === activeId || c.to === activeId);
              const isDim = activeId !== null && !isActive;
              return (
                <path
                  key={key}
                  d={EDGE_PATH[key]}
                  fill="none"
                  className="flow-edge"
                  stroke={isActive ? "var(--color-accent)" : "var(--color-line-strong)"}
                  strokeWidth={isActive ? 1.5 : 1}
                  strokeOpacity={isDim ? 0.35 : 1}
                  markerEnd={isActive ? "url(#lg-arr-acc)" : "url(#lg-arr)"}
                />
              );
            })}

            {areas.map((area) => {
              const pos = POS[area.id];
              const isSelected = area.id === selected;
              const isHovered = area.id === hovered;
              const isDim =
                activeId !== null &&
                area.id !== activeId &&
                !linked.has(area.id);
              return (
                <g
                  key={area.id}
                  transform={`translate(${pos.x} ${pos.y})`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${area.label} — ${area.skills.length} skills`}
                  className="cursor-pointer focus-visible:outline-none"
                  onClick={() => setSelected(isSelected ? null : area.id)}
                  onMouseEnter={() => setHovered(area.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(area.id)}
                  onBlur={() => setHovered(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(isSelected ? null : area.id);
                    } else if (e.key === "Escape") {
                      setSelected(null);
                    }
                  }}
                  opacity={isDim ? 0.45 : 1}
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx="1"
                    fill={isSelected || isHovered ? "var(--color-accent-soft)" : "var(--color-paper)"}
                    stroke={isSelected || isHovered ? "var(--color-accent)" : "var(--color-line-strong)"}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                  <text x="12" y="20" className="flow-node-sub">
                    {area.index}
                  </text>
                  <text x="12" y="42" className="flow-node-label">
                    {area.label.toUpperCase()}
                  </text>
                  <text x="12" y="57" className="flow-node-sub">
                    {String(area.skills.length).padStart(2, "0")} skills
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mono-label mt-3 flex flex-wrap gap-x-6 gap-y-1 text-ink-muted">
          <span>Fig. 01 — areas & connections</span>
          <span>arrows: what feeds what</span>
          <span>select a node</span>
        </p>
      </div>

      <aside
        aria-live="polite"
        className="self-start border border-line bg-paper-raised/60 px-5 py-5 lg:col-span-7"
      >
        {current ? (
          <div>
            <p className="mono-label text-accent">
              {current.index} · {current.label}
            </p>
            <p className="mt-3 max-w-prose font-body text-sm text-ink-soft sm:text-base">
              {current.blurb}
            </p>
            <p className="mono-label mt-5 text-ink-muted">Core skills</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {current.skills.map((t) => (
                <li
                  key={t}
                  className="mono-label inline-flex items-center border border-line-strong/70 bg-paper px-1.5 py-1 text-ink-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="mono-label mt-5 text-ink-muted">Connections</p>
            <ul className="mt-2.5 space-y-1.5">
              {connections
                .filter((c) => c.from === current.id)
                .map((c) => (
                  <li key={c.to} className="mono-data text-ink">
                    <span className="text-accent">→</span> feeds {byId(c.to).label}
                  </li>
                ))}
              {connections
                .filter((c) => c.to === current.id)
                .map((c) => (
                  <li key={c.from} className="mono-data text-ink-soft">
                    <span className="text-accent">←</span> fed by {byId(c.from).label}
                  </li>
                ))}
            </ul>
            <p className="mono-label mt-5 text-ink-muted">Where it shows up</p>
            <ul className="mt-2.5 space-y-2">
              {current.projects.map((p) => (
                <li key={p.label} className="flex items-baseline gap-3">
                  <span className="mono-label shrink-0 text-accent">→</span>
                  {p.href ? (
                    <a
                      href={p.href}
                      className="mono-data text-ink transition-colors hover:text-accent"
                    >
                      {p.label}
                    </a>
                  ) : (
                    <span className="mono-data text-ink-soft">{p.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p className="mono-label text-ink-muted">The workbench</p>
            <p className="mt-2 max-w-prose font-body text-sm text-ink-soft">
              Six areas, one workbench — and the edges between them are the
              interesting part. Select an area to see its tooling, what feeds
              it, and what it feeds.
            </p>
            <p className="mono-label mt-5 text-ink-muted">Connections</p>
            <ul className="mt-2.5 space-y-1.5">
              {connections.map((c) => (
                <li key={`${c.from}-${c.to}`} className="mono-data text-ink-soft">
                  <span className="text-ink">{byId(c.from).label.toUpperCase()}</span>
                  <span className="mx-2 text-accent">→</span>
                  <span className="text-ink">{byId(c.to).label.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
