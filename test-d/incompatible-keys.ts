import {expectTypeOf} from 'nz';
import type {IncompatibleKeys} from '../index.d.ts';

// Shared keys with a property that is not assignable are included.
expectTypeOf<IncompatibleKeys<{id: string; age: number}, {id: string; age: string}>>().toBe<'age'>();
expectTypeOf<IncompatibleKeys<{id: string; age: string; createdAt: string}, {id: string; age: number; createdAt: Date}>>().toBe<'age' | 'createdAt'>();
expectTypeOf<IncompatibleKeys<{a: 1; b: 'b'}, {a: number; b: string}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{}, {a: string}>>().toBe<never>();

// The check runs one way.
expectTypeOf<IncompatibleKeys<{status: 'active'}, {status: string}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{status: string}, {status: 'active'}>>().toBe<'status'>();
expectTypeOf<IncompatibleKeys<{value: string}, {value: string | number}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{value: string | number}, {value: string}>>().toBe<'value'>();

// Keys that only one of the types has are not included.
expectTypeOf<IncompatibleKeys<{a: string; extra: number}, {a: number}>>().toBe<'a'>();
expectTypeOf<IncompatibleKeys<{a: string}, {a: number; missing: boolean}>>().toBe<'a'>();
expectTypeOf<IncompatibleKeys<{a: string}, {b: number}>>().toBe<never>();

// Property values are compared as a whole, without distribution.
expectTypeOf<IncompatibleKeys<{a: string | number}, {a: string | boolean}>>().toBe<'a'>();
expectTypeOf<IncompatibleKeys<{a: boolean}, {a: true}>>().toBe<'a'>();

// `any` and `never` values are assignable to everything, while `unknown` is not.
expectTypeOf<IncompatibleKeys<{a: any; b: never; c: unknown}, {a: string; b: string; c: string}>>().toBe<'c'>();
expectTypeOf<IncompatibleKeys<{a: string}, {a: unknown}>>().toBe<never>();

// The check is shallow, so a nested mismatch is reported by its top-level key.
expectTypeOf<IncompatibleKeys<{user: {name: string; age: string}}, {user: {name: string; age: number}}>>().toBe<'user'>();
expectTypeOf<IncompatibleKeys<{tags: string[]}, {tags: readonly string[]}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{tags: readonly string[]}, {tags: string[]}>>().toBe<'tags'>();

// The optional modifier follows the assignability rules.
expectTypeOf<IncompatibleKeys<{name?: string}, {name: string}>>().toBe<'name'>();
expectTypeOf<IncompatibleKeys<{name?: string}, {name: string | undefined}>>().toBe<'name'>();
expectTypeOf<IncompatibleKeys<{name: string}, {name?: string}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{name?: string}, {name?: string}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{name?: number}, {name?: string}>>().toBe<'name'>();

// With `exactOptionalPropertyTypes` enabled, an explicit `undefined` is not assignable to an optional property.
expectTypeOf<IncompatibleKeys<{name: string | undefined}, {name?: string}>>().toBe<'name'>();

// The `readonly` modifier is ignored, because assignability does not look at it.
expectTypeOf<IncompatibleKeys<{readonly a: string}, {a: string}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{a: string}, {readonly a: number}>>().toBe<'a'>();

// Function properties are compared with their parameter variance, and methods keep their bivariance.
expectTypeOf<IncompatibleKeys<{callback: (value: string) => void}, {callback: (value: string | number) => void}>>().toBe<'callback'>();
expectTypeOf<IncompatibleKeys<{callback: (value: string | number) => void}, {callback: (value: string) => void}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{method(value: string): void}, {method(value: string | number): void}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{getValue: () => string}, {getValue: () => number}>>().toBe<'getValue'>();

// Interfaces and intersections work like type literals.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface UserInterface {
	id: number;
	name: string;
}
expectTypeOf<IncompatibleKeys<UserInterface, {id: string; name: string}>>().toBe<'id'>();
expectTypeOf<IncompatibleKeys<{a: string; b: number} & {c: boolean}, {a: string; b: string; c: string}>>().toBe<'b' | 'c'>();

// Symbol and number keys are supported.
declare const symbolKey: unique symbol;
expectTypeOf<IncompatibleKeys<{[symbolKey]: number; 0: string}, {[symbolKey]: string; 0: number}>>().toBe<typeof symbolKey | 0>();

// A union `Source` gives the incompatible keys of each member.
type Event = {kind: 'click'; x: string} | {kind: 'scroll'; offset: string};
expectTypeOf<IncompatibleKeys<Event, {kind: string; x: number; offset: number}>>().toBe<'x' | 'offset'>();
expectTypeOf<IncompatibleKeys<{kind: 'click'; x: string} | {kind: 'scroll'; x: number}, {x: number}>>().toBe<'x'>();

// A union `Target` is compared as a whole, using only the keys that all members have.
expectTypeOf<IncompatibleKeys<{a: string}, {a: string} | {a: number}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{a: boolean}, {a: string} | {a: number}>>().toBe<'a'>();
expectTypeOf<IncompatibleKeys<{a: string; b: string}, {a: number} | {a: number; b: string}>>().toBe<'a'>();

// Index signatures are compared with each other and with declared keys.
expectTypeOf<IncompatibleKeys<Record<string, number>, Record<string, string>>>().toBe<string>();
expectTypeOf<IncompatibleKeys<Record<string, number>, Record<string, number>>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{a: number; b: string}, Record<string, string>>>().toBe<'a'>();
expectTypeOf<IncompatibleKeys<Record<string, number>, {a: string; b: number}>>().toBe<'a'>();
expectTypeOf<IncompatibleKeys<{a?: string}, Record<string, string>>>().toBe<never>();

// A declared key is still checked when both types have an index signature that covers it.
expectTypeOf<IncompatibleKeys<{[key: string]: unknown; id: number}, {[key: string]: unknown; id: string}>>().toBe<'id'>();
expectTypeOf<IncompatibleKeys<{[key: `data-${string}`]: unknown; 'data-id': number}, {[key: `data-${string}`]: unknown; 'data-id': string}>>().toBe<'data-id'>();
expectTypeOf<IncompatibleKeys<{[key: string]: unknown; id: number}, {[key: string]: unknown}>>().toBe<never>();

// A declared target key is checked even when another union member provides it through an index signature.
expectTypeOf<IncompatibleKeys<Record<string, number>, Record<string, string> | {[key: string]: unknown; id: string}>>().toBe<'id'>();
expectTypeOf<IncompatibleKeys<Record<string, number>, Record<string, number> | {[key: string]: unknown; id: string}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<Record<string, number>, {[key: string]: unknown; id: string} | {other: unknown}>>().toBe<never>();

// Tuples are compared by their indices, without the array methods.
expectTypeOf<IncompatibleKeys<[string, number], [string, string]>>().toBe<'1'>();
expectTypeOf<IncompatibleKeys<[string, number], [string, number]>>().toBe<never>();
expectTypeOf<IncompatibleKeys<[string, number, boolean], [string]>>().toBe<never>();
expectTypeOf<IncompatibleKeys<readonly [string, number?], [string, number]>>().toBe<'1'>();
expectTypeOf<IncompatibleKeys<[string, ...number[]], [string, ...string[]]>>().toBe<number>();
expectTypeOf<IncompatibleKeys<string[], number[]>>().toBe<number>();

// `any` and `never`.
expectTypeOf<IncompatibleKeys<any, {a: string}>>().toBe<never>();
expectTypeOf<IncompatibleKeys<{a: string}, any>>().toBe<never>();
expectTypeOf<IncompatibleKeys<never, {a: string}>>().toBe<never>();

// Nothing is assignable to a `never` target, so every source property is incompatible, except a `never` property.
expectTypeOf<IncompatibleKeys<{a: string; b: never}, never>>().toBe<'a'>();

// Use the result to require a converter for exactly the incompatible fields.
type Row = {id: string; age: string; createdAt: string};
type Model = {id: string; age: number; createdAt: Date};
type Converters = {[Key in IncompatibleKeys<Row, Model>]: (value: Row[Key]) => Model[Key]};
expectTypeOf<Converters>().toBe<{age: (value: string) => number; createdAt: (value: string) => Date}>();

// Only object types are accepted.
// @ts-expect-error
type InvalidSource = IncompatibleKeys<string, {a: string}>;
// @ts-expect-error
type InvalidTarget = IncompatibleKeys<{a: string}, number>;
