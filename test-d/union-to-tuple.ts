import {expectAssignable, expectType} from 'tsd';
import type {UnionToTuple} from '../index.d.ts';

type Options = UnionToTuple<'a' | 'b' | 'c'>;
// Results unordered
expectAssignable<['a', 'b', 'c'] | ['a', 'c', 'b'] | ['b', 'a', 'c'] | ['b', 'c', 'a'] | ['c', 'a', 'b'] | ['c', 'b', 'a']>({} as Options);
expectType<Options[number]>({} as ('a' | 'b' | 'c'));

type Options1 = UnionToTuple<1 | 2 | 3>;
expectType<Options1[number]>({} as (1 | 2 | 3));

type Options2 = UnionToTuple<boolean | 1>;
expectType<Options2[number]>({} as (1 | false | true));

// Test for https://github.com/sindresorhus/type-fest/issues/1352
// This union is special because `{readonly a: 0}` extends `{a: 0}`, and `{a: 0}` also extends `{readonly a: 0}`,
// meaning both types are assignable to each other.
// See [this comment](https://github.com/sindresorhus/type-fest/pull/1349#issuecomment-3858719735) for more details.
type DifferentModifierUnion = {readonly a: 0} | {a: 0};
expectType<DifferentModifierUnion>({} as UnionToTuple<DifferentModifierUnion>[number]);

// Edge cases.
expectType<[]>({} as UnionToTuple<never>);
expectType<[any]>({} as UnionToTuple<any>);
expectType<[unknown]>({} as UnionToTuple<unknown>);
