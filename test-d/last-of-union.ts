import {expectType} from 'tsd';
import type {LastOfUnion, IsAny, IsUnknown, IsNever} from '../index.d.ts';

// `LastOfUnion` distinguishes between different modifiers.
type UnionType = {a: 0} | {b: 0} | {a?: 0} | {readonly a?: 0} | {readonly a: 0};
expectType<true>({} as LastOfUnion<UnionType> extends UnionType ? true : false);
expectType<false>({} as UnionType extends LastOfUnion<UnionType> ? true : false);

// `never` acts as a termination condition with `IsNever`.
expectType<never>({} as LastOfUnion<never>);

expectType<true>({} as IsUnknown<LastOfUnion<unknown>>);
expectType<true>({} as IsAny<LastOfUnion<any>>);

// Ensure a loop of `LastOfUnion` returns all elements.
type UnionToTuple<T, L = LastOfUnion<T>> =
IsNever<T> extends false
	? [...UnionToTuple<ExcludeExactly<T, L>>, L]
	: [];

type MatchOrNever<A, B> =
	[unknown, B] extends [A, never]
		? A
		// This equality code base below doesn't work if `A` is `unknown` and `B` is `never` case.
		// So this branch should be wrapped to take care of this.
		: (<G>() => G extends A & G | G ? 1 : 2) extends (<G>() => G extends B & G | G ? 1 : 2)
			? never
			: A;

type ExcludeExactly<UnionU, DeleteT> =
	LastOfUnion<DeleteT> extends infer D
		? true extends IsNever<D>
			? UnionU
			: ExcludeExactly<_ExcludeExactly<UnionU, D>, _ExcludeExactly<DeleteT, D>>
		: never;

type _ExcludeExactly<UnionU, DeleteT> =
	UnionU extends unknown // Only for union distribution.
		? MatchOrNever<UnionU, DeleteT>
		: never;

type DifferentModifierUnion = {readonly a: 0} | {a: 0};
expectType<DifferentModifierUnion>({} as UnionToTuple<DifferentModifierUnion>[number]);
expectType<2>({} as UnionToTuple<DifferentModifierUnion>['length']);

type ReversedDifferentModifierUnion = {a: 0} | {readonly a: 0};
expectType<ReversedDifferentModifierUnion>({} as UnionToTuple<ReversedDifferentModifierUnion>[number]);
expectType<2>({} as UnionToTuple<ReversedDifferentModifierUnion>['length']);

type SuperTypeUnion = {a: 0; b: 0} | {a: 0};
expectType<SuperTypeUnion>({} as UnionToTuple<SuperTypeUnion>[number]);
expectType<2>({} as UnionToTuple<SuperTypeUnion>['length']);

type ReversedSuperTypeUnion = {a: 0} | {a: 0; b: 0};
expectType<ReversedSuperTypeUnion>({} as UnionToTuple<ReversedSuperTypeUnion>[number]);
expectType<2>({} as UnionToTuple<ReversedSuperTypeUnion>['length']);
