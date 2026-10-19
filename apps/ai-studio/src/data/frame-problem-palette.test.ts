import { describe, expect, it } from 'vitest';

import { assumptionRegisterNodeType, assumptionRegisterPaletteItem } from '../nodes/assumption-register';
import { centerOfGravityNodeType, centerOfGravityPaletteItem } from '../nodes/center-of-gravity';
import { constraintRegisterNodeType, constraintRegisterPaletteItem } from '../nodes/constraint-register';
import { missionStatementNodeType, missionStatementPaletteItem } from '../nodes/mission-statement';
import { situationNodeType, situationPaletteItem } from '../nodes/situation';
import { aiStudioNodeTypes } from './node-types';

const frameNodes = [
  {
    type: situationNodeType,
    item: situationPaletteItem,
    outputKeys: ['friendlyDisposition', 'adversarySituation', 'terrain', 'timeWindow'],
  },
  {
    type: missionStatementNodeType,
    item: missionStatementPaletteItem,
    outputKeys: ['task', 'purpose', 'endState'],
  },
  {
    type: constraintRegisterNodeType,
    item: constraintRegisterPaletteItem,
    outputKeys: ['hardConstraints', 'softConstraints', 'hard', 'soft'],
  },
  {
    type: assumptionRegisterNodeType,
    item: assumptionRegisterPaletteItem,
    outputKeys: ['assumptionsText', 'assumptions'],
  },
  {
    type: centerOfGravityNodeType,
    item: centerOfGravityPaletteItem,
    outputKeys: [
      'friendlyCapability',
      'friendlyRequirement',
      'friendlyVulnerability',
      'adversaryCapability',
      'adversaryRequirement',
      'adversaryVulnerability',
    ],
  },
];

describe('COA palette', () => {
  const items = aiStudioNodeTypes.flatMap((entry) => ('groupItems' in entry ? entry.groupItems : [entry]));

  it('registers each framing node once, and only in the COA group', () => {
    const group = aiStudioNodeTypes.find((entry) => 'groupItems' in entry && entry.label === 'COA');

    expect(group && 'groupItems' in group ? group.groupItems : []).toEqual(frameNodes.map((node) => node.item));

    for (const node of frameNodes) {
      expect(items.filter((item) => item.type === node.type)).toEqual([node.item]);
    }
  });

  it('publishes the same output fields the executor returns', () => {
    for (const node of frameNodes) {
      expect(node.item.outputSchema?.type).toBe('default');
      const properties = node.item.outputSchema?.type === 'default' ? node.item.outputSchema.properties : {};
      expect(Object.keys(properties)).toEqual(node.outputKeys);
    }
  });
});

describe('palette groups', () => {
  it('lists COA, Utility, AI, and Analytics in that order', () => {
    const groups = aiStudioNodeTypes.filter((entry) => 'groupItems' in entry);

    expect(groups.map((group) => ('label' in group ? group.label : ''))).toEqual(['COA', 'Utility', 'AI', 'Analytics']);
    expect(groups.map((group) => ('groupItems' in group ? group.groupItems.map((item) => item.type) : []))).toEqual([
      [
        'ai-studio/situation',
        'ai-studio/mission-statement',
        'ai-studio/constraint-register',
        'ai-studio/assumption-register',
        'ai-studio/center-of-gravity',
      ],
      ['ai-studio/data-input', 'ai-studio/data-parse'],
      ['ai-studio/trigger', 'ai-studio/ai-agent'],
      ['ai-studio/decision', 'ai-studio/human-decision', 'ai-studio/visualize'],
    ]);
  });
});
