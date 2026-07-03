import {expectType} from 'tsd';
import type {IsBooleanLiteral, Tagged, LiteralUnion} from '../index.d.ts';

// Literals
expectType<IsBooleanLiteral<false>>(true);
expectType<IsBooleanLiteral<true>>(true);

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
// Non-literals
expectType<IsBooleanLiteral<Tagged<boolean, 'Tag'>>>(false);
// Non-booleans
expectType<IsBooleanLiteral<Tagged<string, 'Tag'>>>(false);
// Literals and non-literals
expectType<IsBooleanLiteral<Tagged<true | boolean, 'Tag'>>>(false);
// Literals and non-booleans
expectType<IsBooleanLiteral<Tagged<true | string, 'Tag'>>>({} as boolean);
// Non-literals and non-booleans
expectType<IsBooleanLiteral<Tagged<boolean | string, 'Tag'>>>({} as false);
// Unions
expectType<IsBooleanLiteral<Tagged<boolean, 'Tag'> | Tagged<string, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Tagged<true, 'Tag'> | Tagged<false, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Tagged<true, 'Tag'> | Tagged<string, 'Tag'>>>({} as boolean);
expectType<IsBooleanLiteral<Tagged<true, 'Tag'> | string>>({} as boolean); // Tagged and untagged

// Uncollapsed unions (e.g., `true | (boolean & {})`)
expectType<IsBooleanLiteral<true | (boolean & {})>>(false);
expectType<IsBooleanLiteral<LiteralUnion<true, boolean>>>(false);
expectType<IsBooleanLiteral<LiteralUnion<true, string>>>({} as boolean);
expectType<IsBooleanLiteral<Tagged<LiteralUnion<true, boolean>, 'Tag'>>>(false);
