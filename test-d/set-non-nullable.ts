import {expectNotAssignable, expectType} from 'tsd';
import type {SetNonNullable} from '../index.d.ts';

// Update one possibly undefined key and one possibly null key to non-nullable.
declare const variation1: SetNonNullable<{a: number; b: string | undefined; c: boolean | null}, 'b' | 'c'>;
expectType<{a: number; b: string; c: boolean}>(variation1);

// Update a key that is possibly null or undefined.
declare const variation2: SetNonNullable<{a: number; b: string | null | undefined}, 'b'>;
expectType<{a: number; b: string}>(variation2);

// Update an optional key.
declare const variation3: SetNonNullable<{a: number; b?: string | undefined}, 'b'>;
expectType<{a: number; b?: string}>(variation3);

// Fail if type changes even if non-nullable is right.
declare const variation4: SetNonNullable<{a: number; b: string | undefined}, 'b'>;
expectNotAssignable<{a: string; b: string}>(variation4);

// Update all keys if `Keys` generic is not passed.
declare const variation5: SetNonNullable<{a: number; b: string | undefined; c: boolean | null}>;
expectType<{a: number; b: string; c: boolean}>(variation5);

// Does not throw type error in type predicate contexts.
type Variation6Config = {a: boolean | null; b: boolean | null};
const variant6Function = <TProperty extends keyof Variation6Config>(
	config: Variation6Config,
	property: TProperty,
): config is SetNonNullable<Variation6Config, TProperty> => Boolean(config[property]);
expectNotAssignable<never>(variant6Function); // Just to prevent unused error.

// A tuple's elements are keyed by index, so the given keys must reach them.
declare const tupleWithKey: SetNonNullable<[1 | null, 2], 0>;
expectType<[1, 2]>(tupleWithKey);

declare const tupleWithSecondKey: SetNonNullable<[1, 2 | null], 1>;
expectType<[1, 2]>(tupleWithSecondKey);

declare const tupleWithBothKeys: SetNonNullable<[1 | null, 2 | null], 0 | 1>;
expectType<[1, 2]>(tupleWithBothKeys);

declare const readonlyTupleWithKey: SetNonNullable<readonly [1 | null, 2], 0>;
expectType<readonly [1, 2]>(readonlyTupleWithKey);

declare const tupleWithVariableKey: SetNonNullable<[1 | null, 2], number>;
expectType<[1, 2]>(tupleWithVariableKey);

declare const tupleWithOptionalElement: SetNonNullable<[1 | null, 2?], 0>;
expectType<[1, 2?]>(tupleWithOptionalElement);

declare const tupleWithRestElement: SetNonNullable<[1 | null, ...string[]], 0>;
expectType<[1, ...string[]]>(tupleWithRestElement);

// The rest element is the type of every index from there on, so an index that lands in it makes the rest element non-nullable, the same as the default `Keys`, where every key is meant to be non-nullable.
declare const restElement: SetNonNullable<[1, ...Array<string | null>]>;
expectType<[1, ...string[]]>(restElement);

declare const restElementByIndex: SetNonNullable<[1, ...Array<string | null>], 1>;
expectType<[1, ...string[]]>(restElementByIndex);

// An index that is before the rest element is unchanged, because the rest element does not cover it.
declare const beforeRest: SetNonNullable<[1, ...Array<string | null>], 0>;
expectType<[1, ...Array<string | null>]>(beforeRest);

// A rest element with nothing nullish in it is left as it is.
declare const nothingToRemove: SetNonNullable<[1, ...string[]]>;
expectType<[1, ...string[]]>(nothingToRemove);

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result.
declare const keyOfOneMember: SetNonNullable<{a: 1 | null} | {b: 2}, 'a'>;
expectType<{a: 1} | {b: 2}>(keyOfOneMember);

declare const keyOfTheOtherMember: SetNonNullable<{a: 1 | null} | {b: 2}, 'b'>;
expectType<{a: 1 | null} | {b: 2}>(keyOfTheOtherMember);

// A `readonly` rest element stays `readonly`.
declare const readonlyRestElement: SetNonNullable<readonly [1, ...ReadonlyArray<string | null>], 1>;
expectType<readonly [1, ...readonly string[]]>(readonlyRestElement);

// The elements after a rest element are kept.
expectType<[1, ...Array<2>, 3]>({} as SetNonNullable<[1 | null, ...Array<2 | null>, 3 | null]>);
expectType<readonly [1, ...Array<2>, 3]>({} as SetNonNullable<readonly [1 | null, ...Array<2 | null>, 3 | null]>);
expectType<[...Array<2>, 3]>({} as SetNonNullable<[...Array<2 | null>, 3 | null]>);

// A leading rest element accepts `number` to make every element non-nullable, including the trailing element.
expectType<[...Array<2>, 3]>({} as SetNonNullable<[...Array<2 | null>, 3 | null], number>);

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetNonNullable<any>;
expectType<{[x: string]: any}>(anyBase);

declare const anyBaseWithKeys: SetNonNullable<any, 'a'>;
expectType<{[x: string]: any}>(anyBaseWithKeys);
