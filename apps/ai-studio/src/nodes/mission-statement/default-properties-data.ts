import type { NodeDataProperties } from '@workflowbuilder/sdk';

import type { MissionStatementSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<MissionStatementSchema> = {
  label: 'Mission statement',
  description: '',
  task: '',
  purpose: '',
  endState: '',
};
