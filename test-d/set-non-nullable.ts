import {expectTypeOf} from 'nz';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion, SetNonNullable} from '../index.d.ts';

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

// A branded selector names the same property as its underlying key.
expectTypeOf<SetNonNullable<{value: string | null}, Tagged<'value', 'Key'>>>().toBe<{value: string}>();
expectTypeOf<SetNonNullable<[string | null], Tagged<0, 'Key'>>>().toBe<[string]>();

// Normalize metadata on selectors while preserving value brands and property modifiers.
expectTypeOf<SetNonNullable<{readonly value?: Tagged<string, 'Value'> | undefined | null; keep: number | null}, Tagged<'value', 'Key'>>>()
	.toBe<{readonly value?: Tagged<string, 'Value'>; keep: number | null}>();
expectTypeOf<SetNonNullable<{value: string | null}, Opaque<'value', 'Key'>>>().toBe<{value: string}>();
expectTypeOf<SetNonNullable<{value: string | null}, Tagged<Tagged<'value', 'Key'>, 'Validated'>>>().toBe<{value: string}>();
expectTypeOf<SetNonNullable<{value: string | null}, 'value' & {readonly __brand: unique symbol}>>().toBe<{value: string}>();

// Every selected key is transformed together, and absent keys do not leak into other union members.
expectTypeOf<SetNonNullable<{value: string | null; other: number | undefined}, Tagged<'value' | 'other', 'Key'>>>().toBe<{value: string; other: number}>();
expectTypeOf<SetNonNullable<{value: string | null; other: number | undefined}, Tagged<'value', 'Key'> | 'other'>>().toBe<{value: string; other: number}>();
expectTypeOf<SetNonNullable<{value: string | null} | {other: boolean}, Tagged<'value', 'Key'>>>().toBe<{value: string} | {other: boolean}>();

// Symbol selectors retain their identity, including when metadata is attached.
declare const selectorSymbol: unique symbol;
expectTypeOf<SetNonNullable<{[selectorSymbol]: string | null}, typeof selectorSymbol>>().toBe<{[selectorSymbol]: string}>();
expectTypeOf<SetNonNullable<{[selectorSymbol]: string | null}, Tagged<typeof selectorSymbol, 'Key'>>>().toBe<{[selectorSymbol]: string}>();

// Existing enum and empty-intersection selector behavior is unchanged.
enum SelectorKey {
	Value = 'value',
}
expectTypeOf<SetNonNullable<{[SelectorKey.Value]: string | null}, SelectorKey.Value>>().toBe<{[SelectorKey.Value]: string}>();
expectTypeOf<SetNonNullable<{value: string | null}, 'value' & {}>>().toBe<{value: string}>();
expectTypeOf<SetNonNullable<{[key: string]: unknown; value: string}, LiteralUnion<'value', string>>>().toBe<SetNonNullable<{[key: string]: unknown; value: string}, string>>();

// Empty selections and sentinel values retain their existing meaning.
expectTypeOf<SetNonNullable<{value: string | null}, never>>().toBe<{value: string | null}>();
expectTypeOf<SetNonNullable<never, never>>().toBe<never>();
expectTypeOf<SetNonNullable<unknown, never>>().toBe<{}>();
// @ts-expect-error A selector must name a property of the source.
expectTypeOf<SetNonNullable<{value: string | null}, unknown>>();

// A branded index reaches the same fixed or rest element as the unbranded index.
expectTypeOf<SetNonNullable<readonly [(string | null)?, (number | undefined)?], Tagged<0 | 1, 'Key'>>>().toBe<readonly [string?, number?]>();
expectTypeOf<SetNonNullable<[string | null, ...Array<number | null>], Tagged<1, 'Key'>>>().toBe<[string | null, ...number[]]>();
expectTypeOf<SetNonNullable<readonly [...Array<string | null>, number | undefined], Tagged<number, 'Key'>>>().toBe<readonly [...string[], number]>();
expectTypeOf<SetNonNullable<[string | null, number | null], LiteralUnion<0, number>>>().toBe<[string, number]>();
expectTypeOf<SetNonNullable<{a: any; b: never; c: unknown}, Tagged<'a' | 'b' | 'c', 'Key'>>>().toBe<{a: any; b: never; c: {}}>();
expectTypeOf<SetNonNullable<{a: string | null; b?: number | null}, any>>().toBe<{a: string; b?: number}>();
expectTypeOf<{value: null}>().not.toBeAssignableTo<SetNonNullable<{value: string | null}, Tagged<'value', 'Key'>>>();

// A broad branded selector keeps the same coverage as the corresponding index signature.
expectTypeOf<SetNonNullable<{[key: string]: unknown; value?: string | null}, Tagged<string, 'Key'>>>()
	.toBe<SetNonNullable<{[key: string]: unknown; value?: string | null}, string>>();
