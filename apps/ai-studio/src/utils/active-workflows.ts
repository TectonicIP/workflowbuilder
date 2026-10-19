import type { WorkflowBuilderEdge, WorkflowBuilderNode } from '@workflowbuilder/sdk';

export type RunnableWorkflow = {
  startNodeId: string;
  nodes: WorkflowBuilderNode[];
  edges: WorkflowBuilderEdge[];
  triggerPayload: Record<string, unknown>;
};

function isStart(node: WorkflowBuilderNode) {
  return node.data.isStartNode === true;
}

// A Start saved before the switch existed has no `active` and still runs.
function isActive(node: WorkflowBuilderNode) {
  return (node.data.properties as { active?: boolean }).active !== false;
}

function triggerPayloadOf(node: WorkflowBuilderNode): Record<string, unknown> {
  const inputPrompt = (node.data.properties as { inputPrompt?: string }).inputPrompt ?? '';

  return inputPrompt ? { input: inputPrompt } : {};
}

function downstreamOf(start: WorkflowBuilderNode, nodes: WorkflowBuilderNode[], edges: WorkflowBuilderEdge[]) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const included = new Set<string>([start.id]);
  const queue = [start.id];
  let sourceId = queue.shift();

  while (sourceId !== undefined) {
    for (const edge of edges) {
      if (edge.source !== sourceId || included.has(edge.target)) continue;

      const target = byId.get(edge.target);
      // Another Start is its own workflow, even if an edge points at it.
      if (!target || isStart(target)) continue;

      included.add(target.id);
      queue.push(target.id);
    }

    sourceId = queue.shift();
  }

  return {
    startNodeId: start.id,
    nodes: nodes.filter((node) => included.has(node.id)),
    edges: edges.filter((edge) => included.has(edge.source) && included.has(edge.target)),
    triggerPayload: triggerPayloadOf(start),
  };
}

/** Active Start nodes, optionally limited to workflows that contain a selected node. */
export function runnableWorkflows(
  nodes: WorkflowBuilderNode[],
  edges: WorkflowBuilderEdge[],
  selectedNodeIds: readonly string[],
): RunnableWorkflow[] {
  const workflows = nodes
    .filter((node) => isStart(node) && isActive(node))
    .map((start) => downstreamOf(start, nodes, edges));

  if (selectedNodeIds.length === 0) return workflows;

  const selected = new Set(selectedNodeIds);

  return workflows.filter((workflow) => workflow.nodes.some((node) => selected.has(node.id)));
}
