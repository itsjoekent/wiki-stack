import { beforeEach, describe, it, expect, vi } from 'vitest';
import { Reducer } from './reducer';

type MockState = {
  count: number;
  message: string;
};

describe('Reducer', () => {
  let reducer: Reducer<MockState>;

  beforeEach(() => {
    reducer = new Reducer<MockState>({ count: 0, message: '' });
  });

  it('should return the initial state using getState', () => {
    const state = reducer.getState();
    expect(state).toEqual({ count: 0, message: '' });
  });

  it('should update state when an action is dispatched', () => {
    const increment = reducer.defineAction<{ amount: number }>(
      'increment',
      ({ payload, state }) => {
        state.count += payload.amount;
      },
    );

    increment({ amount: 5 });
    const state = reducer.getState();
    expect(state.count).toBe(5);
  });

  it('should emit state_changed event when state changes', () => {
    const listener = vi.fn();
    reducer.registerStateChangedListener(listener);

    const updateMessage = reducer.defineAction<{ text: string }>(
      'update_message',
      ({ payload, state }) => {
        state.message = payload.text;
      },
    );

    updateMessage({ text: 'Hello, world!' });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          previousState: { count: 0, message: '' },
          updatedState: { count: 0, message: 'Hello, world!' },
        },
      }),
    );
  });

  it('should emit action_dispatched and action_completed events', () => {
    const dispatchedListener = vi.fn();
    const completedListener = vi.fn();

    reducer.registerActionDispatchedListener(dispatchedListener);
    reducer.registerActionCompletedListener(completedListener);

    const increment = reducer.defineAction<{ amount: number }>(
      'increment',
      ({ payload, state }) => {
        state.count += payload.amount;
      },
    );

    increment({ amount: 10 });

    expect(dispatchedListener).toHaveBeenCalledTimes(1);
    expect(dispatchedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          type: 'increment',
          payload: { amount: 10 },
          state: { count: 0, message: '' },
        },
      }),
    );

    expect(completedListener).toHaveBeenCalledTimes(1);
    expect(completedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          type: 'increment',
          payload: { amount: 10 },
          previousState: { count: 0, message: '' },
          updatedState: { count: 10, message: '' },
        },
      }),
    );
  });

  it('should emit action_failed event when an action throws an error', () => {
    const failedListener = vi.fn();
    reducer.registerActionFailedListener(failedListener);

    const faultyAction = reducer.defineAction('faulty_action', () => {
      throw new Error('Something went wrong');
    });

    expect(() => faultyAction({})).not.toThrow();

    expect(failedListener).toHaveBeenCalledTimes(1);
    expect(failedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          type: 'faulty_action',
          payload: {},
          state: { count: 0, message: '' },
          error: expect.any(Error),
        },
      }),
    );
  });

  it('should throw an error when replaying an unregistered action', () => {
    expect(() => reducer.dangerouslyReplayAction('unknown_action', {})).toThrow(
      'Action handler for type "unknown_action" not found.',
    );
  });

  it('should unregister a listener successfully', () => {
    const listener = vi.fn();
    const id = reducer.registerStateChangedListener(listener);

    reducer.unregisterListener(id);

    const increment = reducer.defineAction<{ amount: number }>(
      'increment',
      ({ payload, state }) => {
        state.count += payload.amount;
      },
    );

    increment({ amount: 1 });

    expect(listener).not.toHaveBeenCalled();
  });
});
