export type GenericEvents = Record<string | number | symbol, unknown>;

export type EventWrapper<
  Events extends GenericEvents,
  EventType extends keyof Events = keyof Events,
  EventShape extends Events[EventType] = Events[EventType],
> = {
  id: string;
  type: EventType;
  data: EventShape;
};

export type EventListener<
  Events extends GenericEvents,
  EventType extends keyof Events,
> = (event: EventWrapper<Events, EventType>) => void;
