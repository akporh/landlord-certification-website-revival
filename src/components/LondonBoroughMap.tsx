// Geographic London borough map — two-zone fill with Thames river
// ViewBox 0 0 500 520, coordinates derived from ONS simplified boundaries

const OUTER_LONDON =
  "M58,98 L72,74 L98,56 L126,46 L165,38 L208,28 L255,22 L300,28 L338,42 L370,58 L400,80 L424,106 L446,132 L464,162 L474,196 L476,232 L472,266 L462,296 L452,325 L438,355 L422,388 L402,418 L375,445 L345,462 L312,470 L278,474 L244,470 L212,460 L185,448 L160,430 L136,408 L115,382 L98,352 L84,320 L72,288 L60,258 L50,226 L48,194 L54,162 L58,130 Z";

const INNER_ZONE =
  "M170,178 L190,158 L216,146 L248,140 L280,144 L308,158 L330,180 L342,208 L346,238 L340,268 L326,295 L306,318 L282,338 L258,344 L234,340 L212,328 L196,310 L182,288 L172,264 L168,240 L168,210 Z";

// Thames: two paths forming a ribbon (north bank → east → south bank ← west)
const THAMES_NORTH =
  "M52,305 Q80,292 105,284 Q132,278 158,276 Q182,274 204,276 Q224,278 244,274 Q264,270 284,273 Q306,276 328,278 Q355,282 382,290 Q410,298 438,304 Q458,308 476,312";
const THAMES_SOUTH =
  "M476,322 Q458,318 438,314 Q410,308 382,300 Q355,294 328,290 Q306,288 284,285 Q264,282 244,285 Q224,287 204,288 Q182,286 158,288 Q132,292 105,296 Q80,304 52,318 Z";

// Borough centroids for labels [name, x, y, inner]
const LABELS: [string, number, number, boolean][] = [
  // Inner boroughs
  ["Camden", 222, 185, true],
  ["Islington", 256, 192, true],
  ["Hackney", 290, 178, true],
  ["Westminster", 228, 240, true],
  ["City", 265, 235, true],
  ["Tower H.", 302, 248, true],
  ["K&C", 196, 252, true],
  ["H&F", 175, 262, true],
  ["Southwark", 275, 295, true],
  ["Lambeth", 242, 308, true],
  ["Wandsworth", 198, 318, true],
  ["Greenwich", 330, 292, true],
  ["Lewisham", 305, 322, true],
  // Outer boroughs
  ["Enfield", 258, 52, false],
  ["Barnet", 185, 82, false],
  ["Haringey", 252, 152, false],
  ["Harrow", 100, 152, false],
  ["Waltham F.", 308, 148, false],
  ["Havering", 438, 162, false],
  ["Hillingdon", 42, 228, false],
  ["Brent", 152, 172, false],
  ["Ealing", 120, 238, false],
  ["Redbridge", 362, 172, false],
  ["Barking", 398, 215, false],
  ["Newham", 340, 230, false],
  ["Hounslow", 100, 298, false],
  ["Richmond", 128, 338, false],
  ["Bexley", 420, 302, false],
  ["Kingston", 125, 395, false],
  ["Merton", 198, 382, false],
  ["Sutton", 200, 438, false],
  ["Croydon", 270, 418, false],
  ["Bromley", 390, 400, false],
];

// Subtle graticule lines (classic map feel)
const GRATICULE_H = [100, 175, 250, 325, 400, 475];
const GRATICULE_V = [80, 160, 240, 320, 400, 480];

export function LondonBoroughMap() {
  return (
    <svg
      viewBox="0 0 500 520"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ display: "block" }}
      aria-label="Map of London boroughs served"
    >
      <defs>
        <clipPath id="london-clip">
          <path d={OUTER_LONDON} />
        </clipPath>
      </defs>

      {/* Graticule — clipped to London boundary */}
      <g clipPath="url(#london-clip)" opacity={0.045}>
        {GRATICULE_H.map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={500} y2={y} stroke="white" strokeWidth={0.6} />
        ))}
        {GRATICULE_V.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={520} stroke="white" strokeWidth={0.6} />
        ))}
      </g>

      {/* Outer London — zone 3–4 fill */}
      <path
        d={OUTER_LONDON}
        fill="rgba(255,255,255,0.07)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
      />

      {/* Inner zone 1–2 — emerald */}
      <path
        d={INNER_ZONE}
        fill="var(--emerald)"
        fillOpacity={0.72}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={0.8}
      />

      {/* Thames river */}
      <path
        d={`${THAMES_NORTH} L${THAMES_SOUTH}`}
        fill="rgba(15,25,55,0.75)"
        stroke="rgba(80,140,200,0.25)"
        strokeWidth={0.5}
      />
      {/* Thames label */}
      <text
        x={420}
        y={315}
        fontSize={7}
        fill="rgba(120,180,255,0.45)"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        letterSpacing="0.06em"
        textAnchor="middle"
      >
        Thames
      </text>

      {/* Borough labels */}
      {LABELS.map(([name, x, y, inner]) => (
        <text
          key={name}
          x={x}
          y={y}
          fontSize={inner ? 6.5 : 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight={inner ? "700" : "500"}
          letterSpacing="0.04em"
          fill={inner ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.60)"}
        >
          {name}
        </text>
      ))}

      {/* Compass rose — bottom right */}
      <g transform="translate(468, 468)" opacity={0.35}>
        <circle cx={0} cy={0} r={10} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.6} />
        <line x1={0} y1={-9} x2={0} y2={9} stroke="rgba(255,255,255,0.6)" strokeWidth={0.6} />
        <line x1={-9} y1={0} x2={9} y2={0} stroke="rgba(255,255,255,0.6)" strokeWidth={0.6} />
        <text x={0} y={-12} fontSize={5} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontFamily="Georgia, serif">N</text>
      </g>
    </svg>
  );
}
