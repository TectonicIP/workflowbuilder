import { describe, expect, it } from 'vitest';

import { assumptionRegisterNodeType } from '../nodes/assumption-register';
import { centerOfGravityNodeType } from '../nodes/center-of-gravity';
import { constraintRegisterNodeType } from '../nodes/constraint-register';
import { missionStatementNodeType } from '../nodes/mission-statement';
import { situationNodeType } from '../nodes/situation';
import { aiStudioTemplates } from './ai-studio-templates';
import { frameTheProblemFlow } from './frame-the-problem-flow';

const { nodes, edges } = frameTheProblemFlow.value.diagram;

describe('frameTheProblemFlow', () => {
  it('is registered once among the AI Studio templates, under an id no other template uses', () => {
    const ids = aiStudioTemplates.map((template) => template.id);

    expect(aiStudioTemplates.filter((template) => template === frameTheProblemFlow)).toHaveLength(1);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('starts at Situation and walks mission, constraints, assumptions, and center of gravity', () => {
    const chain = [
      situationNodeType,
      missionStatementNodeType,
      constraintRegisterNodeType,
      assumptionRegisterNodeType,
      centerOfGravityNodeType,
    ];

    expect(nodes.map((node) => node.data.type)).toEqual(chain);
    expect(nodes.filter((node) => node.data.isStartNode).map((node) => node.data.type)).toEqual([situationNodeType]);
    expect(edges.map((edge) => [edge.source, edge.target])).toEqual([
      ['situation-1', 'mission-1'],
      ['mission-1', 'constraints-1'],
      ['constraints-1', 'assumptions-1'],
      ['assumptions-1', 'cog-1'],
    ]);
  });
});
