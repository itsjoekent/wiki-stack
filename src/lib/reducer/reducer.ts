import { produce, type Draft } from 'immer';
import { EventEmitter, type EventListener } from '@/lib/event-emitter';
import type { GenericState } from '@/lib/reducer/types';

type ReducerEvents<State extends GenericState> = {
  action_dispatched: {
    type: string;
    payload: unknown;
    state: State;
  };
  action_completed: {
    type: string;
    payload: unknown;
    previousState: State;
    updatedState: State;
  };
  action_failed: {
    type: string;
    payload: unknown;
    state: State;
    error: Error;
  };
  state_changed: {
    previousState: State;
    updatedState: State;
  };
};

export class Reducer<State extends GenericState> {
  private actionHandlers: Map<string, (payload: unknown) => void>;
  private eventEmitter: EventEmitter<ReducerEvents<State>>;
  private state: State;
  private actionQueue: Promise<void>;

  /**
   * Create a reducer with an initial state.
   *
   * @param initialState An object representing the initial state of the reducer.
   */
  constructor(initialState: State) {
    this.actionHandlers = new Map();
    this.eventEmitter = new EventEmitter();
    this.state = initialState;
    this.actionQueue = Promise.resolve();
  }

  /**
   *
   * @returns An immutable copy of the reducer state.
   */
  getState(): State {
    return Object.freeze(structuredClone(this.state));
  }

  /**
   * Register a reducer action.
   *
   * @example
   * ```ts
   * const action = reducer.defineAction<{ hello: string }>('test_action', ({ state, payload }) => {
   *  state.hello = payload.hello;
   * });
   * ```
   *
   * @param type {String} The unique name of the action
   * @param handler {Function} The function that will be called when the action is dispatched.
   * The function receives the action payload and the current state as arguments.
   * The state is a draft that can be modified directly.
   * The function will be wrapped in a try-catch block, and custom error dispatching logic.
   * @returns {Function} A function that can be called to dispatch the action.
   */
  defineAction<ActionPayload = void, ActionType extends string = string>(
    type: ActionType,
    handler: (action: { state: Draft<State>; payload: ActionPayload }) => void,
  ) {
    const wrapper = (payload: ActionPayload) => {
      this.actionQueue = this.actionQueue.then(() => {
        const previousState = structuredClone(this.state);

        this.eventEmitter.emit('action_dispatched', {
          type,
          payload,
          state: previousState,
        });

        Object.freeze(payload);
        let updatedState: State | undefined = undefined;

        try {
          updatedState = produce(previousState, (draft) => {
            handler({ state: draft, payload });
          });
        } catch (error) {
          this.eventEmitter.emit('action_failed', {
            type,
            payload,
            state: previousState,
            error: error as Error,
          });
        }

        if (!updatedState) {
          return;
        }

        this.state = updatedState;

        this.eventEmitter.emit('state_changed', {
          previousState,
          updatedState,
        });

        this.eventEmitter.emit('action_completed', {
          type,
          payload,
          previousState,
          updatedState,
        });
      });
    };

    const wrapped = wrapper.bind(this);
    this.actionHandlers.set(type, wrapped as (payload: unknown) => void);

    return wrapped;
  }

  /**
   * Replay an action on the reducer just using the action name and payload.
   * The reducer will attempt to find a handler for the action name and call it with the payload.
   * This should only be used for building abstract systems (eg: network, replay).
   *
   * @param type {String} The unique name of the action
   * @param payload {Mixed} The payload to pass to the action handler.
   */
  dangerouslyReplayAction(type: string, payload: unknown) {
    const actionHandler = this.actionHandlers.get(type);
    if (!actionHandler) {
      throw new Error(`Action handler for type "${type}" not found.`);
    }

    actionHandler(payload);
  }

  /**
   * Unregister an event listener attached to the reducer.
   *
   * @param id {String} The unique id of the listener.
   */
  unregisterListener(id: string) {
    this.eventEmitter.unsubscribe(id);
  }

  /**
   * Register a listener for when the reducer state changes.
   *
   * @param listener {Function} The function to call when the state changes.
   * The function receives an object with the previous and updated state as arguments.
   *
   * @returns {String} The unique id of the listener.
   */
  registerStateChangedListener(
    listener: EventListener<ReducerEvents<State>, 'state_changed'>,
  ) {
    return this.eventEmitter.subscribe('state_changed', listener);
  }

  /**
   * Register a listener for when an action is dispatched.
   *
   * @param listener {Function} The function to call when an action is dispatched.
   * The function receives an object with the action type, payload and current state as arguments.
   *
   * @returns {String} The unique id of the listener.
   */
  registerActionDispatchedListener(
    listener: EventListener<ReducerEvents<State>, 'action_dispatched'>,
  ) {
    return this.eventEmitter.subscribe('action_dispatched', listener);
  }

  /**
   * Register a listener for when an action was dispatched and completed.
   *
   * @param listener {Function} The function to call when an action is completed.
   * The function receives an object with the action type, payload, previous state and updated state as arguments.
   *
   * @returns {String} The unique id of the listener.
   */
  registerActionCompletedListener(
    listener: EventListener<ReducerEvents<State>, 'action_completed'>,
  ) {
    return this.eventEmitter.subscribe('action_completed', listener);
  }

  /**
   * Register a listener for when an action was dispatched and failed.
   *
   * @param listener {Function} The function to call when an action fails.
   * The function receives an object with the action type, payload, current state and error as arguments.
   *
   * @returns {String} The unique id of the listener.
   */
  registerActionFailedListener(
    listener: EventListener<ReducerEvents<State>, 'action_failed'>,
  ) {
    return this.eventEmitter.subscribe('action_failed', listener);
  }
}
