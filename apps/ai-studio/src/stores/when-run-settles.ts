import { isRunAlive, useExecutionStore } from './use-execution-store';

/** Resolves when the current run ends, or when Stop or a newer run aborts the queue. */
export function whenRunSettles(signal: AbortSignal): Promise<'finished' | 'stopped'> {
  const stoppedAlready = signal.aborted || useExecutionStore.getState().isStopRequested;
  if (stoppedAlready) return Promise.resolve('stopped');

  return new Promise((resolve) => {
    let settled = false;
    const finish = (outcome: 'finished' | 'stopped') => {
      if (settled) return;
      settled = true;
      unsubscribe();
      signal.removeEventListener('abort', onAbort);
      resolve(outcome);
    };
    const onAbort = () => finish('stopped');
    const check = () => {
      const state = useExecutionStore.getState();
      if (signal.aborted || state.isStopRequested) finish('stopped');
      else if (!isRunAlive(state.status)) finish('finished');
    };

    signal.addEventListener('abort', onAbort);
    const unsubscribe = useExecutionStore.subscribe(check);
    check();
  });
}
