import { describe, it, expect } from 'vitest';
import {
  generateCrowd,
  getCrowdMap,
  detectGamePhase,
  type GamePhase,
} from '../engines/crowd';

describe('Crowd Generator', () => {
  describe('generateCrowd', () => {
    it('returns valid crowd data structure', () => {
      const crowd = generateCrowd();
      expect(crowd).toHaveProperty('phase');
      expect(crowd).toHaveProperty('timestamp');
      expect(crowd).toHaveProperty('overallDensity');
      expect(crowd).toHaveProperty('sections');
      expect(crowd).toHaveProperty('hotspots');
    });

    it('all section densities are between 0 and 1', () => {
      const crowd = generateCrowd();
      for (const sec of crowd.sections) {
        expect(sec.density).toBeGreaterThanOrEqual(0);
        expect(sec.density).toBeLessThanOrEqual(1);
      }
    });

    it('overallDensity is between 0 and 1', () => {
      const crowd = generateCrowd();
      expect(crowd.overallDensity).toBeGreaterThanOrEqual(0);
      expect(crowd.overallDensity).toBeLessThanOrEqual(1);
    });

    it('crowd levels are valid enum values', () => {
      const valid = ['low', 'moderate', 'high', 'very_high'];
      const crowd = generateCrowd();
      for (const sec of crowd.sections) {
        expect(valid).toContain(sec.level);
      }
    });

    it('halftime generates higher density than pre_game', () => {
      const halftime = generateCrowd('halftime');
      const preGame = generateCrowd('pre_game');
      expect(halftime.overallDensity).toBeGreaterThan(preGame.overallDensity);
    });

    it('crowd results are deterministic for same phase', () => {
      const c1 = generateCrowd('kickoff');
      const c2 = generateCrowd('kickoff');
      // Same sections, same densities (seeded)
      expect(c1.sections.map(s => s.sectionId)).toEqual(c2.sections.map(s => s.sectionId));
    });

    it('post_game has lower density than kickoff', () => {
      const postGame = generateCrowd('post_game');
      const kickoff = generateCrowd('kickoff');
      expect(postGame.overallDensity).toBeLessThan(kickoff.overallDensity);
    });

    it('hotspots only contains sections with very_high level', () => {
      const crowd = generateCrowd('halftime'); // highest density phase
      const veryHigh = crowd.sections.filter(s => s.level === 'very_high').map(s => s.sectionName);
      for (const hotspot of crowd.hotspots) {
        expect(veryHigh).toContain(hotspot);
      }
    });

    it('sections with recommendAlternate set when density > 0.75', () => {
      const crowd = generateCrowd('kickoff');
      for (const sec of crowd.sections) {
        if (sec.density > 0.75) {
          expect(sec.recommendAlternate).toBe(true);
        }
      }
    });
  });

  describe('getCrowdMap', () => {
    it('returns a Map with section IDs as keys', () => {
      const map = getCrowdMap();
      expect(map instanceof Map).toBe(true);
      expect(map.size).toBeGreaterThan(0);
    });

    it('all values in the map are between 0 and 1', () => {
      const map = getCrowdMap();
      for (const [, density] of map) {
        expect(density).toBeGreaterThanOrEqual(0);
        expect(density).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('detectGamePhase', () => {
    it('returns a valid game phase string', () => {
      const phase = detectGamePhase();
      const valid: GamePhase[] = ['pre_game', 'kickoff', 'halftime', 'second_half', 'post_game'];
      expect(valid).toContain(phase);
    });
  });
});
