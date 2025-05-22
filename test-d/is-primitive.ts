import {expectType} from 'tsd';
import type tag from 'tagged-tag';
import type {
	IsPrimitive,
	IsBooleanPrimitive,
	IsNumericPrimitive,
	IsStringPrimitive,
	IsSymbolPrimitive,
	Tagged,
} from '../index.d.ts';
import type {Numeric} from '../source/numeric.js';

type stringLiteral = '';
type numberLiteral = 1;
type bigintLiteral = 1n;
type booleanLiteral = true;
type symbolLiteral = typeof tag;
type numericLiteral = numberLiteral | bigintLiteral;

// Primitives should be true
expectType<IsPrimitive<string>>(true);
expectType<IsPrimitive<number>>(true);
expectType<IsPrimitive<bigint>>(true);
expectType<IsPrimitive<symbol>>(true);
expectType<IsPrimitive<boolean>>(true);

// Literals should be false
expectType<IsPrimitive<stringLiteral>>(false);
expectType<IsPrimitive<numberLiteral>>(false);
expectType<IsPrimitive<bigintLiteral>>(false);
expectType<IsPrimitive<symbolLiteral>>(false);
expectType<IsPrimitive<booleanLiteral>>(false);

// Null, undefined, and non-primitives should fail all literal checks
expectType<IsPrimitive<null>>(false);
expectType<IsPrimitive<undefined>>(false);
expectType<IsPrimitive<any>>(false);
expectType<IsPrimitive<never>>(false);

expectType<IsStringPrimitive<stringLiteral>>(false);
expectType<IsStringPrimitive<string>>(true);

// Strings with infinite set of possible values return `false`
expectType<IsStringPrimitive<Uppercase<string>>>(false);
expectType<IsStringPrimitive<Lowercase<string>>>(false);
expectType<IsStringPrimitive<Capitalize<string>>>(false);
expectType<IsStringPrimitive<Uncapitalize<string>>>(false);
expectType<IsStringPrimitive<Capitalize<Lowercase<string>>>>(false);
expectType<IsStringPrimitive<Uncapitalize<Uppercase<string>>>>(false);
expectType<IsStringPrimitive<`abc${string}`>>(false);
expectType<IsStringPrimitive<`${string}abc`>>(false);
expectType<IsStringPrimitive<`${number}:${string}`>>(false);
expectType<IsStringPrimitive<`abc${Uppercase<string>}`>>(false);
expectType<IsStringPrimitive<`${Lowercase<string>}abc`>>(false);
expectType<IsStringPrimitive<`${number}`>>(false);
expectType<IsStringPrimitive<`${number}${string}`>>(false);
expectType<IsStringPrimitive<`${number}` | Uppercase<string>>>(false);
expectType<IsStringPrimitive<Capitalize<string> | Uppercase<string>>>(false);
expectType<IsStringPrimitive<`abc${string}` | `${string}abc`>>(false);

// Strings with finite set of possible values return `false`
expectType<IsStringPrimitive<'a' | 'b'>>(false);
expectType<IsStringPrimitive<Uppercase<'a'>>>(false);
expectType<IsStringPrimitive<Lowercase<'a'>>>(false);
expectType<IsStringPrimitive<Uppercase<'a' | 'b'>>>(false);
expectType<IsStringPrimitive<Lowercase<'a' | 'b'>>>(false);
expectType<IsStringPrimitive<Capitalize<'abc' | 'xyz'>>>(false);
expectType<IsStringPrimitive<Uncapitalize<'Abc' | 'Xyz'>>>(false);
expectType<IsStringPrimitive<`ab${'c' | 'd' | 'e'}`>>(false);
expectType<IsStringPrimitive<Uppercase<'a' | 'b'> | 'C' | 'D'>>(false);
expectType<IsStringPrimitive<Lowercase<'xyz'> | Capitalize<'abc'>>>(false);

// Union of literals and non-literals return `true`
expectType<IsStringPrimitive<Uppercase<string> | (string & {})>>(true);
expectType<IsStringPrimitive<Lowercase<string> | (string & {})>>(true);
expectType<IsNumericPrimitive<(number & {}) | 1 | 2 | 3>>(true);

// Boundary types
expectType<IsStringPrimitive<any>>(false);
expectType<IsStringPrimitive<never>>(false);

expectType<IsNumericPrimitive<numericLiteral>>(false);
expectType<IsNumericPrimitive<numberLiteral>>(false);
expectType<IsNumericPrimitive<bigintLiteral>>(false);
expectType<IsNumericPrimitive<Numeric>>(true);
expectType<IsNumericPrimitive<number>>(true);
expectType<IsNumericPrimitive<bigint>>(true);

expectType<IsBooleanPrimitive<booleanLiteral>>(false);
expectType<IsBooleanPrimitive<true | false>>(true);
expectType<IsBooleanPrimitive<boolean>>(true);

expectType<IsSymbolPrimitive<symbolLiteral>>(false);
expectType<IsSymbolPrimitive<symbol>>(true);

// Missing generic parameter
// @ts-expect-error
type A0 = IsPrimitive;
// @ts-expect-error
type A1 = IsStringPrimitive;
// @ts-expect-error
type A2 = IsNumericPrimitive;
// @ts-expect-error
type A3 = IsBooleanPrimitive;
// @ts-expect-error
type A4 = IsSymbolPrimitive;

// Tagged types should be false
expectType<IsStringPrimitive<Tagged<string, 'Tag'>>>(false);
expectType<IsSymbolPrimitive<Tagged<symbol, 'Tag'>>>(false);
expectType<IsNumericPrimitive<Tagged<number, 'Tag'>>>(false);
expectType<IsNumericPrimitive<Tagged<bigint, 'Tag'>>>(false);
expectType<IsBooleanPrimitive<Tagged<boolean, 'Tag'>>>(false);
