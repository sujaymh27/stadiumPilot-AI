import { describe, it, expect } from 'vitest';
import {
  FindRouteSchema,
  FindNearestAmenitySchema,
  GetCrowdStatusSchema,
  GetSectionInfoSchema,
} from '../tools/handlers';

describe('Input Validators (Zod Schemas)', () => {
  describe('FindRouteSchema', () => {
    it('passes with valid from and to', () => {
      const r = FindRouteSchema.safeParse({ from: 'Gate A', to: 'Section 100' });
      expect(r.success).toBe(true);
    });

    it('defaults accessible to false', () => {
      const r = FindRouteSchema.safeParse({ from: 'Gate A', to: 'Section 100' });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.accessible).toBe(false);
    });

    it('defaults crowd_aware to true', () => {
      const r = FindRouteSchema.safeParse({ from: 'Gate A', to: 'Section 100' });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.crowd_aware).toBe(true);
    });

    it('fails when from is missing', () => {
      const r = FindRouteSchema.safeParse({ to: 'Section 100' });
      expect(r.success).toBe(false);
    });

    it('fails when from is empty string', () => {
      const r = FindRouteSchema.safeParse({ from: '', to: 'Section 100' });
      expect(r.success).toBe(false);
    });

    it('fails when from exceeds max length', () => {
      const r = FindRouteSchema.safeParse({ from: 'A'.repeat(101), to: 'B' });
      expect(r.success).toBe(false);
    });

    it('accepts accessible=true', () => {
      const r = FindRouteSchema.safeParse({ from: 'Gate A', to: 'Section 100', accessible: true });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.accessible).toBe(true);
    });
  });

  describe('FindNearestAmenitySchema', () => {
    it('passes with valid type and section', () => {
      const r = FindNearestAmenitySchema.safeParse({ type: 'food', from_section: '100' });
      expect(r.success).toBe(true);
    });

    it('fails for invalid amenity type', () => {
      const r = FindNearestAmenitySchema.safeParse({ type: 'casino', from_section: '100' });
      expect(r.success).toBe(false);
    });

    it('accepts all valid types', () => {
      const types = ['food', 'restroom', 'medical', 'security', 'merchandise'];
      for (const type of types) {
        const r = FindNearestAmenitySchema.safeParse({ type, from_section: '100' });
        expect(r.success).toBe(true);
      }
    });
  });

  describe('GetCrowdStatusSchema', () => {
    it('passes with no section (optional)', () => {
      const r = GetCrowdStatusSchema.safeParse({});
      expect(r.success).toBe(true);
    });

    it('passes with a section string', () => {
      const r = GetCrowdStatusSchema.safeParse({ section: '110' });
      expect(r.success).toBe(true);
    });

    it('fails when section exceeds 50 chars', () => {
      const r = GetCrowdStatusSchema.safeParse({ section: 'A'.repeat(51) });
      expect(r.success).toBe(false);
    });
  });

  describe('GetSectionInfoSchema', () => {
    it('passes with a valid section id', () => {
      const r = GetSectionInfoSchema.safeParse({ section: '300' });
      expect(r.success).toBe(true);
    });

    it('fails with empty section string', () => {
      const r = GetSectionInfoSchema.safeParse({ section: '' });
      expect(r.success).toBe(false);
    });

    it('fails when section is missing', () => {
      const r = GetSectionInfoSchema.safeParse({});
      expect(r.success).toBe(false);
    });
  });
});
