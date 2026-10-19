import { PermanentNodeExecutionError } from '@workflow-builder/execution-core';

import type { AssumptionRegisterNode } from '../domain/ai-studio-nodes';
import { formatAssumption, parseAssumptionLines } from './frame-lines';

export function executeAssumptionRegister(node: AssumptionRegisterNode) {
  const assumptions = parseAssumptionLines(node.config.assumptions);
  if (assumptions.length === 0) {
    throw new PermanentNodeExecutionError('assumptions_incomplete', 'At least one assumption is required.');
  }
  return {
    output: {
      assumptionsText: assumptions.map(formatAssumption).join('\n'),
      assumptions,
    },
  };
}
