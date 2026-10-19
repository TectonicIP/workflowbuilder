import type { NodeDataProperties } from '@workflowbuilder/sdk';

import type { AssumptionRegisterSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<AssumptionRegisterSchema> = {
  label: 'Assumption register',
  description: '',
  assumptions: '',
};
