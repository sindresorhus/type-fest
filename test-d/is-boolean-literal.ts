import {expectTypeOf} from 'nz';
import type {IsBooleanLiteral} from '../source/is-boolean-literal.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';

// Literals
expectTypeOf<IsBooleanLiteral<true>>().toBe<true>();
expectTypeOf<IsBooleanLiteral<false>>().toBe<true>();

// Non-literals
expectTypeOf<IsBooleanLiteral<boolean>>().toBe<false>();

// Non-booleans
expectTypeOf<IsBooleanLiteral<string>>().toBe<false>();
expectTypeOf<IsBooleanLiteral<number>>().toBe<false>();

// Unions
// All boolean literals
expectTypeOf<IsBooleanLiteral<true | false>>().toBe<false>();

// All non-booleans
expectTypeOf<IsBooleanLiteral<string | 1 | 2 | null>>().toBe<false>();

// Boolean literals and non-booleans
expectTypeOf<boolean>().toBe<IsBooleanLiteral<false | string | 1n>>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<null | undefined | true>>();

// Boolean non-literals and non-booleans
expectTypeOf<IsBooleanLiteral<boolean | string | bigint>>().toBe<false>();
expectTypeOf<IsBooleanLiteral<boolean | 100n | 'foo' | 'bar' | null>>().toBe<false>();

// Boundary types
expectTypeOf<IsBooleanLiteral<any>>().toBe<false>();
expectTypeOf<IsBooleanLiteral<unknown>>().toBe<false>();
expectTypeOf<IsBooleanLiteral<never>>().toBe<false>();

// Tagged types
// Literals
expectTypeOf<IsBooleanLiteral<Tagged<true, 'Tag'>>>().toBe<true>();
expectTypeOf<IsBooleanLiteral<Tagged<false, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsBooleanLiteral<Tagged<boolean, 'Tag'>>>().toBe<false>();
// Non-booleans
expectTypeOf<IsBooleanLiteral<Tagged<string, 'Tag'>>>().toBe<false>();
// Literals and non-booleans
expectTypeOf<boolean>().toBe<IsBooleanLiteral<Tagged<true | string, 'Tag'>>>();
// Non-literals and non-booleans
expectTypeOf<false>().toBe<IsBooleanLiteral<Tagged<boolean | string, 'Tag'>>>();
// Unions
expectTypeOf<IsBooleanLiteral<Tagged<boolean, 'Tag'> | Tagged<string, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<Tagged<true, 'Tag'> | Tagged<string, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<Tagged<true, 'Tag'> | string>>(); // Tagged and untagged

// Opaque types
// Literals
expectTypeOf<IsBooleanLiteral<Opaque<true, 'Tag'>>>().toBe<true>();
expectTypeOf<IsBooleanLiteral<Opaque<false, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsBooleanLiteral<Opaque<boolean, 'Tag'>>>().toBe<false>();
// Non-booleans
expectTypeOf<IsBooleanLiteral<Opaque<string, 'Tag'>>>().toBe<false>();
// Literals and non-booleans
expectTypeOf<boolean>().toBe<IsBooleanLiteral<Opaque<true | string, 'Tag'>>>();
// Non-literals and non-booleans
expectTypeOf<false>().toBe<IsBooleanLiteral<Opaque<boolean | string, 'Tag'>>>();
// Unions
expectTypeOf<IsBooleanLiteral<Opaque<boolean, 'Tag'> | Opaque<string, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<Opaque<true, 'Tag'> | Opaque<string, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<Opaque<true, 'Tag'> | string>>(); // Tagged and untagged

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectTypeOf<IsBooleanLiteral<true & Brand>>().toBe<true>();
expectTypeOf<IsBooleanLiteral<false & Brand>>().toBe<true>();
// Non-literals
expectTypeOf<IsBooleanLiteral<boolean & Brand>>().toBe<false>();
// Non-booleans
expectTypeOf<IsBooleanLiteral<string & Brand>>().toBe<false>();
// Literals and non-booleans
expectTypeOf<boolean>().toBe<IsBooleanLiteral<(true | string) & Brand>>();
// Non-literals and non-booleans
expectTypeOf<false>().toBe<IsBooleanLiteral<(boolean | string) & Brand>>();
// Unions
expectTypeOf<IsBooleanLiteral<(boolean & Brand) | (string & Brand)>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<(true & Brand) | (string & Brand)>>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<(true & Brand) | string>>(); // Branded and untagged

// Uncollapsed unions
expectTypeOf<boolean>().toBe<IsBooleanLiteral<true | 1 | 2 | (number & {})>>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<LiteralUnion<1 | 2 | false, number>>>();
expectTypeOf<IsBooleanLiteral<LiteralUnion<'foo' | 'bar', string>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsBooleanLiteral<Tagged<LiteralUnion<false | 'a' | 'b', string>, 'Tag'>>>();
