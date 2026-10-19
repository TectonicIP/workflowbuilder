import { getScope } from '@workflowbuilder/sdk';
import type { UISchema } from '@workflowbuilder/sdk';

import type { DataParseSchema } from './schema';

const scope = getScope<DataParseSchema>;

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
      type: 'VariableTextArea',
      scope: scope('properties.source'),
      label: 'Source',
      placeholder: '{{ nodes.<id>.text }}',
      minRows: 4,
    },
    {
      type: 'Select',
      scope: scope('properties.format'),
      label: 'Format',
    },
  ],
};
