import {expectType} from 'tsd';
import type {IsStringLiteral} from '../source/is-string-literal.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';

// Literals
expectType<IsStringLiteral<'foo'>>(true);
expectType<IsStringLiteral<'1'>>(true);
expectType<IsStringLiteral<Uppercase<'a'>>>(true);
expectType<IsStringLiteral<Lowercase<'a'>>>(true);

// Non-literals
expectType<IsStringLiteral<string>>(false);
expectType<IsStringLiteral<Uppercase<string>>>(false);
expectType<IsStringLiteral<Lowercase<string>>>(false);
expectType<IsStringLiteral<Capitalize<string>>>(false);
expectType<IsStringLiteral<Uncapitalize<string>>>(false);
expectType<IsStringLiteral<Capitalize<Lowercase<string>>>>(false);
expectType<IsStringLiteral<Uncapitalize<Uppercase<string>>>>(false);
expectType<IsStringLiteral<`abc${string}`>>(false);
expectType<IsStringLiteral<`${string}abc`>>(false);
expectType<IsStringLiteral<`${number}:${string}`>>(false);
expectType<IsStringLiteral<`abc${Uppercase<string>}`>>(false);
expectType<IsStringLiteral<`${Lowercase<string>}abc`>>(false);
expectType<IsStringLiteral<`${number}`>>(false);
expectType<IsStringLiteral<`${number}${string}`>>(false);

// Non-strings
expectType<IsStringLiteral<bigint>>(false);
expectType<IsStringLiteral<object>>(false);

// Unions
// All string literals
expectType<IsStringLiteral<'a' | 'b'>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'>>>(true);
expectType<IsStringLiteral<Lowercase<'a' | 'b'>>>(true);
expectType<IsStringLiteral<Capitalize<'abc' | 'xyz'>>>(true);
expectType<IsStringLiteral<Uncapitalize<'Abc' | 'Xyz'>>>(true);
expectType<IsStringLiteral<`ab${'c' | 'd' | 'e'}`>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'> | 'C' | 'D'>>(true);
expectType<IsStringLiteral<Lowercase<'xyz'> | Capitalize<'abc'>>>(true);

// All string non-literals
expectType<IsStringLiteral<`${number}` | Uppercase<string>>>(false);
expectType<IsStringLiteral<Capitalize<string> | Uppercase<string>>>(false);
expectType<IsStringLiteral<`abc${string}` | `${string}abc`>>(false);

// All non-strings
expectType<IsStringLiteral<1 | 2 | 3>>(false);
expectType<IsStringLiteral<false | undefined | null>>(false);

// String literals and string non-literals
expectType<IsStringLiteral<Uppercase<string> | 'abc'>>({} as boolean);
expectType<IsStringLiteral<Lowercase<string> | 'Abc'>>({} as boolean);

// String literals and non-strings
expectType<IsStringLiteral<null | '1' | '2' | '3'>>({} as boolean);
expectType<IsStringLiteral<1 | 2 | '3'>>({} as boolean);
expectType<IsStringLiteral<'foo' | 'bar' | number>>({} as boolean);

// String non-literals and non-strings
expectType<IsStringLiteral<string | number | bigint>>({} as false);
expectType<IsStringLiteral<`on${string}` | Uppercase<string> | 1n | null | undefined>>({} as false);

// Boundary types
expectType<IsStringLiteral<any>>(false);
expectType<IsStringLiteral<unknown>>(false);
expectType<IsStringLiteral<never>>(false);

// Tagged types
// Literals
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'>>>(true);
// Non-literals
expectType<IsStringLiteral<Tagged<string, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<Uppercase<string>, 'Tag'>>>(false);
// Non-strings
expectType<IsStringLiteral<Tagged<number, 'Tag'>>>(false);
// Literals and non-literals
expectType<IsStringLiteral<Tagged<'foo' | 'bar' | `on${string}`, 'Tag'>>>({} as boolean);
// Literals and non-strings
expectType<IsStringLiteral<Tagged<'1st' | '2nd' | '3rd' | number, 'Tag'>>>({} as boolean);
// Non-literals and non-strings
expectType<IsStringLiteral<Tagged<string | number, 'Tag'>>>({} as false);
// Unions
expectType<IsStringLiteral<Tagged<'foo', 'Tag'> | Tagged<'bar', 'Tag'>>>(true);
expectType<IsStringLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | Tagged<number, 'Tag'>>>({} as boolean);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | number>>({} as boolean); // Tagged and untagged

// Opaque types
// Literals
expectType<IsStringLiteral<Opaque<'foo' | 'bar', 'Tag'>>>(true);
// Non-literals
expectType<IsStringLiteral<Opaque<string, 'Tag'>>>(false);
expectType<IsStringLiteral<Opaque<Uppercase<string>, 'Tag'>>>(false);
// Non-strings
expectType<IsStringLiteral<Opaque<number, 'Tag'>>>(false);
// Literals and non-literals
expectType<IsStringLiteral<Opaque<'foo' | 'bar' | `on${string}`, 'Tag'>>>({} as boolean);
// Literals and non-strings
expectType<IsStringLiteral<Opaque<'1st' | '2nd' | '3rd' | number, 'Tag'>>>({} as boolean);
// Non-literals and non-strings
expectType<IsStringLiteral<Opaque<string | number, 'Tag'>>>({} as false);
// Unions
expectType<IsStringLiteral<Opaque<'foo', 'Tag'> | Opaque<'bar', 'Tag'>>>(true);
expectType<IsStringLiteral<Opaque<string, 'Tag'> | Opaque<number, 'Tag'>>>(false);
expectType<IsStringLiteral<Opaque<'foo' | 'bar', 'Tag'> | Opaque<number, 'Tag'>>>({} as boolean);
expectType<IsStringLiteral<Opaque<'foo' | 'bar', 'Tag'> | number>>({} as boolean); // Opaque and untagged

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectType<IsStringLiteral<('foo' | 'bar') & Brand>>(true);
// Non-literals
expectType<IsStringLiteral<string & Brand>>(false);
expectType<IsStringLiteral<Uppercase<string> & Brand>>(false);
// Non-strings
expectType<IsStringLiteral<number & Brand>>(false);
// Literals and non-literals
expectType<IsStringLiteral<('foo' | 'bar' | `on${string}`) & Brand>>({} as boolean);
// Literals and non-strings
expectType<IsStringLiteral<('1st' | '2nd' | '3rd' | number) & Brand>>({} as boolean);
// Non-literals and non-strings
expectType<IsStringLiteral<(string | number) & Brand>>({} as false);
// Unions
expectType<IsStringLiteral<('foo' & Brand) | ('bar' & Brand)>>(true);
expectType<IsStringLiteral<(string & Brand) | (number & Brand)>>(false);
expectType<IsStringLiteral<(('foo' | 'bar') & Brand) | (number & Brand)>>({} as boolean);
expectType<IsStringLiteral<(('foo' | 'bar') & Brand) | number>>({} as boolean); // Branded and untagged

// Uncollapsed unions (e.g., `'foo' | 'bar' | (string & {})`)
expectType<IsStringLiteral<'foo' | 'bar' | (string & {})>>(false);
expectType<IsStringLiteral<LiteralUnion<'foo' | 'bar', string>>>(false);
expectType<IsStringLiteral<LiteralUnion<'onClick' | 'onMouseDown', `on${string}`>>>(false);
expectType<IsStringLiteral<LiteralUnion<'press' | 'onClick' | 'onMouseDown', `on${string}`>>>({} as boolean);
expectType<IsStringLiteral<LiteralUnion<'foo' | 'bar', number>>>({} as boolean);
expectType<IsStringLiteral<Tagged<LiteralUnion<'foo' | 'bar', string>, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<LiteralUnion<'click' | 'onMouseDown', `on${string}`>, 'Tag'>>>({} as boolean);
