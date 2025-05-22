import {expectType} from 'tsd';
import type tag from 'tagged-tag';
import type {
	IsLiteral,
	IsStringLiteral,
	IsNumericLiteral,
	IsBooleanLiteral,
	IsSymbolLiteral,
	Tagged,
} from '../index.d.ts';
import type {Numeric} from '../source/numeric.js';

type stringLiteral = 'aA';
type numberLiteral = 1;
type bigintLiteral = 1n;
type booleanLiteral = true;
type symbolLiteral = typeof tag;
type numericLiteral = numberLiteral | bigintLiteral;

declare const boolean: boolean;

// Literals should be true
expectType<IsLiteral<stringLiteral>>(true);
expectType<IsLiteral<numberLiteral>>(true);
expectType<IsLiteral<bigintLiteral>>(true);
expectType<IsLiteral<booleanLiteral>>(true);
expectType<IsLiteral<symbolLiteral>>(true);

// Primitives should be false
expectType<IsLiteral<string>>(false);
expectType<IsLiteral<number>>(false);
expectType<IsLiteral<bigint>>(false);
expectType<IsLiteral<boolean>>(false);
expectType<IsLiteral<symbol>>(false);

// Null, undefined, and non-primitives should fail all literal checks
expectType<IsLiteral<null>>(false);
expectType<IsLiteral<undefined>>(false);
expectType<IsLiteral<any>>(false);
expectType<IsLiteral<never>>(false);

expectType<IsStringLiteral<stringLiteral>>(true);
expectType<IsStringLiteral<string>>(false);

// Strings with infinite set of possible values return `false`
expectType<IsStringLiteral<Uppercase<string>>>(false);
expectType<IsStringLiteral<Lowercase<string>>>(false);
expectType<IsStringLiteral<Capitalize<string>>>(false);
expectType<IsStringLiteral<Uncapitalize<string>>>(false);
expectType<IsStringLiteral<Capitalize<Lowercase<string>>>>(false);
expectType<IsStringLiteral<Uncapitalize<Uppercase<string>>>>(false);
expectType<IsStringLiteral<`abc${string}`>>(false);
expectType<IsStringLiteral<`${string}abc`>>(false);
expectType<IsStringLiteral<`${number}:${string}`>>(false);
expectType<IsStringLiteral<`abc${Uppercase<string>}`>>(false);
expectType<IsStringLiteral<`${Lowercase<string>}abc`>>(false);
expectType<IsStringLiteral<`${number}`>>(false);
expectType<IsStringLiteral<`${number}${string}`>>(false);
expectType<IsStringLiteral<`${number}` | Uppercase<string>>>(false);
expectType<IsStringLiteral<Capitalize<string> | Uppercase<string>>>(false);
expectType<IsStringLiteral<`abc${string}` | `${string}abc`>>(false);

// Strings with finite set of possible values return `true`
expectType<IsStringLiteral<'a' | 'b'>>(true);
expectType<IsStringLiteral<Uppercase<'a'>>>(true);
expectType<IsStringLiteral<Lowercase<'a'>>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'>>>(true);
expectType<IsStringLiteral<Lowercase<'a' | 'b'>>>(true);
expectType<IsStringLiteral<Capitalize<'abc' | 'xyz'>>>(true);
expectType<IsStringLiteral<Uncapitalize<'Abc' | 'Xyz'>>>(true);
expectType<IsStringLiteral<`ab${'c' | 'd' | 'e'}`>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'> | 'C' | 'D'>>(true);
expectType<IsStringLiteral<Lowercase<'xyz'> | Capitalize<'abc'>>>(true);

// Union of literals and non-literals return `boolean`
expectType<IsStringLiteral<Uppercase<string> | stringLiteral>>(boolean);
expectType<IsStringLiteral<Lowercase<string> | stringLiteral>>(boolean);

// Union of diffrent literal types return `boolean`
expectType<IsNumericLiteral<numericLiteral | stringLiteral>>(boolean);
expectType<IsStringLiteral<stringLiteral | numberLiteral>>(boolean);

// Boundary types
expectType<IsStringLiteral<any>>(false);
expectType<IsStringLiteral<never>>(false);

expectType<IsNumericLiteral<numericLiteral>>(true);
expectType<IsNumericLiteral<numberLiteral>>(true);
expectType<IsNumericLiteral<bigintLiteral>>(true);
expectType<IsNumericLiteral<Numeric>>(false);
expectType<IsNumericLiteral<number>>(false);
expectType<IsNumericLiteral<bigint>>(false);

expectType<IsBooleanLiteral<booleanLiteral>>(true);
expectType<IsBooleanLiteral<true | false>>(false);
expectType<IsBooleanLiteral<boolean>>(false);

expectType<IsSymbolLiteral<symbolLiteral>>(true);
expectType<IsSymbolLiteral<symbol>>(false);

// Missing generic parameter
// @ts-expect-error
type A0 = IsLiteral;
// @ts-expect-error
type A1 = IsStringLiteral;
// @ts-expect-error
type A2 = IsNumericLiteral;
// @ts-expect-error
type A3 = IsBooleanLiteral;
// @ts-expect-error
type A4 = IsSymbolLiteral;

// Tagged types should be false
expectType<IsStringLiteral<Tagged<string, 'Tag'>>>(false);
expectType<IsSymbolLiteral<Tagged<symbol, 'Tag'>>>(false);
expectType<IsNumericLiteral<Tagged<number, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Tagged<bigint, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Tagged<boolean, 'Tag'>>>(false);
