import {expectType} from 'tsd';
import type {UnionMember, IsNever} from '../index.d.ts';

// `UnionMember` distinguishes between different modifiers.
type UnionType = {a: 0} | {b: 0} | {a?: 0} | {readonly a?: 0} | {readonly a: 0};
expectType<true>({} as UnionMember<UnionType> extends UnionType ? true : false);
expectType<false>({} as UnionType extends UnionMember<UnionType> ? true : false);

// `never` acts as a termination condition with `IsNever`.
expectType<never>({} as UnionMember<never>);

expectType<unknown>({} as UnionMember<unknown>);
expectType<any>({} as UnionMember<any>);

type UnionToTupleWithExclude<T, L = UnionMember<T>> =
	IsNever<T> extends false
		? [...UnionToTupleWithExclude<Exclude<T, L>>, L]
		: [];
expectType<1 | 2 | 3>({} as UnionToTupleWithExclude<1 | 2 | 3>[number]);
