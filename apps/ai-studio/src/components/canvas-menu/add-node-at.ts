import { NodeType, trackFutureChange, useStore } from '@workflowbuilder/sdk';
import type { WorkflowBuilderNode } from '@workflowbuilder/sdk';
import type { NodeChange, XYPosition } from '@xyflow/react';

import { humanDecisionNodeType } from '../../nodes/human-decision';

function reactFlowType(paletteType: string, templateType?: NodeType) {
  if (paletteType === humanDecisionNodeType) return humanDecisionNodeType;

  return templateType ?? NodeType.Node;
}

/** Create a palette node at a canvas position and select it. */
export function addNodeAt(nodeType: string, position: XYPosition) {
  const { getNodeDefinition, onNodesChange, isReadOnlyMode, nodes } = useStore.getState();
  if (isReadOnlyMode) return;

  const definition = getNodeDefinition(nodeType);
  if (!definition) return;

  const { defaultPropertiesData, type, icon, templateType, isStartNode, label, description } = definition;
  const properties = {
    ...defaultPropertiesData,
    label: defaultPropertiesData.label || label,
    description: defaultPropertiesData.description || description,
  };
  const id = crypto.randomUUID();

  const changes: NodeChange<WorkflowBuilderNode>[] = [
    ...nodes.filter((node) => node.selected).map((node) => ({ type: 'select' as const, id: node.id, selected: false })),
    {
      type: 'add',
      item: {
        id,
        type: reactFlowType(type, templateType),
        position,
        selected: true,
        data: {
          segments: [],
          properties,
          type,
          icon,
          ...(isStartNode ? { isStartNode: true } : {}),
        },
      },
    },
  ];

  trackFutureChange('addNode', { nodeType: type });
  onNodesChange(changes);
  useStore.setState({ selectedNodesIds: [id], selectedEdgesIds: [] });
}
