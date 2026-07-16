import graphData from '../data/graph.json';

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number;
  type: string;
  accessibleOnly?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  accessible: boolean;
}

export interface RouteResult {
  path: string[];
  nodes: GraphNode[];
  totalSteps: number;
  accessible: boolean;
  crowdAdjusted: boolean;
  instructions: string[];
  estimatedMinutes: number;
}

type CrowdMap = Map<string, number>;

/**
 * Binary min-heap priority queue — O(log n) enqueue and dequeue
 * vs the previous O(n log n) array sort approach.
 * Critical for A* performance on large graphs.
 */
class PriorityQueue<T> {
  private heap: { priority: number; item: T }[] = [];

  private parent(i: number): number { return (i - 1) >> 1; }
  private left(i: number): number   { return 2 * i + 1; }
  private right(i: number): number  { return 2 * i + 2; }

  private swap(i: number, j: number): void {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const p = this.parent(i);
      if (this.heap[p].priority <= this.heap[i].priority) break;
      this.swap(p, i);
      i = p;
    }
  }

  private siftDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = this.left(i);
      const r = this.right(i);
      if (l < n && this.heap[l].priority < this.heap[smallest].priority) smallest = l;
      if (r < n && this.heap[r].priority < this.heap[smallest].priority) smallest = r;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  enqueue(item: T, priority: number): void {
    this.heap.push({ priority, item });
    this.siftUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0].item;
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  get isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

export class RoutingEngine {
  private nodes: Map<string, GraphNode>;
  private adjacency: Map<string, { to: string; weight: number; accessible: boolean }[]>;

  constructor() {
    this.nodes = new Map();
    this.adjacency = new Map();
    this.buildGraph();
  }

  private buildGraph() {
    for (const node of graphData.nodes as GraphNode[]) {
      this.nodes.set(node.id, node);
      if (!this.adjacency.has(node.id)) {
        this.adjacency.set(node.id, []);
      }
    }

    for (const edge of graphData.edges as GraphEdge[]) {
      const fromEdges = this.adjacency.get(edge.from) ?? [];
      fromEdges.push({ to: edge.to, weight: edge.weight, accessible: edge.accessible });
      this.adjacency.set(edge.from, fromEdges);

      // Bidirectional
      const toEdges = this.adjacency.get(edge.to) ?? [];
      toEdges.push({ to: edge.from, weight: edge.weight, accessible: edge.accessible });
      this.adjacency.set(edge.to, toEdges);
    }
  }

  private heuristic(a: GraphNode, b: GraphNode): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / 10;
  }

  findRoute(
    fromId: string,
    toId: string,
    accessibleOnly: boolean = false,
    crowdMap?: CrowdMap
  ): RouteResult | null {
    const start = this.nodes.get(fromId);
    const end = this.nodes.get(toId);
    if (!start || !end) return null;

    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const pq = new PriorityQueue<string>();

    for (const id of this.nodes.keys()) {
      dist.set(id, Infinity);
      prev.set(id, null);
    }
    dist.set(fromId, 0);
    pq.enqueue(fromId, 0);

    while (!pq.isEmpty) {
      const current = pq.dequeue()!;
      if (current === toId) break;

      const neighbors = this.adjacency.get(current) ?? [];
      for (const edge of neighbors) {
        if (accessibleOnly && !edge.accessible) continue;

        const neighbor = this.nodes.get(edge.to);
        if (!neighbor) continue;

        // Crowd-weighted cost: crowded nodes cost more
        const crowdPenalty = crowdMap ? (crowdMap.get(edge.to) ?? 0) * 0.5 : 0;
        const newDist = (dist.get(current) ?? Infinity) + edge.weight + crowdPenalty;

        if (newDist < (dist.get(edge.to) ?? Infinity)) {
          dist.set(edge.to, newDist);
          prev.set(edge.to, current);
          pq.enqueue(edge.to, newDist + this.heuristic(neighbor, end));
        }
      }
    }

    if (dist.get(toId) === Infinity) return null;

    // Reconstruct path
    const path: string[] = [];
    let cur: string | null | undefined = toId;
    while (cur != null) {
      path.unshift(cur);
      cur = prev.get(cur);
    }

    const pathNodes = path.map(id => this.nodes.get(id)!);
    const instructions = this.generateInstructions(pathNodes);
    // Use actual accumulated weight for time estimate (~1 weight unit = 30 seconds walking)
    const actualDist = dist.get(toId) ?? path.length * 3;
    const estimatedMinutes = Math.max(1, Math.round(actualDist / 6));

    return {
      path,
      nodes: pathNodes,
      totalSteps: path.length,
      accessible: accessibleOnly,
      crowdAdjusted: !!crowdMap,
      instructions,
      estimatedMinutes,
    };
  }

  private generateInstructions(nodes: GraphNode[]): string[] {
    const instructions: string[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const current = nodes[i];
      const next = nodes[i + 1];

      if (current.type === 'gate') {
        instructions.push(`Enter through ${current.label} and proceed to the concourse`);
      } else if (next.type === 'elevator') {
        instructions.push(`Head to ${next.label} for level access`);
      } else if (current.type === 'elevator') {
        instructions.push(`Take ${current.label} to Level ${next.level}`);
      } else if (next.type === 'section') {
        instructions.push(`Continue along the concourse to reach ${next.label}`);
      } else if (next.type === 'gate') {
        instructions.push(`Proceed to ${next.label} exit`);
      } else {
        instructions.push(`Follow signs toward ${next.label}`);
      }
    }
    if (nodes.length > 0) {
      instructions.push(`You have arrived at ${nodes[nodes.length - 1].label}`);
    }
    return instructions;
  }

  resolveNodeId(name: string): string | null {
    const normalized = name.trim().toUpperCase();

    // Direct match
    if (this.nodes.has(normalized)) return normalized;

    // Gate alias e.g. "Gate A" -> GATE-A
    const gateMatch = normalized.match(/^GATE[\s-]?([A-F])$/);
    if (gateMatch) {
      const id = `GATE-${gateMatch[1]}`;
      if (this.nodes.has(id)) return id;
    }

    // Section alias e.g. "Section 100" -> SEC-100
    const sectionMatch = normalized.match(/^(?:SECTION[\s-]?)?(\d{3})$/);
    if (sectionMatch) {
      const id = `SEC-${sectionMatch[1]}`;
      if (this.nodes.has(id)) return id;
    }

    // Fuzzy label match
    for (const [id, node] of this.nodes.entries()) {
      if (node.label.toUpperCase().includes(normalized)) return id;
    }

    return null;
  }

  getAllNodeIds(): string[] {
    return Array.from(this.nodes.keys());
  }
}

export const routingEngine = new RoutingEngine();
