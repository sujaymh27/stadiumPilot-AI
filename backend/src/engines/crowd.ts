import sections from '../data/sections.json';

export type CrowdLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type GamePhase = 'pre_game' | 'kickoff' | 'halftime' | 'second_half' | 'post_game';

export interface SectionCrowd {
  sectionId: string;
  sectionName: string;
  density: number;        // 0.0 - 1.0
  level: CrowdLevel;
  estimatedWaitMinutes: number;
  recommendAlternate: boolean;
}

export interface StadiumCrowd {
  phase: GamePhase;
  timestamp: string;
  overallDensity: number;
  sections: SectionCrowd[];
  hotspots: string[];
}

// Phase-based density multipliers
const PHASE_MULTIPLIERS: Record<GamePhase, number> = {
  pre_game:    0.45,
  kickoff:     0.90,
  halftime:    0.95,
  second_half: 0.85,
  post_game:   0.70,
};

// Seeded pseudo-random for deterministic results per section
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function sectionSeed(sectionId: string): number {
  return sectionId.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
}

function densityToLevel(density: number): CrowdLevel {
  if (density < 0.35) return 'low';
  if (density < 0.60) return 'moderate';
  if (density < 0.80) return 'high';
  return 'very_high';
}

export function detectGamePhase(): GamePhase {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hour * 60 + minutes;

  // Simulate game timeline using time of day for demo purposes
  if (totalMinutes < 14 * 60) return 'pre_game';
  if (totalMinutes < 15 * 60) return 'kickoff';
  if (totalMinutes < 16 * 60) return 'halftime';
  if (totalMinutes < 17 * 60 + 30) return 'second_half';
  return 'post_game';
}

export function generateCrowd(phase?: GamePhase): StadiumCrowd {
  const gamePhase = phase ?? detectGamePhase();
  const multiplier = PHASE_MULTIPLIERS[gamePhase];
  const now = new Date();
  const timeVariance = (now.getMinutes() % 10) / 100; // small time variation

  const sectionCrowds: SectionCrowd[] = (sections as { id: string; name: string }[]).map((sec) => {
    const base = seededRandom(sectionSeed(sec.id));
    const raw = Math.min(1, (base * 0.6 + 0.2) * multiplier + timeVariance);
    const density = parseFloat(raw.toFixed(2));
    const level = densityToLevel(density);
    const estimatedWaitMinutes = level === 'very_high' ? 8
      : level === 'high' ? 5
      : level === 'moderate' ? 2
      : 0;

    return {
      sectionId: sec.id,
      sectionName: sec.name,
      density,
      level,
      estimatedWaitMinutes,
      recommendAlternate: density > 0.75,
    };
  });

  const hotspots = sectionCrowds
    .filter(s => s.level === 'very_high')
    .map(s => s.sectionName);

  const overallDensity = parseFloat(
    (sectionCrowds.reduce((sum, s) => sum + s.density, 0) / sectionCrowds.length).toFixed(2)
  );

  return {
    phase: gamePhase,
    timestamp: now.toISOString(),
    overallDensity,
    sections: sectionCrowds,
    hotspots,
  };
}

export function getCrowdMap(): Map<string, number> {
  const crowd = generateCrowd();
  const map = new Map<string, number>();
  for (const s of crowd.sections) {
    map.set(`SEC-${s.sectionId}`, s.density);
  }
  return map;
}
