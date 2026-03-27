import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, X } from "lucide-react";
import ProgressDots from "@/components/ProgressDots";
import NeedChip from "@/components/NeedChip";
import MicroAcknowledgement from "@/components/MicroAcknowledgement";

const NEEDS = [
  { label: "Emotional support", emoji: "🤗" },
  { label: "Space / time for myself", emoji: "🌿" },
  { label: "Clear communication", emoji: "💬" },
  { label: "Reassurance", emoji: "🫂" },
  { label: "Understanding", emoji: "💛" },
  { label: "Stability", emoji: "⚓" },
  { label: "Honesty", emoji: "🪞" },
  { label: "Respect", emoji: "✊" },
  { label: "Clarity about the relationship", emoji: "🔍" },
];

const NEED_EMOJI_MAP: Record<string, string> = {};
NEEDS.forEach((n) => { NEED_EMOJI_MAP[n.label] = n.emoji; });

const PROMPTS: Record<string, string> = {
  "Clear communication": "💬 What would clearer communication look like for you?",
  "Emotional support": "🤗 What kind of support would actually help you right now?",
  "Space / time for myself": "🌿 What would having that space look like for you?",
  "Reassurance": "🫂 What kind of reassurance would feel meaningful?",
  "Understanding": "💛 What would feeling truly understood look like?",
  "Stability": "⚓ What would stability feel like in your life right now?",
  "Honesty": "🪞 What would more honesty look like in your situation?",
  "Respect": "✊ What does respect look like for you right now?",
  "Clarity about the relationship": "🔍 What kind of clarity would help you most?",
};

const REFLECTION_HINTS: Record<string, string[]> = {
  "Clear communication": [
    "I wish I could say...",
    "If they really listened, I'd tell them...",
    "Communication feels hard when...",
  ],
  "Emotional support": [
    "I just need someone to...",
    "It would help if...",
    "What I really want is...",
  ],
  "Space / time for myself": [
    "I'd use that time to...",
    "Space would let me...",
    "I need room to...",
  ],
  "Reassurance": [
    "I need to hear that...",
    "It would calm me to know...",
    "I keep worrying that...",
  ],
  "Understanding": [
    "I wish people knew that...",
    "What I'm really feeling is...",
    "Nobody sees that I...",
  ],
  "Stability": [
    "I need things to feel...",
    "What would ground me is...",
    "Stability means...",
  ],
  "Honesty": [
    "The truth I need to face is...",
    "I want to be honest about...",
    "What's really going on is...",
  ],
  "Respect": [
    "I deserve to be treated...",
    "Respect would look like...",
    "I need people to...",
  ],
  "Clarity about the relationship": [
    "I need to know if...",
    "What confuses me is...",
    "I want us to be clear about...",
  ],
};

const DEFAULT_HINTS = [
  "What comes to mind is...",
  "Right now I feel...",
  "If I'm honest with myself...",
];

const ACTION_CHIPS = [
  { label: "Say something honestly", emoji: "🗣️" },
  { label: "Take some time for myself", emoji: "🧘" },
  { label: "Reach out to someone", emoji: "📱" },
  { label: "Set a small boundary", emoji: "🚧" },
  { label: "Not sure yet", emoji: "🤔" },
];

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

interface SavedReflection {
  date: string;
  primaryNeed: string;
  emoji: string;
  reflection: string;
  action: string;
}

const WhatDoINeedActivity = () => {
  const [screen, setScreen] = useState(1);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [customNeed, setCustomNeed] = useState("");
  const [step2Phase, setStep2Phase] = useState<"select" | "prioritize" | "focus">("select");
  const [primaryNeed, setPrimaryNeed] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [customAction, setCustomAction] = useState("");
  const [step3Phase, setStep3Phase] = useState<"reflect" | "action" | "closing">("reflect");
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SavedReflection[]>([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // Rotating placeholder
  const hints = REFLECTION_HINTS[primaryNeed] || DEFAULT_HINTS;
  useEffect(() => {
    if (step3Phase !== "reflect") return;
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % hints.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [step3Phase, hints.length]);

  // Load history
  useEffect(() => {
    try {
      const stored = localStorage.getItem("needs-history");
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleNeed = useCallback((need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  }, []);

  const addCustomNeed = () => {
    if (customNeed.trim() && !selectedNeeds.includes(customNeed.trim())) {
      setSelectedNeeds((prev) => [...prev, customNeed.trim()]);
      setCustomNeed("");
    }
  };

  const goToPrioritize = () => setStep2Phase("prioritize");
  const selectPrimary = (need: string) => {
    setPrimaryNeed(need);
    setStep2Phase("focus");
  };

  const goToScreen3 = () => {
    setScreen(3);
    setStep3Phase("reflect");
    setPlaceholderIdx(0);
  };

  const goToAction = () => setStep3Phase("action");
  const goToClosing = () => setStep3Phase("closing");

  const handleSave = () => {
    const entry: SavedReflection = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      primaryNeed,
      emoji: NEED_EMOJI_MAP[primaryNeed] || "🌱",
      reflection,
      action: selectedAction || customAction,
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem("needs-history", JSON.stringify(updated));
    setSaved(true);
  };

  const handleFinish = () => {
    setScreen(1);
    setSelectedNeeds([]);
    setCustomNeed("");
    setStep2Phase("select");
    setPrimaryNeed("");
    setReflection("");
    setSelectedAction("");
    setCustomAction("");
    setStep3Phase("reflect");
    setSaved(false);
  };

  const handleBack = () => {
    if (screen === 1) return;
    if (screen === 2) {
      if (step2Phase === "focus") setStep2Phase("prioritize");
      else if (step2Phase === "prioritize") setStep2Phase("select");
      else setScreen(1);
    } else if (screen === 3) {
      if (step3Phase === "closing") setStep3Phase("action");
      else if (step3Phase === "action") setStep3Phase("reflect");
      else { setScreen(2); setStep2Phase("focus"); }
    }
  };

  const dynamicPrompt = PROMPTS[primaryNeed] || "🌱 What would this look like in a real situation?";
  const primaryEmoji = NEED_EMOJI_MAP[primaryNeed] || "🌱";

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col relative overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 -z-10" style={{
        background: `linear-gradient(160deg, hsl(30 25% 96%) 0%, hsl(262 35% 94%) 40%, hsl(207 40% 93%) 70%, hsl(30 25% 96%) 100%)`
      }} />
      <div className="fixed top-20 -right-20 w-64 h-64 rounded-full -z-10 opacity-30" 
        style={{ background: `radial-gradient(circle, hsl(262 30% 80%) 0%, transparent 70%)` }} />
      <div className="fixed bottom-20 -left-20 w-48 h-48 rounded-full -z-10 opacity-20" 
        style={{ background: `radial-gradient(circle, hsl(207 35% 78%) 0%, transparent 70%)` }} />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={screen === 1 ? () => {} : handleBack}
          className="top-icon-btn -ml-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <ProgressDots current={screen} total={3} />
        {screen === 1 ? (
          <button className="top-icon-btn -mr-2" title="Past reflections" onClick={() => setShowHistory(true)}>
            <Clock className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <motion.div
              className="relative w-full max-w-md rounded-t-3xl p-6 pb-10 max-h-[75vh] overflow-y-auto"
              style={{ background: "hsl(30 25% 96%)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-foreground">📖 Past Reflections</h3>
                <button onClick={() => setShowHistory(false)} className="top-icon-btn">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No reflections yet. Complete an activity to see your history here. 🌱
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, i) => (
                    <div key={i} className="rounded-2xl p-4" style={{ background: "hsl(var(--card))" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {item.emoji} {item.primaryNeed}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      {item.reflection && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{item.reflection}"</p>
                      )}
                      {item.action && (
                        <p className="text-xs mt-2" style={{ color: "hsl(var(--lavender))" }}>
                          → {item.action}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ===== SCREEN 1 ===== */}
          {screen === 1 && (
            <motion.div
              key="screen1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-5"
            >
              <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
                <span className="text-5xl">🧘‍♀️</span>
              </motion.div>

              <motion.h1
                className="text-2xl font-semibold text-foreground leading-tight"
                {...fadeUp}
                transition={{ delay: 0.12 }}
              >
                What Do I Need Right Now?
              </motion.h1>

              <motion.div
                className="space-y-3 text-base text-muted-foreground leading-relaxed"
                {...fadeUp}
                transition={{ delay: 0.25 }}
              >
                <p>Sometimes, we focus so much on everything around us that we lose track of what we need.</p>
                <p>This is a moment to pause and check in with yourself. 🌸</p>
                <p>Not to fix anything — just to understand what feels important right now.</p>
              </motion.div>

              <motion.p
                className="text-sm font-medium"
                style={{ color: "hsl(var(--lavender))" }}
                {...fadeUp}
                transition={{ delay: 0.4 }}
              >
                🤍 Your needs matter too.
              </motion.p>

              <motion.div {...fadeUp} transition={{ delay: 0.55 }} className="w-full mt-4">
                <button onClick={() => setScreen(2)} className="btn-primary">
                  Start →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ===== SCREEN 2 ===== */}
          {screen === 2 && (
            <motion.div
              key="screen2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center text-center gap-5 pt-4 w-full"
            >
              <AnimatePresence mode="wait">
                {step2Phase === "select" && (
                  <motion.div key="s2-select" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5 flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-foreground text-center w-full">
                      🌿 What feels important right now?
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2.5 w-full">
                      {NEEDS.map((need) => (
                        <NeedChip
                          key={need.label}
                          label={`${need.emoji} ${need.label}`}
                          selected={selectedNeeds.includes(need.label)}
                          onToggle={() => toggleNeed(need.label)}
                        />
                      ))}
                      {selectedNeeds
                        .filter((n) => !NEEDS.some((nd) => nd.label === n))
                        .map((need) => (
                          <NeedChip
                            key={need}
                            label={`✨ ${need}`}
                            selected
                            onToggle={() => toggleNeed(need)}
                          />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        value={customNeed}
                        onChange={(e) => setCustomNeed(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomNeed()}
                        placeholder="✏️ Something else..."
                        className="input-calm !rounded-full !py-2.5 !text-sm w-48"
                      />
                      {customNeed.trim() && (
                        <button onClick={addCustomNeed} className="text-sm font-medium" style={{ color: "hsl(var(--lavender))" }}>
                          + Add
                        </button>
                      )}
                    </div>
                    <MicroAcknowledgement message="✨ That makes sense." show={selectedNeeds.length > 0} />
                    {selectedNeeds.length > 0 && (
                      <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="w-full">
                        <button onClick={goToPrioritize} className="btn-primary">
                          Continue →
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step2Phase === "prioritize" && (
                  <motion.div key="s2-prioritize" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5 flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-foreground">
                      🎯 Which one feels most important right now?
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2.5 w-full">
                      {selectedNeeds.map((need) => (
                        <NeedChip
                          key={need}
                          label={`${NEED_EMOJI_MAP[need] || "✨"} ${need}`}
                          selected={primaryNeed === need}
                          onToggle={() => selectPrimary(need)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {step2Phase === "focus" && (
                  <motion.div key="s2-focus" {...fadeUp} transition={{ duration: 0.5 }} className="w-full flex flex-col items-center gap-6 pt-8">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                      ✦ Your focus right now
                    </p>
                    <motion.div
                      className="focus-card w-full"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <span className="text-3xl mb-3 block">{primaryEmoji}</span>
                      <p className="text-lg font-semibold text-foreground">{primaryNeed}</p>
                    </motion.div>
                    <MicroAcknowledgement message="🌱 Let's explore this a bit more." show />
                    <button onClick={goToScreen3} className="btn-primary mt-4">
                      Continue →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ===== SCREEN 3 ===== */}
          {screen === 3 && (
            <motion.div
              key="screen3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center text-center gap-5 pt-4"
            >
              <AnimatePresence mode="wait">
                {step3Phase === "reflect" && (
                  <motion.div key="s3-reflect" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5 flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-foreground">
                      {dynamicPrompt}
                    </h2>
                    <textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder={hints[placeholderIdx] + " 🌸"}
                      rows={3}
                      className="input-calm"
                    />
                    <MicroAcknowledgement message="💫 That's a meaningful insight." show={reflection.length > 10} />
                    {reflection.trim() && (
                      <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
                        <button onClick={goToAction} className="btn-primary">
                          Continue →
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step3Phase === "action" && (
                  <motion.div key="s3-action" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5 flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-foreground">
                      🌟 What's one small thing that might help?
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2.5">
                      {ACTION_CHIPS.map((action) => (
                        <NeedChip
                          key={action.label}
                          label={`${action.emoji} ${action.label}`}
                          selected={selectedAction === action.label}
                          onToggle={() => setSelectedAction(action.label === selectedAction ? "" : action.label)}
                        />
                      ))}
                    </div>
                    <input
                      value={customAction}
                      onChange={(e) => {
                        setCustomAction(e.target.value);
                        if (e.target.value) setSelectedAction("");
                      }}
                      placeholder="✏️ Or write your own..."
                      className="input-calm !rounded-full !py-3 !text-sm"
                    />
                    {(selectedAction || customAction.trim()) && (
                      <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
                        <button onClick={goToClosing} className="btn-primary">
                          Continue →
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step3Phase === "closing" && (
                  <motion.div key="s3-closing" {...fadeUp} transition={{ duration: 0.5 }} className="w-full flex flex-col items-center gap-6 pt-4">
                    <motion.div
                      className="summary-card w-full space-y-3"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-sm text-muted-foreground">Right now, you need:</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">{primaryEmoji}</span>
                        <p className="text-lg font-semibold text-foreground">{primaryNeed}</p>
                      </div>
                    </motion.div>
                    <motion.p
                      className="text-base text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      🌿 Even noticing this is a meaningful step.
                    </motion.p>
                    <div className="w-full space-y-3 mt-4">
                      <button
                        onClick={handleSave}
                        className={saved ? "btn-secondary !border-2" : "btn-primary"}
                        style={saved ? { borderColor: "hsl(var(--lavender))", color: "hsl(var(--lavender))" } : {}}
                      >
                        {saved ? "✅ Saved" : "💾 Save"}
                      </button>
                      <button onClick={handleFinish} className="btn-secondary">
                        🏠 Finish
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WhatDoINeedActivity;
