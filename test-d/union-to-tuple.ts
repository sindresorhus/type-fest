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
