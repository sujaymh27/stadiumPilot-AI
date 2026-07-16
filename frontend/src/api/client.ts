import axios, { type AxiosError } from 'axios';
import type { ChatMessage, CrowdData, RouteData } from '../store';

/**
 * Axios instance pre-configured with the backend base URL and a request timeout.
 * VITE_API_URL is set at build time; falls back to localhost for development.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30_000, // 30 s — long enough for Gemini multi-turn, short enough to fail fast
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request types ────────────────────────────────────────────────────────

export interface AIQueryPayload {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  accessible?: boolean;
}

export interface AIQueryResponse {
  reply: string;
  toolsUsed: string[];
  routeData?: RouteData;
  crowdData?: CrowdData;
}

// ─── API calls ────────────────────────────────────────────────────────────

export async function queryAI(payload: AIQueryPayload): Promise<AIQueryResponse> {
  const { data } = await api.post<AIQueryResponse>('/ai/query', payload);
  return data;
}

export async function fetchCrowd(): Promise<CrowdData> {
  const { data } = await api.get<CrowdData>('/crowd');
  return data;
}

export interface Amenity {
  id: string;
  type: 'food' | 'restroom' | 'medical' | 'security' | 'merchandise';
  name: string;
  description: string;
  section: string;
  level: number;
  coordinates: { x: number; y: number };
  accessible: boolean;
  hours: string;
}

export async function fetchAmenities(type?: Amenity['type']): Promise<Amenity[]> {
  const { data } = await api.get<Amenity[]>('/stadium/amenities', {
    params: type ? { type } : undefined,
  });
  return data;
}

export interface TransportOption {
  id: string;
  name: string;
  description: string;
  walkTime: number;
  schedule: string;
  accessible: boolean;
  coordinates: { x: number; y: number };
}

export interface RailOption extends TransportOption {
  line: string;
}

export interface RideshareInfo {
  pickupZone: string;
  coordinates: { x: number; y: number };
  notes: string;
}

export interface TransportData {
  rail: RailOption[];
  bus: TransportOption[];
  rideshare: RideshareInfo;
  generalNotes: string;
}

export async function fetchTransport(): Promise<TransportData> {
  const { data } = await api.get<TransportData>('/stadium/transport');
  return data;
}


// ─── Utilities ────────────────────────────────────────────────────────────

/**
 * Build a trimmed history array from current store messages.
 * Only includes the last 10 turns to keep prompt size reasonable.
 */
export function buildHistory(messages: ChatMessage[]) {
  return messages
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));
}

/**
 * Extract a user-friendly error message from an Axios error or unknown thrown value.
 */
export function getApiErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
  if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
  if (axiosErr.response?.data?.error) return axiosErr.response.data.error;
  if (axiosErr.message) return axiosErr.message;
  return 'An unexpected error occurred.';
}
