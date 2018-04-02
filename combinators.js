// @flow

export function k<T>(a: T): () => T {
  return () => a;
}

export function id<T>(a: T): T {
  return a;
}
