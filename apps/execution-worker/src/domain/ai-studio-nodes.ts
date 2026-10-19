// Concrete node vocabulary for the AI Studio product. Owned by the worker,
// not by execution-core or @workflow-builder/types — those layers only know
// the generic BaseNode shape. A different product would define its own union
// here and register matching executors.
import type { BaseNode } from '@workflowbuilder/temporal';
import type { JSONSchema7 } from 'ai';

// Intersected with BaseNode so the runner-level fields it carries stay declared here,
// rather than arriving at runtime on a type that does not mention them.
type ProductNode<TType extends string, TConfig> = BaseNode & { type: TType; config: TConfig };

type TriggerNodeConfig = Record<string, never>;

type AiAgentNodeConfig = {
  systemPrompt: string; // supports {{namespace.path}} template references
  webSearch?: boolean; // needs TAVILY_API_KEY to take effect
  outputSchema?: JSONSchema7 | null; // asked of the model, answer unchecked; absent or null means text in `response`
};

export type DecisionBranchCondition = {
  x: string;
  y: string;
  comparisonOperator: string;
  logicalOperator?: 'AND' | 'OR';
};

type DecisionBranch = {
  id?: string;
  sourceHandle: string;
  label?: string;
  conditions: DecisionBranchCondition[];
};

type DecisionNodeConfig = {
  decisionBranches: DecisionBranch[];
};

// Display-only node; the UI reads the upstream output directly, so no runtime config.
type VisualizeNodeConfig = Record<string, never>;

// What to ask a person travels on BaseNode.decisionRequest, lifted off config by the backend.
type HumanDecisionNodeConfig = Record<string, never>;

type SituationNodeConfig = {
  friendlyDisposition?: string;
  adversarySituation?: string;
  terrain?: string;
  timeWindow?: string;
};

type MissionStatementNodeConfig = {
  task?: string;
  purpose?: string;
  endState?: string;
};

type ConstraintRegisterNodeConfig = {
  constraints?: string;
};

type AssumptionRegisterNodeConfig = {
  assumptions?: string;
};

type CenterOfGravityNodeConfig = {
  friendlyCapability?: string;
  friendlyRequirement?: string;
  friendlyVulnerability?: string;
  adversaryCapability?: string;
  adversaryRequirement?: string;
  adversaryVulnerability?: string;
};

type DataInputNodeConfig = {
  text?: string;
  format?: string;
};

type DataParseNodeConfig = {
  source?: string;
  format?: string;
};

export type TriggerNode = ProductNode<'ai-studio/trigger', TriggerNodeConfig>;

export type AiAgentNode = ProductNode<'ai-studio/ai-agent', AiAgentNodeConfig>;

export type DecisionNode = ProductNode<'ai-studio/decision', DecisionNodeConfig>;

type VisualizeNode = ProductNode<'ai-studio/visualize', VisualizeNodeConfig>;

export type HumanDecisionNode = ProductNode<'ai-studio/human-decision', HumanDecisionNodeConfig>;

export type SituationNode = ProductNode<'ai-studio/situation', SituationNodeConfig>;

export type MissionStatementNode = ProductNode<'ai-studio/mission-statement', MissionStatementNodeConfig>;

export type ConstraintRegisterNode = ProductNode<'ai-studio/constraint-register', ConstraintRegisterNodeConfig>;

export type AssumptionRegisterNode = ProductNode<'ai-studio/assumption-register', AssumptionRegisterNodeConfig>;

export type CenterOfGravityNode = ProductNode<'ai-studio/center-of-gravity', CenterOfGravityNodeConfig>;

export type DataInputNode = ProductNode<'ai-studio/data-input', DataInputNodeConfig>;

export type DataParseNode = ProductNode<'ai-studio/data-parse', DataParseNodeConfig>;

export type AiStudioNode =
  | TriggerNode
  | AiAgentNode
  | DecisionNode
  | VisualizeNode
  | HumanDecisionNode
  | SituationNode
  | MissionStatementNode
  | ConstraintRegisterNode
  | AssumptionRegisterNode
  | CenterOfGravityNode
  | DataInputNode
  | DataParseNode;
