import type { CenterOfGravityNode } from '../domain/ai-studio-nodes';
import { requiredText } from './frame-lines';

const CODE = 'center_of_gravity_incomplete';

export function executeCenterOfGravity(node: CenterOfGravityNode) {
  return {
    output: {
      friendlyCapability: requiredText(node.config.friendlyCapability, CODE, 'Friendly capability'),
      friendlyRequirement: requiredText(node.config.friendlyRequirement, CODE, 'Friendly requirement'),
      friendlyVulnerability: requiredText(node.config.friendlyVulnerability, CODE, 'Friendly vulnerability'),
      adversaryCapability: requiredText(node.config.adversaryCapability, CODE, 'Adversary capability'),
      adversaryRequirement: requiredText(node.config.adversaryRequirement, CODE, 'Adversary requirement'),
      adversaryVulnerability: requiredText(node.config.adversaryVulnerability, CODE, 'Adversary vulnerability'),
    },
  };
}
