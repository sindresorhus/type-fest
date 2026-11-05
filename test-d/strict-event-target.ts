import {expectTypeOf} from 'nz';
import type {StrictEventTarget} from '../index.d.ts';

type AppEvents = {
	save: CustomEvent<{id: string}>;
	close: Event;
};

// An `EventTarget` is assignable to the stricter type, so no cast is needed.
const target: StrictEventTarget<AppEvents> = new EventTarget();

// A subclass instance and a function that returns the built-in type work too.
class CustomTarget extends EventTarget {
	extraProperty = true;
}

const fromClass: StrictEventTarget<AppEvents> = new CustomTarget();
fromClass.addEventListener('close', null);

const createTarget = (): EventTarget => new EventTarget();
const fromFunction: StrictEventTarget<AppEvents> = createTarget();
fromFunction.addEventListener('close', null);

// A cast also works.
const castTarget = new EventTarget() as StrictEventTarget<AppEvents>;
castTarget.addEventListener('save', null);

// A map without a plain `Event` still accepts the built-in target.
type SaveEvents = {
	save: CustomEvent<{id: string}>;
};

const preciseTarget: StrictEventTarget<SaveEvents> = new EventTarget();
preciseTarget.addEventListener('save', null);

// A `Window` is an `EventTarget` with its own event map.
const fromWindow: StrictEventTarget<WindowEventMap> = globalThis;
fromWindow.addEventListener('click', event => {
	expectTypeOf(event).toBeAssignableTo<MouseEvent>();
});

// The stricter type is assignable to the built-in type, but is not the same type.
expectTypeOf(target).toBeAssignableTo<EventTarget>();
expectTypeOf<StrictEventTarget<AppEvents>>().not.toBe<EventTarget>();

// Only the three `EventTarget` members are present.
expectTypeOf<keyof StrictEventTarget<AppEvents>>().toBe<'addEventListener' | 'removeEventListener' | 'dispatchEvent'>();

// The event name parameter is restricted to the map keys.
expectTypeOf<Parameters<StrictEventTarget<AppEvents>['addEventListener']>[0]>().toBe<'save' | 'close'>();

// The listener receives the event mapped to the event name.
target.addEventListener('save', event => {
	expectTypeOf(event).toBe<CustomEvent<{id: string}>>();
	expectTypeOf(event.detail.id).toBe<string>();
});

target.addEventListener('close', event => {
	expectTypeOf(event).toBe<Event>();
});

// The listener is contextually typed, so it stays inline.
// eslint-disable-next-line unicorn/no-invalid-remove-event-listener
target.removeEventListener('save', event => {
	expectTypeOf(event).toBe<CustomEvent<{id: string}>>();
});

// A function listener is called with the target as `this`.
target.addEventListener('save', function (event) {
	expectTypeOf(this).toBe<StrictEventTarget<AppEvents>>();
	expectTypeOf(event).toBe<CustomEvent<{id: string}>>();
});

// The `this` type can be wider than the target, but not narrower.
function broadHandler(this: EventTarget, event: Event) {
	expectTypeOf(event).toBe<Event>();
}

target.addEventListener('save', broadHandler);

function narrowHandler(this: Window, event: Event) {
	expectTypeOf(event).toBe<Event>();
}

// @ts-expect-error `StrictEventTarget<AppEvents>` is not assignable to `Window`, so the `this` type is too narrow.
target.addEventListener('save', narrowHandler);

// A listener can use a wider event type or no parameters at all.
target.addEventListener('save', (event: Event) => {
	expectTypeOf(event).toBe<Event>();
});

let calls = 0;
target.addEventListener('save', () => {
	calls++;
});

// An optional event parameter is accepted.
target.addEventListener('save', (event?: CustomEvent<{id: string}>) => {
	expectTypeOf(event).toBe<CustomEvent<{id: string}> | undefined>();
});

// A `handleEvent` object is accepted.
target.addEventListener('save', {
	handleEvent(event) {
		expectTypeOf(event).toBe<CustomEvent<{id: string}>>();
	},
});

// Its parameter can be wider, and it can return a value.
target.addEventListener('save', {
	handleEvent(event: Event) {
		return event.type;
	},
});

// The `handleEvent` member can be a property, not just a method.
target.addEventListener('save', {
	// eslint-disable-next-line object-shorthand
	handleEvent: event => {
		expectTypeOf(event).toBe<CustomEvent<{id: string}>>();
	},
});

// A class instance with a `handleEvent` method is accepted.
class SaveListener {
	handleEvent(event: CustomEvent<{id: string}>) {
		expectTypeOf(event).toBe<CustomEvent<{id: string}>>();
	}
}

target.addEventListener('save', new SaveListener());

// Listeners typed against the built-in API are accepted.
declare const builtInListener: EventListener;
declare const builtInListenerObject: EventListenerObject;
target.addEventListener('save', builtInListener);
target.addEventListener('save', builtInListenerObject);

// Generic forwarding keeps the event tied to the name.
function addTypedListener<Name extends keyof AppEvents & string>(name: Name, listener: (event: AppEvents[Name]) => void) {
	target.addEventListener(name, listener);
}

// A union of event names gives a union of events.
type TwoEvents = {
	create: CustomEvent<{created: string}>;
	remove: CustomEvent<{removed: number}>;
};

declare const twoTarget: StrictEventTarget<TwoEvents>;
declare const twoName: 'create' | 'remove';

twoTarget.addEventListener(twoName, event => {
	expectTypeOf(event).toBe<TwoEvents['create' | 'remove']>();
});

twoTarget.addEventListener(twoName, {
	handleEvent(event) {
		expectTypeOf(event).toBe<TwoEvents['create' | 'remove']>();
	},
});

// @ts-expect-error The listener must accept both events.
twoTarget.addEventListener(twoName, (event: CustomEvent<{created: string}>) => {
	expectTypeOf(event).toBe<CustomEvent<{created: string}>>();
});

twoTarget.addEventListener(twoName, {
	// @ts-expect-error The handler must accept both events.
	handleEvent(event: CustomEvent<{created: string}>) {
		expectTypeOf(event).toBe<CustomEvent<{created: string}>>();
	},
});

// A `null` listener is accepted, like the built-in signatures.
target.addEventListener('save', null);
target.removeEventListener('save', null);

// The listener options are accepted.
target.addEventListener('save', null, {once: true});
target.addEventListener('save', null, {capture: true, passive: true});
target.addEventListener('save', null, {signal: new AbortController().signal});
// eslint-disable-next-line unicorn/prefer-add-event-listener-options
target.addEventListener('save', null, true);
target.removeEventListener('save', null, {capture: true});
target.removeEventListener('save', null, false);

// A fresh options object cannot use options that `removeEventListener` ignores.
// @ts-expect-error `once` is not a `removeEventListener` option.
target.removeEventListener('save', null, {once: true});
// @ts-expect-error `passive` is not a `removeEventListener` option.
target.removeEventListener('save', null, {passive: true});

// Unknown options and wrong option values are rejected.
// @ts-expect-error `unknownOption` is not an `AddEventListenerOptions` key.
target.addEventListener('save', null, {unknownOption: true});
// @ts-expect-error `once` must be a boolean.
target.addEventListener('save', null, {once: 'yes'});

// `dispatchEvent` returns `boolean`.
expectTypeOf(target.dispatchEvent(new CustomEvent('save', {detail: {id: 'abc'}}))).toBe<boolean>();
expectTypeOf(target.dispatchEvent(new Event('close'))).toBe<boolean>();

// `dispatchEvent` only accepts the mapped event types.
expectTypeOf<Parameters<StrictEventTarget<SaveEvents>['dispatchEvent']>[0]>().toBe<CustomEvent<{id: string}>>();

// A plain `Event` in the map makes `dispatchEvent` accept any event.
target.dispatchEvent(new CustomEvent('save', {detail: {id: 'abc'}}));
target.dispatchEvent(new Event('close'));
target.dispatchEvent(new MouseEvent('click'));
target.dispatchEvent(new CustomEvent('not-in-the-map'));
target.dispatchEvent(new CustomEvent('save', {detail: {id: 1}}));

// A subclass of the mapped event is accepted.
class SaveEvent extends CustomEvent<{id: string}> {}

preciseTarget.dispatchEvent(new SaveEvent('save'));

// An omitted detail is not checked, because the constructor is contextually typed by the map.
preciseTarget.dispatchEvent(new CustomEvent('save'));
preciseTarget.dispatchEvent(new CustomEvent('save', {}));

// A map with only precise events rejects any other event.
// @ts-expect-error The detail must be a string.
preciseTarget.dispatchEvent(new CustomEvent('save', {detail: {id: 1}}));
// @ts-expect-error A plain `Event` is not a `CustomEvent<{id: string}>`.
preciseTarget.dispatchEvent(new Event('save'));
// @ts-expect-error A different event is not accepted.
preciseTarget.dispatchEvent(new MouseEvent('click'));

// A union of precise events accepts each of them.
twoTarget.dispatchEvent(new CustomEvent('create', {detail: {created: 'abc'}}));
twoTarget.dispatchEvent(new CustomEvent('remove', {detail: {removed: 1}}));
// The event name is not checked, so an event can carry the detail of another event.
twoTarget.dispatchEvent(new CustomEvent('create', {detail: {removed: 1}}));
// @ts-expect-error The detail belongs to neither event.
twoTarget.dispatchEvent(new CustomEvent('create', {detail: {created: 1}}));

// `dispatchEvent` requires an event.
// @ts-expect-error A string is not an event.
target.dispatchEvent('save');
// @ts-expect-error An object with a `type` is not an event.
target.dispatchEvent({type: 'save'});

// Event names must be keys of the map.
// @ts-expect-error `unknown` is not a key of `AppEvents`.
target.addEventListener('unknown', null);
// @ts-expect-error `unknown` is not a key of `AppEvents`.
target.removeEventListener('unknown', null);

declare const stringName: string;
// @ts-expect-error A `string` is not a key.
target.addEventListener(stringName, null);

// The listener must match the mapped event.
// @ts-expect-error The listener parameter is not an event.
target.addEventListener('save', (event: number) => {
	expectTypeOf(event).toBe<number>();
});

// A `handleEvent` object must accept the mapped event, like the function form.
// @ts-expect-error The handler must accept the mapped event.
target.addEventListener('save', {handleEvent: (event: MouseEvent) => event.preventDefault()});

// A wider mapped event does not let the listener narrow the event.
// @ts-expect-error `MouseEvent` is not assignable to `Event`.
target.addEventListener('close', (event: MouseEvent) => event.preventDefault());

// @ts-expect-error `MouseEvent` is not assignable to `Event`.
target.addEventListener('close', {handleEvent: (event: MouseEvent) => event.preventDefault()});

target.addEventListener('close', {
	// @ts-expect-error `MouseEvent` is not assignable to `Event`.
	handleEvent(event: MouseEvent) {
		event.preventDefault();
	},
});

// A fresh listener object cannot have extra properties.
target.addEventListener('save', {
	handleEvent(event: Event) {
		expectTypeOf(event).toBe<Event>();
	},
	// @ts-expect-error `extra` is not part of the listener object.
	extra: true,
});

// The listener is required.
// @ts-expect-error A listener is required.
target.addEventListener('save');

// An index signature accepts any event name.
declare const dynamicTarget: StrictEventTarget<Record<string, Event>>;
dynamicTarget.addEventListener('anything', event => {
	expectTypeOf(event).toBe<Event>();
});
dynamicTarget.dispatchEvent(new MouseEvent('click'));

// An interface event map is accepted, like the built-in `WindowEventMap`.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InterfaceEvents {
	update: CustomEvent<{value: number}>;
	clear: CustomEvent<{all: boolean}>;
}

declare const interfaceTarget: StrictEventTarget<InterfaceEvents>;
interfaceTarget.addEventListener('update', event => {
	expectTypeOf(event).toBe<CustomEvent<{value: number}>>();
});
interfaceTarget.dispatchEvent(new CustomEvent('update', {detail: {value: 1}}));
interfaceTarget.dispatchEvent(new CustomEvent('clear', {detail: {all: true}}));
// @ts-expect-error The detail must be a number.
interfaceTarget.dispatchEvent(new CustomEvent('update', {detail: {value: '1'}}));

// Built-in event maps work directly and keep their event types.
declare const windowTarget: StrictEventTarget<WindowEventMap>;
windowTarget.addEventListener('click', event => {
	expectTypeOf(event).toBeAssignableTo<MouseEvent>();
});
windowTarget.addEventListener('keydown', event => {
	expectTypeOf(event).toBeAssignableTo<KeyboardEvent>();
});

declare const elementTarget: StrictEventTarget<HTMLElementEventMap>;
elementTarget.addEventListener('input', event => {
	expectTypeOf(event).toBe<InputEvent>();
});

// Map values must be events.
// @ts-expect-error A string is not an event.
type InvalidEventMap = StrictEventTarget<{save: string}>;
// @ts-expect-error `unknown` is not an event.
type UnknownEventValueMap = StrictEventTarget<{save: unknown}>;
// @ts-expect-error An optional value is not a required one.
type OptionalEventValueMap = StrictEventTarget<{save?: Event}>;

// `null`, `undefined`, and `unknown` are not event maps.
// @ts-expect-error `null` is not an event map.
type NullEventMap = StrictEventTarget<null>;
// @ts-expect-error `undefined` is not an event map.
type UndefinedEventMap = StrictEventTarget<undefined>;
// @ts-expect-error `unknown` does not extend the event map constraint.
type InvalidTarget = StrictEventTarget<unknown>;

// An empty map accepts no event names and no events.
declare const emptyTarget: StrictEventTarget<{}>;
// @ts-expect-error The empty map has no event names.
emptyTarget.addEventListener('anything', null);
// @ts-expect-error The empty map has no events.
emptyTarget.dispatchEvent(new Event('anything'));

// An `any` event map accepts any name and any event.
declare const anyTarget: StrictEventTarget<any>;
anyTarget.addEventListener('anything', event => {
	expectTypeOf(event).toBe<any>();
});
anyTarget.dispatchEvent(new Event('anything'));

// An `any` event value makes the listener and the dispatched event `any`.
declare const anyValueTarget: StrictEventTarget<{save: any}>;
anyValueTarget.addEventListener('save', event => {
	expectTypeOf(event).toBe<any>();
});
anyValueTarget.dispatchEvent(123);

// A `never` event map accepts any name, but no listener can receive an event and no event can be dispatched.
declare const neverTarget: StrictEventTarget<never>;
neverTarget.addEventListener('anything', null);
// @ts-expect-error A `never` map accepts no event to dispatch.
neverTarget.dispatchEvent(new Event('close'));
