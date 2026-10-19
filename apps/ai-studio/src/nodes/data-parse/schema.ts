import { sharedProperties } from '@workflowbuilder/sdk';
import type { NodeSchema } from '@workflowbuilder/sdk';

export const DATA_PARSE_FORMATS = ['lines', 'csv', 'json'] as const;

const FORMAT_LABELS: Record<(typeof DATA_PARSE_FORMATS)[number], string> = {
  lines: 'Lines',
  csv: 'CSV',
  json: 'JSON',
};

export const schema = {
  type: 'object',
  properties: {
    ...sharedProperties,
    source: { type: 'string', minLength: 1 },
    format: {
      type: 'string',
      options: DATA_PARSE_FORMATS.map((value) => ({ label: FORMAT_LABELS[value], value })),
    },
  },
  required: ['source'],
} satisfies NodeSchema;

export type DataParseSchema = typeof schema;
