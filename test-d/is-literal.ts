import {expectTypeOf} from 'nz';
import type {IsLiteral} from '../source/is-literal.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

declare const symbolLiteral: unique symbol;

// Literals
expectTypeOf<IsLiteral<'foo'>>().toBe<true>();
expectTypeOf<IsLiteral<1>>().toBe<true>();
expectTypeOf<IsLiteral<1n>>().toBe<true>();
expectTypeOf<IsLiteral<true>>().toBe<true>();
expectTypeOf<IsLiteral<false>>().toBe<true>();
expectTypeOf<IsLiteral<typeof symbolLiteral>>().toBe<true>();

// Non-literals
expectTypeOf<IsLiteral<string>>().toBe<false>();
expectTypeOf<IsLiteral<Uppercase<string>>>().toBe<false>();
expectTypeOf<IsLiteral<`${number}`>>().toBe<false>();
expectTypeOf<IsLiteral<number>>().toBe<false>();
expectTypeOf<IsLiteral<bigint>>().toBe<false>();
expectTypeOf<IsLiteral<boolean>>().toBe<false>();
expectTypeOf<IsLiteral<symbol>>().toBe<false>();

expectTypeOf<IsLiteral<null>>().toBe<false>();
expectTypeOf<IsLiteral<undefined>>().toBe<false>();
expectTypeOf<IsLiteral<object>>().toBe<false>();
expectTypeOf<IsLiteral<(x: number) => number>>().toBe<false>();
expectTypeOf<IsLiteral<string[]>>().toBe<false>();

// Unions
// All literals
expectTypeOf<IsLiteral<'a' | 'b'>>().toBe<true>();
expectTypeOf<IsLiteral<1 | 2n | 'two'>>().toBe<true>();
expectTypeOf<IsLiteral<'foo' | 10_000_000n | false | typeof symbolLiteral>>().toBe<true>();

// All non-literals
expectTypeOf<IsLiteral<string | number>>().toBe<false>();
expectTypeOf<IsLiteral<bigint | symbol | boolean>>().toBe<false>();

expectTypeOf<IsLiteral<object | null | undefined>>().toBe<false>();

// Literals and non-literals
expectTypeOf<boolean>().toBe<IsLiteral<'foo' | number>>(); // Literal string + `number`
expectTypeOf<boolean>().toBe<IsLiteral<'foo' | bigint>>(); // Literal string + `bigint`
expectTypeOf<boolean>().toBe<IsLiteral<'foo' | boolean>>(); // Literal string + `boolean`
expectTypeOf<boolean>().toBe<IsLiteral<'foo' | symbol>>(); // Literal string + `symbol`
expectTypeOf<boolean>().toBe<IsLiteral<'foo' | null>>(); // Literal string + `null`

expectTypeOf<boolean>().toBe<IsLiteral<1 | string>>(); // Literal number + `string`
expectTypeOf<boolean>().toBe<IsLiteral<1 | bigint>>(); // Literal number + `bigint`
expectTypeOf<boolean>().toBe<IsLiteral<1 | boolean>>(); // Literal number + `boolean`
expectTypeOf<boolean>().toBe<IsLiteral<1 | symbol>>(); // Literal number + `symbol`
expectTypeOf<boolean>().toBe<IsLiteral<1 | null>>(); // Literal number + `null`

expectTypeOf<boolean>().toBe<IsLiteral<1n | string>>(); // Literal bigint + `string`
expectTypeOf<boolean>().toBe<IsLiteral<1n | number>>(); // Literal bigint + `number`
expectTypeOf<boolean>().toBe<IsLiteral<1n | boolean>>(); // Literal bigint + `boolean`
expectTypeOf<boolean>().toBe<IsLiteral<1n | symbol>>(); // Literal bigint + `symbol`
expectTypeOf<boolean>().toBe<IsLiteral<1n | null>>(); // Literal bigint + `null`

expectTypeOf<boolean>().toBe<IsLiteral<true | string>>(); // Literal boolean + `string`
expectTypeOf<boolean>().toBe<IsLiteral<true | number>>(); // Literal boolean + `number`
expectTypeOf<boolean>().toBe<IsLiteral<true | bigint>>(); // Literal boolean + `bigint`
expectTypeOf<boolean>().toBe<IsLiteral<true | symbol>>(); // Literal boolean + `symbol`
expectTypeOf<boolean>().toBe<IsLiteral<true | null>>(); // Literal boolean + `null`

expectTypeOf<boolean>().toBe<IsLiteral<typeof symbolLiteral | string>>(); // Literal symbol + `string`
expectTypeOf<boolean>().toBe<IsLiteral<typeof symbolLiteral | number>>(); // Literal symbol + `number`
expectTypeOf<boolean>().toBe<IsLiteral<typeof symbolLiteral | bigint>>(); // Literal symbol + `bigint`
expectTypeOf<boolean>().toBe<IsLiteral<typeof symbolLiteral | boolean>>(); // Literal symbol + `boolean`
expectTypeOf<boolean>().toBe<IsLiteral<typeof symbolLiteral | null>>(); // Literal symbol + `null`

// Boundary types
expectTypeOf<IsLiteral<any>>().toBe<false>();
expectTypeOf<IsLiteral<unknown>>().toBe<false>();
expectTypeOf<IsLiteral<never>>().toBe<false>();

// Tagged types
// Literals
expectTypeOf<IsLiteral<Tagged<'foo' | 'bar' | 1n | typeof symbolLiteral | false, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsLiteral<Tagged<string | number | symbol, 'Tag'>>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsLiteral<Tagged<'foo' | 'bar' | number, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsLiteral<Tagged<0 | '' | boolean, 'Tag'>>>();

// Unions
expectTypeOf<IsLiteral<Tagged<'foo', 'Tag'> | Tagged<1, 'Tag'>>>().toBe<true>();
expectTypeOf<IsLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsLiteral<Tagged<'foo', 'Tag'> | Tagged<bigint, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsLiteral<Tagged<'foo', 'Tag'> | number>>();
expectTypeOf<boolean>().toBe<IsLiteral<Tagged<symbol, 'Tag'> | 'foo'>>();

// Opaque types
// Literals
expectTypeOf<IsLiteral<Opaque<'foo' | 'bar' | 1n | typeof symbolLiteral | false, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsLiteral<Opaque<string | number | symbol, 'Tag'>>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsLiteral<Opaque<'foo' | 'bar' | number, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsLiteral<Opaque<0 | '' | boolean, 'Tag'>>>();

// Unions
expectTypeOf<IsLiteral<Opaque<'foo', 'Tag'> | Opaque<1, 'Tag'>>>().toBe<true>();
expectTypeOf<IsLiteral<Opaque<string, 'Tag'> | Opaque<number, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsLiteral<Opaque<'foo', 'Tag'> | Opaque<bigint, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsLiteral<Opaque<'foo', 'Tag'> | number>>();
expectTypeOf<boolean>().toBe<IsLiteral<Opaque<symbol, 'Tag'> | 'foo'>>();

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectTypeOf<IsLiteral<('foo' | 'bar' | 1n | typeof symbolLiteral | false) & Brand>>().toBe<true>();
// Non-literals
expectTypeOf<IsLiteral<(string | number | symbol) & Brand>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsLiteral<('foo' | 'bar' | number) & Brand>>();
expectTypeOf<boolean>().toBe<IsLiteral<(0 | '' | boolean) & Brand>>();

// Unions
expectTypeOf<IsLiteral<('foo' & Brand) | (1 & Brand)>>().toBe<true>();
expectTypeOf<IsLiteral<(string & Brand) | (number & Brand)>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsLiteral<('foo' & Brand) | (bigint & Brand)>>();
expectTypeOf<boolean>().toBe<IsLiteral<('foo' & Brand) | number>>();
expectTypeOf<boolean>().toBe<IsLiteral<(symbol & Brand) | 'foo'>>();

// Uncollapsed unions
expectTypeOf<IsLiteral<LiteralUnion<1n | 2n | 3n, bigint>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsLiteral<'foo' | 1 | false | (string & {})>>();
expectTypeOf<IsLiteral<`on${string}` & {}>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsLiteral<'press' | (`on${string}` & {})>>();
expectTypeOf<boolean>().toBe<IsLiteral<LiteralUnion<'foo' | 1 | false, string>>>();
expectTypeOf<IsLiteral<Tagged<LiteralUnion<'foo' | 'bar', string>, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsLiteral<Tagged<LiteralUnion<'foo' | 'bar', number>, 'Tag'>>>();

// Stacked tags do not turn widened primitive types into literals.
expectTypeOf<IsLiteral<Tagged<Tagged<'foo' | 1 | false | typeof symbolLiteral, 'Value'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsLiteral<Tagged<Tagged<string | number | bigint | symbol | boolean, 'Value'>, 'Validated'>>>().toBe<false>();
expectTypeOf<IsLiteral<Tagged<Tagged<'foo' | number, 'Value'>, 'Validated'>>>().toBe<boolean>();
