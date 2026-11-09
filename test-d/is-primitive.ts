import {expectTypeOf} from 'nz';
import type {If, IsPrimitive, Primitive, Tagged} from '../index.d.ts';

expectTypeOf<IsPrimitive<'string'>>().toBe<true>();
expectTypeOf<IsPrimitive<string>>().toBe<true>();
expectTypeOf<IsPrimitive<Object>>().toBe<false>();
expectTypeOf<IsPrimitive<1>>().toBe<true>();
expectTypeOf<IsPrimitive<1n>>().toBe<true>();
expectTypeOf<IsPrimitive<true>>().toBe<true>();
expectTypeOf<IsPrimitive<'a'>>().toBe<true>();
expectTypeOf<IsPrimitive<null>>().toBe<true>();
expectTypeOf<IsPrimitive<undefined>>().toBe<true>();
expectTypeOf<IsPrimitive<void>>().toBe<false>();
// `never` is not a primitive, so reject it explicitly rather than relying on its assignability to every type.
expectTypeOf<IsPrimitive<never>>().toBe<false>();
expectTypeOf<IsPrimitive<unknown>>().toBe<false>();
expectTypeOf<IsPrimitive<any>>().toBe<false>();
expectTypeOf<IsPrimitive<{a: 1}>>().toBe<false>();
expectTypeOf<IsPrimitive<Date>>().toBe<false>();
expectTypeOf<IsPrimitive<symbol>>().toBe<true>();

// All seven primitive types, their literals, and template literal patterns are accepted.
expectTypeOf<IsPrimitive<number>>().toBe<true>();
expectTypeOf<IsPrimitive<bigint>>().toBe<true>();
expectTypeOf<IsPrimitive<boolean>>().toBe<true>();
expectTypeOf<IsPrimitive<false>>().toBe<true>();
expectTypeOf<IsPrimitive<''>>().toBe<true>();
expectTypeOf<IsPrimitive<0>>().toBe<true>();
expectTypeOf<IsPrimitive<0n>>().toBe<true>();
expectTypeOf<IsPrimitive<`user-${string}`>>().toBe<true>();
expectTypeOf<IsPrimitive<`${number}`>>().toBe<true>();
declare const identifier: unique symbol;
expectTypeOf<IsPrimitive<typeof identifier>>().toBe<true>();

// Every union member must be primitive; a mixed union returns `false`, not `boolean`.
expectTypeOf<IsPrimitive<Primitive>>().toBe<true>();
expectTypeOf<IsPrimitive<string | number>>().toBe<true>();
expectTypeOf<IsPrimitive<'draft' | 1 | false>>().toBe<true>();
expectTypeOf<IsPrimitive<null | undefined>>().toBe<true>();
expectTypeOf<IsPrimitive<string | null | undefined>>().toBe<true>();
expectTypeOf<IsPrimitive<string | {name: string}>>().toBe<false>();
expectTypeOf<IsPrimitive<Primitive | object>>().toBe<false>();
expectTypeOf<IsPrimitive<null | Date>>().toBe<false>();
expectTypeOf<IsPrimitive<undefined | (() => string)>>().toBe<false>();
expectTypeOf<IsPrimitive<string | readonly number[]>>().toBe<false>();
expectTypeOf<IsPrimitive<Date | RegExp>>().toBe<false>();

// `void` is not `undefined`, and broad object types can also contain non-primitives.
expectTypeOf<IsPrimitive<string | void>>().toBe<false>();
expectTypeOf<IsPrimitive<void | undefined>>().toBe<false>();
expectTypeOf<IsPrimitive<object>>().toBe<false>();
expectTypeOf<IsPrimitive<{}>>().toBe<false>();
expectTypeOf<IsPrimitive<NonNullable<unknown>>>().toBe<false>();

// Boxed primitives and objects that can be coerced to primitives are still objects.
expectTypeOf<IsPrimitive<String>>().toBe<false>();
expectTypeOf<IsPrimitive<Number>>().toBe<false>();
expectTypeOf<IsPrimitive<Boolean>>().toBe<false>();
expectTypeOf<IsPrimitive<BigInt>>().toBe<false>();
expectTypeOf<IsPrimitive<Symbol>>().toBe<false>();
expectTypeOf<IsPrimitive<{valueOf(): number}>>().toBe<false>();
expectTypeOf<IsPrimitive<{[Symbol.toPrimitive](): string}>>().toBe<false>();

// Nested primitives and sentinel types do not make their containers primitive.
expectTypeOf<IsPrimitive<string[]>>().toBe<false>();
expectTypeOf<IsPrimitive<readonly [number, string]>>().toBe<false>();
expectTypeOf<IsPrimitive<readonly never[]>>().toBe<false>();
expectTypeOf<IsPrimitive<{value: any}>>().toBe<false>();
expectTypeOf<IsPrimitive<{value: never}>>().toBe<false>();
expectTypeOf<IsPrimitive<Promise<string>>>().toBe<false>();
expectTypeOf<IsPrimitive<Map<string, number>>>().toBe<false>();
expectTypeOf<IsPrimitive<() => string>>().toBe<false>();
expectTypeOf<IsPrimitive<new () => {value: number}>>().toBe<false>();

// TypeScript normalizes unions and intersections before the predicate sees them.
expectTypeOf<IsPrimitive<string | never>>().toBe<true>();
expectTypeOf<IsPrimitive<Primitive | unknown>>().toBe<false>();
expectTypeOf<IsPrimitive<object | any>>().toBe<false>();
expectTypeOf<IsPrimitive<Primitive | any>>().toBe<false>();
expectTypeOf<IsPrimitive<string & any>>().toBe<false>();
expectTypeOf<IsPrimitive<string & unknown>>().toBe<true>();
expectTypeOf<IsPrimitive<string & number>>().toBe<false>();
expectTypeOf<IsPrimitive<string & null>>().toBe<false>();

// A brand refines the underlying primitive without changing its classification.
expectTypeOf<IsPrimitive<Tagged<string, 'UserId'>>>().toBe<true>();
expectTypeOf<IsPrimitive<Tagged<number, 'AccountBalance'>>>().toBe<true>();
expectTypeOf<IsPrimitive<Tagged<bigint, 'Timestamp'>>>().toBe<true>();
expectTypeOf<IsPrimitive<Tagged<symbol, 'Token'>>>().toBe<true>();
expectTypeOf<IsPrimitive<Tagged<boolean, 'Flag'>>>().toBe<true>();
expectTypeOf<IsPrimitive<Tagged<{id: string}, 'User'>>>().toBe<false>();
expectTypeOf<IsPrimitive<string & {readonly brand: 'UserId'}>>().toBe<true>();

enum Status {
	Draft = 'draft',
	Published = 'published',
}

enum ResponseCode {
	Success = 200,
	NotFound = 404,
}

enum MixedEnum {
	Name = 'name',
	Index = 0,
}

// Enum values are primitive; the enum namespace object is not.
expectTypeOf<IsPrimitive<Status>>().toBe<true>();
expectTypeOf<IsPrimitive<Status.Draft>>().toBe<true>();
expectTypeOf<IsPrimitive<ResponseCode>>().toBe<true>();
expectTypeOf<IsPrimitive<ResponseCode.Success>>().toBe<true>();
expectTypeOf<IsPrimitive<MixedEnum>>().toBe<true>();
expectTypeOf<IsPrimitive<typeof Status>>().toBe<false>();

// Select properties only when their entire value type is primitive.
type PrimitiveProperties<Value> = {
	[Key in keyof Value as IsPrimitive<Value[Key]> extends true ? Key : never]: Value[Key];
};

expectTypeOf<PrimitiveProperties<{
	readonly id: Tagged<string, 'UserId'>;
	nickname?: string;
	deletedAt: null | number;
	metadata: {name: string};
	result: string | {error: string};
	callback: () => void;
	missing: never;
	untyped: any;
}>>().toBe<{
	readonly id: Tagged<string, 'UserId'>;
	nickname?: string;
	deletedAt: null | number;
}>();

function _readPrimitiveResult<Value>(result: IsPrimitive<Value>): boolean {
	return result;
}

// The predicate can choose a branch without distributing the input union.
type FormatValue<Value> = IsPrimitive<Value> extends true ? string : Value;
expectTypeOf<FormatValue<string | number>>().toBe<string>();
expectTypeOf<FormatValue<{name: string}>>().toBe<{name: string}>();
expectTypeOf<FormatValue<string | {name: string}>>().toBe<string | {name: string}>();
expectTypeOf<FormatValue<never>>().toBe<never>();

// Rejecting `any` selects the else branch rather than preserving both branches.
expectTypeOf<If<IsPrimitive<any>, 'primitive', 'other'>>().toBe<'other'>();
