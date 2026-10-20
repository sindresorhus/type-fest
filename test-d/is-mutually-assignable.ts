import {expectTypeOf} from 'nz';
import type {IsMutuallyAssignable, Tagged} from '../index.d.ts';

// Identical types
expectTypeOf<IsMutuallyAssignable<number, number>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<'foo', 'foo'>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<null, null>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<undefined, undefined>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<true, true>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<boolean, boolean>>().toBe<true>();

// Different types
expectTypeOf<IsMutuallyAssignable<string, number>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<'foo', 'bar'>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<null, undefined>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<void, undefined>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<true, false>>().toBe<false>();

// A literal and its primitive are not mutually assignable
expectTypeOf<IsMutuallyAssignable<'foo', string>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<string, 'foo'>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<boolean, true>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<number, 1>>().toBe<false>();

// A unique symbol is only mutually assignable with itself
declare const uniqueSymbol: unique symbol;
expectTypeOf<IsMutuallyAssignable<symbol, typeof uniqueSymbol>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<typeof uniqueSymbol, typeof uniqueSymbol>>().toBe<true>();

// `any` is mutually assignable with every type except `never`
expectTypeOf<IsMutuallyAssignable<any, any>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<any, string>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<string, any>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<any, unknown>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<any, never>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<never, any>>().toBe<false>();

// `any` also matches when it is nested inside another type
expectTypeOf<IsMutuallyAssignable<{a: string}, {a: any}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<{a: any}, {a: string}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<string[], any[]>>().toBe<true>();

// `never` is only mutually assignable with itself
expectTypeOf<IsMutuallyAssignable<never, never>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<never, string>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<string, never>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<never, unknown>>().toBe<false>();

// `unknown` is only mutually assignable with `any` and other types that accept every value
expectTypeOf<IsMutuallyAssignable<unknown, unknown>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<unknown, any>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<unknown, {} | null | undefined>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<unknown, {}>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<unknown, string>>().toBe<false>();

// `{}` and `object` are mutually assignable, but neither has properties
expectTypeOf<IsMutuallyAssignable<{}, {}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<{}, object>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<{}, {a: string}>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<object, {a: string}>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<{a: string}, object>>().toBe<false>();

/*
Unions are not distributed, so a narrow type is not mutually assignable with a wider one.
If the types distributed, `IsMutuallyAssignable<string | number, string>` would be `boolean`.
*/
expectTypeOf<IsMutuallyAssignable<string | number, number | string>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<string | number, string>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<'a' | 'b', string>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<string, 'a' | 'b'>>().toBe<false>();

// A union does not have to be written in the same way on both sides
expectTypeOf<IsMutuallyAssignable<{a: 1 | 2}, {a: 1} | {a: 2}>>().toBe<true>();

// The `readonly` modifier is ignored, because assignability does not look at it
expectTypeOf<IsMutuallyAssignable<{a: string}, {readonly a: string}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<{a?: string}, {readonly a?: string}>>().toBe<true>();

// An optional property never matches a required property, even when the type includes `undefined`
expectTypeOf<IsMutuallyAssignable<{a?: string}, {a: string | undefined}>>().toBe<false>();

// With `exactOptionalPropertyTypes` enabled, an explicit `undefined` is not the same as an omitted property
expectTypeOf<IsMutuallyAssignable<{a?: string}, {a?: string | undefined}>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<{a?: string | undefined}, {a?: string | undefined}>>().toBe<true>();

// The order of the properties does not matter
expectTypeOf<IsMutuallyAssignable<{a: 1; b: 2}, {b: 2; a: 1}>>().toBe<true>();

// A type with more required properties is not mutually assignable with a type with fewer
expectTypeOf<IsMutuallyAssignable<{a: 1; b: 2}, {a: 1}>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<{a: 1; b?: 2}, {a: 1; b: 2}>>().toBe<false>();

// An intersection is mutually assignable with the same type written as one object
expectTypeOf<IsMutuallyAssignable<{a: 0} & {b: 0}, {a: 0; b: 0}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<{a: string} & {b: string}, {a: string}>>().toBe<false>();

// A separately declared type is mutually assignable with an equivalent type literal
type Point = {
	x: number;
};

expectTypeOf<IsMutuallyAssignable<Point, {x: number}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<Point, {x: number; y: number}>>().toBe<false>();

// Index signatures
expectTypeOf<IsMutuallyAssignable<Record<string, number>, {[key: string]: number}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<Record<string, number>, {a: number}>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<{[key: string]: number}, {[key: string]: 1 | 2}>>().toBe<false>();

// Functions
expectTypeOf<IsMutuallyAssignable<() => void, () => void>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<() => void, (a: string) => void>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<() => void, () => undefined>>().toBe<false>();

// Function parameters are compared contravariantly under `strictFunctionTypes`
expectTypeOf<IsMutuallyAssignable<(a: string) => void, (a: 'x') => void>>().toBe<false>();

// Method parameters are compared bivariantly, also under `strictFunctionTypes`
expectTypeOf<IsMutuallyAssignable<{m(a: string): void}, {m(a: 'x'): void}>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<{m(a: string): void}, {m: (a: string) => void}>>().toBe<true>();

// Arrays and tuples
expectTypeOf<IsMutuallyAssignable<number[], readonly number[]>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<[], readonly []>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<[number, string], [number, string]>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<[number, string], number[]>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<number[], [number, ...number[]]>>().toBe<false>();

// Classes
declare class WithPrivateMembers {
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members -- The private member makes the class nominal.
	private readonly brand: number;
	value: string;
}

declare class OtherWithPrivateMembers {
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members -- The private member makes the class nominal.
	private readonly brand: number;
	value: string;
}

declare class Plain {
	value: string;
}

expectTypeOf<IsMutuallyAssignable<WithPrivateMembers, WithPrivateMembers>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<WithPrivateMembers, OtherWithPrivateMembers>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<Plain, {value: string}>>().toBe<true>();

// Enums
enum StringEnum {
	A = 'a',
}

expectTypeOf<IsMutuallyAssignable<StringEnum, StringEnum>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<StringEnum, 'a'>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<StringEnum, string>>().toBe<false>();

// A numeric enum is mutually assignable with `number`, unlike a string enum and `string`
enum NumericEnum {
	A,
	B,
}

expectTypeOf<IsMutuallyAssignable<NumericEnum, number>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<NumericEnum, 0>>().toBe<false>();

// Tagged types
expectTypeOf<IsMutuallyAssignable<Tagged<string, 'Id'>, Tagged<string, 'Id'>>>().toBe<true>();
expectTypeOf<IsMutuallyAssignable<Tagged<string, 'Id'>, Tagged<string, 'Other'>>>().toBe<false>();
expectTypeOf<IsMutuallyAssignable<Tagged<string, 'Id'>, string>>().toBe<false>();

// The result can be used to branch
type Branch = IsMutuallyAssignable<{a: 0} & {b: 0}, {a: 0; b: 0}> extends true ? 'same' : 'different';
expectTypeOf<Branch>().toBe<'same'>();

// The type resolves when the generic alias is instantiated
type IsStringMutuallyAssignable<T> = IsMutuallyAssignable<T, string>;

expectTypeOf<IsStringMutuallyAssignable<string>>().toBe<true>();
expectTypeOf<IsStringMutuallyAssignable<number>>().toBe<false>();
expectTypeOf<IsStringMutuallyAssignable<'foo'>>().toBe<false>();

declare function check<Value>(value: Value): IsMutuallyAssignable<Value, string>;

declare const someString: string;
declare const someNumber: number;

expectTypeOf(check(someString)).toBe<true>();
expectTypeOf(check(someNumber)).toBe<false>();

// Missing all generic parameters.
// @ts-expect-error
type MissingAllArguments = IsMutuallyAssignable;

// Missing the `B` generic parameter.
// @ts-expect-error
type MissingSecondArgument = IsMutuallyAssignable<string>;
