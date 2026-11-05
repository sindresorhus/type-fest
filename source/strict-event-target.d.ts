import type {FindGlobalInstanceType} from './find-global-type.d.ts';

/**
The global `EventTarget` instance type, or `never` when the lib has no DOM or Node.js types.
*/
type EventTargetInstance = FindGlobalInstanceType<'EventTarget'>;

/**
The global `Event` instance type, or `never` when the lib has no DOM or Node.js types.
*/
type EventInstance = FindGlobalInstanceType<'Event'>;

/**
The options of `addEventListener`, including its `boolean` shorthand.
*/
type AddListenerOptions = Parameters<EventTargetInstance['addEventListener']>[2];

/**
The options of `removeEventListener`, including its `boolean` shorthand.
*/
type RemoveListenerOptions = Parameters<EventTargetInstance['removeEventListener']>[2];

/**
A listener for one event: a function or an object with a `handleEvent` function.

`handleEvent` is a function-typed property rather than a method, so a handler cannot narrow the event type. This matches the function listener form.
*/
type EventListenerFor<Target, EventValue> = ((this: Target, event: EventValue) => void) | {handleEvent: (event: EventValue) => void};

/**
A stricter version of [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) that maps event names to event types.

Use-cases:
- Add types to an `EventTarget` from a library without changing its runtime code.
- Type an instance of a class that extends `EventTarget`.
- Type an event target built on the DOM API in a browser, Node.js, Deno, or Bun.

`EventMap` values are event types, like the values in `WindowEventMap` or `HTMLElementEventMap`. For an event without data, use `Event`.

The event map is constrained to the global `Event` type, so it requires the DOM types or the Node.js types.

@example
```
import type {StrictEventTarget} from 'type-fest';

type AppEvents = {
	save: CustomEvent<{id: string}>;
	close: Event;
};

const target: StrictEventTarget<AppEvents> = new EventTarget();

target.addEventListener('save', event => {
	const {id} = event.detail;
	//=> string
});

// @ts-expect-error `unknown` is not an event name.
target.addEventListener('unknown', null);

target.dispatchEvent(new CustomEvent('save', {detail: {id: 'abc'}}));
```

Declare the target as `StrictEventTarget<EventMap>`, then assign or cast the real `EventTarget` to it. The methods are declared structurally, so no runtime code is needed.

Note: `dispatchEvent` checks the event type, not the event name, because the type of `CustomEvent` does not include its event name. It also cannot check that a `detail` is present, because the constructor takes the detail type from the map. When a mapped value is a wider type, like `Event`, any event of that type is accepted, including one whose name is not in the map. In a map with several events, an event can carry the detail type of a different event.

@category Improved Built-in
*/
export type StrictEventTarget<EventMap extends Record<keyof EventMap, EventInstance>> = {
	addEventListener<Name extends keyof EventMap & string>(
		type: Name,
		listener: EventListenerFor<StrictEventTarget<EventMap>, EventMap[Name]> | null,
		options?: AddListenerOptions
	): void;
	removeEventListener<Name extends keyof EventMap & string>(
		type: Name,
		listener: EventListenerFor<StrictEventTarget<EventMap>, EventMap[Name]> | null,
		options?: RemoveListenerOptions
	): void;
	dispatchEvent(event: EventMap[keyof EventMap]): boolean;
};

export {};
