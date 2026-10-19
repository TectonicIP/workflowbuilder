import { describe, expect, it } from 'vitest';

import { formatAssumption, parseAssumptionLines, parseConstraintLines } from './frame-lines';

describe('parseConstraintLines', () => {
  it('reads hard and soft prefixes and ignores blank lines', () => {
    const parsed = parseConstraintLines('hard | Stay inside the boundary\n\nsoft | Limit built-up areas\n');

    expect(parsed).toEqual([
      { kind: 'hard', text: 'Stay inside the boundary' },
      { kind: 'soft', text: 'Limit built-up areas' },
    ]);
  });

  it('treats a missing or unrecognised prefix as a hard constraint', () => {
    expect(parseConstraintLines('Stay inside the boundary\nfirm | Keep the reserve')).toEqual([
      { kind: 'hard', text: 'Stay inside the boundary' },
      { kind: 'hard', text: 'firm | Keep the reserve' },
    ]);
  });

  it('keeps text after the first separator', () => {
    expect(parseConstraintLines('hard | Do not cross | the river')).toEqual([
      { kind: 'hard', text: 'Do not cross | the river' },
    ]);
  });

  it('drops a prefixed line whose text is empty', () => {
    expect(parseConstraintLines('hard | \nsoft | Keep the road open')).toEqual([
      { kind: 'soft', text: 'Keep the road open' },
    ]);
  });
});

describe('parseAssumptionLines', () => {
  it('reads criticality, statement, and falsifier', () => {
    expect(parseAssumptionLines('high | The far bank is defended | The far bank is unoccupied')).toEqual([
      { criticality: 'high', statement: 'The far bank is defended', falsifier: 'The far bank is unoccupied' },
    ]);
  });

  it('defaults a missing criticality to medium and keeps a later falsifier', () => {
    expect(parseAssumptionLines('The bridges remain intact | A bridge is dropped')).toEqual([
      { criticality: 'medium', statement: 'The bridges remain intact', falsifier: 'A bridge is dropped' },
    ]);
  });

  it('ignores blank lines and a criticality with no statement', () => {
    expect(parseAssumptionLines('\nhigh |\nlow | Weather holds\n')).toEqual([
      { criticality: 'low', statement: 'Weather holds', falsifier: '' },
    ]);
  });

  it('formats a line the same way it was parsed', () => {
    const [assumption] = parseAssumptionLines('HIGH | The far bank is defended | They withdraw | overnight');

    expect(assumption && formatAssumption(assumption)).toBe(
      'high | The far bank is defended | They withdraw | overnight',
    );
  });
});
