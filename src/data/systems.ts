export interface SystemEntry {
  slug: string;
  title: string;
  year: string;
  status: "active" | "shipped" | "archived";
  what: string;
  problem: string;
  tech: string[];
  why: string;
}

export const SYSTEMS: readonly SystemEntry[] = [
  {
    slug: "robile-amr",
    title: "Robile AMR",
    year: "2025",
    status: "active",
    what: "A ROS 2 autonomous navigation stack on the Robile mobile robot — SLAM, localization, A*/Dijkstra planning, obstacle avoidance and potential-field control.",
    problem:
      "A mobile robot is only useful if it knows where it is, where it has been, and how to get somewhere it has never seen. Robile required a working SLAM and localization stack plus navigation that could plan globally and react locally without colliding.",
    tech: ["ROS 2", "SLAM", "Localization", "A* / Dijkstra", "Potential fields", "Sensor fusion", "Gazebo", "Frontier exploration"],
    why: "It is the full autonomy stack in miniature: perception feeding localization feeding planning feeding control — with every layer's assumptions visible and debuggable.",
  },
  {
    slug: "desk-hero",
    title: "Desk Hero / LeRobot SO101",
    year: "2026",
    status: "active",
    what: "Learning to manipulate real objects with a LeRobot SO101 arm, trained by imitation — built for the Intrinsic AI Robotics Challenge 2026.",
    problem:
      "Instead of hand-coding a grasp, the policy must be learned from demonstrations — and ACT-style action chunking has to produce coordinated sequences, not single-step flailing.",
    tech: ["LeRobot", "ACT", "Imitation learning", "PyTorch"],
    why: "It is the most direct way to study how policies actually fail on real hardware: data quality, chunking, and the gap between demo and deployment.",
  },
  {
    slug: "toyota-hsr",
    title: "Toyota HSR — Vision & Navigation",
    year: "2025",
    status: "shipped",
    what: "ROS 2 perception and navigation modules for the Toyota Human Support Robot — SLAM, object detection and manipulation in a distributed system.",
    problem:
      "A service robot has to know its environment, find objects and act on them. The integration had to hold together across distributed modules — and survive contact with real hardware, not just simulation.",
    tech: ["ROS 2", "SLAM", "Object detection", "Sensor fusion", "Gazebo"],
    why: "Perception and navigation feeding manipulation is the full service-robot loop, validated in Gazebo and in the real world.",
  },
  {
    slug: "charge-consensus",
    title: "Charge Consensus",
    year: "2025",
    status: "shipped",
    what: "GenAI-assisted EV charging orchestration combining reinforcement learning — 1st prize at Junction 2025.",
    problem:
      "Charging demand, grid constraints and user preferences pull against each other. The system had to turn that into decisions that are explainable, not just optimal-looking.",
    tech: ["GenAI", "Reinforcement learning", "EV charging", "Orchestration"],
    why: "It treats orchestration as a learning problem rather than a rules engine — and it shipped as a working hackathon build under real time pressure.",
  },
  {
    slug: "roberta-autograder",
    title: "RoBERTa Autograder",
    year: "2024",
    status: "shipped",
    what: "Automatic grading of free-text answers with a fine-tuned RoBERTa transformer, built in PyTorch.",
    problem:
      "Free-text answers resist rule-based grading. The model had to map open-ended phrasing onto scores consistently enough to be trusted next to a human grader.",
    tech: ["RoBERTa", "Transformers", "NLP", "PyTorch"],
    why: "A compact, honest exercise in applied NLP: dataset, fine-tuning, evaluation — and seeing exactly where the model's judgement diverges from ours.",
  },
];

export interface LabArea {
  id: string;
  label: string;
  index: string;
  blurb: string;
  skills: readonly string[];
  projects: readonly { label: string; href: string | null }[];
}

export interface LabConnection {
  from: string;
  to: string;
}

export const LAB_AREAS: readonly LabArea[] = [
  {
    id: "robotics",
    label: "Robotics",
    index: "01",
    blurb: "Autonomy from the ground up — mapping, localization, planning, and the control loop that ties them together.",
    skills: ["ROS 2", "SLAM", "Navigation", "Localization", "Planning", "Control"],
    projects: [
      { label: "Robile AMR — full autonomy stack", href: "/work/robile-amr" },
      { label: "Toyota HSR — perception & navigation", href: "/work/toyota-hsr" },
      { label: "Warehouse robotics — Flexli", href: null },
    ],
  },
  {
    id: "perception",
    label: "Perception",
    index: "02",
    blurb: "Turning sensor streams into a usable model of the world — and keeping the pipeline honest under real data.",
    skills: ["Computer Vision", "OpenCV", "PyTorch", "Segmentation", "Tracking"],
    projects: [
      { label: "Robile AMR — SLAM & localization", href: "/work/robile-amr" },
      { label: "Toyota HSR — object detection", href: "/work/toyota-hsr" },
      { label: "Perception deep dive — pixels → objects → time", href: "/perception" },
    ],
  },
  {
    id: "learning",
    label: "Learning",
    index: "03",
    blurb: "Policies and models trained on demonstrations and data.",
    skills: ["Machine Learning", "Deep Learning", "Reinforcement Learning", "Imitation Learning", "Transformers"],
    projects: [
      { label: "Desk Hero — ACT manipulation", href: "/work/desk-hero" },
      { label: "Charge Consensus — RL orchestration", href: "/work/charge-consensus" },
      { label: "RoBERTa Autograder", href: "/work/roberta-autograder" },
    ],
  },
  {
    id: "embedded",
    label: "Embedded",
    index: "04",
    blurb: "The physical layer — microcontrollers, single-board computers, and the firmware between them.",
    skills: ["ESP32", "STM32", "Raspberry Pi", "Arduino", "C / C++", "Sensors"],
    projects: [{ label: "IoT systems — Flexli", href: null }],
  },
  {
    id: "data",
    label: "Data",
    index: "05",
    blurb: "Pipelines and storage that keep everything upstream of the model trustworthy.",
    skills: ["Python", "Pandas", "SQL", "ETL", "APIs", "PostgreSQL", "InfluxDB", "Redis"],
    projects: [{ label: "Data engineering — Flexli", href: null }],
  },
  {
    id: "software",
    label: "Software",
    index: "06",
    blurb: "Backends, infrastructure and deployment — the software that keeps production systems running.",
    skills: ["Go", "C#", "C++17", "Docker", "AWS", "FastAPI / Flask", "CI / CD", "Linux"],
    projects: [{ label: "Backend & telemetry services — Flexli", href: null }],
  },
];

export const LAB_CONNECTIONS: readonly LabConnection[] = [
  { from: "data", to: "learning" },
  { from: "learning", to: "perception" },
  { from: "perception", to: "robotics" },
  { from: "embedded", to: "robotics" },
  { from: "software", to: "robotics" },
];
