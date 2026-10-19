import { sharedProperties } from '@workflowbuilder/sdk';
import type { NodeSchema } from '@workflowbuilder/sdk';

export const schema = {
  type: 'object',
  properties: {
    ...sharedProperties,
    task: { type: 'string', minLength: 1 },
    purpose: { type: 'string', minLength: 1 },
    endState: { type: 'string', minLength: 1 },
  },
  required: ['task', 'purpose', 'endState'],
} satisfies NodeSchema;

export type MissionStatementSchema = typeof schema;
