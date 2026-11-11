import {expectTypeOf} from 'nz';
import type {Flavor, LiteralUnion, NegativeInfinity, Opaque, PositiveInfinity, Primitive, StringToBoolean, StringToNumber, Tagged, ToString} from '../index.d.ts';

// Strings retain their spelling, including empty strings, whitespace, and Unicode.
expectTypeOf<ToString<'hello'>>().toBe<'hello'>();
expectTypeOf<ToString<''>>().toBe<''>();
expectTypeOf<ToString<' 001.50\n'>>().toBe<' 001.50\n'>();
expectTypeOf<ToString<'你好🌍'>>().toBe<'你好🌍'>();
expectTypeOf<ToString<string>>().toBe<string>();
expectTypeOf<ToString<`user-${number}`>>().toBe<`user-${number}`>();
expectTypeOf<ToString<Uppercase<string>>>().toBe<Uppercase<string>>();

// Numbers use TypeScript's canonical spelling, not their source spelling.
expectTypeOf<ToString<42>>().toBe<'42'>();
expectTypeOf<ToString<-42>>().toBe<'-42'>();
expectTypeOf<ToString<-1.25>>().toBe<'-1.25'>();
expectTypeOf<ToString<0>>().toBe<'0'>();
expectTypeOf<ToString<-0>>().toBe<'0'>();
expectTypeOf<ToString<1.5>>().toBe<'1.5'>();
expectTypeOf<ToString<0xFF>>().toBe<'255'>();
expectTypeOf<ToString<10_000>>().toBe<'10000'>();
expectTypeOf<ToString<number>>().toBe<`${number}`>();
expectTypeOf<'not a number'>().not.toBeAssignableTo<ToString<number>>();
expectTypeOf<ToString<PositiveInfinity>>().toBe<'Infinity'>();
expectTypeOf<ToString<NegativeInfinity>>().toBe<'-Infinity'>();

// Bigints retain integer precision and omit the `n` suffix.
expectTypeOf<ToString<0n>>().toBe<'0'>();
expectTypeOf<ToString<-42n>>().toBe<'-42'>();
expectTypeOf<ToString<9_007_199_254_740_993n>>().toBe<'9007199254740993'>();
expectTypeOf<ToString<bigint>>().toBe<`${bigint}`>();
expectTypeOf<'1.5'>().not.toBeAssignableTo<ToString<bigint>>();

expectTypeOf<ToString<true>>().toBe<'true'>();
expectTypeOf<ToString<false>>().toBe<'false'>();
expectTypeOf<ToString<boolean>>().toBe<'true' | 'false'>();
expectTypeOf<ToString<null>>().toBe<'null'>();
expectTypeOf<ToString<undefined>>().toBe<'undefined'>();

// Unions distribute, filter unsupported members, and deduplicate equal results.
expectTypeOf<ToString<'draft' | 42 | true | 7n | null | undefined>>()
	.toBe<'draft' | '42' | 'true' | '7' | 'null' | 'undefined'>();
expectTypeOf<ToString<1 | '1' | 1n>>().toBe<'1'>();
expectTypeOf<ToString<'name' | 0 | symbol>>().toBe<'name' | '0'>();
expectTypeOf<ToString<false | {value: 1}>>().toBe<'false'>();
expectTypeOf<ToString<number | null>>().toBe<`${number}` | 'null'>();
expectTypeOf<ToString<Primitive>>().toBe<string>();
expectTypeOf<ToString<Exclude<Primitive, string | symbol>>>()
	.toBe<`${number}` | `${bigint}` | 'true' | 'false' | 'null' | 'undefined'>();

// Special types have explicit results rather than a partially constrained `${any}`.
expectTypeOf<ToString<any>>().toBe<string>();
expectTypeOf<ToString<never>>().toBe<never>();
expectTypeOf<ToString<unknown>>().toBe<never>();
expectTypeOf<ToString<'name' | unknown>>().toBe<never>();
expectTypeOf<ToString<void>>().toBe<never>();
expectTypeOf<ToString<'name' | never>>().toBe<'name'>();

// Object conversion and symbols are outside the template literal contract.
declare const uniqueSymbol: unique symbol;
expectTypeOf<ToString<typeof uniqueSymbol>>().toBe<never>();
expectTypeOf<ToString<symbol>>().toBe<never>();
expectTypeOf<ToString<object>>().toBe<never>();
expectTypeOf<ToString<{}>>().toBe<never>();
expectTypeOf<ToString<{toString(): 'custom'}>>().toBe<never>();
expectTypeOf<ToString<['a', 1]>>().toBe<never>();
expectTypeOf<ToString<readonly string[]>>().toBe<never>();
expectTypeOf<ToString<() => 'custom'>>().toBe<never>();
expectTypeOf<ToString<Date>>().toBe<never>();
expectTypeOf<ToString<String>>().toBe<never>();
expectTypeOf<ToString<Number>>().toBe<never>();
expectTypeOf<ToString<Boolean>>().toBe<never>();

// Enums become their underlying values, not their member names.
enum Status {
	Draft = 'draft',
	Published = 'published',
}

enum ResponseCode {
	Success = 200,
	Missing = 404,
}

expectTypeOf<ToString<Status.Draft>>().toBe<'draft'>();
expectTypeOf<ToString<Status>>().toBe<'draft' | 'published'>();
expectTypeOf<ToString<ResponseCode>>().toBe<'200' | '404'>();

// Conversion removes metadata from branded primitives, as it does for enums.
expectTypeOf<ToString<Tagged<'draft', 'Status'>>>().toBe<'draft'>();
expectTypeOf<ToString<Opaque<42, 'Id'>>>().toBe<'42'>();
expectTypeOf<ToString<Tagged<9_007_199_254_740_993n, 'Id'>>>().toBe<'9007199254740993'>();
expectTypeOf<ToString<Tagged<boolean, 'Flag'>>>().toBe<'true' | 'false'>();
expectTypeOf<ToString<Tagged<Tagged<42, 'Id'>, 'Validated'>>>().toBe<'42'>();
expectTypeOf<ToString<Tagged<string, 'Text'>>>().toBe<string>();
expectTypeOf<ToString<Tagged<number, 'Id'>>>().toBe<`${number}`>();
expectTypeOf<ToString<Tagged<'draft' | 42, 'Value'> | false>>().toBe<'draft' | '42' | 'false'>();
expectTypeOf<ToString<'draft' & {readonly brand: unique symbol}>>().toBe<'draft'>();
expectTypeOf<ToString<`id-${number}` & {readonly brand: unique symbol}>>().toBe<`id-${number}`>();

// Useful compositions preserve the relationship between input and output.
type QueryValues = {page: 1 | 2; preview: boolean; cursor: bigint | undefined};
expectTypeOf<{[Key in keyof QueryValues]: ToString<QueryValues[Key]>}>()
	.toBe<{page: '1' | '2'; preview: 'true' | 'false'; cursor: `${bigint}` | 'undefined'}>();
expectTypeOf<{[Key in 'name' | 0 | typeof uniqueSymbol as ToString<Key>]: Key}>()
	.toBe<{name: 'name'; 0: 0}>();

function _readString<Value>(value: ToString<Value>): string {
	return value;
}

function _rejectArbitraryString<Value>(value: string): ToString<Value> {
	// @ts-expect-error The input can convert to a specific string or to `never`.
	return value;
}

// Every documentation example is checked as an exact result.
expectTypeOf<ToString<1 | 2>>().toBe<'1' | '2'>();
expectTypeOf<ToString<42n | undefined>>().toBe<'42' | 'undefined'>();
expectTypeOf<ToString<keyof {name: string; 0: boolean}>>().toBe<'name' | '0'>();

// Literal strings are not parsed, trimmed, escaped, or normalized.
expectTypeOf<ToString<'00042'>>().toBe<'00042'>();
expectTypeOf<ToString<'-0'>>().toBe<'-0'>();
expectTypeOf<ToString<'1e3'>>().toBe<'1e3'>();
expectTypeOf<ToString<'false'>>().toBe<'false'>();
expectTypeOf<ToString<'null'>>().toBe<'null'>();
expectTypeOf<ToString<'undefined'>>().toBe<'undefined'>();
expectTypeOf<ToString<'a.b[0]/~'>>().toBe<'a.b[0]/~'>();
expectTypeOf<ToString<'a\tb\rc\n'>>().toBe<'a\tb\rc\n'>();
expectTypeOf<ToString<'\\path'>>().toBe<'\\path'>();
expectTypeOf<ToString<'é' | 'é'>>().toBe<'é' | 'é'>();
expectTypeOf<ToString<`item-${bigint}`>>().toBe<`item-${bigint}`>();
expectTypeOf<ToString<`enabled-${boolean}`>>().toBe<'enabled-true' | 'enabled-false'>();
expectTypeOf<ToString<Lowercase<string>>>().toBe<Lowercase<string>>();
expectTypeOf<ToString<Capitalize<string>>>().toBe<Capitalize<string>>();
expectTypeOf<ToString<Uncapitalize<string>>>().toBe<Uncapitalize<string>>();
expectTypeOf<ToString<`on${Capitalize<string>}`>>().toBe<`on${Capitalize<string>}`>();
expectTypeOf<ToString<`${number}`>>().toBe<`${number}`>();
expectTypeOf<ToString<`${bigint}`>>().toBe<`${bigint}`>();

// Different source spellings of the same numeric value have the same output.
expectTypeOf<ToString<0b1010>>().toBe<'10'>();
expectTypeOf<ToString<0o755>>().toBe<'493'>();
expectTypeOf<ToString<1e3>>().toBe<'1000'>();
expectTypeOf<ToString<1e-3>>().toBe<'0.001'>();
expectTypeOf<ToString<-0.5>>().toBe<'-0.5'>();
expectTypeOf<ToString<-0n>>().toBe<'0'>();
expectTypeOf<ToString<0xFFn>>().toBe<'255'>();
expectTypeOf<ToString<0b1010n>>().toBe<'10'>();
expectTypeOf<ToString<0o755n>>().toBe<'493'>();
expectTypeOf<ToString<1_000_000n>>().toBe<'1000000'>();
expectTypeOf<ToString<-9_007_199_254_740_993n>>().toBe<'-9007199254740993'>();

// An unsupported union member is filtered without widening supported literals.
expectTypeOf<ToString<1 | object>>().toBe<'1'>();
expectTypeOf<ToString<2n | Date>>().toBe<'2'>();
expectTypeOf<ToString<null | Promise<string>>>().toBe<'null'>();
expectTypeOf<ToString<undefined | (() => string)>>().toBe<'undefined'>();
expectTypeOf<ToString<false | symbol>>().toBe<'false'>();
expectTypeOf<ToString<true | void>>().toBe<'true'>();
expectTypeOf<ToString<object | symbol | void>>().toBe<never>();
expectTypeOf<ToString<{} | null | undefined>>().toBe<'null' | 'undefined'>();
expectTypeOf<ToString<boolean | bigint>>().toBe<'true' | 'false' | `${bigint}`>();
expectTypeOf<ToString<bigint | undefined>>().toBe<`${bigint}` | 'undefined'>();
expectTypeOf<ToString<string | number | null>>().toBe<string>();
expectTypeOf<ToString<1 | '1' | 1n | {value: 1}>>().toBe<'1'>();
expectTypeOf<ToString<true | 'true'>>().toBe<'true'>();
expectTypeOf<ToString<null | 'null'>>().toBe<'null'>();
expectTypeOf<ToString<undefined | 'undefined'>>().toBe<'undefined'>();
expectTypeOf<ToString<any | null>>().toBe<string>();
expectTypeOf<ToString<unknown | symbol>>().toBe<never>();
expectTypeOf<ToString<NonNullable<unknown>>>().toBe<never>();

// Only primitive values are converted, regardless of object conversion methods.
expectTypeOf<ToString<BigInt>>().toBe<never>();
expectTypeOf<ToString<Symbol>>().toBe<never>();
expectTypeOf<ToString<RegExp>>().toBe<never>();
expectTypeOf<ToString<Map<string, number>>>().toBe<never>();
expectTypeOf<ToString<Set<string>>>().toBe<never>();
expectTypeOf<ToString<Promise<'ready'>>>().toBe<never>();
expectTypeOf<ToString<new () => {value: string}>>().toBe<never>();
expectTypeOf<ToString<{[Symbol.toPrimitive](): 'custom'}>>().toBe<never>();
expectTypeOf<ToString<{valueOf(): 42}>>().toBe<never>();
expectTypeOf<ToString<{readonly [Key in PropertyKey]: never}>>().toBe<never>();
expectTypeOf<ToString<Tagged<{value: 42}, 'Object'>>>().toBe<never>();
expectTypeOf<ToString<Tagged<() => 'custom', 'Function'>>>().toBe<never>();
expectTypeOf<ToString<Tagged<readonly [1, 2], 'Tuple'>>>().toBe<never>();
expectTypeOf<ToString<Opaque<Date, 'Date'>>>().toBe<never>();
expectTypeOf<ToString<Tagged<symbol, 'Symbol'>>>().toBe<never>();
expectTypeOf<ToString<Tagged<typeof uniqueSymbol, 'Symbol'>>>().toBe<never>();
expectTypeOf<ToString<Tagged<symbol, 'Symbol'> | 'ready'>>().toBe<'ready'>();

// Required custom markers and optional flavor markers preserve primitive precision.
type Brand = {readonly __brand: 'Value'};
type OptionalBrand = {readonly __brand?: 'Value'};
expectTypeOf<ToString<('a' | 'b') & Brand>>().toBe<'a' | 'b'>();
expectTypeOf<ToString<(1 | 2) & Brand>>().toBe<'1' | '2'>();
expectTypeOf<ToString<bigint & Brand>>().toBe<`${bigint}`>();
expectTypeOf<ToString<42n & Brand>>().toBe<'42'>();
expectTypeOf<ToString<true & Brand>>().toBe<'true'>();
expectTypeOf<ToString<false & Brand>>().toBe<'false'>();
expectTypeOf<ToString<boolean & Brand>>().toBe<'true' | 'false'>();
expectTypeOf<ToString<symbol & Brand>>().toBe<never>();
expectTypeOf<ToString<'ready' & OptionalBrand>>().toBe<'ready'>();
expectTypeOf<ToString<number & OptionalBrand>>().toBe<`${number}`>();
expectTypeOf<ToString<bigint & OptionalBrand>>().toBe<`${bigint}`>();
expectTypeOf<ToString<boolean & OptionalBrand>>().toBe<'true' | 'false'>();
expectTypeOf<ToString<`item-${number}` & OptionalBrand>>().toBe<`item-${number}`>();
expectTypeOf<ToString<Flavor<'ready', 'State'>>>().toBe<'ready'>();
expectTypeOf<ToString<Flavor<42, 'Id'>>>().toBe<'42'>();
expectTypeOf<ToString<Flavor<string, 'Text'>>>().toBe<string>();
expectTypeOf<ToString<Flavor<number, 'Id'>>>().toBe<`${number}`>();
expectTypeOf<ToString<Flavor<bigint, 'Id'>>>().toBe<`${bigint}`>();
expectTypeOf<ToString<Flavor<true, 'Flag'>>>().toBe<'true'>();
expectTypeOf<ToString<Flavor<false, 'Flag'>>>().toBe<'false'>();
expectTypeOf<ToString<Flavor<boolean, 'Flag'>>>().toBe<'true' | 'false'>();
expectTypeOf<ToString<Flavor<`id-${number}`, 'Id'>>>().toBe<`id-${number}`>();
expectTypeOf<ToString<Flavor<symbol, 'Key'>>>().toBe<never>();

// Tag metadata, distinct nested tags, and the legacy opaque protocol are removed.
expectTypeOf<ToString<Tagged<bigint, 'Id'>>>().toBe<`${bigint}`>();
expectTypeOf<ToString<Tagged<true, 'Flag'>>>().toBe<'true'>();
expectTypeOf<ToString<Tagged<false, 'Flag'>>>().toBe<'false'>();
expectTypeOf<ToString<Tagged<'ready', 'State', {source: 'api'}>>>().toBe<'ready'>();
expectTypeOf<ToString<Tagged<42, 'Id', never>>>().toBe<'42'>();
expectTypeOf<ToString<Tagged<Tagged<'ready', 'State'>, 'Validated'>>>().toBe<'ready'>();
expectTypeOf<ToString<Tagged<Tagged<bigint, 'Id'>, 'Validated'>>>().toBe<`${bigint}`>();
expectTypeOf<ToString<Tagged<Tagged<boolean, 'Flag'>, 'Validated'>>>().toBe<'true' | 'false'>();
expectTypeOf<ToString<Tagged<'ready' | 42 | 7n | false, 'Value'>>>().toBe<'ready' | '42' | '7' | 'false'>();
expectTypeOf<ToString<Tagged<Lowercase<string>, 'Text'>>>().toBe<Lowercase<string>>();
expectTypeOf<ToString<Tagged<Uppercase<string>, 'Text'>>>().toBe<Uppercase<string>>();
expectTypeOf<ToString<Tagged<`item-${bigint}`, 'Id'>>>().toBe<`item-${bigint}`>();
expectTypeOf<ToString<Opaque<'ready', 'State'>>>().toBe<'ready'>();
expectTypeOf<ToString<Opaque<number, 'Id'>>>().toBe<`${number}`>();
expectTypeOf<ToString<Opaque<bigint, 'Id'>>>().toBe<`${bigint}`>();
expectTypeOf<ToString<Opaque<boolean, 'Flag'>>>().toBe<'true' | 'false'>();
expectTypeOf<ToString<Opaque<`item-${number}`, 'Id'>>>().toBe<`item-${number}`>();

// Enum names never leak into output, including mixed string and numeric enums.
enum MixedValue {
	None = 0,
	Ready = 'ready',
}
expectTypeOf<ToString<MixedValue>>().toBe<'0' | 'ready'>();
expectTypeOf<ToString<ResponseCode.Success>>().toBe<'200'>();
expectTypeOf<ToString<Tagged<Status.Draft, 'State'>>>().toBe<'draft'>();
expectTypeOf<ToString<Tagged<Status, 'State'>>>().toBe<'draft' | 'published'>();
expectTypeOf<ToString<Tagged<ResponseCode.Success, 'Code'>>>().toBe<'200'>();
expectTypeOf<ToString<Tagged<ResponseCode, 'Code'>>>().toBe<'200' | '404'>();
expectTypeOf<ToString<Status | ResponseCode>>().toBe<'draft' | 'published' | '200' | '404'>();

// Conversion composes with parsing without widening a known primitive value.
expectTypeOf<StringToNumber<ToString<0 | 1 | -2 | 1.5>>>().toBe<0 | 1 | -2 | 1.5>();
expectTypeOf<StringToNumber<ToString<number>>>().toBe<number>();
expectTypeOf<StringToNumber<ToString<PositiveInfinity | NegativeInfinity>>>().toBe<PositiveInfinity | NegativeInfinity>();
expectTypeOf<StringToNumber<ToString<Tagged<42, 'Id'>>>>().toBe<42>();
expectTypeOf<StringToBoolean<ToString<boolean>>>().toBe<boolean>();
expectTypeOf<StringToBoolean<ToString<Tagged<true, 'Flag'>>>>().toBe<true>();
expectTypeOf<StringToBoolean<ToString<false | 1>>>().toBe<false>();
expectTypeOf<ToString<StringToNumber<'42' | '-1.5'>>>().toBe<'42' | '-1.5'>();
expectTypeOf<ToString<StringToBoolean<'true' | 'false'>>>().toBe<'true' | 'false'>();

// Negative checks reject widened, branded, and unsupported output types.
expectTypeOf<string>().not.toBeAssignableTo<ToString<42>>();
expectTypeOf<'42n'>().not.toBeAssignableTo<ToString<42n>>();
expectTypeOf<'True'>().not.toBeAssignableTo<ToString<boolean>>();
expectTypeOf<'Null'>().not.toBeAssignableTo<ToString<null>>();
expectTypeOf<'undefined'>().not.toBeAssignableTo<ToString<void>>();
expectTypeOf<'custom'>().not.toBeAssignableTo<ToString<{toString(): 'custom'}>>();
expectTypeOf<ToString<Tagged<'ready', 'State'>>>().not.toBeAssignableTo<Tagged<'ready', 'State'>>();
expectTypeOf<ToString<Tagged<number, 'Id'>>>().not.toBeAssignableTo<Tagged<string, 'Id'>>();
expectTypeOf<ToString<any>>().not.toBe<any>();
expectTypeOf<ToString<Tagged<unknown, 'Unknown'>>>().toBe<never>();

// Mapped results preserve optional and readonly properties.
type OptionalQuery = {readonly page?: 1 | 2; enabled: boolean; empty: never; unsupported: object};
expectTypeOf<{[Key in keyof OptionalQuery]: ToString<OptionalQuery[Key]>}>()
	.toBe<{readonly page?: '1' | '2' | 'undefined'; enabled: 'true' | 'false'; empty: never; unsupported: never}>();

declare function stringify<Value>(value: Value): ToString<Value>;
expectTypeOf(stringify('ready' as const)).toBe<'ready'>();
expectTypeOf(stringify(42 as const)).toBe<'42'>();
expectTypeOf(stringify(true as const)).toBe<'true'>();
expectTypeOf(stringify(7n as const)).toBe<'7'>();
expectTypeOf(stringify(null)).toBe<'null'>();
expectTypeOf(stringify(undefined)).toBe<'undefined'>();
expectTypeOf(stringify({value: 1})).toBe<never>();
declare const taggedId: Tagged<number, 'Id'>;
expectTypeOf(stringify(taggedId)).toBe<`${number}`>();

// @ts-expect-error An input type is required.
type MissingValue = ToString;

// Empty intersections and autocomplete alternatives normalize with the primitive.
expectTypeOf<ToString<string & {}>>().toBe<string>();
expectTypeOf<ToString<number & {}>>().toBe<`${number}`>();
expectTypeOf<ToString<bigint & {}>>().toBe<`${bigint}`>();
expectTypeOf<ToString<LiteralUnion<'ready', string>>>().toBe<string>();
expectTypeOf<ToString<LiteralUnion<1, number>>>().toBe<`${number}`>();

// Each branded union member is normalized independently before unsupported members are filtered.
expectTypeOf<ToString<Tagged<'ready', 'State'> | Tagged<42, 'Id'>>>().toBe<'ready' | '42'>();
expectTypeOf<ToString<Tagged<7n, 'Id'> | Tagged<false, 'Flag'>>>().toBe<'7' | 'false'>();
expectTypeOf<ToString<Flavor<1 | 2, 'Page'> | Opaque<'all', 'Page'>>>().toBe<'1' | '2' | 'all'>();
expectTypeOf<ToString<Tagged<42, 'Id'> | Tagged<{value: 42}, 'Object'>>>().toBe<'42'>();
expectTypeOf<ToString<Tagged<'ready', 'State'> | null | undefined>>().toBe<'ready' | 'null' | 'undefined'>();
expectTypeOf<ToString<Tagged<symbol, 'Key'> | Tagged<7n, 'Id'>>>().toBe<'7'>();
expectTypeOf<ToString<('ready' & Brand) | (42 & OptionalBrand)>>().toBe<'ready' | '42'>();
expectTypeOf<ToString<Tagged<42, 'Id'> | Tagged<'42', 'Text'>>>().toBe<'42'>();
expectTypeOf<ToString<Tagged<string, 'Text'> | number>>().toBe<string>();
expectTypeOf<ToString<Tagged<symbol, 'Key'> | Tagged<{value: 1}, 'Object'>>>().toBe<never>();

// Custom markers in a single object are removed together.
expectTypeOf<ToString<'ready' & {readonly brand: 'State'; validated: true}>>().toBe<'ready'>();
expectTypeOf<ToString<42 & {brand: 'Id'; validated?: true}>>().toBe<'42'>();
expectTypeOf<ToString<7n & {readonly [uniqueSymbol]: 'Id'}>>().toBe<'7'>();
expectTypeOf<ToString<true & {readonly [uniqueSymbol]?: 'Flag'}>>().toBe<'true'>();
expectTypeOf<ToString<'ready' & {validate(): boolean}>>().toBe<'ready'>();
