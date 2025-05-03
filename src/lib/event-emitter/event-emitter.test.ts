import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from './event-emitter';

type TestEvents = {
  test_event: { message: string };
  another_event: { count: number };
};

describe('EventEmitter', () => {
  it('should allow subscribing to an event and emitting it', () => {
    const emitter = new EventEmitter<TestEvents>();
    const listener = vi.fn();

    const listenerId = emitter.subscribe('test_event', listener);
    expect(listenerId).toBeDefined();

    emitter.emit('test_event', { message: 'Hello, world!' });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      id: expect.any(String),
      type: 'test_event',
      data: { message: 'Hello, world!' },
    });
  });

  it('should allow unsubscribing from an event', () => {
    const emitter = new EventEmitter<TestEvents>();
    const listener = vi.fn();

    const listenerId = emitter.subscribe('test_event', listener);
    emitter.unsubscribe(listenerId);

    emitter.emit('test_event', { message: 'This should not be received' });

    expect(listener).not.toHaveBeenCalled();
  });

  it('should handle multiple listeners for the same event', () => {
    const emitter = new EventEmitter<TestEvents>();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    emitter.subscribe('test_event', listener1);
    emitter.subscribe('test_event', listener2);

    emitter.emit('test_event', { message: 'Broadcast to all listeners' });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('should not emit events to listeners of a different type', () => {
    const emitter = new EventEmitter<TestEvents>();
    const listener = vi.fn();

    emitter.subscribe('another_event', listener);

    emitter.emit('test_event', { message: 'This should not be received' });

    expect(listener).not.toHaveBeenCalled();
  });

  it('should freeze emitted events to prevent modification', () => {
    const emitter = new EventEmitter<TestEvents>();
    const listener = vi.fn((event) => {
      expect(() => {
        event.data.message = 'Modified';
      }).toThrow();
    });

    emitter.subscribe('test_event', listener);
    emitter.emit('test_event', { message: 'Immutable event' });

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
