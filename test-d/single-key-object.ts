import {expectTypeOf} from 'nz';
import type {IsAny, SingleKeyObject} from '../index.d.ts';

const test = <T>(_: SingleKeyObject<T>): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({key: 'value'});

// @ts-expect-error
test({});
// @ts-expect-error
test({key: 'value', otherKey: 'other value'});

declare const validObject: SingleKeyObject<{key: string}>;
expectTypeOf(validObject).toBeAssignableTo<{key: string}>();

declare const invalidObject: SingleKeyObject<{key1: string; key2: number}>;
expectTypeOf(invalidObject).toBe<never>();

// A type with an index signature can have a single key, since `keyof` of one is `string | number` for every key.
expectTypeOf<SingleKeyObject<{[k: string]: number}>>().toBe<{[k: string]: number}>();
expectTypeOf<SingleKeyObject<{[k: string]: string; b: string}>>().toBe<{[k: string]: string; b: string}>();

// Known limitation: the index signature is kept in the result, so for a type that has one the single-key restriction is not enforced and an object with any number of keys still satisfies it.
declare function singleKey(parameter: SingleKeyObject<{[k: string]: unknown; key: string}>): void;

singleKey({key: 'value'});
singleKey({key: 'value', otherKey: 'other value'});

// The same call for a type without a signature is rejected by the excess property check.
declare function singleNamedKey(parameter: SingleKeyObject<{key: string}>): void;

singleNamedKey({key: 'value'});
// @ts-expect-error
singleNamedKey({key: 'value', otherKey: 'other value'});

// A union of single-key objects is accepted, member by member.
expectTypeOf<SingleKeyObject<{a: 1} | {b: 2}>>().toBe<{a: 1} | {b: 2}>();

// A member with more than one key is rejected even when another member has one.
expectTypeOf<SingleKeyObject<{a: 1; b: 2} | {c: 3}>>().toBe<{c: 3}>();

// The top types.
expectTypeOf<IsAny<SingleKeyObject<any>>>().toBe<true>();
expectTypeOf<SingleKeyObject<unknown>>().toBe<unknown>();
expectTypeOf<SingleKeyObject<never>>().toBe<never>();

// A boolean's boxed valueOf method is not a key on an object argument.
expectTypeOf<SingleKeyObject<boolean>>().toBe<never>();
expectTypeOf<SingleKeyObject<true>>().toBe<never>();
// @ts-expect-error A primitive is not an object with one property.
test(true);

expectTypeOf<SingleKeyObject<false>>().toBe<never>();
expectTypeOf<SingleKeyObject<string | number | bigint | symbol | null | undefined>>().toBe<never>();
expectTypeOf<SingleKeyObject<'a' | 1 | 1n>>().toBe<never>();
// @ts-expect-error A false boolean is still a primitive.
test(false);
// @ts-expect-error Strings do not supply an object argument.
test('value');
// @ts-expect-error Numbers do not supply an object argument.
test(1);
// @ts-expect-error Null does not supply an object argument.
test(null);

// Primitive alternatives are filtered without removing valid object alternatives or their values.
expectTypeOf<SingleKeyObject<true | {value: boolean}>>().toBe<{value: boolean}>();
expectTypeOf<SingleKeyObject<false | {readonly value?: number} | {first: 1; second: 2}>>()
	.toBe<{readonly value?: number}>();
expectTypeOf<SingleKeyObject<number | {a: 1} | {b: 2} | null | undefined>>().toBe<{a: 1} | {b: 2}>();
expectTypeOf<SingleKeyObject<{value: true | undefined}>>().toBe<{value: true | undefined}>();
expectTypeOf<SingleKeyObject<{value: any}>>().toBe<{value: any}>();
expectTypeOf<SingleKeyObject<{value: never}>>().toBe<{value: never}>();
expectTypeOf<SingleKeyObject<{value: unknown}>>().toBe<{value: unknown}>();

// Numeric and symbol properties each count as one key, and optional/readonly modifiers stay intact.
declare const singleSymbol: unique symbol;
expectTypeOf<SingleKeyObject<{readonly [singleSymbol]?: string}>>().toBe<{readonly [singleSymbol]?: string}>();
expectTypeOf<SingleKeyObject<{0?: string}>>().toBe<{0?: string}>();
expectTypeOf<SingleKeyObject<{[singleSymbol]: string; value: number}>>().toBe<never>();
expectTypeOf<SingleKeyObject<{0: string; 1: number}>>().toBe<never>();

// A callable object with one property remains callable; two properties are still too many.
type SinglePropertyCallable = {(this: Date, value: string): number; readonly property?: boolean};
expectTypeOf<SingleKeyObject<SinglePropertyCallable>>().toBe<SinglePropertyCallable>();
expectTypeOf<ThisParameterType<SingleKeyObject<SinglePropertyCallable>>>().toBe<Date>();
expectTypeOf<ReturnType<SingleKeyObject<SinglePropertyCallable>>>().toBe<number>();
expectTypeOf<SingleKeyObject<SinglePropertyCallable & {other: number}>>().toBe<never>();

// Generic argument inference continues to recover the original valid object shape.
declare function acceptSingleKey<Value>(value: SingleKeyObject<Value>): Value;
expectTypeOf(acceptSingleKey({value: 'text'})).toBe<{value: string}>();
expectTypeOf(acceptSingleKey({value: true} as const)).toBe<{readonly value: true}>();
// @ts-expect-error The inferred primitive cannot bypass the object boundary.
acceptSingleKey(true);
// @ts-expect-error A mixed input may still be a primitive at runtime.
acceptSingleKey({} as boolean | {value: string});
