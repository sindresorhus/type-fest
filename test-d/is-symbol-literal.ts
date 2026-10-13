import {expectTypeOf} from 'nz';
import type {IsSymbolLiteral} from '../source/is-symbol-literal.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';

const symbolLiteral1 = Symbol('');
const symbolLiteral2 = Symbol('foo');

// Literals
expectTypeOf<IsSymbolLiteral<typeof symbolLiteral1>>().toBe<true>();
expectTypeOf<IsSymbolLiteral<typeof symbolLiteral2>>().toBe<true>();

// Non-literals
expectTypeOf<IsSymbolLiteral<symbol>>().toBe<false>();

// Non-symbols
expectTypeOf<IsSymbolLiteral<string>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<object>>().toBe<false>();

// Unions
// All symbol literals
expectTypeOf<IsSymbolLiteral<typeof symbolLiteral1 | typeof symbolLiteral2>>().toBe<true>();

// All non-symbols
expectTypeOf<IsSymbolLiteral<string | 100n | null>>().toBe<false>();

// Symbol literals and non-symbols
expectTypeOf<boolean>().toBe<IsSymbolLiteral<typeof symbolLiteral1 | 1 | false>>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<typeof symbolLiteral2 | bigint>>();

// Symbol non-literals and non-symbols
expectTypeOf<IsSymbolLiteral<symbol | '1' | '2' | 1>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<symbol | string | bigint>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<symbol | string | false>>().toBe<false>();

// Boundary types
expectTypeOf<IsSymbolLiteral<any>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<unknown>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<never>>().toBe<false>();

// Tagged types
declare const symbol1: unique symbol;
declare const symbol2: unique symbol;
// Literals
expectTypeOf<IsSymbolLiteral<Tagged<typeof symbol1 | typeof symbol2, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsSymbolLiteral<Tagged<symbol, 'Tag'>>>().toBe<false>();
// Non-symbols
expectTypeOf<IsSymbolLiteral<Tagged<string, 'Tag'>>>().toBe<false>();
// Literals and non-symbols
expectTypeOf<boolean>().toBe<IsSymbolLiteral<Tagged<typeof symbol1 | string, 'Tag'>>>();
// Non-literals and non-symbols
expectTypeOf<false>().toBe<IsSymbolLiteral<Tagged<symbol | string, 'Tag'>>>();
// Unions
expectTypeOf<IsSymbolLiteral<Tagged<symbol, 'Tag'> | Tagged<string, 'Tag'>>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | Tagged<typeof symbol2, 'Tag'>>>().toBe<true>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | Tagged<string, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | string>>(); // Tagged and untagged

// Opaque types
// Literals
expectTypeOf<IsSymbolLiteral<Opaque<typeof symbol1 | typeof symbol2, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsSymbolLiteral<Opaque<symbol, 'Tag'>>>().toBe<false>();
// Non-symbols
expectTypeOf<IsSymbolLiteral<Opaque<string, 'Tag'>>>().toBe<false>();
// Literals and non-symbols
expectTypeOf<boolean>().toBe<IsSymbolLiteral<Opaque<typeof symbol1 | string, 'Tag'>>>();
// Non-literals and non-symbols
expectTypeOf<false>().toBe<IsSymbolLiteral<Opaque<symbol | string, 'Tag'>>>();
// Unions
expectTypeOf<IsSymbolLiteral<Opaque<symbol, 'Tag'> | Opaque<string, 'Tag'>>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<Opaque<typeof symbol1, 'Tag'> | Opaque<typeof symbol2, 'Tag'>>>().toBe<true>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<Opaque<typeof symbol1, 'Tag'> | Opaque<string, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<Opaque<typeof symbol1, 'Tag'> | string>>(); // Opaque and untagged

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectTypeOf<IsSymbolLiteral<(typeof symbol1 | typeof symbol2) & Brand>>().toBe<true>();
// Non-literals
expectTypeOf<IsSymbolLiteral<symbol & Brand>>().toBe<false>();
// Non-symbols
expectTypeOf<IsSymbolLiteral<string & Brand>>().toBe<false>();
// Literals and non-symbols
expectTypeOf<boolean>().toBe<IsSymbolLiteral<(typeof symbol1 | string) & Brand>>();
// Non-literals and non-symbols
expectTypeOf<false>().toBe<IsSymbolLiteral<(symbol | string) & Brand>>();
// Unions
expectTypeOf<IsSymbolLiteral<(symbol & Brand) | (string & Brand)>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<(typeof symbol1 & Brand) | (typeof symbol2 & Brand)>>().toBe<true>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<(typeof symbol1 & Brand) | (string & Brand)>>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<(typeof symbol1 & Brand) | string>>(); // Branded and untagged

// Uncollapsed unions (e.g., `typeof symbol1 | (symbol & {})`)
expectTypeOf<IsSymbolLiteral<typeof symbol1 | (symbol & {})>>().toBe<false>();
expectTypeOf<IsSymbolLiteral<LiteralUnion<typeof symbol1, symbol>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsSymbolLiteral<LiteralUnion<typeof symbol1, string>>>();
expectTypeOf<IsSymbolLiteral<Tagged<LiteralUnion<typeof symbol1, symbol>, 'Tag'>>>().toBe<false>();

// Repeated tags preserve the distinction between unique and widened symbols.
expectTypeOf<IsSymbolLiteral<Tagged<Tagged<typeof symbol1, 'Value'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsSymbolLiteral<Tagged<Tagged<symbol, 'Value'>, 'Validated'>>>().toBe<false>();
