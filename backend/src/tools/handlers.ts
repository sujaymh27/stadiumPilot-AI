import { z } from 'zod';
import { routingEngine } from '../engines/routing';
import { generateCrowd, getCrowdMap } from '../engines/crowd';
import amenitiesData from '../data/amenities.json';
import sectionsData from '../data/sections.json';
import transportData from '../data/transport.json';
import parkingData from '../data/parking.json';

// ─── Zod Validators ────────────────────────────────────────────────────────

export const FindRouteSchema = z.object({
  from: z.string().min(1).max(100),
  to: z.string().min(1).max(100),
  accessible: z.boolean().optional().default(false),
  crowd_aware: z.boolean().optional().default(true),
});

export const FindNearestAmenitySchema = z.object({
  type: z.enum(['food', 'restroom', 'medical', 'security', 'merchandise']),
  from_section: z.string().min(1).max(50),
});

export const GetCrowdStatusSchema = z.object({
  section: z.string().max(50).optional(),
});

export const GetSectionInfoSchema = z.object({
  section: z.string().min(1).max(50),
});

// ─── Tool Handler Types ────────────────────────────────────────────────────

export type ToolName =
  | 'find_route'
  | 'find_nearest_amenity'
  | 'get_crowd_status'
  | 'get_transport_info'
  | 'get_section_info'
  | 'get_parking_info';

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ─── Tool: find_route ─────────────────────────────────────────────────────

function handleFindRoute(args: unknown): ToolResult {
  const parsed = FindRouteSchema.safeParse(args);
  if (!parsed.success) {
    return { success: false, error: `Invalid arguments: ${parsed.error.message}` };
  }

  const { from, to, accessible, crowd_aware } = parsed.data;

  const fromId = routingEngine.resolveNodeId(from);
  const toId = routingEngine.resolveNodeId(to);

  if (!fromId) return { success: false, error: `Could not locate origin: "${from}"` };
  if (!toId) return { success: false, error: `Could not locate destination: "${to}"` };

  const crowdMap = crowd_aware ? getCrowdMap() : undefined;
  const route = routingEngine.findRoute(fromId, toId, accessible ?? false, crowdMap);

  if (!route) {
    return {
      success: false,
      error: accessible
        ? `No accessible route found from "${from}" to "${to}". Please check elevator availability.`
        : `No route found from "${from}" to "${to}".`,
    };
  }

  return { success: true, data: route };
}

// ─── Tool: find_nearest_amenity ───────────────────────────────────────────

interface Amenity {
  id: string;
  type: string;
  name: string;
  description: string;
  section: string;
  level: number;
  coordinates: { x: number; y: number };
  accessible: boolean;
  hours: string;
}

function handleFindNearestAmenity(args: unknown): ToolResult {
  const parsed = FindNearestAmenitySchema.safeParse(args);
  if (!parsed.success) {
    return { success: false, error: `Invalid arguments: ${parsed.error.message}` };
  }

  const { type, from_section } = parsed.data;
  const amenities = amenitiesData as Amenity[];
  const filtered = amenities.filter(a => a.type === type);

  if (filtered.length === 0) {
    return { success: false, error: `No amenities of type "${type}" found.` };
  }

  // Find section coords for distance calc
  const allSections = sectionsData as { id: string; coordinates: { x: number; y: number } }[];
  const originSection = allSections.find(
    s => s.id === from_section.toUpperCase() || s.id === from_section
  );

  if (!originSection) {
    // Return first match if origin unknown
    return { success: true, data: { nearest: filtered[0], alternatives: filtered.slice(1, 3) } };
  }

  const withDist = filtered.map(a => ({
    ...a,
    distance: Math.sqrt(
      (a.coordinates.x - originSection.coordinates.x) ** 2 +
      (a.coordinates.y - originSection.coordinates.y) ** 2
    ),
  }));
  withDist.sort((a, b) => a.distance - b.distance);

  return {
    success: true,
    data: {
      nearest: withDist[0],
      alternatives: withDist.slice(1, 3),
    },
  };
}

// ─── Tool: get_crowd_status ───────────────────────────────────────────────

function handleGetCrowdStatus(args: unknown): ToolResult {
  const parsed = GetCrowdStatusSchema.safeParse(args);
  if (!parsed.success) {
    return { success: false, error: `Invalid arguments: ${parsed.error.message}` };
  }

  const crowd = generateCrowd();

  if (parsed.data.section) {
    const sec = crowd.sections.find(
      s => s.sectionId === parsed.data.section ||
           s.sectionName.toLowerCase().includes((parsed.data.section ?? '').toLowerCase())
    );
    if (!sec) {
      return { success: false, error: `Section "${parsed.data.section}" not found.` };
    }
    return { success: true, data: sec };
  }

  return { success: true, data: crowd };
}

// ─── Tool: get_transport_info ─────────────────────────────────────────────

function handleGetTransportInfo(_args: unknown): ToolResult {
  return { success: true, data: transportData };
}

// ─── Tool: get_section_info ───────────────────────────────────────────────

function handleGetSectionInfo(args: unknown): ToolResult {
  const parsed = GetSectionInfoSchema.safeParse(args);
  if (!parsed.success) {
    return { success: false, error: `Invalid arguments: ${parsed.error.message}` };
  }

  const sections = sectionsData as { id: string; name: string }[];
  const sec = sections.find(
    s => s.id === parsed.data.section ||
         s.name.toLowerCase().includes(parsed.data.section.toLowerCase())
  );

  if (!sec) return { success: false, error: `Section "${parsed.data.section}" not found.` };
  return { success: true, data: sec };
}

// ─── Tool: get_parking_info ───────────────────────────────────────────────

function handleGetParkingInfo(_args: unknown): ToolResult {
  return { success: true, data: parkingData };
}

// ─── Dispatch ─────────────────────────────────────────────────────────────

export function dispatchTool(name: ToolName, args: unknown): ToolResult {
  switch (name) {
    case 'find_route':           return handleFindRoute(args);
    case 'find_nearest_amenity': return handleFindNearestAmenity(args);
    case 'get_crowd_status':     return handleGetCrowdStatus(args);
    case 'get_transport_info':   return handleGetTransportInfo(args);
    case 'get_section_info':     return handleGetSectionInfo(args);
    case 'get_parking_info':     return handleGetParkingInfo(args);
    default:
      return { success: false, error: `Unknown tool: ${name as string}` };
  }
}
