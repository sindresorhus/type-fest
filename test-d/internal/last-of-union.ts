import {expectType} from 'tsd';
import type {LastOfUnion} from '../../source/internal/index.d.ts';
import type {IsAny, IsUnknown, UnionToTuple} from '../../index.d.ts';

// `LastOfUnion` distinguishes between different modifiers.
type UnionType = {a: 0} | {b: 0} | {a?: 0} | {readonly a?: 0} | {readonly a: 0};
expectType<true>({} as LastOfUnion<UnionType> extends UnionType ? true : false);
expectType<false>({} as UnionType extends LastOfUnion<UnionType> ? true : false);

// `never` acts as a termination condition with `IsNever`.
expectType<never>({} as LastOfUnion<never>);

expectType<true>({} as IsUnknown<LastOfUnion<unknown>>);
expectType<true>({} as IsAny<LastOfUnion<any>>);

type DifferentModifierUnion = {readonly a: 0} | {a: 0};
expectType<DifferentModifierUnion>({} as UnionToTuple<DifferentModifierUnion>[number]);
expectType<2>({} as UnionToTuple<DifferentModifierUnion>['length']);

type ReversedDifferentModifierUnion = {a: 0} | {readonly a: 0};
expectType<ReversedDifferentModifierUnion>({} as UnionToTuple<ReversedDifferentModifierUnion>[number]);
expectType<2>({} as UnionToTuple<ReversedDifferentModifierUnion>['length']);
