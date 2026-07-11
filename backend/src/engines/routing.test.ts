import { describe, it, expect } from 'vitest';
import { RoutingEngine } from '../engines/routing';

describe('RoutingEngine', () => {
  const engine = new RoutingEngine();

  describe('resolveNodeId', () => {
    it('resolves "Gate A" to GATE-A', () => {
      expect(engine.resolveNodeId('Gate A')).toBe('GATE-A');
    });

    it('resolves "gate b" case-insensitively', () => {
      expect(engine.resolveNodeId('gate b')).toBe('GATE-B');
    });

    it('resolves section "100" to SEC-100', () => {
      expect(engine.resolveNodeId('100')).toBe('SEC-100');
    });

    it('resolves "Section 110" to SEC-110', () => {
      expect(engine.resolveNodeId('Section 110')).toBe('SEC-110');
    });

    it('returns null for unknown location', () => {
      expect(engine.resolveNodeId('Platform 9 3/4')).toBeNull();
    });

    it('resolves "Elevator 1" to ELV-1', () => {
      expect(engine.resolveNodeId('Elevator 1')).toBe('ELV-1');
    });
  });

  describe('findRoute', () => {
    it('finds a route from Gate A to Section 110', () => {
      const result = engine.findRoute('GATE-A', 'SEC-110');
      expect(result).not.toBeNull();
      expect(result!.path.length).toBeGreaterThan(1);
      expect(result!.path[0]).toBe('GATE-A');
      expect(result!.path[result!.path.length - 1]).toBe('SEC-110');
    });

    it('finds accessible route using elevators only', () => {
      const result = engine.findRoute('GATE-A', 'C2-NORTH', true);
      expect(result).not.toBeNull();
      expect(result!.accessible).toBe(true);
      // Accessible route must go through an elevator
      const hasElevator = result!.path.some(id => id.startsWith('ELV-'));
      expect(hasElevator).toBe(true);
    });

    it('returns null for unreachable destination', () => {
      const result = engine.findRoute('GATE-A', 'NONEXISTENT-NODE');
      expect(result).toBeNull();
    });

    it('includes step-by-step instructions', () => {
      const result = engine.findRoute('GATE-A', 'SEC-100');
      expect(result).not.toBeNull();
      expect(result!.instructions.length).toBeGreaterThan(0);
      expect(result!.instructions[result!.instructions.length - 1]).toContain('arrived');
    });

    it('returns a valid estimatedMinutes', () => {
      const result = engine.findRoute('GATE-C', 'SEC-120');
      expect(result).not.toBeNull();
      expect(result!.estimatedMinutes).toBeGreaterThanOrEqual(1);
    });

    it('crowd-aware routing does not crash with a crowd map', () => {
      const crowdMap = new Map<string, number>([['C0-SOUTH', 0.9], ['C0-EAST', 0.1]]);
      const result = engine.findRoute('GATE-A', 'SEC-110', false, crowdMap);
      expect(result).not.toBeNull();
    });
  });

  describe('getAllNodeIds', () => {
    it('returns a non-empty list of node IDs', () => {
      const ids = engine.getAllNodeIds();
      expect(ids.length).toBeGreaterThan(10);
      expect(ids).toContain('GATE-A');
      expect(ids).toContain('SEC-100');
    });
  });
});
