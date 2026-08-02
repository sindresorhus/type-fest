import {expectType} from 'tsd';
import type {IsNumericLiteral} from '../source/is-numeric-literal.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

// Literals
expectType<IsNumericLiteral<1>>(true);
expectType<IsNumericLiteral<1n>>(true);

// Non-literals
expectType<IsNumericLiteral<number>>(false);
expectType<IsNumericLiteral<bigint>>(false);

// Non-numerics
expectType<IsNumericLiteral<string>>(false);
expectType<IsNumericLiteral<object>>(false);

// Unions
// All numeric literals
expectType<IsNumericLiteral<1 | 2 | 3>>(true);
expectType<IsNumericLiteral<10n | 20n>>(true);
expectType<IsNumericLiteral<3.14 | 0.01 | 5_000_000n>>(true);

// All numeric non-literals
expectType<IsNumericLiteral<number | bigint>>(false);

// All non-numerics
expectType<IsNumericLiteral<string | symbol | undefined>>(false);

// Numeric literals and numeric non-literals
expectType<IsNumericLiteral<1 | 2.5 | bigint>>({} as boolean);
expectType<IsNumericLiteral<10n | number>>({} as boolean);

// Numeric literals and non-numerics
expectType<IsNumericLiteral<null | 1 | 2>>({} as boolean);
expectType<IsNumericLiteral<'1' | '2' | 3n>>({} as boolean);
expectType<IsNumericLiteral<1.96 | 2n | string>>({} as boolean);

// Numeric non-literals and non-numerics
expectType<IsNumericLiteral<bigint | 'foo'>>(false);
expectType<IsNumericLiteral<number | null | '2'>>(false);

// Boundary types
expectType<IsNumericLiteral<any>>(false);
expectType<IsNumericLiteral<unknown>>(false);
expectType<IsNumericLiteral<never>>(false);

// Tagged types
// Literals
expectType<IsNumericLiteral<Tagged<1 | 2, 'Tag'>>>(true);
// Non-literals
expectType<IsNumericLiteral<Tagged<number, 'Tag'>>>(false);
// Non-numerics
expectType<IsNumericLiteral<Tagged<string, 'Tag'>>>(false);
// Literals and non-literals
expectType<IsNumericLiteral<Tagged<1 | 2 | bigint, 'Tag'>>>({} as boolean);
expectType<IsNumericLiteral<Tagged<1n | 2n | number, 'Tag'>>>({} as boolean);
// Literals and non-numerics
expectType<IsNumericLiteral<Tagged<1 | 2n | string, 'Tag'>>>({} as boolean);
// Non-literals and non-numerics
expectType<IsNumericLiteral<Tagged<number | string, 'Tag'>>>({} as false);
// Unions
expectType<IsNumericLiteral<Tagged<1, 'Tag'> | Tagged<2, 'Tag'>>>(true);
expectType<IsNumericLiteral<Tagged<number, 'Tag'> | Tagged<string, 'Tag'>>>(false);
expectType<IsNumericLiteral<Tagged<1 | 2, 'Tag'> | Tagged<string, 'Tag'>>>({} as boolean);
expectType<IsNumericLiteral<Tagged<1 | 2, 'Tag'> | string>>({} as boolean); // Tagged and untagged

// Opaque types
// Literals
expectType<IsNumericLiteral<Opaque<1 | 2, 'Tag'>>>(true);
// Non-literals
expectType<IsNumericLiteral<Opaque<number, 'Tag'>>>(false);
// Non-numerics
expectType<IsNumericLiteral<Opaque<string, 'Tag'>>>(false);
// Literals and non-literals
expectType<IsNumericLiteral<Opaque<1 | 2 | bigint, 'Tag'>>>({} as boolean);
expectType<IsNumericLiteral<Opaque<1n | 2n | number, 'Tag'>>>({} as boolean);
// Literals and non-numerics
expectType<IsNumericLiteral<Opaque<1 | 2n | string, 'Tag'>>>({} as boolean);
// Non-literals and non-numerics
expectType<IsNumericLiteral<Opaque<number | string, 'Tag'>>>({} as false);
// Unions
expectType<IsNumericLiteral<Opaque<1, 'Tag'> | Opaque<2, 'Tag'>>>(true);
expectType<IsNumericLiteral<Opaque<number, 'Tag'> | Opaque<string, 'Tag'>>>(false);
expectType<IsNumericLiteral<Opaque<1 | 2, 'Tag'> | Opaque<string, 'Tag'>>>({} as boolean);
expectType<IsNumericLiteral<Opaque<1 | 2, 'Tag'> | string>>({} as boolean); // Opaque and non-opaque

// Branded types
type Brand = {readonly __brand: unique symbol};

// Tagged types
// Literals
expectType<IsNumericLiteral<(1 | 2) & Brand>>(true);
// Non-literals
expectType<IsNumericLiteral<number & Brand>>(false);
// Non-numerics
expectType<IsNumericLiteral<string & Brand>>(false);
// Literals and non-literals
expectType<IsNumericLiteral<(1 | 2 | bigint) & Brand>>({} as boolean);
expectType<IsNumericLiteral<(1n | 2n | number) & Brand>>({} as boolean);
// Literals and non-numerics
expectType<IsNumericLiteral<(1 | 2n | string) & Brand>>({} as boolean);
// Non-literals and non-numerics
expectType<IsNumericLiteral<(number | string) & Brand>>({} as false);
// Unions
expectType<IsNumericLiteral<(1 & Brand) | (2 & Brand)>>(true);
expectType<IsNumericLiteral<(number & Brand) | (string & Brand)>>(false);
expectType<IsNumericLiteral<((1 | 2) & Brand) | (string & Brand)>>({} as boolean);
expectType<IsNumericLiteral<((1 | 2) & Brand) | string>>({} as boolean); // Branded and non-branded

// Uncollapsed unions (e.g., `1 | 2 | (number & {})`)
expectType<IsNumericLiteral<1 | 2 | (number & {})>>(false);
expectType<IsNumericLiteral<100n | 200n | (bigint & {})>>(false);
expectType<IsNumericLiteral<LiteralUnion<1 | 2, number>>>(false);
expectType<IsNumericLiteral<LiteralUnion<1n | 2n, bigint>>>(false);
expectType<IsNumericLiteral<LiteralUnion<1n | 2n, number>>>({} as boolean);
expectType<IsNumericLiteral<LiteralUnion<1 | 2, string>>>({} as boolean);
expectType<IsNumericLiteral<Tagged<LiteralUnion<1 | 2, number>, 'Tag'>>>(false);
expectType<IsNumericLiteral<Tagged<LiteralUnion<1n | 2n, number>, 'Tag'>>>({} as boolean);
