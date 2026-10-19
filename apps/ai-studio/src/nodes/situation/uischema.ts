import { getScope } from '@workflowbuilder/sdk';
import type { UISchema } from '@workflowbuilder/sdk';

import type { SituationSchema } from './schema';

const scope = getScope<SituationSchema>;

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
      scope: scope('properties.friendlyDisposition'),
      label: 'Friendly disposition',
      placeholder: 'Where friendly forces are and what they are doing',
      minRows: 3,
      maxRows: 10,
    },
    {
      type: 'TextArea',
      scope: scope('properties.adversarySituation'),
      label: 'Adversary situation',
      placeholder: 'What the adversary is doing and can do',
      minRows: 3,
      maxRows: 10,
    },
    {
      type: 'TextArea',
      scope: scope('properties.terrain'),
      label: 'Terrain',
      placeholder: 'Ground, weather, and obstacles that shape the problem',
      minRows: 2,
      maxRows: 8,
    },
    {
      type: 'Text',
      scope: scope('properties.timeWindow'),
      label: 'Time',
      placeholder: 'When this situation applies',
    },
  ],
};
