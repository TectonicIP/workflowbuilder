import { NodeType, type PaletteItem } from '@workflowbuilder/sdk';

import { defaultPropertiesData } from './default-properties-data';
import { type ConstraintRegisterSchema, schema } from './schema';
import { uischema } from './uischema';

export const constraintRegisterNodeType = 'ai-studio/constraint-register';

export const constraintRegisterPaletteItem: PaletteItem<ConstraintRegisterSchema> = {
  label: 'Constraint register',
  description: 'Hard and soft constraints the course of action may not violate',
  type: constraintRegisterNodeType,
  icon: 'Faders',
  templateType: NodeType.Node,
  defaultPropertiesData,
  schema,
  uischema,
  outputSchema: {
    type: 'default',
    properties: {
      hardConstraints: { type: 'string', label: 'Hard constraints', description: 'Hard constraints, one per line' },
      softConstraints: { type: 'string', label: 'Soft constraints', description: 'Soft constraints, one per line' },
      hard: { type: 'array', label: 'Hard', description: 'Hard constraints' },
      soft: { type: 'array', label: 'Soft', description: 'Soft constraints' },
    },
  },
};
