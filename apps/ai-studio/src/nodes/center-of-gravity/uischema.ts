import { getScope } from '@workflowbuilder/sdk';
import type { UISchema } from '@workflowbuilder/sdk';

import type { CenterOfGravitySchema } from './schema';

const scope = getScope<CenterOfGravitySchema>;

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
      scope: scope('properties.friendlyCapability'),
      label: 'Friendly capability',
      placeholder: 'What friendly forces can do that the mission depends on',
      minRows: 2,
      maxRows: 6,
    },
    {
      type: 'TextArea',
      scope: scope('properties.friendlyRequirement'),
      label: 'Friendly requirement',
      placeholder: 'What that capability needs in order to keep working',
      minRows: 2,
      maxRows: 6,
    },
    {
      type: 'TextArea',
      scope: scope('properties.friendlyVulnerability'),
      label: 'Friendly vulnerability',
      placeholder: 'How that requirement can fail',
      minRows: 2,
      maxRows: 6,
    },
    {
      type: 'TextArea',
      scope: scope('properties.adversaryCapability'),
      label: 'Adversary capability',
      placeholder: 'What the adversary can do that their concept depends on',
      minRows: 2,
      maxRows: 6,
    },
    {
      type: 'TextArea',
      scope: scope('properties.adversaryRequirement'),
      label: 'Adversary requirement',
      placeholder: 'What that capability needs in order to keep working',
      minRows: 2,
      maxRows: 6,
    },
    {
      type: 'TextArea',
      scope: scope('properties.adversaryVulnerability'),
      label: 'Adversary vulnerability',
      placeholder: 'How that requirement can fail',
      minRows: 2,
      maxRows: 6,
    },
  ],
};
