import {expectType} from 'tsd';
import type {IsLiteral, Tagged, LiteralUnion} from '../index.d.ts';

declare const sym1: unique symbol;

// Literals
expectType<IsLiteral<'foo'>>(true);
expectType<IsLiteral<1>>(true);
expectType<IsLiteral<1n>>(true);
expectType<IsLiteral<true>>(true);
expectType<IsLiteral<false>>(true);
expectType<IsLiteral<typeof sym1>>(true);

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
expectType<IsLiteral<'foo' | 10_000_000n | false | typeof sym1>>(true);

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

expectType<IsLiteral<typeof sym1 | string>>({} as boolean); // Literal symbol + `string`
expectType<IsLiteral<typeof sym1 | number>>({} as boolean); // Literal symbol + `number`
expectType<IsLiteral<typeof sym1 | bigint>>({} as boolean); // Literal symbol + `bigint`
expectType<IsLiteral<typeof sym1 | boolean>>({} as boolean); // Literal symbol + `boolean`
expectType<IsLiteral<typeof sym1 | null>>(false); // Literal symbol + `null`

// Boundary types
expectType<IsLiteral<any>>(false);
expectType<IsLiteral<unknown>>(false);
expectType<IsLiteral<never>>(false);

// Tagged types
// Literals
expectType<IsLiteral<Tagged<'foo' | 'bar' | 1n | typeof sym1 | false, 'Tag'>>>(true);
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

// Uncollapsed unions
expectType<IsLiteral<'foo' | 1 | false | (string & {})>>(false);
expectType<IsLiteral<LiteralUnion<1n | 2n | 3n, bigint>>>(false);
expectType<IsLiteral<LiteralUnion<'foo' | 1 | false, string>>>({} as boolean);
expectType<IsLiteral<Tagged<LiteralUnion<'foo' | 'bar', string>, 'Tag'>>>(false);
expectType<IsLiteral<Tagged<LiteralUnion<'foo' | 'bar', number>, 'Tag'>>>({} as boolean);
