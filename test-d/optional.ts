import {expectType} from 'tsd';
import type {Optional} from '../index.d.ts';

// Basic
expectType<string | undefined>({} as Optional<string>);
expectType<{foo: string} | undefined>({} as Optional<{foo: string}>);
expectType<'foo' | undefined>({} as Optional<'foo'>);
expectType<42 | undefined>({} as Optional<42>);
expectType<boolean | undefined>({} as Optional<boolean>);
expectType<string | number | undefined>({} as Optional<string | number>);
expectType<(() => void) | undefined>({} as Optional<() => void>);

// Strips `null`
expectType<string | undefined>({} as Optional<string | null>);
expectType<string | undefined>({} as Optional<string | null | undefined>);
expectType<number | boolean | undefined>({} as Optional<number | null | boolean>);
expectType<true | undefined>({} as Optional<true | null>);

// Already `undefined` (idempotent)
expectType<string | undefined>({} as Optional<string | undefined>);

// Pure `null` becomes `undefined` (`null` is stripped, `undefined` remains)
declare const pureNull: Optional<null>;
expectType<undefined>(pureNull);

// `null | undefined` becomes `undefined`
declare const nullOrUndefined: Optional<null | undefined>;
expectType<undefined>(nullOrUndefined);

// Pure `undefined` stays `undefined`
declare const pureUndefined: Optional<undefined>;
expectType<undefined>(pureUndefined);

// Nested `Optional` is idempotent
expectType<string | undefined>({} as Optional<Optional<string>>);

// `void`
declare const voidOptional: Optional<void>;
expectType<void | undefined>(voidOptional);

// Edge cases
expectType<any>({} as Optional<any>);
declare const neverOptional: Optional<never>;
expectType<undefined>(neverOptional);
// `unknown | undefined` simplifies to `unknown`
expectType<unknown>({} as Optional<unknown>);
