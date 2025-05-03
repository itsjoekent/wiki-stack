import ky, { type KyInstance } from 'ky';
import { Reducer } from '@/lib/reducer';
import { registerActions } from './actions';
import { selectQueryFromPathMethod } from './selectors';
import type { FetchClientState } from './types';

type InitOptions = {
  baseUrl?: string;
  baseHeaders?: Record<string, string>;
};

export class FetchClient {
  private baseUrl: string;
  public api: KyInstance;
  private reducerInstance: Reducer<FetchClientState>;

  constructor(options: InitOptions = {}) {
    const { baseUrl = '', baseHeaders = {} } = options;

    this.baseUrl = baseUrl;
    this.reducerInstance = new Reducer<FetchClientState>({
      queries: {},
    });

    const {
      setQueryIsLoading,
      setQueryHasCompleted,
      setQueryHasFailed,
    } = registerActions(this.reducerInstance);

    this.api = ky.create({
      prefixUrl: baseUrl,
      headers: baseHeaders,
      hooks: {
        beforeRequest: [
          (request) => {
            const { method, url } = request;
            const path = this.urlToPath(url);

            setQueryIsLoading({ path, method });
          },
        ],
        beforeError: [
          (error) => {
            const { request } = error;
            const { method, url } = request;
            const path = this.urlToPath(url);

            setQueryHasFailed({ path, method, error: error.message });
            return error;
          },
        ],
        afterResponse: [
          (request, options, response) => {
            const { method, url } = request;
            const path = this.urlToPath(url);

            if (response.ok) {
              setQueryHasCompleted({ path, method });
            }
          },
        ],
      }
    });
  }

  private urlToPath(url: string) {
    return new URL(url).pathname;
  }

  private joinPath(path: string) {
    return `${this.baseUrl}/${path}`;
  }

  isSuccess(method: string, path: string) {
    const query = selectQueryFromPathMethod(
      this.reducerInstance.getState(),
      method,
      this.joinPath(path),
    );

    return query.isSuccess;
  }

  isLoading(method: string, path: string) {
    const query = selectQueryFromPathMethod(
      this.reducerInstance.getState(),
      method,
      this.joinPath(path),
    );

    return query.isLoading;
  }

  isError(method: string, path: string) {
    const query = selectQueryFromPathMethod(
      this.reducerInstance.getState(),
      method,
      this.joinPath(path),
    );

    return query.error;
  }
}
