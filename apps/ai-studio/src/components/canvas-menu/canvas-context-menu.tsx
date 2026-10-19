import { type PaletteItem, type PaletteItemOrGroup, useStore } from '@workflowbuilder/sdk';
import { useEffect, useRef, useState } from 'react';

import styles from './canvas-context-menu.module.css';

import { ImportWorkflowDialog } from '../import-workflow/import-workflow-dialog';
import { addNodeAt } from './add-node-at';

type MenuAt = { x: number; y: number };

type Props = {
  at: MenuAt | null;
  onClose: () => void;
};

type PaletteGroup = {
  label: string;
  groupItems: PaletteItem[];
};

const SUBMENU_WIDTH_PX = 152;

function isPaletteGroup(entry: PaletteItemOrGroup): entry is PaletteGroup {
  return 'groupItems' in entry;
}

function submenuSide(row: HTMLElement): 'left' | 'right' {
  const rect = row.getBoundingClientRect();
  return rect.right + SUBMENU_WIDTH_PX > window.innerWidth ? 'left' : 'right';
}

export function CanvasContextMenu({ at, onClose }: Props) {
  const data = useStore((state) => state.data);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [side, setSide] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (!at) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (openGroup) {
        setOpenGroup(null);
        return;
      }
      onClose();
    };
    const onPointer = (event: MouseEvent) => {
      if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) onClose();
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [at, onClose, openGroup]);

  const place = (type: string) => {
    if (!at) return;

    const position = useStore.getState().reactFlowInstance?.screenToFlowPosition({ x: at.x, y: at.y }) ?? {
      x: at.x,
      y: at.y,
    };
    addNodeAt(type, position);
    onClose();
  };

  const showGroup = (label: string, row: HTMLElement) => {
    setSide(submenuSide(row));
    setOpenGroup(label);
  };

  return (
    <>
      {at && (
        <div ref={menuRef} className={styles['menu']} role="menu" style={{ top: at.y, left: at.x }}>
          {data.map((entry) =>
            isPaletteGroup(entry) ? (
              <div
                key={entry.label}
                className={styles['group']}
                onMouseEnter={(event) => showGroup(entry.label, event.currentTarget)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  role="menuitem"
                  className={`${styles['item']} ${styles['groupItem']}`}
                  aria-haspopup="menu"
                  aria-expanded={openGroup === entry.label}
                  onFocus={(event) => showGroup(entry.label, event.currentTarget)}
                >
                  {entry.label}
                  <span className={styles['caret']} aria-hidden="true">
                    ›
                  </span>
                </button>
                {openGroup === entry.label && (
                  <div
                    className={`${styles['submenu']} ${side === 'left' ? styles['submenuLeft'] : styles['submenuRight']}`}
                    role="menu"
                  >
                    {entry.groupItems.map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        role="menuitem"
                        className={styles['item']}
                        onClick={() => place(item.type)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={entry.type}
                type="button"
                role="menuitem"
                className={styles['item']}
                onClick={() => place(entry.type)}
              >
                {entry.label}
              </button>
            ),
          )}
          {data.length > 0 && <div className={styles['separator']} role="separator" />}
          <button
            type="button"
            role="menuitem"
            className={styles['import']}
            onClick={() => {
              setIsImportOpen(true);
              onClose();
            }}
          >
            Import workflow
          </button>
        </div>
      )}
      {isImportOpen && <ImportWorkflowDialog onClose={() => setIsImportOpen(false)} />}
    </>
  );
}
