import { sharedProperties } from '@workflowbuilder/sdk';
import type { NodeSchema } from '@workflowbuilder/sdk';

export const schema = {
  type: 'object',
  properties: {
    ...sharedProperties,
    friendlyDisposition: { type: 'string', minLength: 1 },
    adversarySituation: { type: 'string', minLength: 1 },
    terrain: { type: 'string' },
    timeWindow: { type: 'string' },
  },
  required: ['friendlyDisposition', 'adversarySituation'],
} satisfies NodeSchema;

export type SituationSchema = typeof schema;
