import {expectTypeOf} from 'nz';
import type {SetNonNullable} from '../index.d.ts';

// Update one possibly undefined key and one possibly null key to non-nullable.
declare const variation1: SetNonNullable<{a: number; b: string | undefined; c: boolean | null}, 'b' | 'c'>;
expectTypeOf(variation1).toBe<{a: number; b: string; c: boolean}>();

// Update a key that is possibly null or undefined.
declare const variation2: SetNonNullable<{a: number; b: string | null | undefined}, 'b'>;
expectTypeOf(variation2).toBe<{a: number; b: string}>();

// Update an optional key.
declare const variation3: SetNonNullable<{a: number; b?: string | undefined}, 'b'>;
expectTypeOf(variation3).toBe<{a: number; b?: string}>();

// Fail if type changes even if non-nullable is right.
declare const variation4: SetNonNullable<{a: number; b: string | undefined}, 'b'>;
expectTypeOf(variation4).not.toBeAssignableTo<{a: string; b: string}>();

// Update all keys if `Keys` generic is not passed.
declare const variation5: SetNonNullable<{a: number; b: string | undefined; c: boolean | null}>;
expectTypeOf(variation5).toBe<{a: number; b: string; c: boolean}>();

// Does not throw type error in type predicate contexts.
type Variation6Config = {a: boolean | null; b: boolean | null};
const variant6Function = <TProperty extends keyof Variation6Config>(
	config: Variation6Config,
	property: TProperty,
): config is SetNonNullable<Variation6Config, TProperty> => config[property] !== null;
expectTypeOf(variant6Function).not.toBeAssignableTo<never>(); // Just to prevent unused error.

// A tuple's elements are keyed by index, so the given keys must reach them.
declare const tupleWithKey: SetNonNullable<[1 | null, 2], 0>;
expectTypeOf(tupleWithKey).toBe<[1, 2]>();

declare const tupleWithSecondKey: SetNonNullable<[1, 2 | null], 1>;
expectTypeOf(tupleWithSecondKey).toBe<[1, 2]>();

declare const tupleWithBothKeys: SetNonNullable<[1 | null, 2 | null], 0 | 1>;
expectTypeOf(tupleWithBothKeys).toBe<[1, 2]>();

declare const readonlyTupleWithKey: SetNonNullable<readonly [1 | null, 2], 0>;
expectTypeOf(readonlyTupleWithKey).toBe<readonly [1, 2]>();

declare const tupleWithVariableKey: SetNonNullable<[1 | null, 2], number>;
expectTypeOf(tupleWithVariableKey).toBe<[1, 2]>();

declare const tupleWithOptionalElement: SetNonNullable<[1 | null, 2?], 0>;
expectTypeOf(tupleWithOptionalElement).toBe<[1, 2?]>();

declare const tupleWithRestElement: SetNonNullable<[1 | null, ...string[]], 0>;
expectTypeOf(tupleWithRestElement).toBe<[1, ...string[]]>();

// The rest element is the type of every index from there on, so an index that lands in it makes the rest element non-nullable, the same as the default `Keys`, where every key is meant to be non-nullable.
declare const restElement: SetNonNullable<[1, ...Array<string | null>]>;
expectTypeOf(restElement).toBe<[1, ...string[]]>();

declare const restElementByIndex: SetNonNullable<[1, ...Array<string | null>], 1>;
expectTypeOf(restElementByIndex).toBe<[1, ...string[]]>();

// An index that is before the rest element is unchanged, because the rest element does not cover it.
declare const beforeRest: SetNonNullable<[1, ...Array<string | null>], 0>;
expectTypeOf(beforeRest).toBe<[1, ...Array<string | null>]>();

// A rest element with nothing nullish in it is left as it is.
declare const nothingToRemove: SetNonNullable<[1, ...string[]]>;
expectTypeOf(nothingToRemove).toBe<[1, ...string[]]>();

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result.
declare const keyOfOneMember: SetNonNullable<{a: 1 | null} | {b: 2}, 'a'>;
expectTypeOf(keyOfOneMember).toBe<{a: 1} | {b: 2}>();

declare const keyOfTheOtherMember: SetNonNullable<{a: 1 | null} | {b: 2}, 'b'>;
expectTypeOf(keyOfTheOtherMember).toBe<{a: 1 | null} | {b: 2}>();

// A `readonly` rest element stays `readonly`.
declare const readonlyRestElement: SetNonNullable<readonly [1, ...ReadonlyArray<string | null>], 1>;
expectTypeOf(readonlyRestElement).toBe<readonly [1, ...readonly string[]]>();

// The elements after a rest element are kept.
expectTypeOf<SetNonNullable<[1 | null, ...Array<2 | null>, 3 | null]>>().toBe<[1, ...Array<2>, 3]>();
expectTypeOf<SetNonNullable<readonly [1 | null, ...Array<2 | null>, 3 | null]>>().toBe<readonly [1, ...Array<2>, 3]>();
expectTypeOf<SetNonNullable<[...Array<2 | null>, 3 | null]>>().toBe<[...Array<2>, 3]>();

// A leading rest element accepts `number` to make every element non-nullable, including the trailing element.
expectTypeOf<SetNonNullable<[...Array<2 | null>, 3 | null], number>>().toBe<[...Array<2>, 3]>();

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetNonNullable<any>;
expectTypeOf(anyBase).toBe<{[x: string]: any}>();

declare const anyBaseWithKeys: SetNonNullable<any, 'a'>;
expectTypeOf(anyBaseWithKeys).toBe<{[x: string]: any}>();
