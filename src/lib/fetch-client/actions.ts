import { type Reducer } from '@/lib/reducer';
import { selectQueryFromKey } from './selectors';
import { type FetchClientState } from './types';
import { computeQueryKey } from './utils';

export type SetQueryIsLoadingActionPayload = {
  path: string;
  method: string;
};

export const setQueryIsLoadingActionName = 'set_query_is_loading';

export type SetQueryHasCompletedActionPayload = {
  path: string;
  method: string;
};

export const setQueryHasCompletedActionName = 'set_query_has_completed';

export type SetQueryHasFailedActionPayload = {
  path: string;
  method: string;
  error?: string;
};

export const setQueryHasFailedActionName = 'set_query_has_failed';

export function registerActions(reducer: Reducer<FetchClientState>) {
  const setQueryIsLoading =
    reducer.defineAction<SetQueryIsLoadingActionPayload>(
      setQueryIsLoadingActionName,
      ({ state, payload }) => {
        const key = computeQueryKey(payload.path, payload.method);
        const query = selectQueryFromKey(state, key);

        state.queries[key] = {
          ...query,
          isLoading: true,
          isSuccess: false,
          error: null,
        };
      },
    );

  const setQueryHasCompleted =
    reducer.defineAction<SetQueryHasCompletedActionPayload>(
      setQueryHasCompletedActionName,
      ({ state, payload }) => {
        const key = computeQueryKey(payload.path, payload.method);
        const query = selectQueryFromKey(state, key);

        state.queries[key] = {
          ...query,
          isLoading: false,
          isSuccess: true,
          error: null,
        };
      },
    );

  const setQueryHasFailed =
    reducer.defineAction<SetQueryHasFailedActionPayload>(
      setQueryHasFailedActionName,
      ({ state, payload }) => {
        const key = computeQueryKey(payload.path, payload.method);
        const query = selectQueryFromKey(state, key);

        state.queries[key] = {
          ...query,
          isLoading: false,
          isSuccess: false,
          error: payload.error || 'An unexpected error occurred',
        };
      },
    );

  return {
    setQueryIsLoading,
    setQueryHasCompleted,
    setQueryHasFailed,
  };
}
