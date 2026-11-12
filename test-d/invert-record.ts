import {expectTypeOf} from 'nz';
import type {InvertRecord} from '../index.d.ts';

expectTypeOf<InvertRecord<{ok: 200; missing: 404}>>().toBe<{200: 'ok'; 404: 'missing'}>();

// A built-in interface without an index signature.
expectTypeOf<InvertRecord<PromiseFulfilledResult<200>>>().toBe<{fulfilled: 'status'; 200: 'value'}>();
expectTypeOf<InvertRecord<{primary: 'blue'; secondary: 'blue'}>>().toBe<{blue: 'primary' | 'secondary'}>();
expectTypeOf<InvertRecord<{readonly first: 'a'; readonly second: 'b'}>>().toBe<{a: 'first'; b: 'second'}>();
expectTypeOf<InvertRecord<{}>>().toBe<{}>();
expectTypeOf<InvertRecord<{first: 0; second: '0'}>>().toBe<{0: 'first' | 'second'}>();
expectTypeOf<InvertRecord<{0: 'first'; 1: 'second'}>>().toBe<{first: 0; second: 1}>();
expectTypeOf<InvertRecord<{first: 'a' | 'b'}>>().toBe<{a: 'first'; b: 'first'}>();
expectTypeOf<InvertRecord<{first: string; second: 'a'}>>().toBe<Record<string, 'first' | 'second'>>();
expectTypeOf<InvertRecord<{first: number; second: 0}>>().toBe<Record<number, 'first' | 'second'>>();
expectTypeOf<InvertRecord<{first: `item-${number}`; second: 'item-1'}>>().toBe<Record<`item-${number}`, 'first' | 'second'>>();
expectTypeOf<InvertRecord<{first: never}>>().toBe<{}>();
expectTypeOf<InvertRecord<{first: 'a'} | {second: 'b'}>>().toBe<{a: 'first'} | {b: 'second'}>();

declare const identifier: unique symbol;
expectTypeOf<InvertRecord<{first: typeof identifier}>>().toBe<{[identifier]: 'first'}>();
expectTypeOf<InvertRecord<{[identifier]: 'first'}>>().toBe<{first: typeof identifier}>();
expectTypeOf<InvertRecord<{first: any}>>().toBe<Record<any, 'first'>>();
expectTypeOf<InvertRecord<any>>().toBe<any>();
expectTypeOf<InvertRecord<never>>().toBe<never>();
expectTypeOf<{a: 'second'}>().not.toBeAssignableTo<InvertRecord<{first: 'a'}>>();
expectTypeOf<InvertRecord<{first: boolean}>>().toBe<never>();
expectTypeOf<InvertRecord<{first: unknown}>>().toBe<never>();
expectTypeOf<InvertRecord<{first?: 'a'}>>().toBe<never>();
expectTypeOf<InvertRecord<{valid: 'a'} | {invalid: false}>>().toBe<never>();
expectTypeOf<InvertRecord<{} | {invalid: false}>>().toBe<never>();
expectTypeOf<InvertRecord<{valid: 'a'} | {valid: 'a'; invalid: false}>>().toBe<never>();

// @ts-expect-error A record is required.
type UnknownRecord = InvertRecord<unknown>;

// Several keys sharing values.
expectTypeOf<InvertRecord<{a: 'x'; b: 'x'; c: 'x'; d: 'y'}>>().toBe<{x: 'a' | 'b' | 'c'; y: 'd'}>();
expectTypeOf<InvertRecord<Record<'a' | 'b', 'x'>>>().toBe<{x: 'a' | 'b'}>();
expectTypeOf<InvertRecord<{a: 'x' | 'y'; b: 'y'}>>().toBe<{x: 'a'; y: 'a' | 'b'}>();

// Inverting twice restores a one-to-one mapping.
expectTypeOf<InvertRecord<InvertRecord<{a: 'x'; b: 'y'}>>>().toBe<{a: 'x'; b: 'y'}>();
expectTypeOf<InvertRecord<InvertRecord<{a: 'x'; b: 'x'}>>>().toBe<{a: 'x'; b: 'x'}>();

// `as const` objects and interfaces.
const statuses = {ok: 200, created: 201} as const;
expectTypeOf<InvertRecord<typeof statuses>>().toBe<{200: 'ok'; 201: 'created'}>();

type Directions = {
	readonly up: 'north';
	readonly down: 'south';
};
expectTypeOf<InvertRecord<Directions>>().toBe<{north: 'up'; south: 'down'}>();

enum Color {
	Red = 'red',
	Blue = 'blue',
}
expectTypeOf<InvertRecord<{primary: Color.Red; secondary: Color.Blue}>>().toBe<{[Color.Red]: 'primary'; [Color.Blue]: 'secondary'}>();
expectTypeOf<InvertRecord<{primary: Color}>>().toBe<{[Color.Red]: 'primary'; [Color.Blue]: 'primary'}>();

// Index signatures.
expectTypeOf<InvertRecord<Record<string, 'a'>>>().toBe<{a: string}>();
expectTypeOf<InvertRecord<Record<string, string>>>().toBe<Record<string, string>>();
expectTypeOf<InvertRecord<Record<number, 'a' | 'b'>>>().toBe<{a: number; b: number}>();
expectTypeOf<InvertRecord<{first: symbol}>>().toBe<Record<symbol, 'first'>>();

// Invalid values.
expectTypeOf<InvertRecord<{first: 1n}>>().toBe<never>();
expectTypeOf<InvertRecord<{first: null}>>().toBe<never>();
expectTypeOf<InvertRecord<{first: undefined}>>().toBe<never>();
expectTypeOf<InvertRecord<{first: 'a' | undefined}>>().toBe<never>();
expectTypeOf<InvertRecord<{first: {}}>>().toBe<never>();
expectTypeOf<InvertRecord<{first: () => 'a'}>>().toBe<never>();
expectTypeOf<InvertRecord<{valid: 'a'; invalid: 1n}>>().toBe<never>();
expectTypeOf<InvertRecord<{valid: 'a'; optional?: 'b'}>>().toBe<never>();
expectTypeOf<InvertRecord<['a', 'b']>>().toBe<never>();

// Assignability.
expectTypeOf<{blue: 'primary'}>().toBeAssignableTo<InvertRecord<{primary: 'blue'; secondary: 'blue'}>>();
expectTypeOf<{blue: 'other'}>().not.toBeAssignableTo<InvertRecord<{primary: 'blue'; secondary: 'blue'}>>();

declare const names: InvertRecord<{ok: 200; missing: 404}>;
expectTypeOf(names[200]).toBe<'ok'>();
expectTypeOf(names['404']).toBe<'missing'>();
// @ts-expect-error There is no `500` key.
const _unknownStatus: unknown = names[500];
