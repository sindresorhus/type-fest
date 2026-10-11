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
