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
