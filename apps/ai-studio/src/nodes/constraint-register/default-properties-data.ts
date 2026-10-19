import type { NodeDataProperties } from '@workflowbuilder/sdk';

import type { ConstraintRegisterSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<ConstraintRegisterSchema> = {
  label: 'Constraint register',
  description: '',
  constraints: '',
};
