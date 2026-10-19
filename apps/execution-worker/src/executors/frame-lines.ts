import { PermanentNodeExecutionError } from '@workflow-builder/execution-core';

const CONSTRAINT_KINDS = ['hard', 'soft'] as const;
const ASSUMPTION_CRITICALITIES = ['high', 'medium', 'low'] as const;

export type ConstraintKind = (typeof CONSTRAINT_KINDS)[number];
export type AssumptionCriticality = (typeof ASSUMPTION_CRITICALITIES)[number];

export type ParsedConstraint = { kind: ConstraintKind; text: string };

export type ParsedAssumption = {
  criticality: AssumptionCriticality;
  statement: string;
  falsifier: string;
};

export function requiredText(value: unknown, code: string, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new PermanentNodeExecutionError(code, `${field} is required.`);
  }
  return value.trim();
}

export function optionalText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseConstraintLines(source: unknown): ParsedConstraint[] {
  return lines(source).flatMap((line) => {
    const parsed = parseConstraintLine(line);
    return parsed ? [parsed] : [];
  });
}

export function parseAssumptionLines(source: unknown): ParsedAssumption[] {
  return lines(source).flatMap((line) => {
    const parsed = parseAssumptionLine(line);
    return parsed ? [parsed] : [];
  });
}

export function formatAssumption(assumption: ParsedAssumption): string {
  return assumption.falsifier.length > 0
    ? `${assumption.criticality} | ${assumption.statement} | ${assumption.falsifier}`
    : `${assumption.criticality} | ${assumption.statement}`;
}

function lines(source: unknown): string[] {
  if (typeof source !== 'string') return [];
  return source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function splitFields(line: string): string[] {
  return line.split('|').map((part) => part.trim());
}

// A prefix other than hard or soft stays part of the text, and the line is hard.
function parseConstraintLine(line: string): ParsedConstraint | null {
  const parts = splitFields(line);
  const prefix = parts[0]?.toLowerCase();
  if (parts.length > 1 && isConstraintKind(prefix)) {
    const text = parts.slice(1).join(' | ').trim();
    return text.length > 0 ? { kind: prefix, text } : null;
  }
  return { kind: 'hard', text: line };
}

// A first field other than high, medium, or low is the statement, at medium criticality.
function parseAssumptionLine(line: string): ParsedAssumption | null {
  const parts = splitFields(line);
  const prefix = parts[0]?.toLowerCase() ?? '';
  if (isCriticality(prefix)) {
    const statement = parts[1] ?? '';
    if (statement.length === 0) return null;
    return { criticality: prefix, statement, falsifier: parts.slice(2).join(' | ').trim() };
  }
  const statement = parts[0] ?? '';
  if (statement.length === 0) return null;
  return { criticality: 'medium', statement, falsifier: parts.slice(1).join(' | ').trim() };
}

function isConstraintKind(value: string | undefined): value is ConstraintKind {
  return value !== undefined && (CONSTRAINT_KINDS as readonly string[]).includes(value);
}

function isCriticality(value: string): value is AssumptionCriticality {
  return (ASSUMPTION_CRITICALITIES as readonly string[]).includes(value);
}
