import { NodeType, type PaletteItem } from '@workflowbuilder/sdk';

import { defaultPropertiesData } from './default-properties-data';
import { type AssumptionRegisterSchema, schema } from './schema';
import { uischema } from './uischema';

export const assumptionRegisterNodeType = 'ai-studio/assumption-register';

export const assumptionRegisterPaletteItem: PaletteItem<AssumptionRegisterSchema> = {
  label: 'Assumption register',
  description: 'Assumptions, how critical each is, and how it would be false',
  type: assumptionRegisterNodeType,
  icon: 'ChatCircleDots',
  templateType: NodeType.Node,
  defaultPropertiesData,
  schema,
  uischema,
  outputSchema: {
    type: 'default',
    properties: {
      assumptionsText: {
        type: 'string',
        label: 'Assumptions',
        description: 'Assumptions, one per line, as criticality | statement | falsifier',
      },
      assumptions: { type: 'array', label: 'Parsed assumptions', description: 'Criticality, statement, and falsifier' },
    },
  },
};
