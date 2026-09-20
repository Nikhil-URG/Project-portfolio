import { useState } from "react";

interface FlowNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  info: { type: string; role: string; topics: string[] };
}

interface Edge {
  d: string;
  from: string;
  to: string;
  dashed?: boolean;
}

const W = 132;
const H = 44;

const NODES: FlowNode[] = [
  {
    id: "scan",
    label: "/scan",
    sub: "lidar",
    x: 20,
    y: 76,
    info: {
      type: "sensor_msgs/LaserScan",
      role: "Raw range readings from the LiDAR — the only exteroceptive input feeding both mapping and localization.",
      topics: ["/scan"],
    },
  },
  {
    id: "slam",
    label: "SLAM",
    sub: "mapping",
    x: 192,
    y: 36,
    info: {
      type: "occupancy grid mapping",
      role: "Simultaneous localization and mapping: fuses scans and motion into a grid map while the robot explores — owning the map → odom transform while the map is being built.",
      topics: ["/scan → map update"],
    },
  },
  {
    id: "map",
    label: "/map",
    sub: "occupancy grid",
    x: 364,
    y: 36,
    info: {
      type: "nav_msgs/OccupancyGrid",
      role: "The shared world model. Planners use it for global reasoning; the particle filter matches scans against it.",
      topics: ["/map"],
    },
  },
  {
    id: "pf",
    label: "Particle filter",
    sub: "localization",
    x: 192,
    y: 148,
    info: {
      type: "Monte Carlo localization",
      role: "A cloud of weighted pose hypotheses, resampled against incoming scans until it converges on the robot's pose in the map. Used once a map exists — then it takes over the map → odom transform.",
      topics: ["map → odom transform"],
    },
  },
  {
    id: "tf",
    label: "TF chain",
    sub: "frames",
    x: 364,
    y: 148,
    info: {
      type: "map → odom → base_footprint → base_link",
      role: "The transform tree ties every frame together. Planners, controllers and sensor data all resolve poses through it.",
      topics: ["/tf", "/tf_static"],
    },
  },
  {
    id: "astar",
    label: "A* planner",
    sub: "global path",
    x: 536,
    y: 36,
    info: {
      type: "nav_msgs/Path",
      role: "Graph search over the occupancy grid: the shortest feasible route from the current pose to the goal, recomputed when the world changes.",
      topics: ["goal → global plan"],
    },
  },
  {
    id: "fields",
    label: "Potential fields",
    sub: "local control",
    x: 536,
    y: 148,
    info: {
      type: "vector composition",
      role: "Attractive pull toward the goal, repulsive push from nearby obstacles — composed into a smooth steering decision at full control rate.",
      topics: ["local avoidance"],
    },
  },
  {
    id: "cmdvel",
    label: "/cmd_vel",
    sub: "twist",
    x: 296,
    y: 268,
    info: {
      type: "geometry_msgs/Twist",
      role: "The only actuation interface: linear and angular velocity that the base is commanded to execute.",
      topics: ["/cmd_vel"],
    },
  },
  {
    id: "base",
    label: "Base",
    sub: "platform",
    x: 486,
    y: 268,
    info: {
      type: "actuation + odometry",
      role: "Motors execute the commanded twist; wheel odometry flows back into the odom frame, closing the loop.",
      topics: ["odometry → /tf"],
    },
  },
  {
    id: "goal",
    label: "Goal pose",
    sub: "input",
    x: 620,
    y: 268,
    info: {
      type: "2D pose goal",
      role: "Where the robot should go — set by an operator or chosen by the frontier-exploration logic when mapping unknown space.",
      topics: ["nav2 goal"],
    },
  },
];

const EDGES: Edge[] = [
  { d: "M152 98 L172 98 L172 58 L192 58", from: "scan", to: "slam" },
  { d: "M152 98 L172 98 L172 170 L192 170", from: "scan", to: "pf" },
  { d: "M324 58 L364 58", from: "slam", to: "map" },
  { d: "M404 80 L404 118 L258 118 L258 148", from: "map", to: "pf" },
  { d: "M324 170 L364 170", from: "pf", to: "tf" },
  { d: "M496 58 L536 58", from: "map", to: "astar" },
  { d: "M496 170 L516 170 L516 58 L536 58", from: "tf", to: "astar" },
  { d: "M496 170 L536 170", from: "tf", to: "fields" },
  { d: "M602 80 L602 148", from: "astar", to: "fields" },
  { d: "M602 192 L602 240 L362 240 L362 268", from: "fields", to: "cmdvel" },
  { d: "M428 290 L486 290", from: "cmdvel", to: "base" },
  { d: "M682 268 L682 110 L628 110 L628 80", from: "goal", to: "astar", dashed: true },
];

const ADJ: Record<string, Set<string>> = {};
for (const e of EDGES) {
  (ADJ[e.from] ??= new Set()).add(e.to);
  (ADJ[e.to] ??= new Set()).add(e.from);
}


export default function RobotFlow() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = NODES.find((n) => n.id === selected) ?? null;
  const linked = selected ? ADJ[selected] ?? new Set<string>() : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="blueprint overflow-x-auto border border-line-strong/80">
          <svg
            className="block w-full min-w-[620px]"
            viewBox="0 0 760 330"
            role="group"
            aria-label="ROS 2 data flow: LiDAR scans feed SLAM and particle-filter localization; transforms feed planners; the local controller publishes /cmd_vel"
          >
            <defs>
              <marker id="rf-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7" fill="var(--color-ink-muted)" />
              </marker>
              <marker id="rf-arr-acc" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7" fill="var(--color-accent)" />
              </marker>
            </defs>

            {EDGES.map((e) => {
              const active =
                !selected || linked?.has(e.from) === true || linked?.has(e.to) === true;
              return (
                <path
                  key={`${e.from}-${e.to}`}
                  d={e.d}
                  fill="none"
                  className={e.dashed ? undefined : "flow-edge"}
                  strokeDasharray={e.dashed ? "3 4" : undefined}
                  stroke={active ? "var(--color-accent)" : "var(--color-line-strong)"}
                  strokeWidth={active && selected ? 1.5 : 1}
                  strokeOpacity={active ? 1 : 0.4}
                  markerEnd={active ? (selected ? "url(#rf-arr-acc)" : "url(#rf-arr)") : undefined}
                />
              );
            })}

            <circle r="3.5" className="flow-packet" fill="var(--color-accent)" />

            {NODES.map((n) => {
              const isSel = n.id === selected;
              const dim = selected !== null && !isSel && !(linked?.has(n.id) ?? false);
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x} ${n.y})`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${n.label} — ${n.sub}`}
                  className="cursor-pointer focus-visible:outline-none"
                  onClick={() => setSelected(isSel ? null : n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(isSel ? null : n.id);
                    }
                  }}
                  opacity={dim ? 0.45 : 1}
                >
                  <rect
                    width={W}
                    height={H}
                    rx="1"
                    fill={isSel ? "var(--color-accent-soft)" : "var(--color-paper)"}
                    stroke={isSel ? "var(--color-accent)" : "var(--color-line-strong)"}
                    strokeWidth={isSel ? 1.5 : 1}
                  />
                  <text x="10" y="19" className="flow-node-label">
                    {n.label}
                  </text>
                  <text x="10" y="33" className="flow-node-sub">
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mono-label mt-3 flex flex-wrap gap-x-6 gap-y-1 text-ink-muted">
          <span>Fig. 01 — system data flow</span>
          <span className="md:hidden text-accent">scroll to explore →</span>
          <span>marching dashes = message flow</span>
          <span>select a node to inspect</span>
        </p>
      </div>

      <aside
        aria-live="polite"
        className="self-start border border-line bg-paper-raised/60 px-5 py-5 lg:col-span-4"
      >
        {current ? (
          <div>
            <p className="mono-label text-accent">{current.label}</p>
            <p className="mono-data mt-2 text-ink-soft">{current.info.type}</p>
            <p className="mt-3 font-body text-sm text-ink-soft">{current.info.role}</p>
            <p className="mono-label mt-4 text-ink-muted">Topics</p>
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
            <p className="mt-2 font-body text-sm text-ink-soft">
              Select any block in the pipeline to see what it does, which
              messages it speaks, and where it sits in the loop.
            </p>
            <p className="mono-label mt-4 text-ink-muted">Legend</p>
            <p className="mono-data mt-1.5 text-ink-soft">
              sense → map → localize → plan → act
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
