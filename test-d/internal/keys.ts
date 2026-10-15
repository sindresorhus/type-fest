import {expectTypeOf} from 'nz';
import type {IsEqual, IsLiteral} from '../../index.d.ts';
import type {ExactKey, FilterDefinedKeys, FilterOptionalKeys, KeysExcept, LiteralKeyOf} from '../../source/internal/index.d.ts';

// A property whose type includes `undefined` is optional, one that is only `undefined` is neither.
expectTypeOf<IsEqual<FilterDefinedKeys<{a: 1; b: string | undefined}>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<FilterOptionalKeys<{a: 1; b: string | undefined}>, 'b'>>().toBe<true>();
expectTypeOf<IsEqual<FilterDefinedKeys<{a?: 1}>, never>>().toBe<true>();
expectTypeOf<IsEqual<FilterOptionalKeys<{a?: 1}>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<FilterDefinedKeys<{a: undefined}>, never>>().toBe<true>();
expectTypeOf<IsEqual<FilterOptionalKeys<{a: undefined}>, never>>().toBe<true>();
expectTypeOf<IsEqual<FilterDefinedKeys<{a: any}>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<FilterDefinedKeys<{a: unknown}>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<FilterOptionalKeys<{a: any}>, never>>().toBe<true>();
expectTypeOf<IsEqual<FilterDefinedKeys<{a: 1 | undefined}>, never>>().toBe<true>();
expectTypeOf<IsEqual<FilterOptionalKeys<{a: 1 | undefined}>, 'a'>>().toBe<true>();

// A symbol key, or a property whose value is a symbol, is not a plain key.
declare const symbolKey: unique symbol;
expectTypeOf<IsEqual<FilterDefinedKeys<{[symbolKey]: 1; a: 2}>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<FilterDefinedKeys<{a: symbol}>, never>>().toBe<true>();

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
expectTypeOf<FilterDefinedKeys<{value: {name: string} | null}>>().toBe<'value'>();
expectTypeOf<FilterOptionalKeys<{value?: {name: string}}>>().toBe<'value'>();
expectTypeOf<FilterOptionalKeys<{value: {name: string} | undefined}>>().toBe<'value'>();

// Interfaces have the same data contract without an implicit index signature.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface NamedRecord {
	name: string;
}
expectTypeOf<FilterDefinedKeys<{value: NamedRecord}>>().toBe<'value'>();
expectTypeOf<FilterOptionalKeys<{value?: NamedRecord}>>().toBe<'value'>();

// Actual functions are still omitted, including within a union.
expectTypeOf<FilterDefinedKeys<{value: () => void}>>().toBe<never>();
expectTypeOf<FilterDefinedKeys<{value: string | (() => void)}>>().toBe<never>();
expectTypeOf<FilterOptionalKeys<{value?: string | (() => void)}>>().toBe<never>();
expectTypeOf<FilterDefinedKeys<{value: Function}>>().toBe<never>();
expectTypeOf<FilterDefinedKeys<{value: new () => NamedRecord}>>().toBe<never>();

// Nullish members do not change whether the remaining members are records.
expectTypeOf<FilterOptionalKeys<{value?: NamedRecord | null}>>().toBe<'value'>();
expectTypeOf<FilterOptionalKeys<{value: NamedRecord | null | undefined}>>().toBe<'value'>();
expectTypeOf<FilterDefinedKeys<{value: NamedRecord | {id: number}}>>().toBe<'value'>();

// `KeysExcept` returns only the element indices of an array, so its methods and `length` are not included.
expectTypeOf<IsEqual<KeysExcept<{a: 1; b: 2; c: 3}, 'a'>, 'b' | 'c'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, 2, 3], 0>, '1' | '2'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, 2, 3], '0' | 2>, '1'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, 2?, 3?], 0>, '1' | '2'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[1, ...string[]], never>, '0'>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<[...string[], 1], never>, never>>().toBe<true>();
expectTypeOf<IsEqual<KeysExcept<string[], never>, never>>().toBe<true>();
