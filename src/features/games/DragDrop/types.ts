export interface DragTask {
  id: string;
  instruction: string;
  voiceLine: string;
  object: { emoji: string; label: string; color: string; bg: string };
  zone: { emoji: string; label: string; color: string; bg: string; hint: string };
  distractor?: { emoji: string; label: string; color: string; bg: string };
  reward: string;
}

export type DDState = "idle" | "dragging" | "correct" | "incorrect" | "completed";
