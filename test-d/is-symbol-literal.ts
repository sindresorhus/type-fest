import {expectType} from 'tsd';
import type {IsSymbolLiteral, Tagged, LiteralUnion} from '../index.d.ts';

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
// Literals and non-literals
expectType<IsSymbolLiteral<Tagged<typeof symbol1 | symbol, 'Tag'>>>(false);
// Literals and non-symbols
expectType<IsSymbolLiteral<Tagged<typeof symbol1 | string, 'Tag'>>>({} as boolean);
// Non-literals and non-symbols
expectType<IsSymbolLiteral<Tagged<symbol | string, 'Tag'>>>({} as false);
// Unions
expectType<IsSymbolLiteral<Tagged<symbol, 'Tag'> | Tagged<string, 'Tag'>>>(false);
expectType<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | Tagged<typeof symbol2, 'Tag'>>>(true);
expectType<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | Tagged<string, 'Tag'>>>({} as boolean);
expectType<IsSymbolLiteral<Tagged<typeof symbol1, 'Tag'> | string>>({} as boolean); // Tagged and untagged

// Uncollapsed unions (e.g., `typeof symbol1 | (symbol & {})`)
expectType<IsSymbolLiteral<typeof symbol1 | (symbol & {})>>(false);
expectType<IsSymbolLiteral<LiteralUnion<typeof symbol1, symbol>>>(false);
expectType<IsSymbolLiteral<LiteralUnion<typeof symbol1, string>>>({} as boolean);
expectType<IsSymbolLiteral<Tagged<LiteralUnion<typeof symbol1, symbol>, 'Tag'>>>(false);
