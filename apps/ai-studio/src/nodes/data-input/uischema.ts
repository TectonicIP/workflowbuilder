import { getScope } from '@workflowbuilder/sdk';
import type { UISchema } from '@workflowbuilder/sdk';

import type { DataInputSchema } from './schema';

const scope = getScope<DataInputSchema>;

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
      scope: scope('properties.text'),
      label: 'Data',
      placeholder: 'Paste the payload',
      minRows: 5,
      maxRows: 14,
    },
    {
      type: 'Select',
      scope: scope('properties.format'),
      label: 'Format',
    },
  ],
};
