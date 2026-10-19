import { getScope } from '@workflowbuilder/sdk';
import type { UISchema } from '@workflowbuilder/sdk';

import type { AssumptionRegisterSchema } from './schema';

const scope = getScope<AssumptionRegisterSchema>;

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
      scope: scope('properties.assumptions'),
      label: 'Assumptions',
      placeholder: 'high | The far bank is defended | The far bank is unoccupied',
      minRows: 5,
      maxRows: 14,
    },
  ],
};
