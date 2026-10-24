import {expectTypeOf} from 'nz';
import type {IntClosedRange, UnionToTuple} from '../index.d.ts';

type Options = UnionToTuple<'a' | 'b' | 'c'>;
// Results unordered
expectTypeOf<Options>().toBeAssignableTo<['a', 'b', 'c'] | ['a', 'c', 'b'] | ['b', 'a', 'c'] | ['b', 'c', 'a'] | ['c', 'a', 'b'] | ['c', 'b', 'a']>();
expectTypeOf<('a' | 'b' | 'c')>().toBe<Options[number]>();

type Options1 = UnionToTuple<1 | 2 | 3>;
expectTypeOf<(1 | 2 | 3)>().toBe<Options1[number]>();

type Options2 = UnionToTuple<boolean | 1>;
expectTypeOf<(1 | false | true)>().toBe<Options2[number]>();

// Test for https://github.com/sindresorhus/type-fest/issues/1352
// This union is special because `{readonly a: 0}` extends `{a: 0}`, and `{a: 0}` also extends `{readonly a: 0}`,
// meaning both types are assignable to each other.
// See [this comment](https://github.com/sindresorhus/type-fest/pull/1349#issuecomment-3858719735) for more details.
type DifferentModifierUnion = {readonly a: 0} | {a: 0};
expectTypeOf<UnionToTuple<DifferentModifierUnion>[number]>().toBe<DifferentModifierUnion>();

// Long unions
expectTypeOf<UnionToTuple<IntClosedRange<1, 50>>['length']>().toBe<50>();
expectTypeOf<UnionToTuple<IntClosedRange<1, 200>>['length']>().toBe<200>();

// Indexable with `"length"`
type Test<T> = UnionToTuple<T>['length'];

// Edge cases.
expectTypeOf<UnionToTuple<never>>().toBe<[]>();
expectTypeOf<UnionToTuple<any>>().toBe<[any]>();
expectTypeOf<UnionToTuple<unknown>>().toBe<[unknown]>();

// Exact member removal keeps a structurally wider event beside its base event.
type BasicEvent = {kind: 'message'; id: string};
type DetailedEvent = BasicEvent & {text: string};
type EventTuple = UnionToTuple<BasicEvent | DetailedEvent>;
expectTypeOf<EventTuple['length']>().toBe<2>();
expectTypeOf<EventTuple[number]>().toBe<BasicEvent | DetailedEvent>();

type OptionalEventTuple = UnionToTuple<{id?: string} | {id: string}>;
expectTypeOf<OptionalEventTuple['length']>().toBe<2>();

function _unionTupleInfo<Union>(values: UnionToTuple<Union>): {values: UnionToTuple<Union>; count: number} {
	return {values, count: values.length};
}

declare function listUnion<const Values extends readonly unknown[]>(values: Values): UnionToTuple<Values[number]>;
const listedActions = listUnion(['open', 'close', 'open']);
expectTypeOf(listedActions.length).toBe<2>();
expectTypeOf(listedActions).toBeAssignableTo<Array<'open' | 'close'>>();
// @ts-expect-error The result has one position per distinct action.
const oversizedActions: [unknown, unknown, unknown] = listedActions;

// Mutable and readonly tuples remain distinct members even when they accept the same values.
expectTypeOf<UnionToTuple<[1] | readonly [1]>['length']>().toBe<2>();
expectTypeOf<UnionToTuple<[1] | readonly [1]>[number]>().toBe<[1] | readonly [1]>();
// @ts-expect-error Tuple positions retain their original action type.
listedActions[0] = 'save';
