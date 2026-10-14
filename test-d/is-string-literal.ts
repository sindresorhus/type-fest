import {expectTypeOf} from 'nz';
import type {IsStringLiteral} from '../source/is-string-literal.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';

// Literals
expectTypeOf<IsStringLiteral<'foo'>>().toBe<true>();
expectTypeOf<IsStringLiteral<'1'>>().toBe<true>();
expectTypeOf<IsStringLiteral<Uppercase<'a'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<Lowercase<'a'>>>().toBe<true>();

// Non-literals
expectTypeOf<IsStringLiteral<string>>().toBe<false>();
expectTypeOf<IsStringLiteral<Uppercase<string>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Lowercase<string>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Capitalize<string>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Uncapitalize<string>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Capitalize<Lowercase<string>>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Uncapitalize<Uppercase<string>>>>().toBe<false>();
expectTypeOf<IsStringLiteral<`abc${string}`>>().toBe<false>();
expectTypeOf<IsStringLiteral<`${string}abc`>>().toBe<false>();
expectTypeOf<IsStringLiteral<`${number}:${string}`>>().toBe<false>();
expectTypeOf<IsStringLiteral<`abc${Uppercase<string>}`>>().toBe<false>();
expectTypeOf<IsStringLiteral<`${Lowercase<string>}abc`>>().toBe<false>();
expectTypeOf<IsStringLiteral<`${number}`>>().toBe<false>();
expectTypeOf<IsStringLiteral<`${number}${string}`>>().toBe<false>();

// Non-strings
expectTypeOf<IsStringLiteral<bigint>>().toBe<false>();
expectTypeOf<IsStringLiteral<object>>().toBe<false>();

// Unions
// All string literals
expectTypeOf<IsStringLiteral<'a' | 'b'>>().toBe<true>();
expectTypeOf<IsStringLiteral<Uppercase<'a' | 'b'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<Lowercase<'a' | 'b'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<Capitalize<'abc' | 'xyz'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<Uncapitalize<'Abc' | 'Xyz'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<`ab${'c' | 'd' | 'e'}`>>().toBe<true>();
expectTypeOf<IsStringLiteral<Uppercase<'a' | 'b'> | 'C' | 'D'>>().toBe<true>();
expectTypeOf<IsStringLiteral<Lowercase<'xyz'> | Capitalize<'abc'>>>().toBe<true>();

// All string non-literals
expectTypeOf<IsStringLiteral<`${number}` | Uppercase<string>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Capitalize<string> | Uppercase<string>>>().toBe<false>();
expectTypeOf<IsStringLiteral<`abc${string}` | `${string}abc`>>().toBe<false>();

// All non-strings
expectTypeOf<IsStringLiteral<1 | 2 | 3>>().toBe<false>();
expectTypeOf<IsStringLiteral<false | undefined | null>>().toBe<false>();

// String literals and string non-literals
expectTypeOf<boolean>().toBe<IsStringLiteral<Uppercase<string> | 'abc'>>();
expectTypeOf<boolean>().toBe<IsStringLiteral<Lowercase<string> | 'Abc'>>();

// String literals and non-strings
expectTypeOf<boolean>().toBe<IsStringLiteral<null | '1' | '2' | '3'>>();
expectTypeOf<boolean>().toBe<IsStringLiteral<1 | 2 | '3'>>();
expectTypeOf<boolean>().toBe<IsStringLiteral<'foo' | 'bar' | number>>();

// String non-literals and non-strings
expectTypeOf<false>().toBe<IsStringLiteral<string | number | bigint>>();
expectTypeOf<false>().toBe<IsStringLiteral<`on${string}` | Uppercase<string> | 1n | null | undefined>>();

// Boundary types
expectTypeOf<IsStringLiteral<any>>().toBe<false>();
expectTypeOf<IsStringLiteral<unknown>>().toBe<false>();
expectTypeOf<IsStringLiteral<never>>().toBe<false>();

// Tagged types
// Literals
expectTypeOf<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsStringLiteral<Tagged<string, 'Tag'>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Tagged<Uppercase<string>, 'Tag'>>>().toBe<false>();
// Non-strings
expectTypeOf<IsStringLiteral<Tagged<number, 'Tag'>>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsStringLiteral<Tagged<'foo' | 'bar' | `on${string}`, 'Tag'>>>();
// Literals and non-strings
expectTypeOf<boolean>().toBe<IsStringLiteral<Tagged<'1st' | '2nd' | '3rd' | number, 'Tag'>>>();
// Non-literals and non-strings
expectTypeOf<false>().toBe<IsStringLiteral<Tagged<string | number, 'Tag'>>>();
// Unions
expectTypeOf<IsStringLiteral<Tagged<'foo', 'Tag'> | Tagged<'bar', 'Tag'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | Tagged<number, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | number>>(); // Tagged and untagged

// Opaque types
// Literals
expectTypeOf<IsStringLiteral<Opaque<'foo' | 'bar', 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsStringLiteral<Opaque<string, 'Tag'>>>().toBe<false>();
expectTypeOf<IsStringLiteral<Opaque<Uppercase<string>, 'Tag'>>>().toBe<false>();
// Non-strings
expectTypeOf<IsStringLiteral<Opaque<number, 'Tag'>>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsStringLiteral<Opaque<'foo' | 'bar' | `on${string}`, 'Tag'>>>();
// Literals and non-strings
expectTypeOf<boolean>().toBe<IsStringLiteral<Opaque<'1st' | '2nd' | '3rd' | number, 'Tag'>>>();
// Non-literals and non-strings
expectTypeOf<false>().toBe<IsStringLiteral<Opaque<string | number, 'Tag'>>>();
// Unions
expectTypeOf<IsStringLiteral<Opaque<'foo', 'Tag'> | Opaque<'bar', 'Tag'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<Opaque<string, 'Tag'> | Opaque<number, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsStringLiteral<Opaque<'foo' | 'bar', 'Tag'> | Opaque<number, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsStringLiteral<Opaque<'foo' | 'bar', 'Tag'> | number>>(); // Opaque and untagged

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectTypeOf<IsStringLiteral<('foo' | 'bar') & Brand>>().toBe<true>();
// Non-literals
expectTypeOf<IsStringLiteral<string & Brand>>().toBe<false>();
expectTypeOf<IsStringLiteral<Uppercase<string> & Brand>>().toBe<false>();
// Non-strings
expectTypeOf<IsStringLiteral<number & Brand>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsStringLiteral<('foo' | 'bar' | `on${string}`) & Brand>>();
// Literals and non-strings
expectTypeOf<boolean>().toBe<IsStringLiteral<('1st' | '2nd' | '3rd' | number) & Brand>>();
// Non-literals and non-strings
expectTypeOf<false>().toBe<IsStringLiteral<(string | number) & Brand>>();
// Unions
expectTypeOf<IsStringLiteral<('foo' & Brand) | ('bar' & Brand)>>().toBe<true>();
expectTypeOf<IsStringLiteral<(string & Brand) | (number & Brand)>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsStringLiteral<(('foo' | 'bar') & Brand) | (number & Brand)>>();
expectTypeOf<boolean>().toBe<IsStringLiteral<(('foo' | 'bar') & Brand) | number>>(); // Branded and untagged

// Uncollapsed unions (e.g., `'foo' | 'bar' | (string & {})`)
expectTypeOf<IsStringLiteral<'foo' | 'bar' | (string & {})>>().toBe<false>();
expectTypeOf<IsStringLiteral<`on${string}` & {}>>().toBe<false>();
expectTypeOf<IsStringLiteral<'onClick' | (`on${string}` & {})>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsStringLiteral<'press' | (`on${string}` & {})>>();
expectTypeOf<IsStringLiteral<LiteralUnion<'foo' | 'bar', string>>>().toBe<false>();
expectTypeOf<IsStringLiteral<LiteralUnion<'onClick' | 'onMouseDown', `on${string}`>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsStringLiteral<LiteralUnion<'press' | 'onClick' | 'onMouseDown', `on${string}`>>>();
expectTypeOf<boolean>().toBe<IsStringLiteral<LiteralUnion<'foo' | 'bar', number>>>();
expectTypeOf<IsStringLiteral<Tagged<LiteralUnion<'foo' | 'bar', string>, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsStringLiteral<Tagged<LiteralUnion<'click' | 'onMouseDown', `on${string}`>, 'Tag'>>>();

// Repeated tags preserve the distinction between finite and open-ended strings.
expectTypeOf<IsStringLiteral<Tagged<Tagged<'foo', 'Text'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsStringLiteral<Tagged<Tagged<Uppercase<string>, 'Text'>, 'Validated'>>>().toBe<false>();
