import {expectType} from 'tsd';
import type {IsBooleanLiteral} from '../source/is-boolean-literal.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';

// Literals
expectType<IsBooleanLiteral<true>>(true);
expectType<IsBooleanLiteral<false>>(true);

// Non-literals
expectType<IsBooleanLiteral<boolean>>(false);

// Non-booleans
expectType<IsBooleanLiteral<string>>(false);
expectType<IsBooleanLiteral<number>>(false);

// Unions
// All boolean literals
expectType<IsBooleanLiteral<true | false>>(false);

// All non-booleans
expectType<IsBooleanLiteral<string | 1 | 2 | null>>(false);

// Boolean literals and non-booleans
expectType<IsBooleanLiteral<false | string | 1n>>({} as boolean);
expectType<IsBooleanLiteral<null | undefined | true>>({} as boolean);

// Boolean non-literals and non-booleans
expectType<IsBooleanLiteral<boolean | string | bigint>>(false);
expectType<IsBooleanLiteral<boolean | 100n | 'foo' | 'bar' | null>>(false);

// Boundary types
expectType<IsBooleanLiteral<any>>(false);
expectType<IsBooleanLiteral<unknown>>(false);
expectType<IsBooleanLiteral<never>>(false);

// Tagged types
// Literals
expectType<IsBooleanLiteral<Tagged<true, 'Tag'>>>(true);
expectType<IsBooleanLiteral<Tagged<false, 'Tag'>>>(true);
// Non-literals
expectType<IsBooleanLiteral<Tagged<boolean, 'Tag'>>>(false);
// Non-booleans
expectType<IsBooleanLiteral<Tagged<string, 'Tag'>>>(false);
// Literals and non-booleans
expectType<IsBooleanLiteral<Tagged<true | string, 'Tag'>>>({} as boolean);
// Non-literals and non-booleans
expectType<IsBooleanLiteral<Tagged<boolean | string, 'Tag'>>>({} as false);
// Unions
expectType<IsBooleanLiteral<Tagged<boolean, 'Tag'> | Tagged<string, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Tagged<true, 'Tag'> | Tagged<string, 'Tag'>>>({} as boolean);
expectType<IsBooleanLiteral<Tagged<true, 'Tag'> | string>>({} as boolean); // Tagged and untagged

// Opaque types
// Literals
expectType<IsBooleanLiteral<Opaque<true, 'Tag'>>>(true);
expectType<IsBooleanLiteral<Opaque<false, 'Tag'>>>(true);
// Non-literals
expectType<IsBooleanLiteral<Opaque<boolean, 'Tag'>>>(false);
// Non-booleans
expectType<IsBooleanLiteral<Opaque<string, 'Tag'>>>(false);
// Literals and non-booleans
expectType<IsBooleanLiteral<Opaque<true | string, 'Tag'>>>({} as boolean);
// Non-literals and non-booleans
expectType<IsBooleanLiteral<Opaque<boolean | string, 'Tag'>>>({} as false);
// Unions
expectType<IsBooleanLiteral<Opaque<boolean, 'Tag'> | Opaque<string, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Opaque<true, 'Tag'> | Opaque<string, 'Tag'>>>({} as boolean);
expectType<IsBooleanLiteral<Opaque<true, 'Tag'> | string>>({} as boolean); // Tagged and untagged

// Branded types
type Brand = {readonly __brand: unique symbol};

// Literals
expectType<IsBooleanLiteral<true & Brand>>(true);
expectType<IsBooleanLiteral<false & Brand>>(true);
// Non-literals
expectType<IsBooleanLiteral<boolean & Brand>>(false);
// Non-booleans
expectType<IsBooleanLiteral<string & Brand>>(false);
// Literals and non-booleans
expectType<IsBooleanLiteral<(true | string) & Brand>>({} as boolean);
// Non-literals and non-booleans
expectType<IsBooleanLiteral<(boolean | string) & Brand>>({} as false);
// Unions
expectType<IsBooleanLiteral<(boolean & Brand) | (string & Brand)>>(false);
expectType<IsBooleanLiteral<(true & Brand) | (string & Brand)>>({} as boolean);
expectType<IsBooleanLiteral<(true & Brand) | string>>({} as boolean); // Branded and untagged

// Uncollapsed unions
expectType<IsBooleanLiteral<true | 1 | 2 | (number & {})>>({} as boolean);
expectType<IsBooleanLiteral<LiteralUnion<1 | 2 | false, number>>>({} as boolean);
expectType<IsBooleanLiteral<LiteralUnion<'foo' | 'bar', string>>>(false);
expectType<IsBooleanLiteral<Tagged<LiteralUnion<false | 'a' | 'b', string>, 'Tag'>>>({} as boolean);
