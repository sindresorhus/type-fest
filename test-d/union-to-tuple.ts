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

// Different modifiers cases.
type DifferentModifiers = {a: 0} | {readonly a: 0};
expectType<UnionToTuple<DifferentModifiers>[number]>({} as DifferentModifiers);
expectType<UnionToTuple<DifferentModifiers>['length']>(2);

type ReversedDifferentModifiers = {readonly a: 0} | {a: 0};
expectType<UnionToTuple<ReversedDifferentModifiers>[number]>({} as ReversedDifferentModifiers);
expectType<UnionToTuple<ReversedDifferentModifiers>['length']>(2);

// Super type cases.
type UnionSuperType0 = {a: string; b: string} | {a: string};
expectType<UnionSuperType0>({} as UnionToTuple<UnionSuperType0>[number]);
expectType<UnionToTuple<UnionSuperType0>['length']>(2);

type ReversedUnionSuperType0 = {a: string} | {a: string; b: string};
expectType<ReversedUnionSuperType0>({} as UnionToTuple<ReversedUnionSuperType0>[number]);
expectType<UnionToTuple<ReversedUnionSuperType0>['length']>(2);

type UnionSuperType1 = {a: 1} | {[x: string]: number};
expectType<UnionSuperType1>({} as UnionToTuple<UnionSuperType1>[number]);
expectType<UnionToTuple<UnionSuperType1>['length']>(2);

type ReversedUnionSuperType1 = {[x: string]: number} | {a: 1};
expectType<ReversedUnionSuperType1>({} as UnionToTuple<ReversedUnionSuperType1>[number]);
expectType<UnionToTuple<ReversedUnionSuperType1>['length']>(2);

// Identical union cases.
type UnionIdentical = {a: string} | {a: string}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<UnionToTuple<UnionIdentical>['length']>(1);

type UnionIdenticalIntersection = {a: string} & {a: string} | {a: string}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<UnionToTuple<UnionIdenticalIntersection>['length']>(1);

type ReversedUnionIdenticalIntersection = {a: string} | {a: string} & {a: string}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<UnionToTuple<ReversedUnionIdenticalIntersection>['length']>(1);
