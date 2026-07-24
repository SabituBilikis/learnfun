import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import {
  createParentPin,
  isValidParentPin,
  readParentSecurity,
  verifyParentPin,
} from "@/lib/parentSecurity";

function formatRemainingTime(lockedUntil: number, now: number): string {
  const remainingSeconds = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ParentGate({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [security, setSecurity] = useState(() => readParentSecurity());
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const isSetup = security === null;
  const lockedUntil = security?.lockedUntil ?? 0;
  const isLocked = lockedUntil > now;

  useEffect(() => {
    if (!isLocked) return;
    const timer = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      if (currentTime >= lockedUntil) setSecurity(readParentSecurity());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isLocked, lockedUntil]);

  const title = isSetup ? "Set Parent PIN" : "Parents Only";
  const description = isSetup
    ? "Create a six-digit PIN before giving Learn Fun to your child. Anyone using a new installation can set this PIN."
    : "Enter your six-digit Parent PIN to manage Learn Fun.";
  const lockMessage = useMemo(
    () => isLocked ? `Too many attempts. Try again in ${formatRemainingTime(lockedUntil, now)}.` : "",
    [isLocked, lockedUntil, now],
  );

  function updatePin(value: string, setValue: (nextValue: string) => void) {
    setValue(value.replace(/\D/g, "").slice(0, 6));
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || isLocked) return;

    if (isSetup) {
      if (!isValidParentPin(pin)) {
        setMessage("Enter exactly six digits.");
        return;
      }
      if (pin !== confirmPin) {
        setMessage("The PINs do not match.");
        return;
      }

      setBusy(true);
      try {
        await createParentPin(pin);
        onSuccess();
      } catch {
        setMessage("Unable to save the Parent PIN. Please try again.");
      } finally {
        setBusy(false);
      }
      return;
    }

    setBusy(true);
    try {
      const result = await verifyParentPin(pin);
      if (result.success) {
        onSuccess();
        return;
      }
      setSecurity(readParentSecurity());
      setPin("");
      setMessage(result.lockedUntil ? "Too many attempts. Access is temporarily locked." : `${result.attemptsRemaining} attempts remaining.`);
      setNow(Date.now());
    } catch {
      setMessage("Unable to verify the Parent PIN. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-lf-navy to-[#2D0082] px-6 py-8 font-fredoka font-nunito">
      <div className="absolute top-6 left-6">
        <motion.button onClick={onBack} className="flex items-center gap-1 rounded-2xl px-3 py-2 bg-white/10 border-2 border-white/20 text-white cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}>
          <ChevronLeft size={18} />
          <span className="font-fredoka font-bold text-[14px]">Exit</span>
        </motion.button>
      </div>

      <motion.form onSubmit={handleSubmit} className="flex flex-col items-center bg-white rounded-3xl p-8 border-[4px] border-lf-orange shadow-[8px_10px_0_var(--color-lf-orange)] max-w-md w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="w-16 h-16 bg-lf-orange rounded-full flex items-center justify-center text-white mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="font-fredoka font-bold text-2xl text-lf-navy mb-2 text-center">{title}</h2>
        <p className="font-nunito text-lf-mutedFg mb-6 text-center">{description}</p>

        <label className="w-full font-bold text-lf-navy mb-2" htmlFor="parent-pin">Parent PIN</label>
        <input id="parent-pin" value={pin} onChange={(event) => updatePin(event.target.value, setPin)} disabled={busy || isLocked} inputMode="numeric" autoComplete="off" type="password" aria-describedby="parent-pin-message" className="w-full rounded-2xl border-[3px] border-lf-navy px-4 py-3 text-center text-2xl tracking-[0.45em] font-bold outline-none focus:ring-4 focus:ring-lf-orange/30 disabled:bg-gray-100" />

        {isSetup && (
          <>
            <label className="w-full font-bold text-lf-navy mt-4 mb-2" htmlFor="parent-pin-confirm">Confirm Parent PIN</label>
            <input id="parent-pin-confirm" value={confirmPin} onChange={(event) => updatePin(event.target.value, setConfirmPin)} disabled={busy || isLocked} inputMode="numeric" autoComplete="off" type="password" className="w-full rounded-2xl border-[3px] border-lf-navy px-4 py-3 text-center text-2xl tracking-[0.45em] font-bold outline-none focus:ring-4 focus:ring-lf-orange/30 disabled:bg-gray-100" />
          </>
        )}

        <p id="parent-pin-message" className="min-h-6 mt-4 text-center font-nunito font-bold text-lf-red" role="status">{lockMessage || message}</p>
        <button type="submit" disabled={busy || isLocked} className="w-full py-4 rounded-2xl bg-lf-orange text-white border-[3px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] font-bold text-lg disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Please wait…" : isSetup ? "Save Parent PIN" : "Unlock Parent Area"}
        </button>
      </motion.form>
    </div>
  );
}
