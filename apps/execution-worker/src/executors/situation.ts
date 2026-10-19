import type { SituationNode } from '../domain/ai-studio-nodes';
import { optionalText, requiredText } from './frame-lines';

const CODE = 'situation_incomplete';

export function executeSituation(node: SituationNode) {
  return {
    output: {
      friendlyDisposition: requiredText(node.config.friendlyDisposition, CODE, 'Friendly disposition'),
      adversarySituation: requiredText(node.config.adversarySituation, CODE, 'Adversary situation'),
      terrain: optionalText(node.config.terrain),
      timeWindow: optionalText(node.config.timeWindow),
    },
  };
}
