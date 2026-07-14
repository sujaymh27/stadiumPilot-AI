import axios from 'axios';
import type { ChatMessage } from '../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

export interface AIQueryPayload {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  accessible?: boolean;
}

export interface AIQueryResponse {
  reply: string;
  toolsUsed: string[];
  routeData?: unknown;
  crowdData?: unknown;
}

export async function queryAI(payload: AIQueryPayload): Promise<AIQueryResponse> {
  const { data } = await api.post<AIQueryResponse>('/ai/query', payload);
  return data;
}

export async function fetchCrowd() {
  const { data } = await api.get('/crowd');
  return data;
}

export async function fetchAmenities(type?: string) {
  const { data } = await api.get('/stadium/amenities', { params: type ? { type } : {} });
  return data;
}

export async function fetchTransport() {
  const { data } = await api.get('/stadium/transport');
  return data;
}

export function buildHistory(messages: ChatMessage[]) {
  return messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
}
