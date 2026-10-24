import {expectTypeOf} from 'nz';
import type {IsEqual, IsLiteral, Tagged} from '../../index.d.ts';
import type {DefinedKeyFilter, ExactKey, KeysExcept, LiteralKeyOf, OptionalKeyFilter} from '../../source/internal/index.d.ts';

// A property whose type includes `undefined` is optional, one that is only `undefined` is neither.
expectTypeOf<IsEqual<DefinedKeyFilter<{a: 1; b: string | undefined}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a: 1; b: string | undefined}, 'b'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: 1; b: string | undefined}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: 1; b: string | undefined}, 'b'>, 'b'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a?: 1}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a?: 1}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a: undefined}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: undefined}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a?: undefined}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a?: undefined}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a: 1 | undefined}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: 1 | undefined}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a: null}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: null | undefined}, 'a'>, 'a'>>().toBe<true>();

// A `never` property can hold no value, so it is neither.
expectTypeOf<IsEqual<DefinedKeyFilter<{a: never}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: never}, 'a'>, never>>().toBe<true>();

// An `any` or `unknown` property is kept as it is, so it is only returned by `DefinedKeyFilter`, even when it is optional.
expectTypeOf<IsEqual<DefinedKeyFilter<{a: any}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a: unknown}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a?: any}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a?: unknown}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: any}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a: unknown}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a?: any}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{a?: unknown}, 'a'>, never>>().toBe<true>();

// A symbol key, or a property whose value is a symbol, is not a plain key.
declare const symbolKey: unique symbol;
expectTypeOf<IsEqual<DefinedKeyFilter<{[symbolKey]: 1; a: 2}, typeof symbolKey>, never>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{[symbolKey]: 1; a: 2}, 'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a: symbol}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{a: typeof symbolKey}, 'a'>, never>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{[symbolKey]: any}, typeof symbolKey>, never>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{[symbolKey]: unknown}, typeof symbolKey>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{[symbolKey]?: any}, typeof symbolKey>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{[symbolKey]?: unknown}, typeof symbolKey>, never>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{[symbolKey]: 1 | undefined}, typeof symbolKey>, never>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{[key: symbol]: any}, symbol>, never>>().toBe<true>();

// An index signature is filtered like any other key.
expectTypeOf<IsEqual<DefinedKeyFilter<{[key: string]: number}, string>, string>>().toBe<true>();
expectTypeOf<IsEqual<OptionalKeyFilter<{[key: string]: number | undefined}, string>, string>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{[key: `x${string}`]: number}, `x${string}`>, `x${string}`>>().toBe<true>();
expectTypeOf<IsEqual<DefinedKeyFilter<{[key: number]: () => void}, number>, never>>().toBe<true>();

// `LiteralKeyOf` keeps the keys that `IsLiteral` calls a literal, which includes a `unique symbol` even though a bare `symbol` is not one. `IsEqual` leaves this mapped type unresolved, so it is asserted on the result directly.
declare const literalKeys: LiteralKeyOf<{a: 1; 1: 2; [symbolKey]: 3}>;
expectTypeOf(literalKeys).toBe<'a' | 1 | typeof symbolKey>();
expectTypeOf<IsEqual<IsLiteral<symbol>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsLiteral<typeof symbolKey>, true>>().toBe<true>();
// An index signature's key is `string | number`, and neither is a literal, so nothing is kept.
expectTypeOf<IsEqual<LiteralKeyOf<{[k: string]: unknown}>, never>>().toBe<true>();

// `ExactKey` reports the key in the exact form the object declares it.
type Mixed = {0: number; '1': string};
expectTypeOf<IsEqual<ExactKey<Mixed, '0'>, 0>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Mixed, 0>, 0>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Mixed, '1'>, '1'>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Mixed, 1>, '1'>>().toBe<true>();

// A name-only record is data even though a function also has a name.
expectTypeOf<DefinedKeyFilter<{value: {name: string} | null}, 'value'>>().toBe<'value'>();
expectTypeOf<OptionalKeyFilter<{value?: {name: string}}, 'value'>>().toBe<'value'>();
expectTypeOf<OptionalKeyFilter<{value: {name: string} | undefined}, 'value'>>().toBe<'value'>();

// Interfaces have the same data contract without an implicit index signature.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface NamedRecord {
	name: string;
}
expectTypeOf<DefinedKeyFilter<{value: NamedRecord}, 'value'>>().toBe<'value'>();
expectTypeOf<OptionalKeyFilter<{value?: NamedRecord}, 'value'>>().toBe<'value'>();

// Actual functions are still omitted, including within a union.
expectTypeOf<DefinedKeyFilter<{value: () => void}, 'value'>>().toBe<never>();
expectTypeOf<DefinedKeyFilter<{value: string | (() => void)}, 'value'>>().toBe<never>();
expectTypeOf<OptionalKeyFilter<{value?: string | (() => void)}, 'value'>>().toBe<never>();
expectTypeOf<DefinedKeyFilter<{value: Function}, 'value'>>().toBe<never>();
expectTypeOf<DefinedKeyFilter<{value: new () => NamedRecord}, 'value'>>().toBe<never>();

// Nullish members do not change whether the remaining members are records.
expectTypeOf<OptionalKeyFilter<{value?: NamedRecord | null}, 'value'>>().toBe<'value'>();
expectTypeOf<OptionalKeyFilter<{value: NamedRecord | null | undefined}, 'value'>>().toBe<'value'>();
expectTypeOf<DefinedKeyFilter<{value: NamedRecord | {id: number}}, 'value'>>().toBe<'value'>();

// `KeysExcept` returns only the element indices of an array, so its methods and `length` are not included.
expectTypeOf<IsEqual<KeysExcept<{a: 1; b: 2; c: 3}, 'a'>, 'b' | 'c'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, 2, 3], 0>, '1' | '2'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, 2, 3], '0' | 2>, '1'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, 2?, 3?], 0>, '1' | '2'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, ...string[]], never>, '0'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[...string[], 1], never>, never>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<string[], never>, never>>().toBe<true>();

// Numeric index signatures only cover canonical numeric property names.
expectTypeOf<IsEqual<ExactKey<Record<number, string>, '00'>, never>>().toBe<true>();
expectTypeOf<IsEqual<ExactKey<Record<number, string>, '0x10'>, never>>().toBe<true>();

// Exact spellings still resolve, including decimals and the original form of declared keys.
expectTypeOf<ExactKey<Record<number, string>, '16'>>().toBe<16>();
expectTypeOf<ExactKey<Record<number, string>, '-2'>>().toBe<-2>();
expectTypeOf<ExactKey<Record<number, string>, '1.5'>>().toBe<1.5>();
expectTypeOf<ExactKey<Record<number, string>, '1e3' | '-0' | '+1' | ' 1'>>().toBe<never>();
expectTypeOf<ExactKey<Record<number, string>, `${number}`>>().toBe<number>();
expectTypeOf<ExactKey<Record<string, string>, '00'>>().toBe<'00'>();
expectTypeOf<ExactKey<Record<number, string> & {'00': boolean}, '00'>>().toBe<'00'>();
expectTypeOf<ExactKey<{readonly '1.5'?: string}, 1.5>>().toBe<'1.5'>();
expectTypeOf<ExactKey<{[symbolKey]: string}, typeof symbolKey>>().toBe<typeof symbolKey>();

enum ExactCounterKey {
	First,
}

expectTypeOf<ExactKey<{[ExactCounterKey.First]: string}, '0'>>().toBe<0>();
expectTypeOf<ExactKey<Record<number, string>, Tagged<1, 'Index'>>>().toBe<Tagged<1, 'Index'>>();
expectTypeOf<ExactKey<Record<number, string>, never>>().toBe<never>();
expectTypeOf<ExactKey<{name: string}, any>>().toBe<any>();
expectTypeOf<ExactKey<any, '00'>>().toBe<'00'>();
// @ts-expect-error Unknown does not describe an object whose keys can be looked up.
expectTypeOf<ExactKey<unknown, 'name'>>();

function _exactNumericKey<Value>(key: number): ExactKey<Record<number, Value>, number> {
	return key;
}

function _readExactLiteralKey<Value>(key: ExactKey<{0: Value}, '0'>): 0 {
	return key;
}

// Enum selectors compare by their string spelling without changing declared key identity.
enum ExcludedField {
	Value = 'value',
}
expectTypeOf<KeysExcept<{value: string; keep: number}, ExcludedField.Value>>().toBe<'keep'>();
expectTypeOf<KeysExcept<{[ExcludedField.Value]: string; keep: number}, ExcludedField.Value>>().toBe<'keep'>();
expectTypeOf<KeysExcept<{[key: number]: unknown; '00': string}, number>>().toBe<'00'>();
