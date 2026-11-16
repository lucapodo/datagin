import { useId } from 'react';

interface Props {
  id: string;
  name: string;
  type: string;
  year?: number | null;
}

type Shape = 'classic' | 'apothecary' | 'crock';

interface ShapeSpec {
  body: string;
  /** Tappo / chiusura disegnata sopra il collo. */
  cap: { x: number; y: number; w: number; h: number; rx: number; fill: string };
  label: { x: number; y: number; w: number; h: number };
  /** Riflesso verticale sul vetro (x, y iniziale, y finale). */
  highlight: [number, number, number] | null;
  /** Livello del liquido; null = recipiente opaco (gres). */
  liquidTop: number | null;
}

const SHAPES: Record<Shape, ShapeSpec> = {
  // Bottiglia alta con spalle morbide: il "London Dry" da scaffale.
  classic: {
    body: 'M70,40 L70,60 C70,72 38,78 38,100 L38,214 C38,222 44,228 52,228 L108,228 C116,228 122,222 122,214 L122,100 C122,78 90,72 90,60 L90,40 Z',
    cap: { x: 66, y: 16, w: 28, h: 26, rx: 3, fill: 'var(--ink)' },
    label: { x: 46, y: 122, w: 68, h: 82 },
    highlight: [46, 104, 208],
    liquidTop: 96,
  },
  // Bottiglia da farmacia, larga e squadrata, con tappo di sughero.
  apothecary: {
    body: 'M71,52 L71,66 L36,84 C31,87 28,91 28,98 L28,216 C28,223 33,228 40,228 L120,228 C127,228 132,223 132,216 L132,98 C132,91 129,87 124,84 L89,66 L89,52 Z',
    cap: { x: 67, y: 30, w: 26, h: 24, rx: 5, fill: '#b48a5a' },
    label: { x: 38, y: 118, w: 84, h: 84 },
    highlight: [36, 100, 212],
    liquidTop: 92,
  },
  // Orcio in gres, la bottiglia tradizionale del genever.
  crock: {
    body: 'M72,44 L72,62 C72,70 42,74 40,98 L40,206 C40,220 52,228 66,228 L94,228 C108,228 120,220 120,206 L120,98 C118,74 88,70 88,62 L88,44 Z',
    cap: { x: 68, y: 26, w: 24, h: 20, rx: 4, fill: '#b48a5a' },
    label: { x: 48, y: 120, w: 64, h: 80 },
    highlight: null,
    liquidTop: null,
  },
};

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function shapeFor(id: string, type: string): Shape {
  if (/genever|jenever/i.test(type)) return 'crock';
  // Varietà stabile: lo stesso gin ha sempre la stessa bottiglia.
  return hash(id) % 3 === 0 ? 'apothecary' : 'classic';
}

function liquidFor(type: string): { color: string; opacity: number } {
  if (/sloe|prugnol/i.test(type)) return { color: 'var(--accent)', opacity: 0.32 };
  if (/aged|barrel|invecchiat|reserve|botte|cask/i.test(type)) return { color: '#c98f3c', opacity: 0.34 };
  if (/pink|rosa/i.test(type)) return { color: '#d98a8a', opacity: 0.3 };
  return { color: 'var(--parchment-dark)', opacity: 0.55 };
}

/** A capo sulle parole, al massimo `maxLines` righe; l'ultima viene troncata. */
function wrapWords(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1]}…`;
    return kept;
  }
  return lines;
}

/** Larghezza stimata di una riga in maiuscolo, per non uscire dall'etichetta. */
function estimateWidth(text: string, fontSize: number, letterSpacing: number): number {
  return text.length * (fontSize * 0.68 + letterSpacing);
}

function JuniperSprig({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`} stroke="var(--ink)" fill="none" strokeLinecap="round">
      <path d="M-14,2 C-6,0 6,0 14,-2" strokeWidth="0.8" />
      {[-10, -4, 2, 8].map((nx) => (
        <g key={nx}>
          <line x1={nx} y1={0.5} x2={nx + 3} y2={-4.5} strokeWidth="0.6" />
          <line x1={nx} y1={0.5} x2={nx + 3} y2={5} strokeWidth="0.6" />
        </g>
      ))}
      <circle cx="-2" cy="-3.5" r="2.1" fill="var(--ink-soft)" stroke="none" />
      <circle cx="3" cy="3.8" r="2.1" fill="var(--ink-soft)" stroke="none" />
      <circle cx="9" cy="-2.6" r="1.8" fill="var(--ink-soft)" stroke="none" opacity="0.8" />
    </g>
  );
}

/**
 * Illustrazione vettoriale della bottiglia, usata quando `image` è null (non
 * usiamo loghi o foto dei marchi senza diritti d'uso chiari). Stile incisione
 * coerente con l'atlante: tre sagome (classica, farmacia, orcio da genever)
 * scelte in modo stabile per gin, liquido tinto in base alla tipologia, e
 * un'etichetta il cui testo va a capo e si restringe per restare sempre dentro.
 */
export function BottleIllustration({ id, name, type, year }: Props) {
  const uid = useId().replace(/:/g, '');
  const shape = SHAPES[shapeFor(id, type)];
  const liquid = liquidFor(type);
  const { label } = shape;
  const cx = label.x + label.w / 2;
  const innerW = label.w - 12;

  // Se il nome non entra in tre righe, il "Gin" finale è superfluo sull'etichetta.
  let nameLines = wrapWords(name.toUpperCase(), 11, 3);
  if (nameLines.at(-1)?.endsWith('…') && /\s+gin$/i.test(name)) {
    nameLines = wrapWords(name.replace(/\s+gin$/i, '').toUpperCase(), 11, 3);
  }
  const longest = Math.max(...nameLines.map((l) => l.length));
  const nameSize = Math.max(6.5, Math.min(10, innerW / (longest * 0.78)));
  const nameSpacing = 0.6;
  const lineHeight = nameSize * 1.18;

  const typeSize = 5.2;
  const typeSpacing = 0.8;
  const typeMaxChars = Math.floor(innerW / estimateWidth('X', typeSize, typeSpacing)) - 1;
  const typeLines = wrapWords(type.replace(/\//g, ' / ').toUpperCase(), typeMaxChars, 3);
  const typeLineHeight = 7;

  // Blocco verticale centrato nell'etichetta: rametto, nome, filetto, tipologia.
  const blockH = 12 + nameLines.length * lineHeight + 8 + typeLines.length * typeLineHeight + (year ? 8 : 0);
  let cursor = label.y + (label.h - blockH) / 2;
  const sprigY = cursor + 5;
  cursor += 14;
  const nameStartY = cursor + nameSize * 0.8;
  cursor += nameLines.length * lineHeight + 3;
  const ruleY = cursor;
  cursor += 9;
  const typeY = cursor;
  const yearY = cursor + (typeLines.length - 1) * typeLineHeight + 8;

  const fit = (text: string, size: number, spacing: number) =>
    estimateWidth(text, size, spacing) > innerW
      ? { textLength: innerW, lengthAdjust: 'spacingAndGlyphs' as const }
      : {};

  return (
    <svg
      width="160"
      height="240"
      viewBox="0 0 160 240"
      role="img"
      aria-label={`Illustrazione della bottiglia di ${name}`}
      className="bottle-illustration"
    >
      <defs>
        <clipPath id={`body-${uid}`}>
          <path d={shape.body} />
        </clipPath>
      </defs>

      <ellipse cx="80" cy="231" rx="46" ry="4.5" fill="var(--ink)" opacity="0.1" />

      {/* Vetro (o gres) */}
      <path d={shape.body} fill={shape.liquidTop === null ? 'var(--parchment-dark)' : 'var(--paper)'} />

      {shape.liquidTop !== null && (
        <g clipPath={`url(#body-${uid})`}>
          <rect x="0" y={shape.liquidTop} width="160" height="240" fill={liquid.color} opacity={liquid.opacity} />
          <line x1="0" y1={shape.liquidTop} x2="160" y2={shape.liquidTop} stroke="var(--ink)" strokeWidth="0.5" opacity="0.35" />
        </g>
      )}

      {shape.liquidTop === null && (
        // Smaltatura scura sulla parte alta dell'orcio
        <g clipPath={`url(#body-${uid})`}>
          <rect x="0" y="0" width="160" height="92" fill="var(--ink-soft)" opacity="0.28" />
        </g>
      )}

      {shape.highlight && (
        <line
          x1={shape.highlight[0]}
          y1={shape.highlight[1]}
          x2={shape.highlight[0]}
          y2={shape.highlight[2]}
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      )}

      <path d={shape.body} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Tappo */}
      <rect
        x={shape.cap.x}
        y={shape.cap.y}
        width={shape.cap.w}
        height={shape.cap.h}
        rx={shape.cap.rx}
        fill={shape.cap.fill}
        stroke="var(--ink)"
        strokeWidth="1.2"
      />
      <line
        x1={shape.cap.x}
        y1={shape.cap.y + shape.cap.h - 5}
        x2={shape.cap.x + shape.cap.w}
        y2={shape.cap.y + shape.cap.h - 5}
        stroke="var(--paper)"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Etichetta con doppio filetto */}
      <rect x={label.x} y={label.y} width={label.w} height={label.h} fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.2" />
      <rect
        x={label.x + 3}
        y={label.y + 3}
        width={label.w - 6}
        height={label.h - 6}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="0.5"
        opacity="0.6"
      />

      <JuniperSprig x={cx} y={sprigY} />

      <text
        textAnchor="middle"
        fontSize={nameSize}
        letterSpacing={nameSpacing}
        fontWeight="600"
        fill="var(--ink)"
        style={{ fontFamily: "'Bodoni Moda', 'Didot', Georgia, serif" }}
      >
        {nameLines.map((line, i) => (
          <tspan key={i} x={cx} y={nameStartY + i * lineHeight} {...fit(line, nameSize, nameSpacing)}>
            {line}
          </tspan>
        ))}
      </text>

      <line x1={cx - 12} y1={ruleY} x2={cx + 12} y2={ruleY} stroke="var(--accent)" strokeWidth="0.7" />

      <text textAnchor="middle" fontSize={typeSize} letterSpacing={typeSpacing} fill="var(--ink-soft)">
        {typeLines.map((line, i) => (
          <tspan key={i} x={cx} y={typeY + i * typeLineHeight} {...fit(line, typeSize, typeSpacing)}>
            {line}
          </tspan>
        ))}
      </text>

      {year ? (
        <text x={cx} y={yearY} textAnchor="middle" fontSize="5.5" fontStyle="italic" fill="var(--ink-soft)">
          dal {year}
        </text>
      ) : null}
    </svg>
  );
}
