import { describe, expect, it } from 'vitest';

import { type ExecutionContext, PermanentNodeExecutionError } from '@workflow-builder/execution-core';

import type { DataInputNode, DataParseNode } from '../domain/ai-studio-nodes';
import { executeDataInput } from './data-input';
import { executeDataParse } from './data-parse';

function context(nodeOutputs: ExecutionContext['nodeOutputs'] = {}): ExecutionContext {
  return {
    workflowId: 'wf',
    executionId: 'exec',
    triggerPayload: {},
    nodeOutputs,
    variables: {},
    global: {},
  };
}

function expectPermanent(run: () => unknown, code: string) {
  expect(run).toThrow(PermanentNodeExecutionError);
  expect(run).toThrow(expect.objectContaining({ code }));
}

describe('executeDataInput', () => {
  const node: DataInputNode = {
    id: 'input-1',
    type: 'ai-studio/data-input',
    config: { text: '  alpha,beta  ', format: 'csv' },
  };

  it('returns the trimmed payload and its format', () => {
    expect(executeDataInput(node).output).toEqual({ text: 'alpha,beta', format: 'csv' });
  });

  it('defaults a missing format to text', () => {
    expect(executeDataInput({ ...node, config: { text: 'hello' } }).output).toEqual({ text: 'hello', format: 'text' });
  });

  it('throws data_input_incomplete when the payload is blank', () => {
    expectPermanent(() => executeDataInput({ ...node, config: { text: '  ' } }), 'data_input_incomplete');
  });
});

function parseNode(config: DataParseNode['config']): DataParseNode {
  return {
    id: 'parse-1',
    type: 'ai-studio/data-parse',
    config,
  };
}

describe('executeDataParse', () => {
  it('splits lines and drops blanks', () => {
    expect(executeDataParse(parseNode({ source: 'one\n\n two ', format: 'lines' }), context()).output).toEqual({
      lines: ['one', 'two'],
      text: 'one\ntwo',
    });
  });

  it('reads a CSV header into row objects', () => {
    expect(
      executeDataParse(parseNode({ source: 'name, side\nAble, friendly', format: 'csv' }), context()).output,
    ).toEqual({
      rows: [{ name: 'Able', side: 'friendly' }],
      text: 'name, side\nAble, friendly',
    });
  });

  it('parses JSON and keeps the source text', () => {
    expect(executeDataParse(parseNode({ source: '{"side":"friendly"}', format: 'json' }), context()).output).toEqual({
      value: { side: 'friendly' },
      text: '{"side":"friendly"}',
    });
  });

  it('resolves a template reference before parsing', () => {
    const result = executeDataParse(
      parseNode({ source: '{{nodes.input-1.text}}', format: 'lines' }),
      context({
        'input-1': { text: 'alpha\nbeta' },
      }),
    );

    expect(result.output).toEqual({ lines: ['alpha', 'beta'], text: 'alpha\nbeta' });
  });

  it('throws data_parse_failed when the source is empty', () => {
    expectPermanent(
      () => executeDataParse(parseNode({ source: '  ', format: 'lines' }), context()),
      'data_parse_failed',
    );
  });

  it('throws data_parse_failed when JSON does not parse', () => {
    expectPermanent(() => executeDataParse(parseNode({ source: '{', format: 'json' }), context()), 'data_parse_failed');
  });
});
