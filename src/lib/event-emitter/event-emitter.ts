import { deepFreeze } from '@/lib/helpers';
import type { GenericEvents, EventListener, EventWrapper } from './types';

export class EventEmitter<Events extends GenericEvents> {
  private listenersById: Map<string, EventListener<Events, keyof Events>> =
    new Map();
  private listenerIdsToEventTypes: Map<string, keyof Events> = new Map();
  private eventTypesToListenerIds: Map<keyof Events, string[]> = new Map();

  subscribe<EventType extends keyof Events>(
    type: EventType,
    listener: EventListener<Events, EventType>,
  ): string {
    const id = crypto.randomUUID();
    this.listenersById.set(id, listener as EventListener<Events, keyof Events>);
    this.listenerIdsToEventTypes.set(id, type);

    const listenerIds = this.eventTypesToListenerIds.get(type) ?? [];
    listenerIds.push(id);
    this.eventTypesToListenerIds.set(type, listenerIds);

    return id;
  }

  unsubscribe(id: string) {
    const type = this.listenerIdsToEventTypes.get(id);
    if (type) {
      const listenerIds = this.eventTypesToListenerIds.get(type);
      if (listenerIds && listenerIds.length > 0) {
        this.eventTypesToListenerIds.set(
          type,
          listenerIds.filter((listenerId) => listenerId !== id),
        );
      }
    }

    this.listenersById.delete(id);
    this.listenerIdsToEventTypes.delete(id);
  }

  emit<EventType extends keyof Events>(
    type: EventType,
    payload: Events[EventType],
  ) {
    const listenerIds = this.eventTypesToListenerIds.get(type);
    if (!listenerIds) {
      return;
    }

    const event: EventWrapper<Events, EventType> = {
      id: crypto.randomUUID(),
      type,
      data: payload,
    };

    deepFreeze(event);

    listenerIds.forEach((id) => {
      const listener = this.listenersById.get(id);
      if (listener) {
        listener(event);
      }
    });
  }
}
