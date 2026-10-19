import { sharedProperties } from '@workflowbuilder/sdk';
import type { NodeSchema } from '@workflowbuilder/sdk';

const requiredText = { type: 'string', minLength: 1 } as const;

export const schema = {
  type: 'object',
  properties: {
    ...sharedProperties,
    friendlyCapability: requiredText,
    friendlyRequirement: requiredText,
    friendlyVulnerability: requiredText,
    adversaryCapability: requiredText,
    adversaryRequirement: requiredText,
    adversaryVulnerability: requiredText,
  },
  required: [
    'friendlyCapability',
    'friendlyRequirement',
    'friendlyVulnerability',
    'adversaryCapability',
    'adversaryRequirement',
    'adversaryVulnerability',
  ],
} satisfies NodeSchema;

export type CenterOfGravitySchema = typeof schema;
