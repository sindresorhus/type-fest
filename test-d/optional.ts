import {expectTypeOf} from 'nz';
import type {Optional} from '../index.d.ts';

// Basic
expectTypeOf<Optional<string>>().toBe<string | undefined>();
expectTypeOf<Optional<{foo: string}>>().toBe<{foo: string} | undefined>();
expectTypeOf<Optional<'foo'>>().toBe<'foo' | undefined>();
expectTypeOf<Optional<42>>().toBe<42 | undefined>();
expectTypeOf<Optional<boolean>>().toBe<boolean | undefined>();
expectTypeOf<Optional<string | number>>().toBe<string | number | undefined>();
expectTypeOf<Optional<() => void>>().toBe<(() => void) | undefined>();

// Strips `null`
expectTypeOf<Optional<string | null>>().toBe<string | undefined>();
expectTypeOf<Optional<string | null | undefined>>().toBe<string | undefined>();
expectTypeOf<Optional<number | null | boolean>>().toBe<number | boolean | undefined>();
expectTypeOf<Optional<true | null>>().toBe<true | undefined>();

// Already `undefined` (idempotent)
expectTypeOf<Optional<string | undefined>>().toBe<string | undefined>();

// Pure `null` becomes `undefined` (`null` is stripped, `undefined` remains)
declare const pureNull: Optional<null>;
expectTypeOf(pureNull).toBe<undefined>();

// `null | undefined` becomes `undefined`
declare const nullOrUndefined: Optional<null | undefined>;
expectTypeOf(nullOrUndefined).toBe<undefined>();

// Pure `undefined` stays `undefined`
declare const pureUndefined: Optional<undefined>;
expectTypeOf(pureUndefined).toBe<undefined>();

// Nested `Optional` is idempotent
expectTypeOf<Optional<Optional<string>>>().toBe<string | undefined>();

// `void`
declare const voidOptional: Optional<void>;
expectTypeOf(voidOptional).toBe<void | undefined>();

// Edge cases
expectTypeOf<Optional<any>>().toBe<any>();
declare const neverOptional: Optional<never>;
expectTypeOf(neverOptional).toBe<undefined>();
// `unknown | undefined` simplifies to `unknown`
expectTypeOf<Optional<unknown>>().toBe<unknown>();
