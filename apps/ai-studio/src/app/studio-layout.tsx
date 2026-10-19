import { WorkflowBuilder, type WorkflowBuilderNode, setStoreNodes, useStore } from '@workflowbuilder/sdk';
import { useEffect } from 'react';

import styles from './studio-layout.module.css';

export function StudioLayout() {
  const fetchData = useStore((state) => state.fetchData);

  // The palette used to load node definitions. Without it, adding a node cannot resolve a type.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nodes = useStore((state) => state.nodes);

  // Older Start nodes have no active flag. The switch would show off while Run still includes them.
  useEffect(() => {
    const missingActive = (node: WorkflowBuilderNode) =>
      node.data.isStartNode === true && (node.data.properties as { active?: boolean }).active === undefined;
    if (!nodes.some(missingActive)) return;

    setStoreNodes(
      nodes.map((node) =>
        missingActive(node)
          ? { ...node, data: { ...node.data, properties: { ...node.data.properties, active: true } } }
          : node,
      ),
    );
  }, [nodes]);

  return (
    <div className={styles['container']}>
      <div className={styles['content']}>
        <div id="viewport-bounds" className={styles['viewport-bounds']} />
        <div className={styles['panel']}>
          <div className={styles['right-panel']}>
            <WorkflowBuilder.PropertiesPanel />
          </div>
        </div>
      </div>
      <div className={styles['diagram']}>
        <WorkflowBuilder.Canvas />
      </div>
    </div>
  );
}
