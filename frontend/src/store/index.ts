import { create } from 'zustand';

// ─── Domain types ─────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}

export interface RouteNode {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number;
  type: string;
}

export interface RouteData {
  path: string[];
  nodes: RouteNode[];
  instructions: string[];
  estimatedMinutes: number;
  accessible: boolean;
  crowdAdjusted?: boolean;
  totalSteps?: number;
}

export interface SectionCrowd {
  sectionId: string;
  sectionName: string;
  density: number;
  level: 'low' | 'moderate' | 'high' | 'very_high';
  estimatedWaitMinutes: number;
  recommendAlternate: boolean;
}

export interface CrowdData {
  phase: string;
  timestamp?: string;
  overallDensity: number;
  sections: SectionCrowd[];
  hotspots: string[];
}

// ─── Store shape ──────────────────────────────────────────────────────────

interface AppState {
  // Chat
  messages: ChatMessage[];
  isLoading: boolean;
  accessibleMode: boolean;

  // Map
  currentRoute: RouteData | null;

  // Crowd
  crowdData: CrowdData | null;

  // Actions
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (v: boolean) => void;
  setAccessibleMode: (v: boolean) => void;
  setCurrentRoute: (r: RouteData | null) => void;
  setCrowdData: (c: CrowdData | null) => void;
  clearRoute: () => void;
  clearMessages: () => void;
}

// Auto-incrementing ID — simple and avoids external dependency for non-critical IDs
let msgId = 0;

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  isLoading: false,
  accessibleMode: false,
  currentRoute: null,
  crowdData: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: String(++msgId), timestamp: new Date() },
      ],
    })),

  setLoading: (v) => set({ isLoading: v }),
  setAccessibleMode: (v) => set({ accessibleMode: v }),
  setCurrentRoute: (r) => set({ currentRoute: r }),
  setCrowdData: (c) => set({ crowdData: c }),
  clearRoute: () => set({ currentRoute: null }),
  clearMessages: () => set({ messages: [], currentRoute: null }),
}));
