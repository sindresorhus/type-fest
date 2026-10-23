import {expectTypeOf} from 'nz';
import type {TaggedUnion} from '../index.d.ts';

type Union = TaggedUnion<'tag', {str: {a: string}; num: {b: number}}>;

const first = {
	tag: 'str' as const,
	a: 'some-string',
};

const second = {
	tag: 'num' as const,
	b: 1,
};

expectTypeOf(first).toBeAssignableTo<Union>();
expectTypeOf(second).toBeAssignableTo<Union>();

const fails = {
	tag: 'num' as const,
	b: 'should not be string',
};

const failsToo = {
	tag: 'str' as const,
	b: 2,
};

expectTypeOf(fails).not.toBeAssignableTo<Union>();
expectTypeOf(failsToo).not.toBeAssignableTo<Union>();

// Three members, each with its own fields, and a tag whose name is also a field's name in one of them, which is the case where a key and a tag could be confused for one another.
type ThreeMembers = TaggedUnion<'kind', {
	Open: {url: string; id: number};
	Close: {visible: boolean};
	Move: {to: {x: number; y: number}; kind?: 'Move'};
}>;

// A member's tag is paired with its own fields, so another member's fields do not satisfy it.
({kind: 'Open', url: 'a', id: 1}) satisfies ThreeMembers;
({kind: 'Close', visible: true}) satisfies ThreeMembers;
expectTypeOf({kind: 'Open', visible: true} as const).not.toBeAssignableTo<ThreeMembers>();
expectTypeOf({kind: 'Move', url: 'a', id: 1} as const).not.toBeAssignableTo<ThreeMembers>();

// The optional field stays optional, and the tag is still required.
({kind: 'Move', to: {x: 1, y: 2}}) satisfies ThreeMembers;
expectTypeOf({to: {x: 1, y: 2}} as const).not.toBeAssignableTo<ThreeMembers>();

// An empty record is one member with no fields, which is a tag and nothing else.
type OnlyATag = TaggedUnion<'tag', {A: {}; B: {value: string}}>;
({tag: 'A'}) satisfies OnlyATag;
({tag: 'B', value: 'x'}) satisfies OnlyATag;
// @ts-expect-error
const onlyATag: OnlyATag = {tag: 'A', value: 'x'} as const;

// Optional dictionary entries still describe tagged members, never an absent event.
type OptionalEvents = TaggedUnion<'kind', {
	text?: {value: string};
	count: {value: number};
}>;
type ExpectedOptionalEvents = ({kind: 'text'} & {value: string}) | ({kind: 'count'} & {value: number});
expectTypeOf<OptionalEvents>().toBe<ExpectedOptionalEvents>();
expectTypeOf<undefined>().not.toBeAssignableTo<OptionalEvents>();

function _readOptionalEvent(event: OptionalEvents): string {
	return event.kind === 'text' ? event.value.toUpperCase() : event.value.toFixed(0);
}

// Dictionary optionality is separate from the optional fields inside an event payload.
type AllOptionalEvents = TaggedUnion<'kind', {
	readonly start?: {readonly id: string; label?: string | undefined};
	stop?: {};
}>;
({kind: 'start', id: 'session', label: undefined}) satisfies AllOptionalEvents;
({kind: 'stop'}) satisfies AllOptionalEvents;
expectTypeOf<{kind: 'start'}>().not.toBeAssignableTo<AllOptionalEvents>();
expectTypeOf<undefined>().not.toBeAssignableTo<AllOptionalEvents>();
declare const startEvent: Extract<AllOptionalEvents, {kind: 'start'}>;
expectTypeOf(startEvent.label).toBe<string | undefined>();
// @ts-expect-error Payload readonly modifiers remain intact.
startEvent.id = 'session';

declare const eventSymbol: unique symbol;
expectTypeOf<TaggedUnion<'kind', {0?: {value: number}; [eventSymbol]?: {value: string}}>>()
	.toBe<({kind: 0} & {value: number}) | ({kind: typeof eventSymbol} & {value: string})>();
expectTypeOf<TaggedUnion<'kind', {}>>().toBe<never>();
expectTypeOf<TaggedUnion<'kind', never>>().toBe<never>();
expectTypeOf<TaggedUnion<'kind', {absent?: never}>>().toBe<never>();
expectTypeOf<TaggedUnion<'kind', any>>().toBe<any>();
// @ts-expect-error The member dictionary must be an object of payload records.
type UnknownEvents = TaggedUnion<'kind', unknown>;

function constructEvent<Value>(value: Value): TaggedUnion<'kind', {data?: {value: Value}; empty?: {}}> {
	return {kind: 'data', value};
}

function readEvent<Value>(event: TaggedUnion<'kind', {data?: {value: Value}; empty?: {}}>): Value | undefined {
	return event.kind === 'data' ? event.value : undefined;
}

expectTypeOf(constructEvent('text' as const)).toBe<({kind: 'data'} & {value: 'text'}) | {kind: 'empty'}>();
expectTypeOf(readEvent({kind: 'data', value: 42 as const})).toBe<42 | undefined>();
