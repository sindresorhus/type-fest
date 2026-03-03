import {expectType} from 'tsd';
import type {UnionMember, IsNever, IsEqual} from '../index.d.ts';

type UnionType = {a: 0} | {readonly a: 0};
type PickedUnionMember = UnionMember<UnionType>;
expectType<false>({} as IsEqual<UnionType, PickedUnionMember>);

// `never` acts as a termination condition with `IsNever`.
expectType<never>({} as UnionMember<never>);

expectType<unknown>({} as UnionMember<unknown>);
expectType<any>({} as UnionMember<any>);

// `WrapMemberInTuple` ensures `UnionMember` selects exactly one member at a time.
type WrapMemberInTuple<T, L = UnionMember<T>> =
	IsNever<T> extends false
		? WrapMemberInTuple<Exclude<T, L>> | [L]
		: never;
expectType<[1] | [2] | [3]>({} as WrapMemberInTuple<1 | 2 | 3>);
expectType<['foo'] | ['bar'] | ['baz']>({} as WrapMemberInTuple<'foo' | 'bar' | 'baz'>);
expectType<[1] | ['foo'] | [true] | [100n] | [null] | [undefined]>(
	{} as WrapMemberInTuple<1 | 'foo' | true | 100n | null | undefined>,
);
expectType<[{a: string}] | [{b: number}]>({} as WrapMemberInTuple<{a: string} | {b: number}>);
