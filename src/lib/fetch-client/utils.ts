export function computeQueryKey(method: string, path: string): string {
  return `${method.toLowerCase()}-${path}`;
}
