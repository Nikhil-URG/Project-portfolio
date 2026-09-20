import { useState, type ReactNode } from "react";

interface StageDetail {
  type: string;
  body: string;
  failures: string[];
  question: string;
}

interface Stage {
  id: string;
  title: string;
  bucket: string;
  visual: ReactNode;
  detail: StageDetail;
}

const mono = { fontFamily: "var(--font-mono)" } as const;

const FramesVisual = (
  <svg className="block w-full text-ink" viewBox="0 0 150 100" role="img" aria-label="Three successive camera frames">
    <rect x="10" y="8" width="66" height="44" rx="1" fill="var(--color-paper-raised)" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <rect x="22" y="18" width="66" height="44" rx="1" fill="var(--color-paper)" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <rect x="34" y="28" width="66" height="44" rx="1" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.25"></rect>
    <circle cx="96" cy="68" r="2.5" fill="var(--color-accent)"></circle>
    <text x="118" y="16" style={mono} fontSize="9" fill="var(--color-ink-muted)">t</text>
    <text x="122" y="30" style={mono} fontSize="9" fill="var(--color-ink-muted)">t+Δ</text>
    <text x="108" y="48" style={mono} fontSize="9" fill="var(--color-ink-muted)">t+2Δ</text>
  </svg>
);

const RepresentationVisual = (
  <svg className="block w-full text-ink" viewBox="0 0 150 100" role="img" aria-label="Pixel grid decoded into stacked tensor channels">
    <g stroke="var(--color-line-strong)" strokeWidth="0.75">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <rect key={`${c}-${r}`} x={12 + c * 9} y={22 + r * 9} width="9" height="9"></rect>
        ))
      )}
    </g>
    <line x1="68" y1="50" x2="88" y2="50" stroke="var(--color-ink-muted)" strokeWidth="1" markerEnd="url(#pp-arr)"></line>
    <g stroke="var(--color-ink)" strokeWidth="1.25">
      <line x1="92" y1="30" x2="136" y2="28"></line>
      <line x1="92" y1="50" x2="136" y2="48"></line>
      <line x1="92" y1="70" x2="136" y2="68"></line>
    </g>
    <text x="12" y="16" style={mono} fontSize="9" fill="var(--color-ink-muted)">pixels</text>
    <text x="92" y="14" style={mono} fontSize="9" fill="var(--color-ink-muted)">H × W × C</text>
    <text x="12" y="92" style={mono} fontSize="9" fill="var(--color-ink-muted)">decode · resize · sync t</text>
  </svg>
);

const SegmentationVisual = (
  <svg className="block w-full text-ink" viewBox="0 0 150 100" role="img" aria-label="Segmentation regions with a boundary between classes">
    <rect x="10" y="8" width="130" height="80" fill="var(--color-paper)" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <path d="M22 30 Q 34 18 48 30 Q 46 52 30 60 Q 18 44 22 30 Z" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.25"></path>
    <path d="M60 40 Q 88 28 104 44 Q 100 72 72 74 Q 52 68 60 40 Z" fill="none" stroke="var(--color-ink)" strokeWidth="1.25"></path>
    <line x1="50" y1="14" x2="54" y2="84" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 4"></line>
    <text x="96" y="80" style={mono} fontSize="9" fill="var(--color-ink-muted)">mask / instance</text>
    <text x="12" y="98" style={mono} fontSize="9" fill="var(--color-ink-muted)">boundary — who drew it?</text>
  </svg>
);

const TrackingVisual = (
  <svg className="block w-full text-ink" viewBox="0 0 150 100" role="img" aria-label="Object identities persisting across frames through an occlusion">
    <rect x="10" y="8" width="130" height="80" rx="1" fill="var(--color-paper)" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <polyline points="24,64 50,52 76,52 100,64 124,40" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1" strokeDasharray="3 4"></polyline>
    <rect x="18" y="18" width="22" height="18" fill="none" stroke="var(--color-accent)" strokeWidth="1.25"></rect>
    <rect x="70" y="18" width="22" height="18" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1" strokeDasharray="3 3"></rect>
    <rect x="112" y="30" width="22" height="22" fill="none" stroke="var(--color-accent)" strokeWidth="1.25"></rect>
    <rect x="46" y="60" width="22" height="18" fill="none" stroke="var(--color-ink)" strokeWidth="1.25"></rect>
    <text x="20" y="14" style={mono} fontSize="8" fill="var(--color-accent)">id 07</text>
    <text x="72" y="44" style={mono} fontSize="8" fill="var(--color-ink-muted)">occluded</text>
    <text x="108" y="26" style={mono} fontSize="8" fill="var(--color-accent)">id 07</text>
    <text x="48" y="56" style={mono} fontSize="8" fill="var(--color-ink)">id 12</text>
    <text x="12" y="98" style={mono} fontSize="9" fill="var(--color-ink-muted)">judged at re-appearance</text>
  </svg>
);

const TemporalVisual = (
  <svg className="block w-full text-ink" viewBox="0 0 150 100" role="img" aria-label="Labels checked for consistency between consecutive frames">
    <rect x="12" y="14" width="52" height="40" rx="1" fill="var(--color-paper-raised)" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <rect x="86" y="14" width="52" height="40" rx="1" fill="var(--color-paper-raised)" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <circle cx="34" cy="36" r="3" fill="var(--color-accent)"></circle>
    <circle cx="110" cy="34" r="3" fill="var(--color-accent)"></circle>
    <line x1="34" y1="36" x2="110" y2="34" stroke="var(--color-ink-muted)" strokeWidth="1" strokeDasharray="3 4"></line>
    <rect x="98" y="58" width="28" height="16" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3"></rect>
    <text x="100" y="70" style={mono} fontSize="8" fill="var(--color-accent)">✕ flicker</text>
    <text x="12" y="8" style={mono} fontSize="9" fill="var(--color-ink-muted)">frame N</text>
    <text x="86" y="8" style={mono} fontSize="9" fill="var(--color-ink-muted)">frame N+1</text>
    <text x="12" y="90" style={mono} fontSize="9" fill="var(--color-ink-muted)">N must agree with N+1</text>
  </svg>
);

const DatasetVisual = (
  <svg className="block w-full text-ink" viewBox="0 0 150 100" role="img" aria-label="Versioned dataset rows with fixed splits">
    <text x="12" y="14" style={mono} fontSize="9" fill="var(--color-ink)">v1.4.2 · pinned</text>
    <g style={mono} fontSize="9" fill="var(--color-ink-soft)">
      <text x="12" y="36">0001 · mask · ok</text>
      <text x="12" y="50">0002 · mask · ok</text>
      <text x="12" y="64">0003 · mask · review</text>
      <text x="12" y="78">0004 · box · ok</text>
    </g>
    <g stroke="var(--color-line)" strokeWidth="1">
      <line x1="12" y1="24" x2="138" y2="24"></line>
      <line x1="12" y1="40" x2="138" y2="40"></line>
      <line x1="12" y1="54" x2="138" y2="54"></line>
      <line x1="12" y1="68" x2="138" y2="68"></line>
      <line x1="12" y1="82" x2="138" y2="82"></line>
    </g>
    <text x="12" y="96" style={mono} fontSize="9" fill="var(--color-ink-muted)">splits fixed · configs recorded</text>
  </svg>
);

const ModelVisual = (
  <svg className="block w-full text-ink" viewBox="0 0 150 100" role="img" aria-label="Model trained in PyTorch, evaluated on held-out data">
    <rect x="12" y="16" width="30" height="16" rx="1" fill="none" stroke="var(--color-ink)" strokeWidth="1.25"></rect>
    <rect x="18" y="38" width="30" height="16" rx="1" fill="var(--color-paper-raised)" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <rect x="24" y="60" width="30" height="16" rx="1" fill="none" stroke="var(--color-line-strong)" strokeWidth="1"></rect>
    <line x1="60" y1="56" x2="88" y2="56" stroke="var(--color-ink-muted)" strokeWidth="1" markerEnd="url(#pp-arr)"></line>
    <g stroke="var(--color-accent)" strokeWidth="1.25">
      <line x1="94" y1="48" x2="94" y2="30"></line>
      <line x1="104" y1="48" x2="94" y2="30"></line>
      <line x1="94" y1="48" x2="108" y2="34"></line>
    </g>
    <text x="94" y="24" style={mono} fontSize="8.5" fill="var(--color-accent)">metrics</text>
    <text x="12" y="90" style={mono} fontSize="9" fill="var(--color-ink-muted)">train · held-out eval · error triage</text>
    <text x="12" y="8" style={mono} fontSize="9" fill="var(--color-ink-muted)">PyTorch</text>
  </svg>
);

const STAGES: Stage[] = [
  {
    id: "frames",
    title: "Image sequence",
    bucket: "pixels",
    visual: FramesVisual,
    detail: {
      type: "raw capture",
      body: "Frames before they are meaning: sensor output hitting disk. Codec, exposure and trigger sync are already perception decisions — made before any model runs.",
      failures: ["dropped frames mid-sequence", "unstable exposure between scenes", "no common clock between sensors"],
      question: "Does what we saved resemble what the sensor saw?",
    },
  },
  {
    id: "representation",
    title: "Representation",
    bucket: "representation",
    visual: RepresentationVisual,
    detail: {
      type: "tensors & synchronized samples",
      body: "Decode, convert, resize, align timestamps across sensors. The representation decides how much signal survives and what the downstream stages even can see.",
      failures: ["mismatched timestamps across sources", "lossy preprocessing destroying weak signals", "resolution choices made once, regretted later"],
      question: "Which representation carries enough signal at the least cost?",
    },
  },
  {
    id: "segmentation",
    title: "Segmentation",
    bucket: "objects",
    visual: SegmentationVisual,
    detail: {
      type: "regions, masks, instances",
      body: "Turning representation into discrete structure: which pixels belong to which thing. A model is only as good as its boundary labels — annotation quality sets the ceiling.",
      failures: ["annotator disagreement on boundaries", "class definitions drifting between sessions", "rare classes under-labeled"],
      question: "Is the label trustworthy — and would two people agree on it?",
    },
  },
  {
    id: "tracking",
    title: "Tracking",
    bucket: "objects · ids",
    visual: TrackingVisual,
    detail: {
      type: "identity across frames",
      body: "Detection is per-frame; tracking answers the harder question — is this the same object as last frame? Quality is judged at re-appearance, not first detection.",
      failures: ["identity switches after occlusion", "drift when appearance changes", "fragmented tracks from short misses"],
      question: "Does the object stay itself when it disappears?",
    },
  },
  {
    id: "temporal",
    title: "Temporal consistency",
    bucket: "time",
    visual: TemporalVisual,
    detail: {
      type: "coherence across the sequence",
      body: "A label that flickers frame-to-frame injects noise at the source. Temporal consistency is a dataset property to engineer, not a model feature to hope for.",
      failures: ["flickering class boundaries", "id swaps on fast motion", "inconsistent policy across annotators"],
      question: "Does frame N agree with frame N+1 — and how would we know?",
    },
  },
  {
    id: "dataset",
    title: "Dataset",
    bucket: "reproducibility",
    visual: DatasetVisual,
    detail: {
      type: "versioned, regenerable data",
      body: "Version the data like code: pinned preprocessing, fixed splits, recorded configs. A benchmark number you cannot regenerate is an anecdote, not a result.",
      failures: ["train/test leakage", 'lost "final" preprocessing scripts', "silent schema changes"],
      question: "Can someone re-run this and get the same numbers?",
    },
  },
  {
    id: "model",
    title: "Model",
    bucket: "PyTorch → action",
    visual: ModelVisual,
    detail: {
      type: "train · evaluate · route errors back",
      body: "In PyTorch: train, then evaluate per class and per condition — aggregates hide conditional failures. Predictions the model is unsure about go back to the annotation queue. The loop closes.",
      failures: ["metrics that look fine on average", "eval splits leaked into training", "no human baseline to compare against"],
      question: "Where exactly does the model's judgement diverge from ours?",
    },
  },
];

export default function PerceptionPipeline() {
  const [active, setActive] = useState(0);
  const current = STAGES[active];

  return (
    <div>
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <marker id="pp-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0 0L7 3.5L0 7" fill="var(--color-ink-muted)"></path>
          </marker>
        </defs>
      </svg>

      <div role="tablist" aria-label="Perception pipeline stages" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {STAGES.map((stage, i) => {
          const selected = i === active;
          return (
            <button
              key={stage.id}
              role="tab"
              id={`pp-tab-${stage.id}`}
              aria-selected={selected}
              aria-controls="pp-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((active + 1) % STAGES.length);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((active - 1 + STAGES.length) % STAGES.length);
                }
              }}
              className={`group border p-3 text-left transition-colors duration-150 ${
                selected
                  ? "border-accent bg-accent-soft/40"
                  : "border-line hover:border-line-strong hover:bg-paper-raised"
              }`}
            >
              <span className="mono-label block" style={{ color: selected ? "var(--color-accent)" : "var(--color-ink-muted)" }}>
                {String(i + 1).padStart(2, "0")} · {stage.bucket}
              </span>
              <span className="mt-2 block">{stage.visual}</span>
              <span className="mono-label mt-2 block" style={{ color: selected ? "var(--color-accent-ink)" : "var(--color-ink)" }}>
                {stage.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center sm:justify-start">
        <svg className="block w-full max-w-3xl text-ink" height="6" viewBox="0 0 600 6" preserveAspectRatio="none" aria-hidden="true">
          <line x1="2" y1="3" x2="598" y2="3" stroke="currentColor" strokeWidth="1.5" className="flow-edge"></line>
        </svg>
      </div>

      <div
        role="tabpanel"
        id="pp-panel"
        aria-labelledby={`pp-tab-${current.id}`}
        className="mt-4 grid grid-cols-1 gap-6 border border-line bg-paper-raised/60 px-5 py-6 sm:grid-cols-12 sm:px-6"
      >
        <div className="sm:col-span-7">
          <p className="mono-label text-accent">{current.title}</p>
          <p className="mono-data mt-2 text-ink-soft">{current.detail.type}</p>
          <p className="mt-3 max-w-prose font-body text-sm text-ink-soft sm:text-base">{current.detail.body}</p>
        </div>
        <div className="sm:col-span-4 sm:col-start-9">
          <p className="mono-label text-ink-muted">Failure modes</p>
          <ul className="mt-2 space-y-1.5">
            {current.detail.failures.map((f) => (
              <li key={f} className="mono-data flex items-baseline gap-2 text-ink">
                <span className="text-accent" aria-hidden="true">·</span>
                {f}
              </li>
            ))}
          </ul>
          <p className="mono-label mt-5 text-ink-muted">The engineering question</p>
          <p className="mt-1.5 font-display text-sm text-accent-ink sm:text-base">{current.detail.question}</p>
        </div>
      </div>
    </div>
  );
}
