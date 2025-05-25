import {expectType} from 'tsd';
import type tag from 'tagged-tag';
import type {
	IsLiteral,
	IsStringLiteral,
	IsNumericLiteral,
	IsBooleanLiteral,
	IsSymbolLiteral,
	Tagged,
	LiteralUnion,
} from '../index.d.ts';
import type {Numeric} from '../source/numeric.d.ts';

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
expectType<IsLiteral<symbolLiteral>>(true);
expectType<IsLiteral<booleanLiteral>>(true);

// Primitives should be false
expectType<IsLiteral<string>>(false);
expectType<IsLiteral<number>>(false);
expectType<IsLiteral<bigint>>(false);
expectType<IsLiteral<symbol>>(false);
expectType<IsLiteral<boolean>>(false);

// Null, undefined, and non-primitives should fail all literal checks
expectType<IsLiteral<null>>(false);
expectType<IsLiteral<undefined>>(false);
expectType<IsLiteral<any>>(false);
expectType<IsLiteral<never>>(false);

expectType<IsStringLiteral<stringLiteral>>(true);
expectType<IsStringLiteral<string>>(false);

// Strings with infinite set of possible values return `false` in Strict
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

// Strings with infinite set of possible values return `true` in NonStrict
expectType<IsStringLiteral<Uppercase<string>, {strict: false}>>(true);
expectType<IsStringLiteral<Lowercase<string>, {strict: false}>>(true);
expectType<IsStringLiteral<Capitalize<string>, {strict: false}>>(true);
expectType<IsStringLiteral<Uncapitalize<string>, {strict: false}>>(true);
expectType<IsStringLiteral<Capitalize<Lowercase<string>>, {strict: false}>>(true);
expectType<IsStringLiteral<Uncapitalize<Uppercase<string>>, {strict: false}>>(true);
expectType<IsStringLiteral<`abc${string}`, {strict: false}>>(true);
expectType<IsStringLiteral<`${string}abc`, {strict: false}>>(true);
expectType<IsStringLiteral<`${number}:${string}`, {strict: false}>>(true);
expectType<IsStringLiteral<`abc${Uppercase<string>}`, {strict: false}>>(true);
expectType<IsStringLiteral<`${Lowercase<string>}abc`, {strict: false}>>(true);
expectType<IsStringLiteral<`${number}`, {strict: false}>>(true);
expectType<IsStringLiteral<`${number}${string}`, {strict: false}>>(true);
expectType<IsStringLiteral<`${number}` | Uppercase<string>, {strict: false}>>(true);
expectType<IsStringLiteral<Capitalize<string> | Uppercase<string>, {strict: false}>>(true);
expectType<IsStringLiteral<`abc${string}` | `${string}abc`, {strict: false}>>(true);

// Strings with finite set of possible values return `true` in Strict
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

// Strings with finite set of possible values return `true` in NonStrict
expectType<IsStringLiteral<'a' | 'b', {strict: false}>>(true);
expectType<IsStringLiteral<Uppercase<'a'>, {strict: false}>>(true);
expectType<IsStringLiteral<Lowercase<'a'>, {strict: false}>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'>, {strict: false}>>(true);
expectType<IsStringLiteral<Lowercase<'a' | 'b'>, {strict: false}>>(true);
expectType<IsStringLiteral<Capitalize<'abc' | 'xyz'>, {strict: false}>>(true);
expectType<IsStringLiteral<Uncapitalize<'Abc' | 'Xyz'>, {strict: false}>>(true);
expectType<IsStringLiteral<`ab${'c' | 'd' | 'e'}`, {strict: false}>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'> | 'C' | 'D', {strict: false}>>(true);
expectType<IsStringLiteral<Lowercase<'xyz'> | Capitalize<'abc'>, {strict: false}>>(true);

// Union of literals and non-literals return `false`
expectType<IsStringLiteral<Uppercase<string> | stringLiteral>>(false);
expectType<IsStringLiteral<Lowercase<string> | stringLiteral>>(false);

// Union of diffrent literal types return `false`
expectType<IsNumericLiteral<numericLiteral | stringLiteral>>(false);
expectType<IsStringLiteral<stringLiteral | numberLiteral>>(false);

// Strings with union of literals and non-literals return `false`
expectType<IsStringLiteral<Uppercase<string> | 'abc'>>(false);
expectType<IsStringLiteral<Lowercase<string> | 'Abc'>>(false);
expectType<IsStringLiteral<null | '1' | '2' | '3'>>(false);
expectType<IsStringLiteral<'foo' | 'bar' | number>>(false);
expectType<IsStringLiteral<1 | 2 | '3'>>(false);

// Types other than string return `false`
expectType<IsStringLiteral<bigint>>(false);
expectType<IsStringLiteral<1 | 2 | 3>>(false);
expectType<IsStringLiteral<object>>(false);
expectType<IsStringLiteral<false | undefined | null>>(false);

// Boundary types
expectType<IsStringLiteral<{}>>(false);
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

// Tagged types
expectType<IsStringLiteral<Tagged<string, 'Tag'>>>(false);
expectType<IsSymbolLiteral<Tagged<symbol, 'Tag'>>>(false);
expectType<IsNumericLiteral<Tagged<number, 'Tag'>>>(false);
expectType<IsNumericLiteral<Tagged<bigint, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Tagged<boolean, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<string, 'Tag'>, {strict: false}>>(false);

expectType<IsStringLiteral<Tagged<Uppercase<string>, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<number, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'>>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar' | `on${string}`, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<'1st' | '2nd' | '3rd' | number, 'Tag'>>>(false);

expectType<IsStringLiteral<Tagged<Uppercase<string>, 'Tag'>, {strict: false}>>(true);
expectType<IsStringLiteral<Tagged<number, 'Tag'>, {strict: false}>>(false);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'>, {strict: false}>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar' | `on${string}`, 'Tag'>, {strict: false}>>(true);
expectType<IsStringLiteral<Tagged<'1st' | '2nd' | '3rd' | number, 'Tag'>, {strict: false}>>(false);

expectType<IsStringLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<'foo', 'Tag'> | Tagged<'bar', 'Tag'>>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | Tagged<number, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | number>>(false);

expectType<IsStringLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>, {strict: false}>>(false);
expectType<IsStringLiteral<Tagged<'foo', 'Tag'> | Tagged<'bar', 'Tag'>, {strict: false}>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | Tagged<number, 'Tag'>, {strict: false}>>(false);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | number, {strict: false}>>(false);

// Uncollapsed unions (e.g., `'foo' | 'bar' | (string & {})`)
expectType<IsStringLiteral<'foo' | 'bar' | (string & {})>>(false);
expectType<IsStringLiteral<LiteralUnion<'foo' | 'bar', string>>>(false);
expectType<IsStringLiteral<LiteralUnion<'onClick' | 'onMouseDown', `on${string}`>>>(false);
expectType<IsStringLiteral<LiteralUnion<'press' | 'onClick' | 'onMouseDown', `on${string}`>>>(false);
expectType<IsStringLiteral<LiteralUnion<'foo' | 'bar', number>>>(false);
expectType<IsStringLiteral<Tagged<LiteralUnion<'foo' | 'bar', string>, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<LiteralUnion<'click' | 'onMouseDown', `on${string}`>, 'Tag'>>>(false);
