import {expectTypeOf} from 'nz';
import type {UnionMember, IsNever, IsEqual} from '../index.d.ts';

expectTypeOf<boolean extends UnionMember<boolean> ? true : false>().toBe<false>();
expectTypeOf<(1 | 'foo' | 'bar') extends UnionMember<1 | 'foo' | 'bar'> ? true : false>().toBe<false>();
expectTypeOf<({foo: string} | {bar: number}) extends UnionMember<{foo: string} | {bar: number}> ? true : false>().toBe<false>();

expectTypeOf<UnionMember<number>>().toBe<number>();
expectTypeOf<UnionMember<string>>().toBe<string>();
expectTypeOf<UnionMember<bigint>>().toBe<bigint>();
expectTypeOf<UnionMember<true>>().toBe<true>();
expectTypeOf<UnionMember<false>>().toBe<false>();
expectTypeOf({} as any as UnionMember<null>).toBe<null>();
expectTypeOf({} as any as UnionMember<undefined>).toBe<undefined>();

expectTypeOf<UnionMember<never>>().toBe<never>();
expectTypeOf<UnionMember<unknown>>().toBe<unknown>();
expectTypeOf<UnionMember<any>>().toBe<any>();

// `WrapMemberInTuple` ensures `UnionMember` selects exactly one member at a time.
type WrapMemberInTuple<T, L = UnionMember<T>> =
	IsNever<T> extends false
		? WrapMemberInTuple<Exclude<T, L>> | [L]
		: never;
expectTypeOf<WrapMemberInTuple<1 | 2 | 3>>().toBe<[1] | [2] | [3]>();
expectTypeOf<WrapMemberInTuple<'foo' | 'bar' | 'baz'>>().toBe<['foo'] | ['bar'] | ['baz']>();
expectTypeOf<WrapMemberInTuple<1 | 'foo' | true | 100n | null | undefined>>().toBe<[1] | ['foo'] | [true] | [100n] | [null] | [undefined]>();
expectTypeOf<WrapMemberInTuple<{a: string} | {b: number}>>().toBe<[{a: string}] | [{b: number}]>();

type UnionType = {a: 0} | {readonly a: 0};
type PickedUnionMember = UnionMember<UnionType>;
// We can't use `UnionType extends PickedUnionMember ? true : false` for testing here,
// because that would always be `true` as `UnionType` extends both of its members individually.
expectTypeOf<IsEqual<UnionType, PickedUnionMember>>().toBe<false>();

// Selected object members preserve generic construction and shared-property reads.
function constructSingleton<const Value>(value: Value): UnionMember<{value: Value}> {
	return {value};
}

function _readSharedId<Value>(value: UnionMember<{id: Value} | {id: Value; active: true}>): Value {
	return value.id;
}

const selectedPayload = constructSingleton({id: 'request', values: [1, 2]});
expectTypeOf(selectedPayload.value).toBe<{readonly id: 'request'; readonly values: readonly [1, 2]}>();
// @ts-expect-error A valid element still cannot overwrite a readonly inferred tuple.
selectedPayload.value.values[0] = 1;
