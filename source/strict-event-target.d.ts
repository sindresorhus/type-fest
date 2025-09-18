interface EventListenerObject<EventType> {
	handleEvent(object: EventType): void;
}

interface EventListener<EventType> {
	(evt: EventType): void;
}

type EventListenerOrEventListenerObject<EventType> = EventListener<EventType> | EventListenerObject<EventType>;

type EventType<EventData> = EventData extends never ? Event : CustomEvent<EventData>;

export declare class StrictEventTarget<Events extends Record<string, unknown> = {}> implements EventTarget {
	addEventListener<EventName extends keyof Events>(
		type: EventName,
		listener: EventListenerOrEventListenerObject<EventType<Events[EventName]>> | null,
		options?: AddEventListenerOptions | boolean,
	): void;
	removeEventListener<EventName extends keyof Events>(
		type: EventName,
		listener: EventListenerOrEventListenerObject<EventType<Events[EventName]>> | null,
		options?: EventListenerOptions | boolean,
	): void;
	dispatchEvent<EventName extends keyof Events>(
		event: EventType<Events[EventName]>,
	): boolean;
}
