import {expectNever, expectAssignable, expectType} from 'tsd';
import type {IsAny, SingleKeyObject} from '../index.d.ts';

const test = <T>(_: SingleKeyObject<T>): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({key: 'value'});

// @ts-expect-error
test({});
// @ts-expect-error
test({key: 'value', otherKey: 'other value'});

declare const validObject: SingleKeyObject<{key: string}>;
expectAssignable<{key: string}>(validObject);

declare const invalidObject: SingleKeyObject<{key1: string; key2: number}>;
expectNever(invalidObject);

// A type with an index signature can have a single key, since `keyof` of one is `string | number` for every key.
expectType<{[k: string]: number}>({} as SingleKeyObject<{[k: string]: number}>);
expectType<{[k: string]: string; b: string}>({} as SingleKeyObject<{[k: string]: string; b: string}>);

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
expectType<{a: 1} | {b: 2}>({} as SingleKeyObject<{a: 1} | {b: 2}>);

// A member with more than one key is rejected even when another member has one.
expectType<{c: 3}>({} as SingleKeyObject<{a: 1; b: 2} | {c: 3}>);

// The top types.
expectType<true>({} as IsAny<SingleKeyObject<any>>);
expectType<unknown>({} as SingleKeyObject<unknown>);
expectNever({} as SingleKeyObject<never>);
