import { NodeType, type PaletteItem } from '@workflowbuilder/sdk';

import { defaultPropertiesData } from './default-properties-data';
import { type SituationSchema, schema } from './schema';
import { uischema } from './uischema';

export const situationNodeType = 'ai-studio/situation';

export const situationPaletteItem: PaletteItem<SituationSchema> = {
  label: 'Situation',
  description: 'Friendly and adversary situation, terrain, and time',
  type: situationNodeType,
  icon: 'MagnifyingGlass',
  templateType: NodeType.Node,
  isStartNode: true,
  defaultPropertiesData,
  schema,
  uischema,
  outputSchema: {
    type: 'default',
    properties: {
      friendlyDisposition: { type: 'string', label: 'Friendly disposition' },
      adversarySituation: { type: 'string', label: 'Adversary situation' },
      terrain: { type: 'string', label: 'Terrain' },
      timeWindow: { type: 'string', label: 'Time' },
    },
  },
};
