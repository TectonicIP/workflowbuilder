import type { IntegrationDataFormat, WorkflowBuilderEdge, WorkflowBuilderNode } from '@workflowbuilder/sdk';

const NODE_GAP = 160;

export type CanvasGraph = Pick<IntegrationDataFormat, 'nodes' | 'edges' | 'globalVariables'>;

type MergeResult = { ok: true; canvas: CanvasGraph } | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nodeRight(node: WorkflowBuilderNode) {
  return node.position.x + (node.measured?.width ?? node.width ?? 0);
}

function offsetX(current: WorkflowBuilderNode[], imported: WorkflowBuilderNode[]) {
  if (current.length === 0 || imported.length === 0) return 0;

  const maxRight = Math.max(...current.map(nodeRight));
  const minLeft = Math.min(...imported.map((node) => node.position.x));

  return maxRight + NODE_GAP - minLeft;
}

function asNodes(value: unknown): WorkflowBuilderNode[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const nodes: WorkflowBuilderNode[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || typeof entry['id'] !== 'string' || !isRecord(entry['position'])) return undefined;
    if (typeof entry['position']['x'] !== 'number' || typeof entry['position']['y'] !== 'number') return undefined;
    nodes.push(entry as unknown as WorkflowBuilderNode);
  }

  return nodes;
}

function asEdges(value: unknown): WorkflowBuilderEdge[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const edges: WorkflowBuilderEdge[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || typeof entry['id'] !== 'string') return undefined;
    if (typeof entry['source'] !== 'string' || typeof entry['target'] !== 'string') return undefined;
    edges.push(entry as unknown as WorkflowBuilderEdge);
  }

  return edges;
}

function mergedVariables(current: CanvasGraph['globalVariables'], imported: unknown): CanvasGraph['globalVariables'] {
  if (!isRecord(imported)) return current;

  const next = { ...current };
  for (const [key, value] of Object.entries(imported)) {
    if (next[key] === undefined && isRecord(value)) {
      next[key] = value as CanvasGraph['globalVariables'][string];
    }
  }

  return next;
}

/** Place a workflow JSON to the right of the canvas. Existing nodes stay, and every imported id is new. */
export function mergeWorkflowOntoCanvas(current: CanvasGraph, raw: string, newId: () => string): MergeResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, message: 'That is not valid JSON.' };
  }

  if (!isRecord(parsed)) return { ok: false, message: 'A workflow needs nodes and edges.' };

  const importedNodes = asNodes(parsed['nodes']);
  const importedEdges = asEdges(parsed['edges']);
  if (!importedNodes || !importedEdges) return { ok: false, message: 'A workflow needs nodes and edges.' };
  if (importedNodes.length === 0) return { ok: false, message: 'That workflow has no nodes.' };

  const nodeIds = new Map<string, string>();
  for (const node of importedNodes) {
    if (nodeIds.has(node.id)) return { ok: false, message: 'That workflow repeats a node id.' };
    nodeIds.set(node.id, newId());
  }

  const edgeIds = new Set<string>();
  for (const edge of importedEdges) {
    if (edgeIds.has(edge.id)) return { ok: false, message: 'That workflow repeats an edge id.' };
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      return { ok: false, message: 'An edge points at a node that is not in the workflow.' };
    }
    edgeIds.add(edge.id);
  }

  const dx = offsetX(current.nodes, importedNodes);
  const nodes = importedNodes.map((node) => ({
    ...node,
    id: nodeIds.get(node.id) ?? node.id,
    selected: false,
    position: { x: node.position.x + dx, y: node.position.y },
  }));
  const edges = importedEdges.map((edge) => ({
    ...edge,
    id: newId(),
    source: nodeIds.get(edge.source) ?? edge.source,
    target: nodeIds.get(edge.target) ?? edge.target,
    selected: false,
  }));

  return {
    ok: true,
    canvas: {
      nodes: [...current.nodes, ...nodes],
      edges: [...current.edges, ...edges],
      globalVariables: mergedVariables(current.globalVariables, parsed['globalVariables']),
    },
  };
}
