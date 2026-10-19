import { describe, expect, it } from 'vitest';

import { PermanentNodeExecutionError } from '@workflow-builder/execution-core';

import type {
  AssumptionRegisterNode,
  CenterOfGravityNode,
  ConstraintRegisterNode,
  MissionStatementNode,
  SituationNode,
} from '../domain/ai-studio-nodes';
import { executeAssumptionRegister } from './assumption-register';
import { executeCenterOfGravity } from './center-of-gravity';
import { executeConstraintRegister } from './constraint-register';
import { executeMissionStatement } from './mission-statement';
import { executeSituation } from './situation';

function expectPermanent(run: () => unknown, code: string) {
  expect(run).toThrow(PermanentNodeExecutionError);
  expect(run).toThrow(expect.objectContaining({ code }));
}

describe('executeSituation', () => {
  const node: SituationNode = {
    id: 'situation-1',
    type: 'ai-studio/situation',
    config: {
      friendlyDisposition: ' Holds the crossings ',
      adversarySituation: ' Defends the far bank ',
      terrain: ' River line ',
      timeWindow: ' 24 hours ',
    },
  };

  it('returns the trimmed situation', () => {
    expect(executeSituation(node).output).toEqual({
      friendlyDisposition: 'Holds the crossings',
      adversarySituation: 'Defends the far bank',
      terrain: 'River line',
      timeWindow: '24 hours',
    });
  });

  it('throws situation_incomplete when a required field is blank', () => {
    expectPermanent(
      () => executeSituation({ ...node, config: { ...node.config, friendlyDisposition: '  ' } }),
      'situation_incomplete',
    );
  });
});

describe('executeMissionStatement', () => {
  const node: MissionStatementNode = {
    id: 'mission-1',
    type: 'ai-studio/mission-statement',
    config: { task: 'Seize the crossings', purpose: 'Pass the follow-on force', endState: 'Crossings held' },
  };

  it('returns task, purpose, and end state', () => {
    expect(Object.keys(executeMissionStatement(node).output)).toEqual(['task', 'purpose', 'endState']);
    expect(executeMissionStatement(node).output).toEqual(node.config);
  });

  it('throws mission_incomplete when a required field is missing', () => {
    expectPermanent(() => executeMissionStatement({ ...node, config: { task: 'Seize' } }), 'mission_incomplete');
  });
});

describe('executeConstraintRegister', () => {
  const node: ConstraintRegisterNode = {
    id: 'constraints-1',
    type: 'ai-studio/constraint-register',
    config: { constraints: 'hard | Stay inside the boundary\nsoft | Limit built-up areas\nStay off the road' },
  };

  it('returns joined lines and arrays', () => {
    expect(executeConstraintRegister(node).output).toEqual({
      hardConstraints: 'Stay inside the boundary\nStay off the road',
      softConstraints: 'Limit built-up areas',
      hard: ['Stay inside the boundary', 'Stay off the road'],
      soft: ['Limit built-up areas'],
    });
  });

  it('throws constraints_incomplete when no line is hard', () => {
    expectPermanent(
      () => executeConstraintRegister({ ...node, config: { constraints: 'soft | Limit built-up areas' } }),
      'constraints_incomplete',
    );
  });
});

describe('executeAssumptionRegister', () => {
  const node: AssumptionRegisterNode = {
    id: 'assumptions-1',
    type: 'ai-studio/assumption-register',
    config: {
      assumptions: 'high | The far bank is defended | The far bank is unoccupied\nThe bridges remain intact',
    },
  };

  it('returns the text form and the parsed assumptions', () => {
    expect(executeAssumptionRegister(node).output).toEqual({
      assumptionsText:
        'high | The far bank is defended | The far bank is unoccupied\nmedium | The bridges remain intact',
      assumptions: [
        { criticality: 'high', statement: 'The far bank is defended', falsifier: 'The far bank is unoccupied' },
        { criticality: 'medium', statement: 'The bridges remain intact', falsifier: '' },
      ],
    });
  });

  it('throws assumptions_incomplete when every line is blank', () => {
    expectPermanent(
      () => executeAssumptionRegister({ ...node, config: { assumptions: '\n  \n' } }),
      'assumptions_incomplete',
    );
  });
});

describe('executeCenterOfGravity', () => {
  const node: CenterOfGravityNode = {
    id: 'cog-1',
    type: 'ai-studio/center-of-gravity',
    config: {
      friendlyCapability: 'Hold a reserve',
      friendlyRequirement: 'The reserve stays uncommitted',
      friendlyVulnerability: 'Committing the reserve early',
      adversaryCapability: 'Deny the crossings',
      adversaryRequirement: 'Observation of the crossings',
      adversaryVulnerability: 'Loss of observation',
    },
  };

  it('returns both sides', () => {
    expect(Object.keys(executeCenterOfGravity(node).output)).toEqual([
      'friendlyCapability',
      'friendlyRequirement',
      'friendlyVulnerability',
      'adversaryCapability',
      'adversaryRequirement',
      'adversaryVulnerability',
    ]);
    expect(executeCenterOfGravity(node).output).toEqual(node.config);
  });

  it('throws center_of_gravity_incomplete when a side is incomplete', () => {
    expectPermanent(
      () => executeCenterOfGravity({ ...node, config: { ...node.config, adversaryVulnerability: '' } }),
      'center_of_gravity_incomplete',
    );
  });
});
