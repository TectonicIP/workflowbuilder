import { PermanentNodeExecutionError } from '@workflow-builder/execution-core';

import type { DataInputNode } from '../domain/ai-studio-nodes';

const FORMATS = ['text', 'json', 'csv'] as const;
type DataInputFormat = (typeof FORMATS)[number];

const CODE = 'data_input_incomplete';

export function executeDataInput(node: DataInputNode) {
  const text = typeof node.config.text === 'string' ? node.config.text.trim() : '';
  if (text.length === 0) {
    throw new PermanentNodeExecutionError(CODE, 'Data is required.');
  }
  return { output: { text, format: inputFormat(node.config.format) } };
}

function inputFormat(value: unknown): DataInputFormat {
  if (value === undefined || value === '') return 'text';
  if (isFormat(value)) return value;
  throw new PermanentNodeExecutionError(CODE, 'Format must be text, json, or csv.');
}

function isFormat(value: unknown): value is DataInputFormat {
  return typeof value === 'string' && (FORMATS as readonly string[]).includes(value);
}
