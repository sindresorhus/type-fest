import {expectType} from 'tsd';
import type {IsSymbolLiteral} from '../source/is-symbol-literal.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';

const symbolLiteral1 = Symbol('');
const symbolLiteral2 = Symbol('foo');

// Literals
expectType<IsSymbolLiteral<typeof symbolLiteral1>>(true);
expectType<IsSymbolLiteral<typeof symbolLiteral2>>(true);

// Non-literals
expectType<IsSymbolLiteral<symbol>>(false);

// Non-symbols
expectType<IsSymbolLiteral<string>>(false);
expectType<IsSymbolLiteral<object>>(false);

// Unions
// All symbol literals
expectType<IsSymbolLiteral<typeof symbolLiteral1 | typeof symbolLiteral2>>(true);

// All non-symbols
expectType<IsSymbolLiteral<string | 100n | null>>(false);

// Symbol literals and non-symbols
expectType<IsSymbolLiteral<typeof symbolLiteral1 | 1 | false>>({} as boolean);
expectType<IsSymbolLiteral<typeof symbolLiteral2 | bigint>>({} as boolean);

// Symbol non-literals and non-symbols
expectType<IsSymbolLiteral<symbol | '1' | '2' | 1>>(false);
expectType<IsSymbolLiteral<symbol | string | bigint>>(false);
expectType<IsSymbolLiteral<symbol | string | false>>(false);

// Boundary types
expectType<IsSymbolLiteral<any>>(false);
expectType<IsSymbolLiteral<unknown>>(false);
expectType<IsSymbolLiteral<never>>(false);

// Tagged types
declare const symbol1: unique symbol;
declare const symbol2: unique symbol;
// Literals
expectType<IsSymbolLiteral<Tagged<typeof symbol1 | typeof symbol2, 'Tag'>>>(true);
// Non-literals
expectType<IsSymbolLiteral<Tagged<symbol, 'Tag'>>>(false);
// Non-symbols
expectType<IsSymbolLiteral<Tagged<string, 'Tag'>>>(false);
// Literals and non-symbols
expectType<IsSymbolLiteral<Tagged<typeof symbol1 | string, 'Tag'>>>({} as boolean);
// Non-literals and non-symbols
expectType<IsSymbolLiteral<Tagged<symbol | string, 'Tag'>>>({} as false);
// Unions
expectType<IsSymbolLiteral<Tagged<symbol, 'Tag'> | Tagged<string, 'Tag'>>>(false);
expectType<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | Tagged<typeof symbol2, 'Tag'>>>(true);
expectType<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | Tagged<string, 'Tag'>>>({} as boolean);
expectType<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | string>>({} as boolean); // Tagged and untagged

// Opaque types
// Literals
expectType<IsSymbolLiteral<Opaque<typeof symbol1 | typeof symbol2, 'Tag'>>>(true);
// Non-literals
expectType<IsSymbolLiteral<Opaque<symbol, 'Tag'>>>(false);
// Non-symbols
expectType<IsSymbolLiteral<Opaque<string, 'Tag'>>>(false);
// Literals and non-symbols
expectType<IsSymbolLiteral<Opaque<typeof symbol1 | string, 'Tag'>>>({} as boolean);
// Non-literals and non-symbols
expectType<IsSymbolLiteral<Opaque<symbol | string, 'Tag'>>>({} as false);
// Unions
expectType<IsSymbolLiteral<Opaque<symbol, 'Tag'> | Opaque<string, 'Tag'>>>(false);
expectType<IsSymbolLiteral<Opaque<typeof symbol1, 'Tag'> | Opaque<typeof symbol2, 'Tag'>>>(true);
expectType<IsSymbolLiteral<Opaque<typeof symbol1, 'Tag'> | Opaque<string, 'Tag'>>>({} as boolean);
expectType<IsSymbolLiteral<Opaque<typeof symbol1, 'Tag'> | string>>({} as boolean); // Opaque and untagged

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectType<IsSymbolLiteral<(typeof symbol1 | typeof symbol2) & Brand>>(true);
// Non-literals
expectType<IsSymbolLiteral<symbol & Brand>>(false);
// Non-symbols
expectType<IsSymbolLiteral<string & Brand>>(false);
// Literals and non-symbols
expectType<IsSymbolLiteral<(typeof symbol1 | string) & Brand>>({} as boolean);
// Non-literals and non-symbols
expectType<IsSymbolLiteral<(symbol | string) & Brand>>({} as false);
// Unions
expectType<IsSymbolLiteral<(symbol & Brand) | (string & Brand)>>(false);
expectType<IsSymbolLiteral<(typeof symbol1 & Brand) | (typeof symbol2 & Brand)>>(true);
expectType<IsSymbolLiteral<(typeof symbol1 & Brand) | (string & Brand)>>({} as boolean);
expectType<IsSymbolLiteral<(typeof symbol1 & Brand) | string>>({} as boolean); // Branded and untagged

// Uncollapsed unions (e.g., `typeof symbol1 | (symbol & {})`)
expectType<IsSymbolLiteral<typeof symbol1 | (symbol & {})>>(false);
expectType<IsSymbolLiteral<LiteralUnion<typeof symbol1, symbol>>>(false);
expectType<IsSymbolLiteral<LiteralUnion<typeof symbol1, string>>>({} as boolean);
expectType<IsSymbolLiteral<Tagged<LiteralUnion<typeof symbol1, symbol>, 'Tag'>>>(false);
