import type { PaletteItemOrGroup } from '@workflowbuilder/sdk';

import { aiAgentPaletteItem } from '../nodes/ai-agent';
import { assumptionRegisterPaletteItem } from '../nodes/assumption-register';
import { centerOfGravityPaletteItem } from '../nodes/center-of-gravity';
import { constraintRegisterPaletteItem } from '../nodes/constraint-register';
import { dataInputPaletteItem } from '../nodes/data-input';
import { dataParsePaletteItem } from '../nodes/data-parse';
import { decisionPaletteItem } from '../nodes/decision';
import { humanDecisionPaletteItem } from '../nodes/human-decision';
import { missionStatementPaletteItem } from '../nodes/mission-statement';
import { situationPaletteItem } from '../nodes/situation';
import { triggerPaletteItem } from '../nodes/trigger';
import { visualizePaletteItem } from '../nodes/visualize';

export const aiStudioNodeTypes: PaletteItemOrGroup[] = [
  {
    label: 'COA',
    isOpen: true,
    groupItems: [
      situationPaletteItem,
      missionStatementPaletteItem,
      constraintRegisterPaletteItem,
      assumptionRegisterPaletteItem,
      centerOfGravityPaletteItem,
    ],
  },
  {
    label: 'Utility',
    isOpen: true,
    groupItems: [dataInputPaletteItem, dataParsePaletteItem],
  },
  {
    label: 'AI',
    isOpen: true,
    groupItems: [triggerPaletteItem, aiAgentPaletteItem],
  },
  {
    label: 'Analytics',
    isOpen: true,
    groupItems: [decisionPaletteItem, humanDecisionPaletteItem, visualizePaletteItem],
  },
];
