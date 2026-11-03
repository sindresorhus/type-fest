import {expectTypeOf} from 'nz';
import type {SubsetOf} from '../source/subset-of.d.ts';

// Primitive union tests

type ShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';
type LargeShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l';

declare const largeShirtSizes: SubsetOf<ShirtSize, LargeShirtSize>;
expectTypeOf(largeShirtSizes).toBe<LargeShirtSize>();

// @ts-expect-error
declare const notASubset: SubsetOf<ShirtSize, 'skyscraper-large' | 'atom-small'>;

// @ts-expect-error
declare const partiallyInvalid: SubsetOf<ShirtSize, 'm' | 'atom-small'>;

// Object tests (https://github.com/sindresorhus/type-fest/issues/473)

type AllowedValue = string | number | boolean;

type BaseConfig = {
	blah: AllowedValue;
	blah2: AllowedValue;
};

type Config = SubsetOf<BaseConfig, {blah: string; blah2: boolean}>;
expectTypeOf<Config>().toBe<{blah: string; blah2: boolean}>();

// @ts-expect-error
type IncompatibleProperty = SubsetOf<BaseConfig, {blah: string; blah2: null}>;

// @ts-expect-error
type MissingProperty = SubsetOf<BaseConfig, {blah: string}>;

// Nested properties are narrowed too
type DeepBaseConfig = {
	database: {
		host: string;
		port: number;
	};
};

expectTypeOf<SubsetOf<DeepBaseConfig, {database: {host: 'localhost'; port: 5432}}>>().toBe<{database: {host: 'localhost'; port: 5432}}>();

// @ts-expect-error
type IncompatibleNestedProperty = SubsetOf<DeepBaseConfig, {database: {host: string; port: string}}>;

// `unknown` properties accept anything
expectTypeOf<SubsetOf<{data: unknown}, {data: string}>>().toBe<{data: string}>();

// @ts-expect-error
type UnknownPropertyIsNotASubset = SubsetOf<{data: string}, {data: unknown}>;

// `any` properties accept anything, and are accepted by every property type except `never`
expectTypeOf<SubsetOf<{a: any}, {a: string}>>().toBe<{a: string}>();
expectTypeOf<SubsetOf<{a: string}, {a: any}>>().toBe<{a: any}>();

// Extra properties are allowed, unlike the `satisfies` operator
expectTypeOf<SubsetOf<{a: string}, {a: string; b: number}>>().toBe<{a: string; b: number}>();

// Extra properties are also allowed when nested
expectTypeOf<SubsetOf<DeepBaseConfig, {database: {host: string; port: number; ssl: true}}>>().toBe<{database: {host: string; port: number; ssl: true}}>();

// Mapped types work as targets
expectTypeOf<SubsetOf<{[Key in 'a' | 'b']: number}, {a: 1; b: 2}>>().toBe<{a: 1; b: 2}>();

// Literal types are subsets of their primitive base types, unlike `ExtractStrict`
expectTypeOf<SubsetOf<string | number, 'foo' | 'bar' | 1>>().toBe<'foo' | 'bar' | 1>();
expectTypeOf<SubsetOf<boolean, true>>().toBe<true>();
expectTypeOf<SubsetOf<`b${string}`, 'bar' | 'baz'>>().toBe<'bar' | 'baz'>();

// @ts-expect-error
type BooleanIsNotASubsetOfTrue = SubsetOf<true, boolean>;

// Numeric and bigint literals

expectTypeOf<SubsetOf<number, 1 | 2>>().toBe<1 | 2>();
expectTypeOf<SubsetOf<bigint, 1n>>().toBe<1n>();

// @ts-expect-error
type BigintIsNotASubsetOfNumber = SubsetOf<number, 1n>;

// @ts-expect-error
type NonMatchingTemplateLiteral = SubsetOf<`a${string}`, 'b'>;

// `null`, `undefined`, and `void`

expectTypeOf<SubsetOf<string | null | undefined, null | undefined>>().toBe<null | undefined>();

// `undefined` is a subset of `void`
expectTypeOf<SubsetOf<void, undefined>>().toBe<undefined>();

// @ts-expect-error
type NullIsNotASubsetOfString = SubsetOf<string, null>;

// @ts-expect-error
type VoidIsNotASubsetOfUndefined = SubsetOf<undefined, void>;

// `unknown` accepts every type, and `{}` accepts every type except `null`, `undefined`, and `void`

expectTypeOf<SubsetOf<unknown, string>>().toBe<string>();
expectTypeOf<SubsetOf<unknown, {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<SubsetOf<{}, string>>().toBe<string>();
expectTypeOf<SubsetOf<{}, {a: string}>>().toBe<{a: string}>();

// @ts-expect-error
type NullIsNotASubsetOfEmptyObject = SubsetOf<{}, null>;

// `object` accepts objects, arrays, and functions, but not primitives

expectTypeOf<SubsetOf<object, {a: string}>>().toBe<{a: string}>();
expectTypeOf<SubsetOf<object, string[]>>().toBe<string[]>();
expectTypeOf<SubsetOf<object, () => void>>().toBe<() => void>();

// @ts-expect-error
type StringIsNotASubsetOfObject = SubsetOf<object, string>;

// Index signature targets

expectTypeOf<SubsetOf<Record<string, number>, {a: 1}>>().toBe<{a: 1}>();

// A `Record` target requires every key to be present
expectTypeOf<SubsetOf<Record<'a' | 'b', number>, {a: 1; b: 2}>>().toBe<{a: 1; b: 2}>();

// @ts-expect-error
type MissingRecordKey = SubsetOf<Record<'a' | 'b', number>, {a: 1}>;

// @ts-expect-error
type IncompatibleIndexValue = SubsetOf<Record<string, number>, {a: string}>;

// An index signature is not a subset of a type with required properties
// @ts-expect-error
type IndexSignatureIsNotASubsetOfSpecificProperties = SubsetOf<{a: string}, Record<string, string>>;

// Unions and intersections

expectTypeOf<SubsetOf<{a: string} | {b: number}, {a: string} & {b: number}>>().toBe<{a: string} & {b: number}>();

// A value only needs to be assignable to one member of a union target
expectTypeOf<SubsetOf<{a: string} | {b: number}, {b: 1}>>().toBe<{b: 1}>();

// @ts-expect-error
type ValueMatchingNoUnionMember = SubsetOf<{a: string} | {b: number}, {c: 1}>;

// A value must be assignable to every member of an intersection target
expectTypeOf<SubsetOf<{a: string} & {b: number}, {a: 'x'; b: 1}>>().toBe<{a: 'x'; b: 1}>();

// @ts-expect-error
type ValueMissingIntersectionProperty = SubsetOf<{a: string} & {b: number}, {a: 'x'}>;

// Modifiers

// Mutable is assignable to readonly
expectTypeOf<SubsetOf<readonly string[], string[]>>().toBe<string[]>();
expectTypeOf<SubsetOf<{readonly a: string}, {a: string}>>().toBe<{a: string}>();

// @ts-expect-error
type ReadonlyIsNotAssignableToMutable = SubsetOf<string[], readonly string[]>;

// Required is assignable to optional
expectTypeOf<SubsetOf<{a?: string}, {a: string}>>().toBe<{a: string}>();

// @ts-expect-error
type OptionalIsNotAssignableToRequired = SubsetOf<{a: string}, {a?: string}>;

// With `exactOptionalPropertyTypes` enabled, an explicit `undefined` is not assignable to an optional property
// @ts-expect-error
type ExplicitUndefinedIsNotASubsetOfOptional = SubsetOf<{a?: string}, {a?: string | undefined}>;

// An optional property including `undefined` is a subset of itself
expectTypeOf<SubsetOf<{a?: string | undefined}, {a?: string | undefined}>>().toBe<{a?: string | undefined}>();

// Functions

// Function parameters are contravariant: a function accepting `string` can be used where one accepting only `'a'` is expected
expectTypeOf<SubsetOf<(value: 'a') => void, (value: string) => void>>().toBe<(value: string) => void>();

// @ts-expect-error
type IncompatibleParameter = SubsetOf<(value: string) => void, (value: 'a') => void>;

// Function return types are covariant
expectTypeOf<SubsetOf<() => string, () => 'a'>>().toBe<() => 'a'>();

// @ts-expect-error
type WidenedReturnType = SubsetOf<() => 'a', () => string>;

// Method parameters are compared bivariantly, unlike function property parameters
expectTypeOf<SubsetOf<{m(a: string): void}, {m(a: 'a'): void}>>().toBe<{m(a: 'a'): void}>();

// @ts-expect-error
type IncompatibleMethodPropertyParameter = SubsetOf<{m: (a: string) => void}, {m: (a: 'a') => void}>;

// Tuples and arrays

// @ts-expect-error
type WrongLength = SubsetOf<[number, number], [number, number, number]>;

// Tuples are subsets of arrays with a compatible element type
expectTypeOf<SubsetOf<number[], [1, 2]>>().toBe<[1, 2]>();

// @ts-expect-error
type ArrayIsNotASubsetOfTuple = SubsetOf<[number], number[]>;

// Arrays are narrowed element-wise
expectTypeOf<SubsetOf<Array<{name: string}>, Array<{name: 'foo'}>>>().toBe<Array<{name: 'foo'}>>();
expectTypeOf<SubsetOf<Array<{name: string}>, Array<{name: 'foo'; age: number}>>>().toBe<Array<{name: 'foo'; age: number}>>();

// @ts-expect-error
type IncompatibleElements = SubsetOf<Array<{name: string}>, Array<{name: number}>>;

// Classes with private members are nominal, so structural equivalents are not subsets

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

expectTypeOf<SubsetOf<WithPrivateMembers, WithPrivateMembers>>().toBe<WithPrivateMembers>();

// @ts-expect-error
type StructurallyEquivalentClassIsNotASubset = SubsetOf<WithPrivateMembers, OtherWithPrivateMembers>;

// Enums

// A string enum is nominal: the enum is a subset of `string`, but `string` is not a subset of the enum
enum StringEnum {
	A = 'a',
}

expectTypeOf<SubsetOf<string, StringEnum>>().toBe<StringEnum>();
expectTypeOf<SubsetOf<StringEnum, StringEnum.A>>().toBe<StringEnum.A>();

// @ts-expect-error
type StringIsNotASubsetOfStringEnum = SubsetOf<StringEnum, string>;

// A string enum member is a subset of its literal, but the literal is not a subset of the member
expectTypeOf<SubsetOf<'a', StringEnum.A>>().toBe<StringEnum.A>();

// @ts-expect-error
type LiteralIsNotASubsetOfStringEnumMember = SubsetOf<StringEnum.A, 'a'>;

// Numeric enum members and `number` are subsets of each other
enum NumericEnum {
	A = 1,
}

expectTypeOf<SubsetOf<number, NumericEnum.A>>().toBe<NumericEnum.A>();
expectTypeOf<SubsetOf<NumericEnum.A, number>>().toBe<number>();

// Symbols

// A unique symbol is a subset of `symbol`, but `symbol` is not a subset of a unique symbol
declare const uniqueSymbol: unique symbol;

expectTypeOf<SubsetOf<symbol, typeof uniqueSymbol>>().toBe<typeof uniqueSymbol>();
expectTypeOf<SubsetOf<typeof uniqueSymbol, typeof uniqueSymbol>>().toBe<typeof uniqueSymbol>();

// @ts-expect-error
type SymbolIsNotASubsetOfUniqueSymbol = SubsetOf<typeof uniqueSymbol, symbol>;

// `any`, `never`, and `unknown`

expectTypeOf<SubsetOf<{a: string}, any>>().toBe<any>();
expectTypeOf<SubsetOf<any, string>>().toBe<string>();
expectTypeOf<SubsetOf<any, any>>().toBe<any>();
expectTypeOf<SubsetOf<string, never>>().toBe<never>();
expectTypeOf<SubsetOf<never, never>>().toBe<never>();
expectTypeOf<SubsetOf<unknown, unknown>>().toBe<unknown>();
expectTypeOf<SubsetOf<any, never>>().toBe<never>();
expectTypeOf<SubsetOf<any, unknown>>().toBe<unknown>();
expectTypeOf<SubsetOf<unknown, any>>().toBe<any>();

// @ts-expect-error
type AnyIsNotASubsetOfNever = SubsetOf<never, any>;

// @ts-expect-error
type StringIsNotASubsetOfNever = SubsetOf<never, string>;

// @ts-expect-error
type UnknownIsNotASubsetOfASpecificType = SubsetOf<{a: string}, unknown>;

// Works with generic type parameters
type ConstrainedString<Value extends string> = SubsetOf<string, Value>;

expectTypeOf<ConstrainedString<'foo'>>().toBe<'foo'>();
