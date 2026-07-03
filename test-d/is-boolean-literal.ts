import {expectType} from 'tsd';
import type {IsBooleanLiteral, Tagged, LiteralUnion} from '../index.d.ts';

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

// Uncollapsed unions
expectType<IsBooleanLiteral<true | 1 | 2 | (number & {})>>({} as boolean);
expectType<IsBooleanLiteral<LiteralUnion<1 | 2 | false, number>>>({} as boolean);
expectType<IsBooleanLiteral<LiteralUnion<'foo' | 'bar', string>>>(false);
expectType<IsBooleanLiteral<Tagged<LiteralUnion<false | 'a' | 'b', string>, 'Tag'>>>({} as boolean);
