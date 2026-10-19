import { NodeType, type PaletteItem } from '@workflowbuilder/sdk';

import { defaultPropertiesData } from './default-properties-data';
import { type MissionStatementSchema, schema } from './schema';
import { uischema } from './uischema';

export const missionStatementNodeType = 'ai-studio/mission-statement';

export const missionStatementPaletteItem: PaletteItem<MissionStatementSchema> = {
  label: 'Mission statement',
  description: 'Task, purpose, and end state the course of action must satisfy',
  type: missionStatementNodeType,
  icon: 'ListChecks',
  templateType: NodeType.Node,
  defaultPropertiesData,
  schema,
  uischema,
  outputSchema: {
    type: 'default',
    properties: {
      task: { type: 'string', label: 'Task' },
      purpose: { type: 'string', label: 'Purpose' },
      endState: { type: 'string', label: 'End state' },
    },
  },
};
