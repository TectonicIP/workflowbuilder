import { NodeType, type PaletteItem } from '@workflowbuilder/sdk';

import { defaultPropertiesData } from './default-properties-data';
import { type CenterOfGravitySchema, schema } from './schema';
import { uischema } from './uischema';

export const centerOfGravityNodeType = 'ai-studio/center-of-gravity';

export const centerOfGravityPaletteItem: PaletteItem<CenterOfGravitySchema> = {
  label: 'Center of gravity',
  description: 'Friendly and adversary critical capability, requirement, and vulnerability',
  type: centerOfGravityNodeType,
  icon: 'TreeStructure',
  templateType: NodeType.Node,
  defaultPropertiesData,
  schema,
  uischema,
  outputSchema: {
    type: 'default',
    properties: {
      friendlyCapability: { type: 'string', label: 'Friendly capability' },
      friendlyRequirement: { type: 'string', label: 'Friendly requirement' },
      friendlyVulnerability: { type: 'string', label: 'Friendly vulnerability' },
      adversaryCapability: { type: 'string', label: 'Adversary capability' },
      adversaryRequirement: { type: 'string', label: 'Adversary requirement' },
      adversaryVulnerability: { type: 'string', label: 'Adversary vulnerability' },
    },
  },
};
