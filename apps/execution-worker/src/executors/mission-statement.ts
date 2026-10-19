import type { MissionStatementNode } from '../domain/ai-studio-nodes';
import { requiredText } from './frame-lines';

const CODE = 'mission_incomplete';

export function executeMissionStatement(node: MissionStatementNode) {
  return {
    output: {
      task: requiredText(node.config.task, CODE, 'Task'),
      purpose: requiredText(node.config.purpose, CODE, 'Purpose'),
      endState: requiredText(node.config.endState, CODE, 'End state'),
    },
  };
}
