import type { WorkflowBuilderEdge, WorkflowBuilderNode } from '@workflowbuilder/sdk';
import { describe, expect, it } from 'vitest';

import { runnableWorkflows } from './active-workflows';

function node(id: string, data: WorkflowBuilderNode['data'], x = 0): WorkflowBuilderNode {
  return { id, position: { x, y: 0 }, data };
}

function start(id: string, active?: boolean, prompt = ''): WorkflowBuilderNode {
  return node(id, {
    isStartNode: true,
    type: 'ai-studio/trigger',
    icon: 'Lightning',
    properties: { label: id, inputPrompt: prompt, ...(active === undefined ? {} : { active }) },
  });
}

function step(id: string): WorkflowBuilderNode {
  return node(id, { type: 'ai-studio/ai-agent', icon: 'Lightning', properties: { label: id } });
}

function edge(id: string, source: string, target: string): WorkflowBuilderEdge {
  return { id, source, target };
}

describe('runnableWorkflows', () => {
  it('treats a Start with no active flag as active, and reads its prompt', () => {
    const [workflow] = runnableWorkflows([start('s', undefined, 'hello'), step('a')], [edge('e', 's', 'a')], []);

    expect(workflow?.startNodeId).toBe('s');
    expect(workflow?.nodes.map((item) => item.id)).toEqual(['s', 'a']);
    expect(workflow?.edges.map((item) => item.id)).toEqual(['e']);
    expect(workflow?.triggerPayload).toEqual({ input: 'hello' });
  });

  it('skips a Start switched off, and keeps each Start out of the other graph', () => {
    const nodes = [start('on', true), start('off', false), step('after-on'), step('after-off')];
    const edges = [edge('e1', 'on', 'after-on'), edge('e2', 'off', 'after-off'), edge('e3', 'on', 'off')];

    const workflows = runnableWorkflows(nodes, edges, []);

    expect(workflows.map((workflow) => workflow.startNodeId)).toEqual(['on']);
    expect(workflows[0]?.nodes.map((item) => item.id)).toEqual(['on', 'after-on']);
    expect(workflows[0]?.edges.map((item) => item.id)).toEqual(['e1']);
  });

  it('runs every active Start when nothing is selected, and only the selected ones otherwise', () => {
    const nodes = [start('a', true), start('b', true), step('from-a')];
    const edges = [edge('e', 'a', 'from-a')];

    expect(runnableWorkflows(nodes, edges, []).map((workflow) => workflow.startNodeId)).toEqual(['a', 'b']);
    expect(runnableWorkflows(nodes, edges, ['from-a']).map((workflow) => workflow.startNodeId)).toEqual(['a']);
    expect(runnableWorkflows(nodes, edges, ['missing'])).toEqual([]);
  });
});
