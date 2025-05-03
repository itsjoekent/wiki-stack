import { useEffect, useRef, useState } from 'react';
import { diff } from 'deep-object-diff';
import { Reducer } from './reducer';
import type { GenericState } from './types';

type Selector<State, ReturnType> = (state: State) => ReturnType;

type LocalStateType<
  State extends GenericState,
  Selectors extends Array<Selector<State, unknown>>,
> = {
  [Index in keyof Selectors]: Selectors[Index] extends Selector<
    State,
    infer ReturnType
  >
    ? ReturnType
    : never;
};

function getStateValue<
  State extends GenericState,
  Selectors extends Array<Selector<State, unknown>>,
>(state: State, selectors: Selectors) {
  return selectors.map((selector) => selector(state)) as LocalStateType<
    State,
    Selectors
  >;
}

export function useReducer<
  State extends GenericState,
  Selectors extends Array<Selector<State, unknown>>,
>(reducer: Reducer<State>, ...selectors: Selectors) {
  const [localizedState, setLocalizedState] = useState(
    getStateValue(reducer.getState(), selectors),
  );
  const localizedStateRef = useRef(localizedState);

  useEffect(() => {
    const id = reducer.registerStateChangedListener((event) => {
      const updatedLocalizedState = getStateValue(
        event.data.updatedState,
        selectors,
      );

      const hasChanged =
        Object.keys(diff(localizedStateRef.current, updatedLocalizedState))
          .length > 0;

      if (hasChanged) {
        setLocalizedState(updatedLocalizedState);
        localizedStateRef.current = updatedLocalizedState;
      }
    });

    return () => {
      reducer.unregisterListener(id);
    };
  }, [reducer, selectors]);

  return localizedState;
}
