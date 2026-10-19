import {
  WorkflowBuilder,
  type WorkflowBuilderIsValidConnection,
  type WorkflowBuilderReactFlowProps,
  useStore,
} from '@workflowbuilder/sdk';
import { useMemo, useState } from 'react';

import './node-overrides.css';
import '@workflowbuilder/sdk/style.css';

import { SaveButton } from '../../../../packages/sdk/src/features/integration/components/save-button/save-button';
import logoDark from '../assets/workflow-builder-logo-white.svg';
import logoLight from '../assets/workflow-builder-logo.svg';
import { responseControlRenderer } from '../components/ai-agent/response-control';
import { CanvasContextMenu } from '../components/canvas-menu/canvas-context-menu';
import { AiStudioControls } from '../components/controls/ai-studio-controls';
import { ExecutionHighlighting } from '../components/execution/highlighting';
import { ExecutionLogPanel } from '../components/execution/log-panel';
import { decisionFieldsRenderer } from '../components/human-decision/decision-fields/decision-fields-control';
import { decisionFormRenderer } from '../components/human-decision/decision-form/decision-form-control';
import { HumanDecisionNodeTemplate } from '../components/human-decision/node-template/human-decision-template';
import { DecisionWaitingSnackbar } from '../components/human-decision/waiting-snackbar/decision-waiting-snackbar';
import { OpenNotices } from '../components/open-from-url/open-notices';
import { aiStudioTemplates } from '../data/ai-studio-templates';
import { aiStudioNodeTypes } from '../data/node-types';
import { supportTriageFlow } from '../data/support-triage-flow';
import { humanDecisionNodeType } from '../nodes/human-decision';
import type { OpenedSource } from './open-from-url';
import { rootPropsFor } from './root-props';
import { StudioLayout } from './studio-layout';

const flagship = supportTriageFlow.value;

// Module-level: `nodeTemplates` must keep the same reference across renders.
const nodeTemplates = { [humanDecisionNodeType]: HumanDecisionNodeTemplate };
const jsonForm = { renderers: [decisionFormRenderer, responseControlRenderer, decisionFieldsRenderer] };

// A start node is where the run begins, so it can never be a connection target.
const isValidConnection: WorkflowBuilderIsValidConnection = ({ targetNode }) => !targetNode.data.isStartNode;

export function App({ opened }: { opened: OpenedSource }) {
  const { name, initialNodes, initialEdges, integration, plugins } = rootPropsFor(opened);
  const workflowId = opened.kind === 'workflow' ? opened.workflowId : undefined;
  const isRunView = opened.kind === 'execution';
  const [menuAt, setMenuAt] = useState<{ x: number; y: number } | null>(null);
  const reactFlowProps = useMemo<WorkflowBuilderReactFlowProps>(
    () => ({
      // Middle and right buttons pan. A right-click that does not drag still opens the menu.
      panOnDrag: [1, 2],
      onPaneContextMenu: (event) => {
        event.preventDefault();
        if (useStore.getState().isReadOnlyMode) return;
        setMenuAt({ x: event.clientX, y: event.clientY });
      },
      onPaneClick: () => setMenuAt(null),
    }),
    [],
  );

  return (
    <WorkflowBuilder.Root
      name={name}
      logo={{ light: logoLight, dark: logoDark }}
      logoHref="https://workflowbuilder.io"
      layoutDirection={flagship.layoutDirection}
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      integration={integration}
      nodeTypes={aiStudioNodeTypes}
      nodeTemplates={nodeTemplates}
      jsonForm={jsonForm}
      diagramTemplates={aiStudioTemplates}
      isValidConnection={isValidConnection}
      plugins={plugins}
      reactFlowProps={reactFlowProps}
    >
      <StudioLayout />
      {/* Autosave and the save on close are registered by the save control, which used to live in the bar. */}
      {!isRunView && (
        <div hidden>
          <SaveButton />
        </div>
      )}
      <CanvasContextMenu at={menuAt} onClose={() => setMenuAt(null)} />
      <AiStudioControls workflowId={workflowId} isRunView={isRunView} />
      <ExecutionLogPanel />
      <DecisionWaitingSnackbar />
      <ExecutionHighlighting />
      <OpenNotices />
    </WorkflowBuilder.Root>
  );
}
