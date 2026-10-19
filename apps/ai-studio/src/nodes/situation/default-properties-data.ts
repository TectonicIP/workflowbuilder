import type { NodeDataProperties } from '@workflowbuilder/sdk';

import type { SituationSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<SituationSchema> = {
  label: 'Situation',
  description: '',
  friendlyDisposition: '',
  adversarySituation: '',
  terrain: '',
  timeWindow: '',
};
