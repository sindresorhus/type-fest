import {expectType} from 'tsd';
import type {IsLiteral} from '../source/is-literal.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

declare const symbolLiteral: unique symbol;

// Literals
expectType<IsLiteral<'foo'>>(true);
expectType<IsLiteral<1>>(true);
expectType<IsLiteral<1n>>(true);
expectType<IsLiteral<true>>(true);
expectType<IsLiteral<false>>(true);
expectType<IsLiteral<typeof symbolLiteral>>(true);

// Non-literals
expectType<IsLiteral<string>>(false);
expectType<IsLiteral<Uppercase<string>>>(false);
expectType<IsLiteral<`${number}`>>(false);
expectType<IsLiteral<number>>(false);
expectType<IsLiteral<bigint>>(false);
expectType<IsLiteral<boolean>>(false);
expectType<IsLiteral<symbol>>(false);

expectType<IsLiteral<null>>(false);
expectType<IsLiteral<undefined>>(false);
expectType<IsLiteral<object>>(false);
expectType<IsLiteral<(x: number) => number>>(false);
expectType<IsLiteral<string[]>>(false);

// Unions
// All literals
expectType<IsLiteral<'a' | 'b'>>(true);
expectType<IsLiteral<1 | 2n | 'two'>>(true);
expectType<IsLiteral<'foo' | 10_000_000n | false | typeof symbolLiteral>>(true);

// All non-literals
expectType<IsLiteral<string | number>>(false);
expectType<IsLiteral<bigint | symbol | boolean>>(false);

expectType<IsLiteral<object | null | undefined>>(false);

// Literals and non-literals
expectType<IsLiteral<'foo' | number>>({} as boolean); // Literal string + `number`
expectType<IsLiteral<'foo' | bigint>>({} as boolean); // Literal string + `bigint`
expectType<IsLiteral<'foo' | boolean>>({} as boolean); // Literal string + `boolean`
expectType<IsLiteral<'foo' | symbol>>({} as boolean); // Literal string + `symbol`
expectType<IsLiteral<'foo' | null>>({} as boolean); // Literal string + `null`

expectType<IsLiteral<1 | string>>({} as boolean); // Literal number + `string`
expectType<IsLiteral<1 | bigint>>({} as boolean); // Literal number + `bigint`
expectType<IsLiteral<1 | boolean>>({} as boolean); // Literal number + `boolean`
expectType<IsLiteral<1 | symbol>>({} as boolean); // Literal number + `symbol`
expectType<IsLiteral<1 | null>>({} as boolean); // Literal number + `null`

expectType<IsLiteral<1n | string>>({} as boolean); // Literal bigint + `string`
expectType<IsLiteral<1n | number>>({} as boolean); // Literal bigint + `number`
expectType<IsLiteral<1n | boolean>>({} as boolean); // Literal bigint + `boolean`
expectType<IsLiteral<1n | symbol>>({} as boolean); // Literal bigint + `symbol`
expectType<IsLiteral<1n | null>>({} as boolean); // Literal bigint + `null`

expectType<IsLiteral<true | string>>({} as boolean); // Literal boolean + `string`
expectType<IsLiteral<true | number>>({} as boolean); // Literal boolean + `number`
expectType<IsLiteral<true | bigint>>({} as boolean); // Literal boolean + `bigint`
expectType<IsLiteral<true | symbol>>({} as boolean); // Literal boolean + `symbol`
expectType<IsLiteral<true | null>>({} as boolean); // Literal boolean + `null`

expectType<IsLiteral<typeof symbolLiteral | string>>({} as boolean); // Literal symbol + `string`
expectType<IsLiteral<typeof symbolLiteral | number>>({} as boolean); // Literal symbol + `number`
expectType<IsLiteral<typeof symbolLiteral | bigint>>({} as boolean); // Literal symbol + `bigint`
expectType<IsLiteral<typeof symbolLiteral | boolean>>({} as boolean); // Literal symbol + `boolean`
expectType<IsLiteral<typeof symbolLiteral | null>>({} as boolean); // Literal symbol + `null`

// Boundary types
expectType<IsLiteral<any>>(false);
expectType<IsLiteral<unknown>>(false);
expectType<IsLiteral<never>>(false);

// Tagged types
// Literals
expectType<IsLiteral<Tagged<'foo' | 'bar' | 1n | typeof symbolLiteral | false, 'Tag'>>>(true);
// Non-literals
expectType<IsLiteral<Tagged<string | number | symbol, 'Tag'>>>(false);
// Literals and non-literals
expectType<IsLiteral<Tagged<'foo' | 'bar' | number, 'Tag'>>>({} as boolean);
expectType<IsLiteral<Tagged<0 | '' | boolean, 'Tag'>>>({} as boolean);

// Unions
expectType<IsLiteral<Tagged<'foo', 'Tag'> | Tagged<1, 'Tag'>>>(true);
expectType<IsLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>>>(false);
expectType<IsLiteral<Tagged<'foo', 'Tag'> | Tagged<bigint, 'Tag'>>>({} as boolean);
expectType<IsLiteral<Tagged<'foo', 'Tag'> | number>>({} as boolean);
expectType<IsLiteral<Tagged<symbol, 'Tag'> | 'foo'>>({} as boolean);

// Opaque types
// Literals
expectType<IsLiteral<Opaque<'foo' | 'bar' | 1n | typeof symbolLiteral | false, 'Tag'>>>(true);
// Non-literals
expectType<IsLiteral<Opaque<string | number | symbol, 'Tag'>>>(false);
// Literals and non-literals
expectType<IsLiteral<Opaque<'foo' | 'bar' | number, 'Tag'>>>({} as boolean);
expectType<IsLiteral<Opaque<0 | '' | boolean, 'Tag'>>>({} as boolean);

// Unions
expectType<IsLiteral<Opaque<'foo', 'Tag'> | Opaque<1, 'Tag'>>>(true);
expectType<IsLiteral<Opaque<string, 'Tag'> | Opaque<number, 'Tag'>>>(false);
expectType<IsLiteral<Opaque<'foo', 'Tag'> | Opaque<bigint, 'Tag'>>>({} as boolean);
expectType<IsLiteral<Opaque<'foo', 'Tag'> | number>>({} as boolean);
expectType<IsLiteral<Opaque<symbol, 'Tag'> | 'foo'>>({} as boolean);

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectType<IsLiteral<('foo' | 'bar' | 1n | typeof symbolLiteral | false) & Brand>>(true);
// Non-literals
expectType<IsLiteral<(string | number | symbol) & Brand>>(false);
// Literals and non-literals
expectType<IsLiteral<('foo' | 'bar' | number) & Brand>>({} as boolean);
expectType<IsLiteral<(0 | '' | boolean) & Brand>>({} as boolean);

// Unions
expectType<IsLiteral<('foo' & Brand) | (1 & Brand)>>(true);
expectType<IsLiteral<(string & Brand) | (number & Brand)>>(false);
expectType<IsLiteral<('foo' & Brand) | (bigint & Brand)>>({} as boolean);
expectType<IsLiteral<('foo' & Brand) | number>>({} as boolean);
expectType<IsLiteral<(symbol & Brand) | 'foo'>>({} as boolean);

// Uncollapsed unions
expectType<IsLiteral<LiteralUnion<1n | 2n | 3n, bigint>>>(false);
expectType<IsLiteral<'foo' | 1 | false | (string & {})>>({} as boolean);
expectType<IsLiteral<LiteralUnion<'foo' | 1 | false, string>>>({} as boolean);
expectType<IsLiteral<Tagged<LiteralUnion<'foo' | 'bar', string>, 'Tag'>>>(false);
expectType<IsLiteral<Tagged<LiteralUnion<'foo' | 'bar', number>, 'Tag'>>>({} as boolean);
