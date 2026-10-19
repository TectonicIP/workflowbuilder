import {
  getStoreDataForIntegration,
  setStoreEdges,
  setStoreNodes,
  trackFutureChange,
  useStore,
} from '@workflowbuilder/sdk';
import { Button } from '@workflowbuilder/ui';
import { useState } from 'react';

import styles from './import-workflow-dialog.module.css';

import { mergeWorkflowOntoCanvas } from '../../utils/merge-workflow';

type Props = {
  onClose: () => void;
};

export function ImportWorkflowDialog({ onClose }: Props) {
  const [json, setJson] = useState('{\n  "nodes": [],\n  "edges": []\n}');
  const [error, setError] = useState<string | null>(null);

  const importOntoCanvas = () => {
    const current = getStoreDataForIntegration();
    const merged = mergeWorkflowOntoCanvas(current, json, () => crypto.randomUUID());
    if (!merged.ok) {
      setError(merged.message);
      return;
    }

    trackFutureChange('import');
    setStoreNodes(merged.canvas.nodes);
    setStoreEdges(merged.canvas.edges);
    useStore.setState({ globalVariables: merged.canvas.globalVariables });
    onClose();
  };

  return (
    <div className={styles['overlay']} role="presentation" onMouseDown={onClose}>
      <div
        className={styles['card']}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-workflow-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 className={styles['title']} id="import-workflow-title">
          Import workflow
        </h2>
        <p className={styles['hint']}>Paste a workflow JSON. It is placed beside the graphs already on the canvas.</p>
        <textarea
          className={styles['json']}
          value={json}
          spellCheck={false}
          onChange={(event) => setJson(event.target.value)}
        />
        {error && <p className={styles['error']}>{error}</p>}
        <div className={styles['actions']}>
          <Button variant="secondary" size="s" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="s" onClick={importOntoCanvas}>
            Import
          </Button>
        </div>
      </div>
    </div>
  );
}
