import type { WorkflowBuilderNode } from '@workflowbuilder/sdk';
import { describe, expect, it } from 'vitest';

import { mergeWorkflowOntoCanvas } from './merge-workflow';

function node(id: string, x: number, width?: number): WorkflowBuilderNode {
  return {
    id,
    position: { x, y: 10 },
    width,
    data: { type: 'ai-studio/trigger', icon: 'Lightning', properties: { label: id }, isStartNode: true },
  };
}

const empty = { nodes: [], edges: [], globalVariables: {} };

function ids() {
  let next = 0;

  return () => `id-${next++}`;
}

describe('mergeWorkflowOntoCanvas', () => {
  it('keeps the canvas and places the import to the right, with new ids', () => {
    const current = { ...empty, nodes: [node('kept', 100, 40)] };
    const raw = JSON.stringify({
      nodes: [node('imported', 0), { ...node('next', 80), data: { ...node('next', 80).data, isStartNode: false } }],
      edges: [{ id: 'edge-1', source: 'imported', target: 'next' }],
      globalVariables: {
        kept: { id: 'kept', name: 'Kept', type: 'string', defaultValue: 'old', description: '' },
        added: { id: 'added', name: 'Added', type: 'string', defaultValue: '', description: '' },
      },
    });
    const currentVariables = {
      kept: { id: 'kept', name: 'Kept', type: 'string' as const, defaultValue: 'mine', description: '' },
    };

    const merged = mergeWorkflowOntoCanvas({ ...current, globalVariables: currentVariables }, raw, ids());

    expect(merged.ok).toBe(true);
    if (!merged.ok) return;

    expect(merged.canvas.nodes.map((item) => item.id)).toEqual(['kept', 'id-0', 'id-1']);
    expect(merged.canvas.nodes[1]?.position.x).toBe(300);
    expect(merged.canvas.nodes[2]?.position.x).toBe(380);
    expect(merged.canvas.edges).toEqual([
      expect.objectContaining({ id: 'id-2', source: 'id-0', target: 'id-1', selected: false }),
    ]);
    expect(merged.canvas.globalVariables['kept']?.defaultValue).toBe('mine');
    expect(merged.canvas.globalVariables['added']?.name).toBe('Added');
  });

  it('leaves positions alone when the canvas is empty', () => {
    const merged = mergeWorkflowOntoCanvas(empty, JSON.stringify({ nodes: [node('only', 25)], edges: [] }), ids());

    expect(merged.ok && merged.canvas.nodes[0]?.position).toEqual({ x: 25, y: 10 });
  });

  it.each([
    ['not json', '{', 'That is not valid JSON.'],
    ['missing nodes', JSON.stringify({ edges: [] }), 'A workflow needs nodes and edges.'],
    ['no nodes', JSON.stringify({ nodes: [], edges: [] }), 'That workflow has no nodes.'],
    [
      'a repeated node id',
      JSON.stringify({ nodes: [node('same', 0), node('same', 10)], edges: [] }),
      'That workflow repeats a node id.',
    ],
    [
      'an edge to a missing node',
      JSON.stringify({ nodes: [node('only', 0)], edges: [{ id: 'e', source: 'only', target: 'gone' }] }),
      'An edge points at a node that is not in the workflow.',
    ],
  ])('refuses %s', (_name, raw, message) => {
    expect(mergeWorkflowOntoCanvas(empty, raw, ids())).toEqual({ ok: false, message });
  });
});
