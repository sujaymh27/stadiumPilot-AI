import { GoogleGenerativeAI, type Content, type FunctionDeclaration } from '@google/generative-ai';
import { TOOL_DECLARATIONS } from './tools';
import { SYSTEM_PROMPT } from './systemPrompt';
import { dispatchTool, type ToolName } from '../tools/handlers';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIQueryRequest {
  message: string;
  history?: ChatMessage[];
  accessible?: boolean;
}

export interface AIQueryResponse {
  reply: string;
  toolsUsed: string[];
  routeData?: unknown;
  crowdData?: unknown;
}

// ─── Provider Abstraction ──────────────────────────────────────────────────

interface AIProvider {
  query(req: AIQueryRequest): Promise<AIQueryResponse>;
}

// ─── Mock Provider (dev/test without API key) ─────────────────────────────

class MockAIProvider implements AIProvider {
  async query(req: AIQueryRequest): Promise<AIQueryResponse> {
    const msg = req.message.toLowerCase();

    if (msg.includes('route') || msg.includes('get to') || msg.includes('navigate')) {
      return {
        reply:
          'I can help you navigate the stadium. Please tell me your current location and destination, and I will find the best route for you.',
        toolsUsed: [],
      };
    }

    if (msg.includes('crowd') || msg.includes('busy')) {
      return {
        reply:
          'Crowd status: The south concourse is currently at moderate density. The north concourse is the least crowded option right now.',
        toolsUsed: ['get_crowd_status'],
      };
    }

    if (msg.includes('food') || msg.includes('eat')) {
      return {
        reply: 'The nearest food option from your section is Blue Plate Grill near Section 101, open 2 hours before kickoff.',
        toolsUsed: ['find_nearest_amenity'],
      };
    }

    return {
      reply:
        'Welcome to MetLife Stadium. I can help with directions, crowd updates, amenities, transport, and accessibility. What do you need?',
      toolsUsed: [],
    };
  }
}

// ─── Gemini Provider ──────────────────────────────────────────────────────

class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  /** Cached model instance — re-used across all queries to avoid re-init overhead */
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: TOOL_DECLARATIONS as unknown as FunctionDeclaration[] }],
    });
  }

  async query(req: AIQueryRequest): Promise<AIQueryResponse> {
    // Cap history to last 20 turns to avoid token limits
    const cappedHistory = (req.history ?? []).slice(-20);

    // Build history in Gemini Content format
    const history: Content[] = cappedHistory.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    }));

    const chat = this.model.startChat({ history });

    const toolsUsed: string[] = [];
    let routeData: unknown;
    let crowdData: unknown;

    // First turn
    let result = await chat.sendMessage(req.message);
    let response = result.response;

    // Agentic loop: handle function calls
    while (response.functionCalls()?.length) {
      const calls = response.functionCalls()!;
      const functionResponses = [];

      for (const call of calls) {
        const toolName = call.name as ToolName;
        toolsUsed.push(toolName);

        // Inject accessibility flag if user toggled it
        const args =
          toolName === 'find_route' && req.accessible
            ? { ...(call.args as object), accessible: true }
            : call.args;

        const toolResult = dispatchTool(toolName, args);
        console.log(`[AI] Tool call: ${toolName} => ${toolResult.success ? 'ok' : `error: ${toolResult.error}`}`);

        // Capture structured data for frontend
        if (toolName === 'find_route' && toolResult.success) routeData = toolResult.data;
        if (toolName === 'get_crowd_status' && toolResult.success) crowdData = toolResult.data;

        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: toolResult.success
              ? { result: toolResult.data }
              : { error: toolResult.error },
          },
        });
      }

      // Send tool results back
      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }

    const reply = response.text();
    if (!reply) throw new Error('Gemini returned an empty response');

    return { reply, toolsUsed, routeData, crowdData };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'mock';
  const apiKey = process.env.GEMINI_API_KEY;

  if (provider === 'gemini' && apiKey) {
    return new GeminiProvider(apiKey);
  }

  console.warn('[AI] Using MockAIProvider — set AI_PROVIDER=gemini and GEMINI_API_KEY to enable Gemini');
  return new MockAIProvider();
}

export const aiProvider = createAIProvider();
