import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { Reducer } from './reducer';
import { useReducer } from './hooks';

describe('useReducer', () => {
  it.only('should return the correct localized state', () => {
    const reducer = new Reducer({ a: 0, b: 1, c: 3 });

    const incrementA = reducer.defineAction<number>(
      'incrementA',
      ({ payload, state }) => (state.a += payload),
    );
    const incrementC = reducer.defineAction<number>(
      'incrementC',
      ({ payload, state }) => (state.c += payload),
    );

    const selectA = (state: { a: number; b: number }) => state.a;
    const selectB = (state: { a: number; b: number }) => state.b;

    const { result } = renderHook(() => useReducer(reducer, selectA, selectB));

    expect(result.current).toEqual([0, 1]);

    act(() => {
      incrementA(1);
    });
    expect(result.current).toEqual([1, 1]);

    act(() => {
      incrementC(2);
    });
    expect(result.current).toEqual([1, 1]);
  });
});
