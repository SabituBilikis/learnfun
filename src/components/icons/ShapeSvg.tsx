import React from "react";

export function ShapeSvg({ type, color, size }: { type: string; color: string; size: number }) {
  const s = size; const h = s * 0.5; const c = s * 0.5;
  const shapes: Record<string, React.ReactNode> = {
    circle:    <circle cx={c} cy={c} r={h * 0.9} fill={color} />,
    square:    <rect x={h*0.1} y={h*0.1} width={h*1.8} height={h*1.8} rx={h*0.15} fill={color} />,
    triangle:  <polygon points={`${c},${h*0.1} ${h*1.9},${h*1.9} ${h*0.1},${h*1.9}`} fill={color} />,
    rectangle: <rect x={h*0.05} y={h*0.3} width={h*1.9} height={h*1.4} rx={h*0.1} fill={color} />,
    star:      <polygon points={`${c},${h*0.1} ${h*1.15},${h*0.75} ${h*1.9},${h*0.75} ${h*1.3},${h*1.25} ${h*1.6},${h*1.9} ${c},${h*1.5} ${h*0.4},${h*1.9} ${h*0.7},${h*1.25} ${h*0.1},${h*0.75} ${h*0.85},${h*0.75}`} fill={color} />,
    heart:     <path d={`M ${c} ${h*1.7} C ${h*0.3} ${h*1.2} ${h*0.1} ${h*0.5} ${h*0.5} ${h*0.3} C ${h*0.8} ${h*0.15} ${c} ${h*0.4} ${c} ${h*0.6} C ${c} ${h*0.4} ${h*1.2} ${h*0.15} ${h*1.5} ${h*0.3} C ${h*1.9} ${h*0.5} ${h*1.7} ${h*1.2} ${c} ${h*1.7} Z`} fill={color} />,
    diamond:   <polygon points={`${c},${h*0.1} ${h*1.9},${c} ${c},${h*1.9} ${h*0.1},${c}`} fill={color} />,
    oval:      <ellipse cx={c} cy={c} rx={h*0.95} ry={h*0.65} fill={color} />,
    pentagon:  <polygon points={`${c},${h*0.1} ${h*1.85},${h*0.75} ${h*1.5},${h*1.85} ${h*0.5},${h*1.85} ${h*0.15},${h*0.75}`} fill={color} />,
    hexagon:   <polygon points={`${c},${h*0.1} ${h*1.8},${h*0.55} ${h*1.8},${h*1.45} ${c},${h*1.9} ${h*0.2},${h*1.45} ${h*0.2},${h*0.55}`} fill={color} />,
  };
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} overflow="visible">
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <g filter="url(#glow)">{shapes[type] ?? shapes.circle}</g>
    </svg>
  );
}
