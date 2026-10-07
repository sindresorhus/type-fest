import {expectType} from 'tsd';
import type {IsEqual, IsLiteral} from '../../index.d.ts';
import type {ExactKey, FilterDefinedKeys, FilterOptionalKeys, LiteralKeyOf, UnknownArrayOrTuple} from '../../source/internal/index.d.ts';

// A property whose type includes `undefined` is optional, one that is only `undefined` is neither.
expectType<IsEqual<FilterDefinedKeys<{a: 1; b: string | undefined}>, 'a'>>(true);
expectType<IsEqual<FilterOptionalKeys<{a: 1; b: string | undefined}>, 'b'>>(true);
expectType<IsEqual<FilterDefinedKeys<{a?: 1}>, never>>(true);
expectType<IsEqual<FilterOptionalKeys<{a?: 1}>, 'a'>>(true);
expectType<IsEqual<FilterDefinedKeys<{a: undefined}>, never>>(true);
expectType<IsEqual<FilterOptionalKeys<{a: undefined}>, never>>(true);
expectType<IsEqual<FilterDefinedKeys<{a: any}>, 'a'>>(true);
expectType<IsEqual<FilterDefinedKeys<{a: unknown}>, 'a'>>(true);
expectType<IsEqual<FilterOptionalKeys<{a: any}>, never>>(true);
expectType<IsEqual<FilterDefinedKeys<{a: 1 | undefined}>, never>>(true);
expectType<IsEqual<FilterOptionalKeys<{a: 1 | undefined}>, 'a'>>(true);

// A symbol key, or a property whose value is a symbol, is not a plain key.
declare const symbolKey: unique symbol;
expectType<IsEqual<FilterDefinedKeys<{[symbolKey]: 1; a: 2}>, 'a'>>(true);
expectType<IsEqual<FilterDefinedKeys<{a: symbol}>, never>>(true);

// `LiteralKeyOf` keeps the keys that `IsLiteral` calls a literal, which includes a `unique symbol` even though a bare `symbol` is not one. `IsEqual` leaves this mapped type unresolved, so it is asserted on the result directly.
declare const literalKeys: LiteralKeyOf<{a: 1; 1: 2; [symbolKey]: 3}>;
expectType<'a' | 1 | typeof symbolKey>(literalKeys);
expectType<IsEqual<IsLiteral<symbol>, false>>(true);
expectType<IsEqual<IsLiteral<typeof symbolKey>, true>>(true);
// An index signature's key is `string | number`, and neither is a literal, so nothing is kept.
expectType<IsEqual<LiteralKeyOf<{[k: string]: unknown}>, never>>(true);

// `ExactKey` reports the key in the exact form the object declares it.
type Mixed = {0: number; '1': string};
expectType<IsEqual<ExactKey<Mixed, '0'>, 0>>(true);
expectType<IsEqual<ExactKey<Mixed, 0>, 0>>(true);
expectType<IsEqual<ExactKey<Mixed, '1'>, '1'>>(true);
expectType<IsEqual<ExactKey<Mixed, 1>, '1'>>(true);

// Any array or tuple matches, readonly or not.
expectType<IsEqual<string[] extends UnknownArrayOrTuple ? true : false, true>>(true);
expectType<IsEqual<readonly [1, 2] extends UnknownArrayOrTuple ? true : false, true>>(true);
expectType<IsEqual<{length: number} extends UnknownArrayOrTuple ? true : false, false>>(true);
