import { sharedProperties } from '@workflowbuilder/sdk';
import type { NodeSchema } from '@workflowbuilder/sdk';

export const schema = {
  type: 'object',
  properties: {
    ...sharedProperties,
    assumptions: { type: 'string', minLength: 1 },
  },
  required: ['assumptions'],
} satisfies NodeSchema;

export type AssumptionRegisterSchema = typeof schema;
