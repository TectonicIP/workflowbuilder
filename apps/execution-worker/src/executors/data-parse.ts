import { type ExecutionContext, PermanentNodeExecutionError, resolveTemplate } from '@workflow-builder/execution-core';

import type { DataParseNode } from '../domain/ai-studio-nodes';

const FORMATS = ['lines', 'csv', 'json'] as const;
type DataParseFormat = (typeof FORMATS)[number];

const CODE = 'data_parse_failed';

export function executeDataParse(node: DataParseNode, context: ExecutionContext) {
  const source = typeof node.config.source === 'string' ? node.config.source.trim() : '';
  if (source.length === 0) {
    throw new PermanentNodeExecutionError(CODE, 'Source is required.');
  }
  const text = resolveTemplate(source, context).trim();
  if (text.length === 0) {
    throw new PermanentNodeExecutionError(CODE, 'Source resolved to an empty payload.');
  }
  return { output: parsePayload(parseFormat(node.config.format), text) };
}

function parsePayload(format: DataParseFormat, text: string) {
  switch (format) {
    case 'lines': {
      return parseLines(text);
    }
    case 'csv': {
      return parseCsv(text);
    }
    case 'json': {
      return parseJson(text);
    }
    default: {
      const unreachable: never = format;
      throw new PermanentNodeExecutionError(CODE, `Unhandled format: ${String(unreachable)}`);
    }
  }
}

function parseLines(text: string) {
  const lines = nonEmptyLines(text);
  return { lines, text: lines.join('\n') };
}

function parseCsv(text: string) {
  const lines = nonEmptyLines(text);
  const headerLine = lines[0];
  if (!headerLine) {
    throw new PermanentNodeExecutionError(CODE, 'CSV needs a header line.');
  }
  const headers = splitCsvLine(headerLine);
  const rows = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
  return { rows, text };
}

function parseJson(text: string) {
  try {
    return { value: JSON.parse(text) as unknown, text };
  } catch (error) {
    throw new PermanentNodeExecutionError(CODE, 'JSON did not parse.', { cause: error });
  }
}

function nonEmptyLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function splitCsvLine(line: string): string[] {
  return line.split(',').map((cell) => cell.trim());
}

function parseFormat(value: unknown): DataParseFormat {
  if (value === undefined || value === '') return 'lines';
  if (isFormat(value)) return value;
  throw new PermanentNodeExecutionError(CODE, 'Format must be lines, csv, or json.');
}

function isFormat(value: unknown): value is DataParseFormat {
  return typeof value === 'string' && (FORMATS as readonly string[]).includes(value);
}
