import {
  Stack,
  Row,
  Grid,
  H1,
  H2,
  H3,
  Text,
  Pill,
  Callout,
  Divider,
  Swatch,
  Table,
  colorPalette,
  useHostTheme,
  useCanvasState,
} from "cursor/canvas";
import type { ReactNode } from "react";

type ViewId =
  | "architecture"
  | "execution"
  | "modules"
  | "adaptive"
  | "feedback";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "architecture", label: "System Architecture" },
  { id: "execution", label: "Execution Flow" },
  { id: "modules", label: "AI Components" },
  { id: "adaptive", label: "Adaptive Engine" },
  { id: "feedback", label: "Feedback Pipeline" },
];

/* ── SVG icon glyphs (minimal, no emoji) ── */
function IconUser({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconMic({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke={color} strokeWidth="2" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconBrain({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 6a3 3 0 0 0-3 3v1a2 2 0 0 0 0 4v1a3 3 0 0 0 3 3M16 6a3 3 0 0 1 3 3v1a2 2 0 0 1 0 4v1a3 3 0 0 1-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4v16" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}
function IconDb({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke={color} strokeWidth="2" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function IconChart({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconNlp({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h10M4 17h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="19" cy="17" r="2" fill={color} />
    </svg>
  );
}

/* ── Flowchart primitives ── */
type FlowNodeProps = {
  label: string;
  sub?: string;
  color: string;
  icon?: ReactNode;
  width?: number;
  highlight?: boolean;
};

function FlowNode({ label, sub, color, icon, width = 180, highlight }: FlowNodeProps) {
  const t = useHostTheme();
  return (
    <div
      style={{
        width,
        padding: "10px 14px",
        borderRadius: 10,
        border: `2px solid ${highlight ? t.accent.primary : color}`,
        background: highlight ? `${color}28` : t.bg.elevated,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {icon && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: `${color}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.text.primary, lineHeight: 1.3 }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 10, color: t.text.tertiary, marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function FlowArrow({ label, dashed }: { label?: string; dashed?: boolean }) {
  const t = useHostTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2px 0" }}>
      <svg width="16" height="24" viewBox="0 0 16 24">
        <line
          x1="8" y1="0" x2="8" y2="18"
          stroke={t.text.tertiary}
          strokeWidth="1.5"
          strokeDasharray={dashed ? "3 3" : undefined}
        />
        <polygon points="4,16 8,22 12,16" fill={t.text.tertiary} />
      </svg>
      {label && (
        <span style={{ fontSize: 10, color: t.text.quaternary, marginTop: -2 }}>{label}</span>
      )}
    </div>
  );
}

function FlowRow({ children, gap = 16 }: { children: ReactNode; gap?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap, flexWrap: "wrap" }}>
      {children}
    </div>
  );
}

function LayerBand({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: ReactNode;
}) {
  const t = useHostTheme();
  return (
    <div
      style={{
        border: `1px solid ${t.stroke.secondary}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        padding: "12px 16px",
        background: t.fill.quaternary,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Swatch color={layerColorKey(color)} />
        <span style={{ fontSize: 11, fontWeight: 600, color: t.text.secondary, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function layerColorKey(hex: string): "blue" | "purple" | "green" | "orange" | "pink" | "gray" {
  if (hex === colorPalette.purple) return "purple";
  if (hex === colorPalette.green) return "green";
  if (hex === colorPalette.orange) return "orange";
  if (hex === colorPalette.pink) return "pink";
  return "blue";
}

function BranchLabel({ text, color }: { text: string; color: string }) {
  const t = useHostTheme();
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        color,
        padding: "2px 8px",
        borderRadius: 4,
        background: `${color}18`,
        border: `1px solid ${color}44`,
      }}
    >
      {text}
    </span>
  );
}


function MergeNode({ label }: { label: string }) {
  const t = useHostTheme();
  return (
    <div
      style={{
        width: 200,
        padding: "8px 12px",
        borderRadius: 20,
        border: `2px dashed ${t.accent.primary}`,
        background: `${t.accent.primary}12`,
        textAlign: "center",
        fontSize: 11,
        fontWeight: 600,
        color: t.accent.primary,
      }}
    >
      {label}
    </div>
  );
}

function PipelineColumn({ title, color, steps }: { title: string; color: string; steps: string[] }) {
  const t = useHostTheme();
  return (
    <div style={{ flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 8, textAlign: "center" }}>{title}</div>
      <Stack gap={0}>
        {steps.map((step, i) => (
          <div key={step}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${color}55`,
                background: t.bg.elevated,
                fontSize: 11,
                color: t.text.primary,
                textAlign: "center",
              }}
            >
              {step}
            </div>
            {i < steps.length - 1 && <FlowArrow />}
          </div>
        ))}
      </Stack>
    </div>
  );
}

/* ── Diagram 1: System Architecture ── */
function SystemArchitecture() {
  const c = colorPalette;
  return (
    <Stack gap={12}>
      <Text tone="secondary" size="small">
        Layered architecture — presentation, application, AI/ML processing, and persistent data stores.
      </Text>
      <Stack gap={10}>
        <LayerBand title="Presentation Layer" color={c.blue}>
          <FlowRow>
            <FlowNode label="User Login" icon={<IconUser color={c.blue} />} color={c.blue} width={150} />
            <FlowNode label="Interview UI" sub="Text & Voice Input" icon={<IconMic color={c.blue} />} color={c.blue} width={170} />
            <FlowNode label="Dashboard & Analytics" icon={<IconChart color={c.blue} />} color={c.blue} width={190} />
          </FlowRow>
        </LayerBand>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FlowArrow label="REST / WebSocket" />
        </div>
        <LayerBand title="Application Layer" color={c.purple}>
          <FlowRow>
            <FlowNode label="Interview Engine" sub="Question Selection & Session Mgmt" color={c.purple} width={170} />
            <FlowNode label="Adaptive Decision Engine" sub="RL-Inspired Logic" color={c.purple} width={190} highlight />
            <FlowNode label="Final Report Generator" color={c.purple} width={170} />
          </FlowRow>
        </LayerBand>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FlowArrow />
        </div>
        <LayerBand title="AI / ML Processing Layer" color={c.purple}>
          <Grid columns={3} gap={10}>
            <FlowNode label="Speech-to-Text" sub="Whisper API" icon={<IconMic color={c.pink} />} color={c.pink} width={160} />
            <FlowNode label="NLP & Semantic Engine" sub="TF-IDF · Cosine Similarity" icon={<IconNlp color={c.purple} />} color={c.purple} width={180} />
            <FlowNode label="STAR Evaluator" sub="S · T · A · R Detection" icon={<IconBrain color={c.purple} />} color={c.purple} width={170} />
            <FlowNode label="Communication Analyzer" sub="Grammar · Clarity · Fluency" color={c.purple} width={180} />
            <FlowNode label="Scoring Engine" sub="Multi-dimensional Scores" color={c.purple} width={170} />
            <FlowNode label="Confidence Analyzer" sub="Filler · Pause · Speed" color={c.pink} width={170} />
          </Grid>
        </LayerBand>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FlowArrow />
        </div>
        <LayerBand title="Data Layer" color={c.green}>
          <FlowRow>
            <FlowNode label="Domain Question DB" sub="Interview Domains & Q-A Pairs" icon={<IconDb color={c.green} />} color={c.green} width={190} />
            <FlowNode label="User Performance Store" sub="Scores · Weak/Strong Areas" icon={<IconDb color={c.green} />} color={c.green} width={200} />
            <FlowNode label="Session History" sub="Previous Interviews & Trends" icon={<IconDb color={c.green} />} color={c.green} width={190} />
          </FlowRow>
        </LayerBand>
      </Stack>
      <Callout tone="info" title="Architecture Pattern">
        Modular microservice-ready design with clear separation of concerns. Each AI module is independently testable and swappable.
      </Callout>
    </Stack>
  );
}

/* ── Diagram 2: Execution Flow ── */
function ExecutionFlow() {
  const c = colorPalette;
  return (
    <Stack gap={12}>
      <Text tone="secondary" size="small">
        End-to-end session lifecycle from authentication through adaptive questioning loop to final analytics.
      </Text>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FlowNode label="User Login" icon={<IconUser color={c.blue} />} color={c.blue} />
        <FlowArrow />
        <FlowNode label="Select Interview Domain" color={c.blue} />
        <FlowArrow />
        <FlowNode label="Load Domain Question Database" icon={<IconDb color={c.green} />} color={c.green} />
        <FlowArrow />
        <FlowNode label="Start Interview Session" color={c.blue} />
        <FlowArrow />
        <FlowNode label="Interview Engine Selects Question" color={c.purple} highlight />
        <FlowArrow />
        <FlowNode label="User Gives Response" sub="Text Input  ·  Voice Input" color={c.blue} width={220} />
        <FlowArrow label="branch" />

        <Row gap={24} align="start" wrap style={{ width: "100%", justifyContent: "center" }}>
          <PipelineColumn
            title="Text Pipeline"
            color={c.blue}
            steps={["User Text", "Text Cleaning", "Tokenization", "Stopword Removal", "TF-IDF Vectorization"]}
          />
          <div style={{ alignSelf: "center", paddingTop: 40 }}>
            <MergeNode label="NLP & Semantic Analysis Engine" />
          </div>
          <PipelineColumn
            title="Voice Pipeline"
            color={c.pink}
            steps={["Voice Input", "Speech-to-Text (Whisper)", "Filler Words · Pause · Speed", "Confidence Score"]}
          />
        </Row>

        <FlowArrow />
        <FlowNode label="Cosine Similarity Check" sub="User vector vs Expected answer vector" color={c.purple} width={260} />
        <FlowArrow />
        <FlowNode label="STAR Format Evaluation" sub="Situation · Task · Action · Result" color={c.purple} width={260} />
        <FlowArrow />
        <FlowNode label="Communication Analysis" sub="Grammar · Clarity · Fluency · Length" color={c.purple} width={260} />
        <FlowArrow />
        <FlowNode label="Scoring & Evaluation Engine" sub="Technical · STAR · Confidence · Communication · Overall" color={c.purple} width={280} highlight />
        <FlowArrow />
        <FlowNode label="Adaptive Decision Engine" sub="Reinforcement-Learning-Inspired Logic" color={c.purple} width={280} highlight />
        <FlowArrow label="loop" dashed />
        <FlowNode label="Generate Next Question" color={c.purple} />
        <FlowArrow dashed />
        <Text size="small" tone="tertiary" style={{ fontStyle: "italic" }}>
          ↺ loops back to Interview Engine Selects Question
        </Text>
        <FlowArrow />
        <FlowNode label="Interview Session Ends" color={c.blue} />
        <FlowArrow />
        <FlowNode label="Final Report Generator" color={c.green} width={200} />
        <FlowArrow />
        <FlowNode label="Dashboard & Analytics" icon={<IconChart color={c.blue} />} color={c.blue} width={220} />
      </div>
    </Stack>
  );
}

/* ── Diagram 3: Modular AI Components ── */
function ModularComponents() {
  const t = useHostTheme();
  const c = colorPalette;

  const modules = [
    {
      name: "Speech Processing Module",
      color: c.pink,
      icon: <IconMic color={c.pink} />,
      inputs: ["Raw audio stream"],
      outputs: ["Transcript", "Confidence metrics"],
      tech: ["Whisper API", "Audio feature extraction"],
    },
    {
      name: "Text Preprocessing Module",
      color: c.blue,
      icon: <IconNlp color={c.blue} />,
      inputs: ["Raw text response"],
      outputs: ["Clean token vectors"],
      tech: ["Tokenization", "Stopword removal", "TF-IDF"],
    },
    {
      name: "Semantic Analysis Engine",
      color: c.purple,
      icon: <IconBrain color={c.purple} />,
      inputs: ["User vector", "Expected answer vector"],
      outputs: ["Semantic relevance score"],
      tech: ["Cosine similarity", "Embedding comparison"],
    },
    {
      name: "STAR Evaluator",
      color: c.purple,
      inputs: ["Parsed response text"],
      outputs: ["STAR compliance score", "Component breakdown"],
      tech: ["Situation detection", "Task detection", "Action detection", "Result detection"],
    },
    {
      name: "Communication Analyzer",
      color: c.blue,
      inputs: ["Response text / transcript"],
      outputs: ["Communication score"],
      tech: ["Grammar check", "Clarity scoring", "Fluency analysis", "Length validation"],
    },
    {
      name: "Scoring & Evaluation Engine",
      color: c.green,
      inputs: ["All module scores"],
      outputs: ["Overall score", "Dimension breakdown"],
      tech: ["Weighted aggregation", "Normalization"],
    },
    {
      name: "Adaptive Decision Engine",
      color: c.orange,
      icon: <IconBrain color={c.orange} />,
      inputs: ["Overall score", "Performance history"],
      outputs: ["Next difficulty", "Question type", "Coaching hints"],
      tech: ["RL-inspired policy", "Performance memory"],
      highlight: true,
    },
    {
      name: "Report Generator",
      color: c.green,
      icon: <IconChart color={c.green} />,
      inputs: ["Session scores", "Analysis results"],
      outputs: ["Feedback report", "Recommendations"],
      tech: ["Template rendering", "Trend analysis"],
    },
  ];

  return (
    <Stack gap={12}>
      <Text tone="secondary" size="small">
        Independently deployable AI/ML modules with defined inputs, outputs, and underlying techniques.
      </Text>
      <Grid columns={2} gap={12}>
        {modules.map((m) => (
          <div
            key={m.name}
            style={{
              border: `1px solid ${m.highlight ? t.accent.primary : t.stroke.secondary}`,
              borderRadius: 10,
              padding: 14,
              background: m.highlight ? `${m.color}10` : t.bg.elevated,
            }}
          >
            <Row gap={8} align="center" style={{ marginBottom: 8 }}>
              {m.icon && (
                <div style={{ width: 26, height: 26, borderRadius: 6, background: `${m.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {m.icon}
                </div>
              )}
              <span style={{ fontSize: 12, fontWeight: 600, color: t.text.primary }}>{m.name}</span>
            </Row>
            <Grid columns={2} gap={8}>
              <div>
                <div style={{ fontSize: 10, color: t.text.quaternary, marginBottom: 4, fontWeight: 600 }}>INPUTS</div>
                {m.inputs.map((i) => (
                  <div key={i} style={{ fontSize: 10, color: t.text.secondary, marginBottom: 2 }}>→ {i}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.text.quaternary, marginBottom: 4, fontWeight: 600 }}>OUTPUTS</div>
                {m.outputs.map((o) => (
                  <div key={o} style={{ fontSize: 10, color: t.text.secondary, marginBottom: 2 }}>← {o}</div>
                ))}
              </div>
            </Grid>
            <Divider style={{ margin: "8px 0" }} />
            <div style={{ fontSize: 10, color: t.text.quaternary, marginBottom: 4, fontWeight: 600 }}>TECHNIQUES</div>
            <Row gap={6} wrap>
              {m.tech.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: t.fill.tertiary,
                    color: t.text.secondary,
                  }}
                >
                  {tech}
                </span>
              ))}
            </Row>
          </div>
        ))}
      </Grid>
    </Stack>
  );
}

/* ── Diagram 4: Adaptive Decision Flow ── */
function AdaptiveDecisionFlow() {
  const c = colorPalette;
  const t = useHostTheme();

  return (
    <Stack gap={12}>
      <Text tone="secondary" size="small">
        Reinforcement-learning-inspired policy that adapts question difficulty and coaching strategy based on real-time performance.
      </Text>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FlowNode label="Scoring & Evaluation Engine" sub="Overall Score Generated" color={c.purple} width={260} />
        <FlowArrow />
        <FlowNode label="Adaptive Decision Engine" sub="Reinforcement-Learning-Inspired Logic" color={c.purple} width={300} highlight />
        <FlowArrow label="score threshold" />

        <Row gap={20} align="start" wrap style={{ justifyContent: "center", width: "100%" }}>
          {/* HIGH */}
          <div style={{ flex: 1, minWidth: 200, maxWidth: 240 }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <BranchLabel text="HIGH SCORE" color={c.green} />
            </div>
            <Stack gap={0}>
              <FlowNode label="Increase Difficulty" color={c.green} width={220} />
              <FlowArrow />
              <FlowNode label="Ask Cross Questions" sub="Probe deeper understanding" color={c.green} width={220} />
            </Stack>
          </div>

          {/* MEDIUM */}
          <div style={{ flex: 1, minWidth: 200, maxWidth: 240 }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <BranchLabel text="MEDIUM SCORE" color={c.orange} />
            </div>
            <Stack gap={0}>
              <FlowNode label="Continue Same Difficulty" sub="Maintain current level" color={c.orange} width={220} />
            </Stack>
          </div>

          {/* LOW */}
          <div style={{ flex: 1, minWidth: 200, maxWidth: 240 }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <BranchLabel text="LOW SCORE" color={c.pink} />
            </div>
            <Stack gap={0}>
              <FlowNode label="Easier Question" color={c.pink} width={220} />
              <FlowArrow />
              <FlowNode label="Hint-Based Follow-Up" color={c.pink} width={220} />
              <FlowArrow />
              <FlowNode label="Coaching Questions" sub="Guided learning mode" color={c.pink} width={220} />
            </Stack>
          </div>
        </Row>

        <FlowArrow label="merge" />
        <FlowNode label="Store User Performance" sub="Weak Areas · Strong Areas · STAR Mistakes · Previous Scores" color={c.green} width={320} />
        <FlowArrow />
        <FlowNode label="Generate Next Question" color={c.purple} width={220} />
        <FlowArrow dashed />
        <div
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: `1px dashed ${t.accent.primary}`,
            background: `${t.accent.primary}10`,
            fontSize: 11,
            color: t.accent.primary,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          ↺ Loop back → Interview Engine Selects Question
        </div>
      </div>

      <Divider />
      <H3>Performance Memory Schema</H3>
      <Table
        headers={["Field", "Purpose", "Used By"]}
        rows={[
          ["Weak Areas", "Topics/skills needing improvement", "Adaptive Engine, Report"],
          ["Strong Areas", "Demonstrated competencies", "Report, Dashboard"],
          ["STAR Mistakes", "Missing S/T/A/R components", "Coaching Questions"],
          ["Previous Scores", "Historical performance trend", "Difficulty Adjustment"],
        ]}
        striped
      />
    </Stack>
  );
}

/* ── Diagram 5: Final Feedback Pipeline ── */
function FinalFeedbackPipeline() {
  const c = colorPalette;

  const reportSections = [
    "Overall Score",
    "STAR Evaluation",
    "Communication Analysis",
    "Technical Relevance",
    "Confidence Analysis",
    "Strengths",
    "Weak Areas",
    "Improvement Suggestions",
    "Recommended Practice Areas",
  ];

  const dashboardFeatures = [
    "Previous Interviews",
    "Score Trends",
    "Improvement Graphs",
    "Performance Tracking",
  ];

  return (
    <Stack gap={12}>
      <Text tone="secondary" size="small">
        Post-session report generation and longitudinal analytics for continuous improvement tracking.
      </Text>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FlowNode label="Interview Session Ends" color={c.blue} width={220} />
        <FlowArrow />
        <FlowNode label="Final Report Generator" sub="Aggregates all session data" color={c.green} width={260} highlight />
        <FlowArrow />
      </div>

      <Grid columns={2} gap={16}>
        <div>
          <H3>Final Feedback Report</H3>
          <Stack gap={6}>
            {reportSections.map((section, i) => (
              <div
                key={section}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${c.green}33`,
                  background: i % 2 === 0 ? `${c.green}08` : undefined,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, color: c.green, width: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 12 }}>{section}</span>
              </div>
            ))}
          </Stack>
        </div>

        <div>
          <H3>Dashboard & Analytics</H3>
          <Stack gap={10}>
            {dashboardFeatures.map((feature) => (
              <FlowNode key={feature} label={feature} icon={<IconChart color={c.blue} />} color={c.blue} width={260} />
            ))}
            <Callout tone="success" title="Longitudinal Tracking">
              Score trends and improvement graphs enable users to visualize progress across multiple interview sessions over time.
            </Callout>
          </Stack>
        </div>
      </Grid>

      <Divider />
      <H3>Score Dimensions Summary</H3>
      <Grid columns={5} gap={10}>
        <StatBlock label="Technical Relevance" value="0–100" color={c.purple} />
        <StatBlock label="STAR Compliance" value="0–100" color={c.purple} />
        <StatBlock label="Confidence" value="0–100" color={c.pink} />
        <StatBlock label="Communication" value="0–100" color={c.blue} />
        <StatBlock label="Overall Score" value="Weighted Avg" color={c.green} highlight />
      </Grid>
    </Stack>
  );
}

function StatBlock({ label, value, color, highlight }: { label: string; value: string; color: string; highlight?: boolean }) {
  const t = useHostTheme();
  return (
    <div
      style={{
        padding: "12px 10px",
        borderRadius: 8,
        border: `1px solid ${highlight ? t.accent.primary : t.stroke.secondary}`,
        background: highlight ? `${color}15` : t.bg.elevated,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: highlight ? t.accent.primary : color }}>{value}</div>
      <div style={{ fontSize: 10, color: t.text.tertiary, marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ── Main Canvas ── */
export default function AdaptiveInterviewCoachingArchitecture() {
  const [view, setView] = useCanvasState<ViewId>("diagram-view", "architecture");

  const renderView = () => {
    switch (view) {
      case "architecture": return <SystemArchitecture />;
      case "execution": return <ExecutionFlow />;
      case "modules": return <ModularComponents />;
      case "adaptive": return <AdaptiveDecisionFlow />;
      case "feedback": return <FinalFeedbackPipeline />;
    }
  };

  return (
    <Stack gap={16} style={{ maxWidth: 960, margin: "0 auto" }}>
      <div>
        <H1>AI-Powered Adaptive Interview Coaching System</H1>
        <Text tone="secondary">
          System architecture & execution flowcharts — Mini Project · Research Proposal · Viva Presentation
        </Text>
      </div>

      <Row gap={8} wrap>
        {VIEWS.map((v) => (
          <Pill
            key={v.id}
            active={view === v.id}
            tone={view === v.id ? "info" : "neutral"}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </Pill>
        ))}
      </Row>

      <Divider />

      <H2>{VIEWS.find((v) => v.id === view)?.label}</H2>
      {renderView()}

      <Divider />
      <Row gap={16} wrap justify="center">
        <LegendItem color={colorPalette.blue} label="Presentation / User" />
        <LegendItem color={colorPalette.purple} label="AI / ML Processing" />
        <LegendItem color={colorPalette.pink} label="Voice / Speech" />
        <LegendItem color={colorPalette.green} label="Data / Reports" />
        <LegendItem color={colorPalette.orange} label="Adaptive Logic" />
      </Row>
    </Stack>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <Row gap={6} align="center">
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      <Text size="small" tone="tertiary">{label}</Text>
    </Row>
  );
}
