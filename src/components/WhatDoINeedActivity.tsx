import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import ProgressDots from "@/components/ProgressDots";
import NeedChip from "@/components/NeedChip";
import MicroAcknowledgement from "@/components/MicroAcknowledgement";

const NEEDS = [
  "Emotional support",
  "Space / time for myself",
  "Clear communication",
  "Reassurance",
  "Understanding",
  "Stability",
  "Honesty",
  "Respect",
  "Clarity about the relationship",
];

const PROMPTS: Record<string, string> = {
  "Clear communication": "What would clearer communication look like for you?",
  "Emotional support": "What kind of support would actually help you right now?",
  "Space / time for myself": "What would having that space look like for you?",
  "Reassurance": "What kind of reassurance would feel meaningful?",
  "Understanding": "What would feeling truly understood look like?",
  "Stability": "What would stability feel like in your life right now?",
  "Honesty": "What would more honesty look like in your situation?",
  "Respect": "What does respect look like for you right now?",
  "Clarity about the relationship": "What kind of clarity would help you most?",
};

const ACTION_CHIPS = [
  "Say something honestly",
  "Take some time for myself",
  "Reach out to someone",
  "Set a small boundary",
  "Not sure yet",
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

const WhatDoINeedActivity = () => {
  const [screen, setScreen] = useState(1);
  // Screen 2 state
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [customNeed, setCustomNeed] = useState("");
  const [step2Phase, setStep2Phase] = useState<"select" | "prioritize" | "focus">("select");
  const [primaryNeed, setPrimaryNeed] = useState("");
  // Screen 3 state
  const [reflection, setReflection] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [customAction, setCustomAction] = useState("");
  const [step3Phase, setStep3Phase] = useState<"reflect" | "action" | "closing">("reflect");
  const [saved, setSaved] = useState(false);

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
  };

  const goToAction = () => setStep3Phase("action");
  const goToClosing = () => setStep3Phase("closing");

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

  const dynamicPrompt = PROMPTS[primaryNeed] || "What would this look like in a real situation?";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={handleBack} className="p-2 -ml-2 text-foreground/60 hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <ProgressDots current={screen} total={3} />
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-8 overflow-y-auto">
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
              className="flex-1 flex flex-col items-center justify-center text-center gap-6 max-w-sm mx-auto"
            >
              <motion.h1
                className="text-2xl font-semibold text-foreground leading-tight"
                {...fadeUp}
                transition={{ delay: 0.1 }}
              >
                What Do I Need Right Now?
              </motion.h1>

              <motion.div
                className="space-y-4 text-base text-text-secondary leading-relaxed"
                {...fadeUp}
                transition={{ delay: 0.25 }}
              >
                <p>
                  Sometimes, we focus so much on everything around us that we lose track of what we need.
                </p>
                <p>
                  This is a moment to pause and check in with yourself.
                </p>
                <p>
                  Not to fix anything — just to understand what feels important right now.
                </p>
              </motion.div>

              <motion.p
                className="text-sm text-primary font-medium"
                {...fadeUp}
                transition={{ delay: 0.4 }}
              >
                Your needs matter too.
              </motion.p>

              <motion.div {...fadeUp} transition={{ delay: 0.55 }} className="w-full mt-4">
                <button
                  onClick={() => setScreen(2)}
                  className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all"
                >
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
              className="flex-1 flex flex-col items-center text-center gap-5 max-w-sm mx-auto pt-4"
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Select */}
                {step2Phase === "select" && (
                  <motion.div key="s2-select" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5">
                    <h2 className="text-xl font-semibold text-foreground">
                      What feels important right now?
                    </h2>

                    <div className="flex flex-wrap justify-center gap-2.5">
                      {NEEDS.map((need) => (
                        <NeedChip
                          key={need}
                          label={need}
                          selected={selectedNeeds.includes(need)}
                          onToggle={() => toggleNeed(need)}
                        />
                      ))}
                      {selectedNeeds
                        .filter((n) => !NEEDS.includes(n))
                        .map((need) => (
                          <NeedChip
                            key={need}
                            label={need}
                            selected
                            onToggle={() => toggleNeed(need)}
                          />
                        ))}
                    </div>

                    {/* Something else */}
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        value={customNeed}
                        onChange={(e) => setCustomNeed(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomNeed()}
                        placeholder="Something else..."
                        className="bg-card border border-border rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      {customNeed.trim() && (
                        <button onClick={addCustomNeed} className="text-primary text-sm font-medium">
                          + Add
                        </button>
                      )}
                    </div>

                    <MicroAcknowledgement message="That makes sense." show={selectedNeeds.length > 0} />

                    {selectedNeeds.length > 0 && (
                      <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                        <button
                          onClick={goToPrioritize}
                          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                          Continue →
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Prioritize */}
                {step2Phase === "prioritize" && (
                  <motion.div key="s2-prioritize" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5">
                    <h2 className="text-xl font-semibold text-foreground">
                      Which one feels most important right now?
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2.5">
                      {selectedNeeds.map((need) => (
                        <NeedChip
                          key={need}
                          label={need}
                          selected={primaryNeed === need}
                          onToggle={() => selectPrimary(need)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Focus State */}
                {step2Phase === "focus" && (
                  <motion.div key="s2-focus" {...fadeUp} transition={{ duration: 0.5 }} className="w-full flex flex-col items-center gap-6 pt-8">
                    <p className="text-sm text-text-secondary uppercase tracking-wider font-medium">
                      Your focus right now
                    </p>

                    <motion.div
                      className="focus-card w-full"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <span className="text-2xl mb-2 block">💬</span>
                      <p className="text-lg font-semibold text-foreground">{primaryNeed}</p>
                    </motion.div>

                    <MicroAcknowledgement message="Let's explore this a bit more." show />

                    <button
                      onClick={goToScreen3}
                      className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all mt-4"
                    >
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
              className="flex-1 flex flex-col items-center text-center gap-5 max-w-sm mx-auto pt-4"
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Reflect */}
                {step3Phase === "reflect" && (
                  <motion.div key="s3-reflect" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5">
                    <h2 className="text-xl font-semibold text-foreground">
                      {dynamicPrompt}
                    </h2>

                    <textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="Take a moment to describe it..."
                      rows={3}
                      className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-foreground text-base placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
                    />

                    <MicroAcknowledgement message="That's a meaningful insight." show={reflection.length > 10} />

                    {reflection.trim() && (
                      <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
                        <button
                          onClick={goToAction}
                          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                          Continue →
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Action */}
                {step3Phase === "action" && (
                  <motion.div key="s3-action" {...fadeUp} transition={{ duration: 0.4 }} className="w-full space-y-5">
                    <h2 className="text-xl font-semibold text-foreground">
                      What's one small thing that might help?
                    </h2>

                    <div className="flex flex-wrap justify-center gap-2.5">
                      {ACTION_CHIPS.map((action) => (
                        <NeedChip
                          key={action}
                          label={action}
                          selected={selectedAction === action}
                          onToggle={() => setSelectedAction(action === selectedAction ? "" : action)}
                        />
                      ))}
                    </div>

                    <input
                      value={customAction}
                      onChange={(e) => {
                        setCustomAction(e.target.value);
                        if (e.target.value) setSelectedAction("");
                      }}
                      placeholder="Or write your own..."
                      className="w-full bg-card border border-border rounded-full px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />

                    {(selectedAction || customAction.trim()) && (
                      <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
                        <button
                          onClick={goToClosing}
                          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                          Continue →
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Closing */}
                {step3Phase === "closing" && (
                  <motion.div key="s3-closing" {...fadeUp} transition={{ duration: 0.5 }} className="w-full flex flex-col items-center gap-6 pt-4">
                    <motion.div
                      className="summary-card w-full space-y-3"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-sm text-text-secondary">Right now, you need:</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">💬</span>
                        <p className="text-lg font-semibold text-foreground">{primaryNeed}</p>
                      </div>
                    </motion.div>

                    <motion.p
                      className="text-base text-text-secondary leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Even noticing this is a meaningful step.
                    </motion.p>

                    <div className="w-full space-y-3 mt-4">
                      <button
                        onClick={() => setSaved(true)}
                        className={`w-full py-4 rounded-full font-semibold text-base transition-all ${
                          saved
                            ? "bg-card border-2 border-primary text-primary"
                            : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                        }`}
                      >
                        {saved ? "Saved ✓" : "Save"}
                      </button>
                      <button
                        onClick={handleFinish}
                        className="w-full py-4 rounded-full border border-border text-foreground font-medium text-base hover:bg-card active:scale-[0.98] transition-all"
                      >
                        Finish
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
