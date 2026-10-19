import type { NodeDataProperties } from '@workflowbuilder/sdk';

import type { DataParseSchema } from './schema';

export const defaultPropertiesData: NodeDataProperties<DataParseSchema> = {
  label: 'Data parse',
  description: '',
  source: '',
  format: 'lines',
};
