import type { Query, FetchClientState } from './types';
import { computeQueryKey } from './utils';

export function selectQueryFromKey(state: FetchClientState, key: string) {
  return (
    state.queries[key] ||
    ({
      isInitialLoading: false,
      isLoading: false,
      error: null,
      isSuccess: false,
    } as Query)
  );
}

export function selectQueryFromPathMethod(
  state: FetchClientState,
  method: string,
  path: string,
) {
  return selectQueryFromKey(state, computeQueryKey(method, path));
}
