import { describe, it, expect } from 'vitest';
import { dispatchTool } from '../tools/handlers';

describe('Tool Handlers', () => {
  describe('find_route', () => {
    it('returns a route from Gate A to Section 110', () => {
      const result = dispatchTool('find_route', { from: 'Gate A', to: 'Section 110' });
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('path');
      expect(result.data).toHaveProperty('instructions');
    });

    it('returns error for unknown origin', () => {
      const result = dispatchTool('find_route', { from: 'Narnia', to: 'Section 100' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Narnia');
    });

    it('returns error for unknown destination', () => {
      const result = dispatchTool('find_route', { from: 'Gate A', to: 'Platform 9' });
      expect(result.success).toBe(false);
    });

    it('returns accessible route when accessible=true', () => {
      const result = dispatchTool('find_route', { from: 'Gate A', to: 'C2-SOUTH', accessible: true });
      expect(result.success).toBe(true);
      const data = result.data as { accessible: boolean };
      expect(data.accessible).toBe(true);
    });

    it('rejects invalid schema (missing from)', () => {
      const result = dispatchTool('find_route', { to: 'Section 100' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid arguments');
    });

    it('rejects if from is empty string', () => {
      const result = dispatchTool('find_route', { from: '', to: 'Section 100' });
      expect(result.success).toBe(false);
    });
  });

  describe('find_nearest_amenity', () => {
    it('finds nearest food from section 100', () => {
      const result = dispatchTool('find_nearest_amenity', { type: 'food', from_section: '100' });
      expect(result.success).toBe(true);
      const data = result.data as { nearest: { type: string } };
      expect(data.nearest.type).toBe('food');
    });

    it('finds nearest restroom', () => {
      const result = dispatchTool('find_nearest_amenity', { type: 'restroom', from_section: '110' });
      expect(result.success).toBe(true);
      const data = result.data as { nearest: { type: string } };
      expect(data.nearest.type).toBe('restroom');
    });

    it('rejects invalid amenity type', () => {
      const result = dispatchTool('find_nearest_amenity', { type: 'spa', from_section: '100' });
      expect(result.success).toBe(false);
    });
  });

  describe('get_crowd_status', () => {
    it('returns full crowd data when no section specified', () => {
      const result = dispatchTool('get_crowd_status', {});
      expect(result.success).toBe(true);
      const data = result.data as { sections: unknown[] };
      expect(Array.isArray(data.sections)).toBe(true);
      expect(data.sections.length).toBeGreaterThan(0);
    });

    it('returns single section data when section specified', () => {
      const result = dispatchTool('get_crowd_status', { section: '100' });
      expect(result.success).toBe(true);
      const data = result.data as { sectionId: string };
      expect(data.sectionId).toBe('100');
    });

    it('returns error for unknown section', () => {
      const result = dispatchTool('get_crowd_status', { section: 'ZZZNOPE' });
      expect(result.success).toBe(false);
    });
  });

  describe('get_transport_info', () => {
    it('returns transport data with rail and bus', () => {
      const result = dispatchTool('get_transport_info', {});
      expect(result.success).toBe(true);
      const data = result.data as { rail: unknown[]; bus: unknown[] };
      expect(Array.isArray(data.rail)).toBe(true);
      expect(Array.isArray(data.bus)).toBe(true);
    });
  });

  describe('get_section_info', () => {
    it('returns info for section 100', () => {
      const result = dispatchTool('get_section_info', { section: '100' });
      expect(result.success).toBe(true);
      const data = result.data as { id: string };
      expect(data.id).toBe('100');
    });

    it('returns error for unknown section', () => {
      const result = dispatchTool('get_section_info', { section: '999' });
      expect(result.success).toBe(false);
    });
  });

  describe('get_parking_info', () => {
    it('returns parking lot array', () => {
      const result = dispatchTool('get_parking_info', {});
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('unknown tool', () => {
    it('returns error for unknown tool name', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = dispatchTool('teleport' as any, {});
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown tool');
    });
  });
});
