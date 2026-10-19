import type { DiagramModel, TemplateModel } from '@workflowbuilder/sdk';

import { assumptionRegisterNodeType } from '../nodes/assumption-register';
import { centerOfGravityNodeType } from '../nodes/center-of-gravity';
import { constraintRegisterNodeType } from '../nodes/constraint-register';
import { missionStatementNodeType } from '../nodes/mission-statement';
import { situationNodeType } from '../nodes/situation';

const diagram: DiagramModel = {
  name: 'Frame the Problem',
  diagram: {
    nodes: [
      {
        id: 'situation-1',
        type: 'node',
        position: { x: 0, y: 300 },
        data: {
          segments: [],
          isStartNode: true,
          properties: {
            label: 'Situation',
            description: 'The facts the course of action is framed against.',
            friendlyDisposition: 'A reinforced battalion holds two river crossings and keeps a reserve uncommitted.',
            adversarySituation: 'A defending force occupies the far bank and can counterattack either crossing.',
            terrain: 'A river line with two bridges and limited fords.',
            timeWindow: 'The first 24 hours after receipt of the order.',
          },
          type: situationNodeType,
          icon: 'MagnifyingGlass',
        },
        selected: false,
      },
      {
        id: 'mission-1',
        type: 'node',
        position: { x: 380, y: 300 },
        data: {
          segments: [],
          properties: {
            label: 'Mission statement',
            description: 'Task, purpose, and end state.',
            task: 'Seize and hold the far-bank crossings.',
            purpose: 'Pass the follow-on force.',
            endState: 'Both crossings are held and the reserve is still available.',
          },
          type: missionStatementNodeType,
          icon: 'ListChecks',
        },
        selected: false,
      },
      {
        id: 'constraints-1',
        type: 'node',
        position: { x: 760, y: 300 },
        data: {
          segments: [],
          properties: {
            label: 'Constraint register',
            description: 'One constraint per line: hard | … or soft | …',
            constraints: 'hard | Stay inside the assigned boundary\nsoft | Limit movement through built-up areas',
          },
          type: constraintRegisterNodeType,
          icon: 'Faders',
        },
        selected: false,
      },
      {
        id: 'assumptions-1',
        type: 'node',
        position: { x: 1140, y: 300 },
        data: {
          segments: [],
          properties: {
            label: 'Assumption register',
            description: 'One assumption per line: criticality | statement | how it would be false.',
            assumptions:
              'high | The far bank is defended | The far bank is unoccupied\nmedium | The bridges remain intact | A bridge is dropped before the crossing',
          },
          type: assumptionRegisterNodeType,
          icon: 'ChatCircleDots',
        },
        selected: false,
      },
      {
        id: 'cog-1',
        type: 'node',
        position: { x: 1520, y: 300 },
        data: {
          segments: [],
          properties: {
            label: 'Center of gravity',
            description: 'Critical capability, requirement, and vulnerability for both sides.',
            friendlyCapability: 'Hold a reserve that can reinforce either crossing.',
            friendlyRequirement: 'The reserve stays uncommitted until a decision point.',
            friendlyVulnerability: 'Committing the reserve before the decision point.',
            adversaryCapability: 'Deny use of the crossings.',
            adversaryRequirement: 'Observation of both crossing sites.',
            adversaryVulnerability: 'Loss of observation of a crossing site.',
          },
          type: centerOfGravityNodeType,
          icon: 'TreeStructure',
        },
        selected: false,
      },
    ],
    edges: [
      {
        source: 'situation-1',
        sourceHandle: 'source',
        target: 'mission-1',
        targetHandle: 'target',
        type: 'labelEdge',
        id: 'edge-situation-mission',
        data: {},
      },
      {
        source: 'mission-1',
        sourceHandle: 'source',
        target: 'constraints-1',
        targetHandle: 'target',
        type: 'labelEdge',
        id: 'edge-mission-constraints',
        data: {},
      },
      {
        source: 'constraints-1',
        sourceHandle: 'source',
        target: 'assumptions-1',
        targetHandle: 'target',
        type: 'labelEdge',
        id: 'edge-constraints-assumptions',
        data: {},
      },
      {
        source: 'assumptions-1',
        sourceHandle: 'source',
        target: 'cog-1',
        targetHandle: 'target',
        type: 'labelEdge',
        id: 'edge-assumptions-cog',
        data: {},
      },
    ],
    viewport: { x: 40, y: 150, zoom: 0.7 },
  },
  layoutDirection: 'RIGHT',
};

export const frameTheProblemFlow: TemplateModel = {
  id: 307,
  name: 'Frame the Problem',
  value: diagram,
  icon: 'ListChecks',
};
