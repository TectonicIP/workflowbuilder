import { sharedProperties } from '@workflowbuilder/sdk';
import type { NodeSchema } from '@workflowbuilder/sdk';

export const DATA_INPUT_FORMATS = ['text', 'json', 'csv'] as const;

const FORMAT_LABELS: Record<(typeof DATA_INPUT_FORMATS)[number], string> = {
  text: 'Text',
  json: 'JSON',
  csv: 'CSV',
};

export const schema = {
  type: 'object',
  properties: {
    ...sharedProperties,
    text: { type: 'string', minLength: 1 },
    format: {
      type: 'string',
      options: DATA_INPUT_FORMATS.map((value) => ({ label: FORMAT_LABELS[value], value })),
    },
  },
  required: ['text'],
} satisfies NodeSchema;

export type DataInputSchema = typeof schema;
