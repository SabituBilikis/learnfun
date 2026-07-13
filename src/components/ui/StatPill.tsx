import { C } from "@/app/constants";

export function StatPill({ emoji, value, label, valueColor }: { emoji: string; value: string; label: string; valueColor: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-2xl"
      style={{ background: C.white, border: `2.5px solid ${C.navy}`, boxShadow: `3px 4px 0 ${C.navy}` }}
    >
      <span className="text-xl leading-none">{emoji}</span>
      <div>
        <p style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 16, color: valueColor, lineHeight: 1.1 }}>{value}</p>
        <p style={{ fontFamily: "'Nunito',sans-serif", color: C.mutedFg, fontSize: 11 }}>{label}</p>
      </div>
    </div>
  );
}
