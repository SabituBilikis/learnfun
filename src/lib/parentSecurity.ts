const PARENT_SECURITY_KEY = "learnfun_parent_security";
const PIN_LENGTH = 6;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;
const PBKDF2_ITERATIONS = 120_000;

interface ParentSecurityRecord {
  version: 1;
  salt: string;
  pinHash: string;
  failedAttempts: number;
  lockedUntil: number;
}

export interface PinVerificationResult {
  success: boolean;
  attemptsRemaining: number;
  lockedUntil: number;
}

function isValidRecord(value: unknown): value is ParentSecurityRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 1
    && typeof record.salt === "string"
    && typeof record.pinHash === "string"
    && typeof record.failedAttempts === "number"
    && Number.isInteger(record.failedAttempts)
    && record.failedAttempts >= 0
    && typeof record.lockedUntil === "number"
    && Number.isFinite(record.lockedUntil);
}

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value: string): ArrayBuffer {
  const bytes = Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: base64ToBytes(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return bytesToBase64(new Uint8Array(bits));
}

function saveRecord(record: ParentSecurityRecord): void {
  localStorage.setItem(PARENT_SECURITY_KEY, JSON.stringify(record));
}

export function readParentSecurity(): ParentSecurityRecord | null {
  try {
    const stored = localStorage.getItem(PARENT_SECURITY_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return isValidRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function isValidParentPin(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

export async function createParentPin(pin: string): Promise<ParentSecurityRecord> {
  if (!isValidParentPin(pin)) {
    throw new Error(`Parent PIN must contain exactly ${PIN_LENGTH} digits.`);
  }

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = bytesToBase64(saltBytes);
  const record: ParentSecurityRecord = {
    version: 1,
    salt,
    pinHash: await hashPin(pin, salt),
    failedAttempts: 0,
    lockedUntil: 0,
  };
  saveRecord(record);
  return record;
}

export async function verifyParentPin(pin: string): Promise<PinVerificationResult> {
  const record = readParentSecurity();
  const now = Date.now();

  if (!record || !isValidParentPin(pin)) {
    return { success: false, attemptsRemaining: MAX_FAILED_ATTEMPTS, lockedUntil: 0 };
  }

  if (record.lockedUntil > now) {
    return { success: false, attemptsRemaining: 0, lockedUntil: record.lockedUntil };
  }

  const pinHash = await hashPin(pin, record.salt);
  if (pinHash === record.pinHash) {
    const updated = { ...record, failedAttempts: 0, lockedUntil: 0 };
    saveRecord(updated);
    return { success: true, attemptsRemaining: MAX_FAILED_ATTEMPTS, lockedUntil: 0 };
  }

  const failedAttempts = record.failedAttempts + 1;
  const lockedUntil = failedAttempts >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
  saveRecord({
    ...record,
    failedAttempts: lockedUntil ? 0 : failedAttempts,
    lockedUntil,
  });
  return {
    success: false,
    attemptsRemaining: lockedUntil ? 0 : MAX_FAILED_ATTEMPTS - failedAttempts,
    lockedUntil,
  };
}
