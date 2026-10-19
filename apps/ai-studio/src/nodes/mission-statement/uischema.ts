import { getScope } from '@workflowbuilder/sdk';
import type { UISchema } from '@workflowbuilder/sdk';

import type { MissionStatementSchema } from './schema';

const scope = getScope<MissionStatementSchema>;

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
      scope: scope('properties.task'),
      label: 'Task',
      placeholder: 'What the force must do',
      minRows: 2,
      maxRows: 8,
    },
    {
      type: 'TextArea',
      scope: scope('properties.purpose'),
      label: 'Purpose',
      placeholder: 'Why the task is undertaken',
      minRows: 2,
      maxRows: 8,
    },
    {
      type: 'TextArea',
      scope: scope('properties.endState'),
      label: 'End state',
      placeholder: 'The conditions that mean the mission is done',
      minRows: 2,
      maxRows: 8,
    },
  ],
};
