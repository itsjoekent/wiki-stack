export type Query = {
  isSuccess: boolean;
  isLoading: boolean;
  error: string | null;
};

export type FetchClientState = {
  queries: Record<string, Query>;
};
