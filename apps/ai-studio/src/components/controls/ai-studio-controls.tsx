import { Icon, getStoreDataForIntegration, getStoreSelection } from '@workflowbuilder/sdk';
import { Button, NavButton } from '@workflowbuilder/ui';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './ai-studio-controls.module.css';

import { patchDraft } from '../../adapters/save-workflow-draft';
import { useBackendExecution } from '../../hooks/use-backend-execution';
import { useHasStartNode } from '../../hooks/use-has-start-node';
import { useRunLocksCanvas } from '../../hooks/use-run-locks-canvas';
import { isRunAlive, resetExecution, useExecutionStore } from '../../stores/use-execution-store';
import { addNotice } from '../../stores/use-notices-store';
import { whenRunSettles } from '../../stores/when-run-settles';
import { runnableWorkflows } from '../../utils/active-workflows';
import { leaveRunView } from '../../utils/open-from-url/address-execution-id';

type Props = {
  /** The link's workflow: Run saves the canvas into its draft before it runs. */
  workflowId?: string;
  /** The canvas shows a run's graph, saved nowhere: no Run, and Reset reloads the page without the run. */
  isRunView: boolean;
};

export function AiStudioControls({ workflowId, isRunView }: Props) {
  // A run view shows only its run: once the run is forgotten, the page reloads onto the workflow or the local draft.
  const { executeFromCanvas, cancel, reset, status } = useBackendExecution(isRunView ? leaveRunView : undefined);
  const hasStartNode = useHasStartNode();
  // A run outlives its trigger node, so Stop and Reset stay reachable after it is deleted.
  const shouldShowControls = hasStartNode || status !== 'idle';
  const isStopRequested = useExecutionStore((state) => state.isStopRequested);
  // A start waits for the backend; a second one meanwhile would leave two runs streaming into one view.
  const [isStarting, setIsStarting] = useState(false);
  const [isQueueRunning, setIsQueueRunning] = useState(false);
  const queueAbortRef = useRef<AbortController | null>(null);
  useRunLocksCanvas();
  const canRun = hasStartNode && !isRunView;

  useEffect(() => () => queueAbortRef.current?.abort(), []);

  const handleExecute = useCallback(async () => {
    queueAbortRef.current?.abort();
    const abort = new AbortController();
    queueAbortRef.current = abort;

    // The shape the editor's autosave sends, so its compare recognises Run's write.
    const { nodes, edges } = getStoreDataForIntegration();
    const selectedNodeIds = getStoreSelection().nodes.map((node) => node.id);
    const workflows = runnableWorkflows(nodes, edges, selectedNodeIds);
    if (workflows.length === 0) {
      addNotice('No active workflow to run.', 'error');
      return;
    }

    setIsQueueRunning(true);
    setIsStarting(true);
    try {
      // The linked draft stays the whole canvas. Each graph below is its own workflow, so one start
      // does not replace the others.
      if (workflowId) {
        const response = await patchDraft(workflowId, nodes, edges);
        if (!response.ok) {
          const error = (await response.json()) as { message?: string };
          throw new Error(error.message ?? 'Failed to save workflow');
        }
      }
      if (abort.signal.aborted) return;

      for (const workflow of workflows) {
        if (abort.signal.aborted) break;

        await executeFromCanvas(workflow.nodes, workflow.edges, workflow.triggerPayload);
        if (abort.signal.aborted) {
          if (queueAbortRef.current === abort) resetExecution();
          break;
        }

        setIsStarting(false);
        const outcome = await whenRunSettles(abort.signal);
        if (outcome === 'stopped') break;
      }
    } catch (error) {
      console.error('Execution failed:', error);
      addNotice(`The run did not start: ${error instanceof Error ? error.message : String(error)}.`, 'error');
    } finally {
      if (queueAbortRef.current === abort) {
        setIsStarting(false);
        setIsQueueRunning(false);
      }
    }
  }, [executeFromCanvas, workflowId]);

  const handleStop = () => {
    queueAbortRef.current?.abort();
    void cancel();
  };

  const handleReset = () => {
    queueAbortRef.current?.abort();
    reset();
  };

  const isRunning = isRunAlive(status) || isQueueRunning;
  const isDone = status !== 'idle' && !isRunAlive(status) && !isQueueRunning;
  // Any Stop may never resolve, so asking is enough to offer Reset; `cancelling` covers one asked before a reload.
  const hasAskedToStop = isStopRequested || status === 'cancelling';
  const isDoneOrStuck = isDone || hasAskedToStop;
  const resetTooltip =
    !isDone && hasAskedToStop ? 'Reset without cancelling: the run may still be running on the server' : 'Reset';

  return (
    <div
      className={clsx(styles['container'], {
        [styles['container--visible']]: shouldShowControls,
      })}
    >
      <div className={styles['panel']}>
        {isRunning || isStarting ? (
          // There is no run to cancel until the backend names it.
          <Button
            className={styles['run-stop-button']}
            variant="ghost-critical"
            size="s"
            onClick={handleStop}
            disabled={isStarting}
            prefixIcon={<Icon name="Stop" />}
          >
            Stop
          </Button>
        ) : canRun ? (
          <Button
            className={styles['run-stop-button']}
            variant="primary"
            size="s"
            onClick={handleExecute}
            prefixIcon={<Icon name="Play" />}
          >
            Run
          </Button>
        ) : null}
        {isDoneOrStuck && !isStarting && (
          <NavButton
            size="s"
            aria-label={resetTooltip}
            onClick={handleReset}
            tooltip={resetTooltip}
            prefixIcon={<Icon name="ArrowCounterClockwise" />}
          />
        )}
      </div>
    </div>
  );
}
