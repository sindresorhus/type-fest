import {expectTypeOf} from 'nz';
import type {ExtractLiterals, LiteralUnion, Tagged} from '../index.d.ts';

declare const symbolLiteral: unique symbol;

// Literal unions
expectTypeOf<ExtractLiterals<LiteralUnion<'dog' | 'cat', string>>>().toBe<'dog' | 'cat'>();
expectTypeOf<ExtractLiterals<LiteralUnion<0 | 1 | 2, number>>>().toBe<0 | 1 | 2>();
expectTypeOf<ExtractLiterals<LiteralUnion<1n | 2n, bigint>>>().toBe<1n | 2n>();
expectTypeOf<ExtractLiterals<LiteralUnion<typeof symbolLiteral, symbol>>>().toBe<typeof symbolLiteral>();
expectTypeOf<ExtractLiterals<'foo' | 'bar' | (string & {})>>().toBe<'foo' | 'bar'>();
expectTypeOf<ExtractLiterals<'click' | 'hover' | (`on${string}` & {})>>().toBe<'click' | 'hover'>();
expectTypeOf<ExtractLiterals<LiteralUnion<'onClick' | 'onHover', `on${string}`>>>().toBe<'onClick' | 'onHover'>();

// Wide types are removed
expectTypeOf<ExtractLiterals<'foo' | 1 | 10n | number | bigint>>().toBe<'foo'>(); // TypeScript already merged `1` and `10n` into `number` and `bigint`
expectTypeOf<ExtractLiterals<'foo' | 1 | 10n | boolean | symbol>>().toBe<'foo' | 1 | 10n | boolean>();
expectTypeOf<ExtractLiterals<string | number | bigint | symbol>>().toBe<never>();

// Infinite string types are removed
expectTypeOf<ExtractLiterals<'click' | `on${string}`>>().toBe<'click'>();
expectTypeOf<ExtractLiterals<'a' | `${number}`>>().toBe<'a'>();
expectTypeOf<ExtractLiterals<'foo' | Uppercase<string>>>().toBe<'foo'>();
expectTypeOf<ExtractLiterals<LiteralUnion<'1' | '2', `${number}`>>>().toBe<'1' | '2'>();
expectTypeOf<ExtractLiterals<LiteralUnion<'FOO', Uppercase<string>>>>().toBe<'FOO'>();

// Booleans
expectTypeOf<ExtractLiterals<true | string>>().toBe<true>();
expectTypeOf<ExtractLiterals<boolean | string>>().toBe<boolean>();

// Mixed primitives
expectTypeOf<ExtractLiterals<LiteralUnion<'a', string> | LiteralUnion<1, number> | 1n | true | LiteralUnion<typeof symbolLiteral, symbol>>>().toBe<'a' | 1 | 1n | true | typeof symbolLiteral>();

// Tagged types
expectTypeOf<ExtractLiterals<Tagged<'dog' | 'cat', 'Pet'> | Tagged<string, 'Pet'>>>().toBe<Tagged<'dog' | 'cat', 'Pet'>>();
expectTypeOf<ExtractLiterals<Tagged<'dog' | `${string}Dog`, 'Pet'>>>().toBe<Tagged<'dog', 'Pet'>>();
expectTypeOf<ExtractLiterals<LiteralUnion<Tagged<'dog' | 'cat', 'Pet'>, string>>>().toBe<Tagged<'dog' | 'cat', 'Pet'>>();

// Non-literal members are removed
expectTypeOf<ExtractLiterals<'a' | null | undefined>>().toBe<'a'>();
expectTypeOf<ExtractLiterals<'a' | (() => void) | {a: 1}>>().toBe<'a'>();

// Boundary types
expectTypeOf<ExtractLiterals<any>>().toBe<never>();
expectTypeOf<ExtractLiterals<never>>().toBe<never>();
expectTypeOf<ExtractLiterals<unknown>>().toBe<never>();

// @ts-expect-error
type MissingArgument = ExtractLiterals;
