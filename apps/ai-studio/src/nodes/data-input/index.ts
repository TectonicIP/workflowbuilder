import { NodeType, type PaletteItem } from '@workflowbuilder/sdk';

import { defaultPropertiesData } from './default-properties-data';
import { type DataInputSchema, schema } from './schema';
import { uischema } from './uischema';

export const dataInputNodeType = 'ai-studio/data-input';

export const dataInputPaletteItem: PaletteItem<DataInputSchema> = {
  label: 'Data input',
  description: 'Paste a payload and name its format',
  type: dataInputNodeType,
  icon: 'Database',
  templateType: NodeType.Node,
  defaultPropertiesData,
  schema,
  uischema,
  outputSchema: {
    type: 'default',
    properties: {
      text: { type: 'string', label: 'Text', description: 'The payload, trimmed' },
      format: { type: 'string', label: 'Format', description: 'text, json, or csv' },
    },
  },
};
