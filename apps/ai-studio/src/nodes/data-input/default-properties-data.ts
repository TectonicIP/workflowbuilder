import type { NodeDataProperties } from '@workflowbuilder/sdk';

import type { DataInputSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<DataInputSchema> = {
  label: 'Data input',
  description: '',
  text: '',
  format: 'text',
};
