import { PermanentNodeExecutionError } from '@workflow-builder/execution-core';

import type { ConstraintRegisterNode } from '../domain/ai-studio-nodes';
import { parseConstraintLines } from './frame-lines';

export function executeConstraintRegister(node: ConstraintRegisterNode) {
  const parsed = parseConstraintLines(node.config.constraints);
  const hard = parsed.filter((item) => item.kind === 'hard').map((item) => item.text);
  const soft = parsed.filter((item) => item.kind === 'soft').map((item) => item.text);
  if (hard.length === 0) {
    throw new PermanentNodeExecutionError('constraints_incomplete', 'At least one hard constraint is required.');
  }
  return {
    output: {
      hardConstraints: hard.join('\n'),
      softConstraints: soft.join('\n'),
      hard,
      soft,
    },
  };
}
