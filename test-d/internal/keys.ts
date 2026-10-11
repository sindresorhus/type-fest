import {expectTypeOf} from 'nz';
import type {IsEqual, IsLiteral} from '../../index.d.ts';
import type {ExactKey, FilterDefinedKeys, FilterOptionalKeys, LiteralKeyOf, UnknownArrayOrTuple} from '../../source/internal/index.d.ts';

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

// Any array or tuple matches, readonly or not.
expectTypeOf<IsEqual<string[] extends UnknownArrayOrTuple ? true : false, true>>().toBe<true>();
expectTypeOf<IsEqual<readonly [1, 2] extends UnknownArrayOrTuple ? true : false, true>>().toBe<true>();
expectTypeOf<IsEqual<{length: number} extends UnknownArrayOrTuple ? true : false, false>>().toBe<true>();
