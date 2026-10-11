import {expectTypeOf} from 'nz';
import type {IsNumericLiteral} from '../source/is-numeric-literal.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

// Literals
expectTypeOf<IsNumericLiteral<1>>().toBe<true>();
expectTypeOf<IsNumericLiteral<1n>>().toBe<true>();

// Non-literals
expectTypeOf<IsNumericLiteral<number>>().toBe<false>();
expectTypeOf<IsNumericLiteral<bigint>>().toBe<false>();

// Non-numerics
expectTypeOf<IsNumericLiteral<string>>().toBe<false>();
expectTypeOf<IsNumericLiteral<object>>().toBe<false>();

// Unions
// All numeric literals
expectTypeOf<IsNumericLiteral<1 | 2 | 3>>().toBe<true>();
expectTypeOf<IsNumericLiteral<10n | 20n>>().toBe<true>();
expectTypeOf<IsNumericLiteral<3.14 | 0.01 | 5_000_000n>>().toBe<true>();

// All numeric non-literals
expectTypeOf<IsNumericLiteral<number | bigint>>().toBe<false>();

// All non-numerics
expectTypeOf<IsNumericLiteral<string | symbol | undefined>>().toBe<false>();

// Numeric literals and numeric non-literals
expectTypeOf<boolean>().toBe<IsNumericLiteral<1 | 2.5 | bigint>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<10n | number>>();

// Numeric literals and non-numerics
expectTypeOf<boolean>().toBe<IsNumericLiteral<null | 1 | 2>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<'1' | '2' | 3n>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<1.96 | 2n | string>>();

// Numeric non-literals and non-numerics
expectTypeOf<IsNumericLiteral<bigint | 'foo'>>().toBe<false>();
expectTypeOf<IsNumericLiteral<number | null | '2'>>().toBe<false>();

// Boundary types
expectTypeOf<IsNumericLiteral<any>>().toBe<false>();
expectTypeOf<IsNumericLiteral<unknown>>().toBe<false>();
expectTypeOf<IsNumericLiteral<never>>().toBe<false>();

// Tagged types
// Literals
expectTypeOf<IsNumericLiteral<Tagged<1 | 2, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsNumericLiteral<Tagged<number, 'Tag'>>>().toBe<false>();
// Non-numerics
expectTypeOf<IsNumericLiteral<Tagged<string, 'Tag'>>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsNumericLiteral<Tagged<1 | 2 | bigint, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<Tagged<1n | 2n | number, 'Tag'>>>();
// Literals and non-numerics
expectTypeOf<boolean>().toBe<IsNumericLiteral<Tagged<1 | 2n | string, 'Tag'>>>();
// Non-literals and non-numerics
expectTypeOf<false>().toBe<IsNumericLiteral<Tagged<number | string, 'Tag'>>>();
// Unions
expectTypeOf<IsNumericLiteral<Tagged<1, 'Tag'> | Tagged<2, 'Tag'>>>().toBe<true>();
expectTypeOf<IsNumericLiteral<Tagged<number, 'Tag'> | Tagged<string, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<Tagged<1 | 2, 'Tag'> | Tagged<string, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<Tagged<1 | 2, 'Tag'> | string>>(); // Tagged and untagged

// Opaque types
// Literals
expectTypeOf<IsNumericLiteral<Opaque<1 | 2, 'Tag'>>>().toBe<true>();
// Non-literals
expectTypeOf<IsNumericLiteral<Opaque<number, 'Tag'>>>().toBe<false>();
// Non-numerics
expectTypeOf<IsNumericLiteral<Opaque<string, 'Tag'>>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsNumericLiteral<Opaque<1 | 2 | bigint, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<Opaque<1n | 2n | number, 'Tag'>>>();
// Literals and non-numerics
expectTypeOf<boolean>().toBe<IsNumericLiteral<Opaque<1 | 2n | string, 'Tag'>>>();
// Non-literals and non-numerics
expectTypeOf<false>().toBe<IsNumericLiteral<Opaque<number | string, 'Tag'>>>();
// Unions
expectTypeOf<IsNumericLiteral<Opaque<1, 'Tag'> | Opaque<2, 'Tag'>>>().toBe<true>();
expectTypeOf<IsNumericLiteral<Opaque<number, 'Tag'> | Opaque<string, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<Opaque<1 | 2, 'Tag'> | Opaque<string, 'Tag'>>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<Opaque<1 | 2, 'Tag'> | string>>(); // Opaque and non-opaque

// Branded types
type Brand = {readonly __brand: unique symbol};

// Tagged types
// Literals
expectTypeOf<IsNumericLiteral<(1 | 2) & Brand>>().toBe<true>();
// Non-literals
expectTypeOf<IsNumericLiteral<number & Brand>>().toBe<false>();
// Non-numerics
expectTypeOf<IsNumericLiteral<string & Brand>>().toBe<false>();
// Literals and non-literals
expectTypeOf<boolean>().toBe<IsNumericLiteral<(1 | 2 | bigint) & Brand>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<(1n | 2n | number) & Brand>>();
// Literals and non-numerics
expectTypeOf<boolean>().toBe<IsNumericLiteral<(1 | 2n | string) & Brand>>();
// Non-literals and non-numerics
expectTypeOf<false>().toBe<IsNumericLiteral<(number | string) & Brand>>();
// Unions
expectTypeOf<IsNumericLiteral<(1 & Brand) | (2 & Brand)>>().toBe<true>();
expectTypeOf<IsNumericLiteral<(number & Brand) | (string & Brand)>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<((1 | 2) & Brand) | (string & Brand)>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<((1 | 2) & Brand) | string>>(); // Branded and non-branded

// Uncollapsed unions (e.g., `1 | 2 | (number & {})`)
expectTypeOf<IsNumericLiteral<1 | 2 | (number & {})>>().toBe<false>();
expectTypeOf<IsNumericLiteral<100n | 200n | (bigint & {})>>().toBe<false>();
expectTypeOf<IsNumericLiteral<LiteralUnion<1 | 2, number>>>().toBe<false>();
expectTypeOf<IsNumericLiteral<LiteralUnion<1n | 2n, bigint>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<LiteralUnion<1n | 2n, number>>>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<LiteralUnion<1 | 2, string>>>();
expectTypeOf<IsNumericLiteral<Tagged<LiteralUnion<1 | 2, number>, 'Tag'>>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsNumericLiteral<Tagged<LiteralUnion<1n | 2n, number>, 'Tag'>>>();

// A numeric enum member is a literal even though `number` is assignable to it, which is what separates it from the widened `number`. A string enum member is recognised the same way, so the two enum kinds agree.
enum NumericEnum {
	A,
	B,
}

enum StringEnum {
	A = 'a',
	B = 'b',
}

enum NegativeNumericEnum {
	A = -1,
}

const enum ConstNumericEnum {
	A = 5,
}

expectTypeOf<IsNumericLiteral<NumericEnum.A>>().toBe<true>();
expectTypeOf<IsNumericLiteral<NegativeNumericEnum.A>>().toBe<true>();
expectTypeOf<IsNumericLiteral<ConstNumericEnum.A>>().toBe<true>();
expectTypeOf<IsNumericLiteral<NumericEnum>>().toBe<true>();
expectTypeOf<IsNumericLiteral<NumericEnum.A | 1>>().toBe<true>();
expectTypeOf<IsNumericLiteral<NumericEnum.A | number>>().toBe<false>();
