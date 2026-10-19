import { getScope } from '@workflowbuilder/sdk';
import type { UISchema } from '@workflowbuilder/sdk';

import type { ConstraintRegisterSchema } from './schema';

const scope = getScope<ConstraintRegisterSchema>;

export const uischema: UISchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Text',
      scope: scope('properties.label'),
      label: 'Title',
      placeholder: 'Node Title...',
    },
    {
      type: 'TextArea',
      scope: scope('properties.constraints'),
      label: 'Constraints',
      placeholder: 'hard | Stay inside the assigned boundary\nsoft | Limit movement through built-up areas',
      minRows: 5,
      maxRows: 14,
    },
  ],
};
