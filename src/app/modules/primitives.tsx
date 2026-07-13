// ── Barrel re-exports ─────────────────────────────────────────────────────────
// All components formerly in this file have been extracted to individual modules
// under src/components/ and src/features/. This file re-exports them so existing
// import paths (`./primitives`) continue to work without modification.

// Feedback / decorative
export { Sparkle, AmbientSparkles } from "@/components/feedback/Sparkle";
export type { SparkleSpot } from "@/components/feedback/Sparkle";
export { ConfettiBurst } from "@/components/feedback/ConfettiBurst";
export { SoundRings } from "@/components/feedback/SoundRings";
export { LessonBg } from "@/components/feedback/LessonBg";

// UI primitives
export { BackButton } from "@/components/ui/BackButton";
export { StarRow } from "@/components/ui/StarRow";
export { ProgressTrack } from "@/components/ui/ProgressTrack";
export { StatPill } from "@/components/ui/StatPill";
export { CTAButton } from "@/components/ui/CTAButton";
export { CategoryHero } from "@/components/ui/CategoryHero";
export { ProgressDots } from "@/components/ui/ProgressDots";

// Lesson-specific
export { LessonMascot } from "@/features/lesson/LessonMascot";
export { IllustrationPanel } from "@/features/lesson/IllustrationPanel";
export { GiantLetter } from "@/features/lesson/GiantLetter";
