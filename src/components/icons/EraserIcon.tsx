export function EraserIcon({ size = "1em", className = "" }: { size?: string | number; className?: string }) {
  const sz = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      width={sz}
      height={sz}
      className={`inline-block select-none ${className}`}
      style={{ filter: "drop-shadow(2px 3px 0 rgba(26,0,80,0.18))" }}
    >
      <g transform="rotate(-22 32 32)">
        {/* Pink eraser main body */}
        <rect x="6" y="18" width="52" height="28" rx="5" fill="#FF6584" stroke="#1A0050" strokeWidth="3.5" />
        {/* Beveled top highlight */}
        <path d="M 9 19 L 17 19 L 50 19 L 45 23 Z" fill="#FFA3B5" />
        {/* White protective paper sleeve */}
        <rect x="24" y="18" width="22" height="28" fill="#FFFFFF" stroke="#1A0050" strokeWidth="3.5" />
        {/* Blue brand stripes on sleeve */}
        <line x1="29" y1="21" x2="29" y2="43" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="21" x2="34" y2="43" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function CalculatorIcon({ size = "1em", className = "" }: { size?: string | number; className?: string }) {
  const sz = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      width={sz}
      height={sz}
      className={`inline-block select-none ${className}`}
      style={{ filter: "drop-shadow(2px 3px 0 rgba(26,0,80,0.18))" }}
    >
      {/* Calculator Body */}
      <rect x="10" y="6" width="44" height="52" rx="8" fill="#3B82F6" stroke="#1A0050" strokeWidth="3.5" />
      {/* LCD Screen */}
      <rect x="16" y="12" width="32" height="13" rx="3" fill="#D1FAE5" stroke="#1A0050" strokeWidth="2.5" />
      <text x="44" y="22" fontFamily="'Fredoka', sans-serif" fontWeight="700" fontSize="9" fill="#065F46" textAnchor="end">123</text>
      {/* Keypad Buttons */}
      <rect x="16" y="29" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="28" y="29" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="40" y="29" width="8" height="6" rx="2" fill="#FF9500" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="16" y="38" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="28" y="38" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="40" y="38" width="8" height="6" rx="2" fill="#FF9500" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="16" y="47" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="28" y="47" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#1A0050" strokeWidth="1.5" />
      <rect x="40" y="47" width="8" height="6" rx="2" fill="#34C759" stroke="#1A0050" strokeWidth="1.5" />
    </svg>
  );
}

export function DeskIcon({ size = "1em", className = "" }: { size?: string | number; className?: string }) {
  const sz = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      width={sz}
      height={sz}
      className={`inline-block select-none ${className}`}
      style={{ filter: "drop-shadow(2px 3px 0 rgba(26,0,80,0.18))" }}
    >
      {/* Desk Surface / Top Board */}
      <rect x="6" y="24" width="52" height="8" rx="2" fill="#D97706" stroke="#1A0050" strokeWidth="3" />
      {/* Desk Drawer Body */}
      <rect x="10" y="32" width="44" height="12" rx="2" fill="#B45309" stroke="#1A0050" strokeWidth="3" />
      {/* Drawer Handle Knob */}
      <circle cx="32" cy="38" r="2.5" fill="#FBBF24" stroke="#1A0050" strokeWidth="1.5" />
      {/* Left Desk Leg */}
      <rect x="12" y="44" width="6" height="16" rx="2" fill="#78350F" stroke="#1A0050" strokeWidth="2.5" />
      {/* Right Desk Leg */}
      <rect x="46" y="44" width="6" height="16" rx="2" fill="#78350F" stroke="#1A0050" strokeWidth="2.5" />
      {/* Open Book on Desk Surface */}
      <path d="M 22 24 L 22 17 Q 27 15 32 17 Q 37 15 42 17 L 42 24 Z" fill="#FFFFFF" stroke="#1A0050" strokeWidth="2" />
      <line x1="32" y1="17" x2="32" y2="24" stroke="#1A0050" strokeWidth="2" />
      {/* Pencil Cup / Lamp on Desk */}
      <rect x="14" y="15" width="6" height="9" rx="1" fill="#3B82F6" stroke="#1A0050" strokeWidth="1.5" />
    </svg>
  );
}

export function TableIcon({ size = "1em", className = "" }: { size?: string | number; className?: string }) {
  const sz = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      width={sz}
      height={sz}
      className={`inline-block select-none ${className}`}
      style={{ filter: "drop-shadow(2px 3px 0 rgba(26,0,80,0.18))" }}
    >
      {/* Back Left Leg */}
      <rect x="14" y="24" width="5" height="28" fill="#78350F" stroke="#1A0050" strokeWidth="2.5" />
      {/* Back Right Leg */}
      <rect x="45" y="24" width="5" height="28" fill="#78350F" stroke="#1A0050" strokeWidth="2.5" />
      
      {/* Front Left Leg */}
      <rect x="8" y="30" width="7" height="28" fill="#B45309" stroke="#1A0050" strokeWidth="3" />
      {/* Front Right Leg */}
      <rect x="49" y="30" width="7" height="28" fill="#B45309" stroke="#1A0050" strokeWidth="3" />

      {/* Table Apron / Under-frame */}
      <rect x="10" y="26" width="44" height="8" fill="#D97706" stroke="#1A0050" strokeWidth="3" />

      {/* 3D Rectangular Table Top Surface */}
      <polygon points="4,22 16,14 60,14 48,22" fill="#F59E0B" stroke="#1A0050" strokeWidth="3.5" strokeLinejoin="round" />
      {/* Front Thickness Edge */}
      <polygon points="4,22 48,22 48,26 4,26" fill="#D97706" stroke="#1A0050" strokeWidth="3.5" strokeLinejoin="round" />
      {/* Right Side Thickness Edge */}
      <polygon points="48,22 60,14 60,18 48,26" fill="#B45309" stroke="#1A0050" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  );
}

export function FridgeIcon({ size = "1em", className = "" }: { size?: string | number; className?: string }) {
  const sz = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      width={sz}
      height={sz}
      className={`inline-block select-none ${className}`}
      style={{ filter: "drop-shadow(3px 4px 0 rgba(26,0,80,0.22))" }}
    >
      {/* 3D Side Cabinet Layer */}
      <polygon points="46,6 56,12 56,58 46,54" fill="#0284C7" stroke="#1A0050" strokeWidth="3" strokeLinejoin="round" />

      {/* Main Front Cabinet Body (Ice Blue) */}
      <rect x="8" y="6" width="38" height="48" rx="5" fill="#38BDF8" stroke="#1A0050" strokeWidth="3.5" />

      {/* Top Freezer Door */}
      <rect x="11" y="9" width="32" height="18" rx="3" fill="#E0F2FE" stroke="#1A0050" strokeWidth="2.5" />
      {/* Top Freezer Handle */}
      <rect x="37" y="13" width="3.5" height="10" rx="1.5" fill="#FFFFFF" stroke="#1A0050" strokeWidth="2" />
      {/* Freezer Snowflake Detail */}
      <path d="M 21 18 L 27 18 M 24 15 L 24 21 M 22 16 L 26 20 M 22 20 L 26 16" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />

      {/* Heavy Black Horizontal Line between Freezer & Fridge */}
      <line x1="8" y1="29" x2="46" y2="29" stroke="#1A0050" strokeWidth="3.5" />

      {/* Bottom Main Fridge Door */}
      <rect x="11" y="31" width="32" height="20" rx="3" fill="#F0F9FF" stroke="#1A0050" strokeWidth="2.5" />
      {/* Bottom Main Fridge Handle */}
      <rect x="37" y="34" width="3.5" height="14" rx="1.5" fill="#FFFFFF" stroke="#1A0050" strokeWidth="2" />

      {/* Ice / Water Dispenser Niche */}
      <rect x="15" y="35" width="12" height="12" rx="2" fill="#0284C7" stroke="#1A0050" strokeWidth="2" />
      <rect x="18" y="38" width="6" height="6" rx="1" fill="#7DD3FC" />
      <path d="M 21 40 Q 21 43 21 43" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Refrigerator Feet */}
      <rect x="12" y="54" width="7" height="4" rx="1" fill="#1A0050" />
      <rect x="35" y="54" width="7" height="4" rx="1" fill="#1A0050" />
    </svg>
  );
}

export function StoveIcon({ size = "1em", className = "" }: { size?: string | number; className?: string }) {
  const sz = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      width={sz}
      height={sz}
      className={`inline-block select-none ${className}`}
      style={{ filter: "drop-shadow(3px 4px 0 rgba(26,0,80,0.2))" }}
    >
      {/* 3D Side Cabinet Wall */}
      <polygon points="46,8 56,12 56,58 46,54" fill="#64748B" stroke="#1A0050" strokeWidth="3" strokeLinejoin="round" />

      {/* Main Front Stove Unit (Silver Metallic) */}
      <rect x="8" y="8" width="38" height="46" rx="5" fill="#CBD5E1" stroke="#1A0050" strokeWidth="3.5" />

      {/* Cooktop Surface Lid / Top Rim */}
      <polygon points="6,12 14,6 50,6 44,12" fill="#94A3B8" stroke="#1A0050" strokeWidth="3" strokeLinejoin="round" />
      {/* 2 Top Burner Grates with Glowing Orange Coils */}
      <ellipse cx="23" cy="9" rx="6" ry="2.5" fill="#1E293B" stroke="#1A0050" strokeWidth="1.5" />
      <ellipse cx="23" cy="9" rx="3" ry="1" fill="#FF9500" />
      <ellipse cx="37" cy="9" rx="6" ry="2.5" fill="#1E293B" stroke="#1A0050" strokeWidth="1.5" />
      <ellipse cx="37" cy="9" rx="3" ry="1" fill="#FF9500" />

      {/* Front Control Panel Bar */}
      <rect x="11" y="14" width="32" height="9" rx="2" fill="#E2E8F0" stroke="#1A0050" strokeWidth="2" />
      {/* 4 Control Knobs */}
      <circle cx="15" cy="18.5" r="2" fill="#FF3B30" stroke="#1A0050" strokeWidth="1" />
      <circle cx="21" cy="18.5" r="2" fill="#1E293B" stroke="#1A0050" strokeWidth="1" />
      <circle cx="33" cy="18.5" r="2" fill="#1E293B" stroke="#1A0050" strokeWidth="1" />
      <circle cx="39" cy="18.5" r="2" fill="#FF3B30" stroke="#1A0050" strokeWidth="1" />

      {/* Large Front Oven Glass Door */}
      <rect x="11" y="26" width="32" height="24" rx="4" fill="#334155" stroke="#1A0050" strokeWidth="2.5" />
      {/* Inner Glowing Oven Window */}
      <rect x="15" y="30" width="24" height="16" rx="2" fill="#F59E0B" fillOpacity="0.85" stroke="#1A0050" strokeWidth="1.5" />
      {/* Glass Light Reflection Streak */}
      <path d="M 18 32 L 31 32 L 23 44 L 18 44 Z" fill="#FFFFFF" fillOpacity="0.3" />

      {/* Horizontal Oven Door Handle Bar */}
      <rect x="13" y="28" width="28" height="3" rx="1.5" fill="#FFFFFF" stroke="#1A0050" strokeWidth="1.5" />

      {/* Stove Base Feet */}
      <rect x="11" y="54" width="6" height="4" rx="1" fill="#1A0050" />
      <rect x="37" y="54" width="6" height="4" rx="1" fill="#1A0050" />
    </svg>
  );
}

export function LampIcon({ size = "1em", className = "" }: { size?: string | number; className?: string }) {
  const sz = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      width={sz}
      height={sz}
      className={`inline-block select-none ${className}`}
      style={{ filter: "drop-shadow(3px 4px 0 rgba(26,0,80,0.2))" }}
    >
      {/* Soft glowing ambient aura behind lampshade */}
      <ellipse cx="32" cy="36" rx="24" ry="18" fill="#FDE047" opacity="0.3" />

      {/* Light cone radiating downwards */}
      <polygon points="16,28 48,28 58,56 6,56" fill="#FEF08A" opacity="0.4" />

      {/* Lamp Base Pedestal */}
      <path d="M 20 54 Q 32 50 44 54 L 46 58 Q 32 61 18 58 Z" fill="#475569" stroke="#1A0050" strokeWidth="3" strokeLinejoin="round" />

      {/* Lamp Central Stem / Pole */}
      <rect x="30" y="24" width="4" height="30" rx="2" fill="#94A3B8" stroke="#1A0050" strokeWidth="2.5" />

      {/* Decorative Stem Ring Collar */}
      <rect x="28" y="44" width="8" height="3" rx="1.5" fill="#F59E0B" stroke="#1A0050" strokeWidth="1.5" />

      {/* Pull String Switch with Bead */}
      <line x1="40" y1="28" x2="40" y2="40" stroke="#1A0050" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="40" cy="41" r="2.5" fill="#F59E0B" stroke="#1A0050" strokeWidth="1.5" />

      {/* Lampshade Inner Glow (under shade) */}
      <ellipse cx="32" cy="28" rx="18" ry="4" fill="#FBBF24" />

      {/* Classic Lampshade (Trapezoid Body) */}
      <polygon points="22,10 42,10 52,28 12,28" fill="#F59E0B" stroke="#1A0050" strokeWidth="3.5" strokeLinejoin="round" />

      {/* Lampshade Top Highlight Band */}
      <polygon points="22,10 42,10 44,14 20,14" fill="#FCD34D" />

      {/* Lampshade Decorative Trim / Ribbon */}
      <path d="M 14 24 Q 32 27 50 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Top Finial Knob */}
      <circle cx="32" cy="8" r="2.5" fill="#F59E0B" stroke="#1A0050" strokeWidth="2" />
    </svg>
  );
}

export function SmartEmoji({ emoji, size = "1em", className = "" }: { emoji: string; size?: string | number; className?: string }) {
  if (emoji === "🧼" || emoji === "eraser") {
    return <EraserIcon size={size} className={className} />;
  }
  if (emoji === "🧮" || emoji === "calculator") {
    return <CalculatorIcon size={size} className={className} />;
  }
  if (emoji === "desk") {
    return <DeskIcon size={size} className={className} />;
  }
  if (emoji === "table") {
    return <TableIcon size={size} className={className} />;
  }
  if (emoji === "fridge" || emoji === "refrigerator") {
    return <FridgeIcon size={size} className={className} />;
  }
  if (emoji === "stove") {
    return <StoveIcon size={size} className={className} />;
  }
  if (emoji === "lamp" || emoji === "💡") {
    return <LampIcon size={size} className={className} />;
  }
  return <span className={className}>{emoji}</span>;
}
