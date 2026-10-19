import { NodeType, type PaletteItem } from '@workflowbuilder/sdk';

import { defaultPropertiesData } from './default-properties-data';
import { type DataParseSchema, schema } from './schema';
import { uischema } from './uischema';

export const dataParseNodeType = 'ai-studio/data-parse';

export const dataParsePaletteItem: PaletteItem<DataParseSchema> = {
  label: 'Data parse',
  description: 'Split a payload into lines, CSV rows, or JSON',
  type: dataParseNodeType,
  icon: 'Code',
  templateType: NodeType.Node,
  defaultPropertiesData,
  schema,
  uischema,
  outputSchema: {
    type: 'variant',
    variants: {
      lines: {
        variantRule: { dataPropertyName: 'format', dataPropertyValue: 'lines' },
        properties: {
          lines: { type: 'array', label: 'Lines' },
          text: { type: 'string', label: 'Text' },
        },
      },
      csv: {
        variantRule: { dataPropertyName: 'format', dataPropertyValue: 'csv' },
        properties: {
          rows: { type: 'array', label: 'Rows' },
          text: { type: 'string', label: 'Text' },
        },
      },
      json: {
        variantRule: { dataPropertyName: 'format', dataPropertyValue: 'json' },
        properties: {
          value: { type: 'object', label: 'Value' },
          text: { type: 'string', label: 'Text' },
        },
      },
    },
  },
};
