import { sharedProperties } from '@workflowbuilder/sdk';
import type { NodeSchema } from '@workflowbuilder/sdk';

export const schema = {
  type: 'object',
  properties: {
    ...sharedProperties,
    constraints: { type: 'string', minLength: 1 },
  },
  required: ['constraints'],
} satisfies NodeSchema;

export type ConstraintRegisterSchema = typeof schema;
