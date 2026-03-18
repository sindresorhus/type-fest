import {expectType} from 'tsd';
import type {UnionMember, IsNever, IsEqual} from '../index.d.ts';

expectType<false>({} as boolean extends UnionMember<boolean> ? true : false);
expectType<false>({} as (1 | 'foo' | 'bar') extends UnionMember<1 | 'foo' | 'bar'> ? true : false);
expectType<false>({} as ({foo: string} | {bar: number}) extends UnionMember<{foo: string} | {bar: number}> ? true : false);

expectType<number>({} as UnionMember<number>);
expectType<string>({} as UnionMember<string>);
expectType<bigint>({} as UnionMember<bigint>);
expectType<true>({} as UnionMember<true>);
expectType<false>({} as UnionMember<false>);
expectType<null>({} as any as UnionMember<null>);
expectType<undefined>({} as any as UnionMember<undefined>);

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

type UnionType = {a: 0} | {readonly a: 0};
type PickedUnionMember = UnionMember<UnionType>;
// We can't use `UnionType extends PickedUnionMember ? true : false` for testing here,
// because that would always be `true` as `UnionType` extends both of its members individually.
expectType<false>({} as IsEqual<UnionType, PickedUnionMember>);
