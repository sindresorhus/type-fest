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

// Strings with infinite set of possible values return `false` in strict
expectType<IsLiteral<Uppercase<string>>>(false);
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

// Strings with infinite set of possible values return `true` in non-strict
expectType<IsLiteral<Uppercase<string>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Uppercase<string>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Lowercase<string>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Capitalize<string>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Uncapitalize<string>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Capitalize<Lowercase<string>>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Uncapitalize<Uppercase<string>>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`abc${string}`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`${string}abc`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`${number}:${string}`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`abc${Uppercase<string>}`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`${Lowercase<string>}abc`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`${number}`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`${number}${string}`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`${number}` | Uppercase<string>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Capitalize<string> | Uppercase<string>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`abc${string}` | `${string}abc`, {strictStringCheck: false}>>(true);

// Strings with finite set of possible values return `true` in strict
expectType<IsLiteral<'a' | 'b'>>(true);
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

// Strings with finite set of possible values return `true` in non-strict
expectType<IsLiteral<'a' | 'b', {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<'a' | 'b', {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Uppercase<'a'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Lowercase<'a'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Lowercase<'a' | 'b'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Capitalize<'abc' | 'xyz'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Uncapitalize<'Abc' | 'Xyz'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<`ab${'c' | 'd' | 'e'}`, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Uppercase<'a' | 'b'> | 'C' | 'D', {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Lowercase<'xyz'> | Capitalize<'abc'>, {strictStringCheck: false}>>(true);

// Union of literals and non-literals return `boolean`
expectType<IsStringLiteral<Uppercase<string> | stringLiteral>>(boolean);
expectType<IsStringLiteral<Lowercase<string> | stringLiteral>>(boolean);
expectType<IsStringLiteral<stringLiteral | numberLiteral>>(boolean);
expectType<IsStringLiteral<Uppercase<string> | 'abc'>>(boolean);
expectType<IsStringLiteral<Lowercase<string> | 'Abc'>>(boolean);
expectType<IsStringLiteral<null | '1' | '2' | '3'>>(boolean);
expectType<IsStringLiteral<'foo' | 'bar' | number>>(boolean);
expectType<IsStringLiteral<1 | 2 | '3'>>(boolean);

// Types other than string return `false`
expectType<IsStringLiteral<bigint>>(false);
expectType<IsStringLiteral<1 | 2 | 3>>(false);
expectType<IsStringLiteral<object>>(false);
expectType<IsStringLiteral<false | undefined | null>>(false);

// Boundary types
expectType<IsStringLiteral<{}>>(false);
expectType<IsStringLiteral<any>>(false);
expectType<IsStringLiteral<never>>(false);

expectType<IsNumericLiteral<numericLiteral>>(false); // ! Needs fixing
expectType<IsNumericLiteral<numberLiteral>>(true);
expectType<IsNumericLiteral<bigintLiteral>>(true);
expectType<IsNumericLiteral<Numeric>>(false);
expectType<IsNumericLiteral<number>>(false);
expectType<IsNumericLiteral<bigint>>(false);
expectType<IsNumericLiteral<any>>(false);
expectType<IsNumericLiteral<never>>(false);

expectType<IsBooleanLiteral<booleanLiteral>>(true);
expectType<IsBooleanLiteral<true | false>>(false);
expectType<IsBooleanLiteral<boolean>>(false);
expectType<IsBooleanLiteral<any>>(false);
expectType<IsBooleanLiteral<never>>(false);

expectType<IsSymbolLiteral<symbolLiteral>>(true);
expectType<IsSymbolLiteral<symbol>>(false);
expectType<IsSymbolLiteral<any>>(false);
expectType<IsSymbolLiteral<never>>(false);

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
expectType<IsStringLiteral<Tagged<string, 'Tag'>, {strictStringCheck: false}>>(false);

expectType<IsStringLiteral<Tagged<Uppercase<string>, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<number, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'>>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar' | `on${string}`, 'Tag'>>>(boolean);
expectType<IsStringLiteral<Tagged<'1st' | '2nd' | '3rd' | number, 'Tag'>>>(boolean);

expectType<IsStringLiteral<Tagged<Uppercase<string>, 'Tag'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Tagged<number, 'Tag'>, {strictStringCheck: false}>>(false);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar' | `on${string}`, 'Tag'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Tagged<'1st' | '2nd' | '3rd' | number, 'Tag'>, {strictStringCheck: false}>>(boolean);

expectType<IsStringLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<'foo', 'Tag'> | Tagged<'bar', 'Tag'>>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | Tagged<number, 'Tag'>>>(boolean);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | number>>(boolean);

expectType<IsStringLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>, {strictStringCheck: false}>>(false);
expectType<IsStringLiteral<Tagged<'foo', 'Tag'> | Tagged<'bar', 'Tag'>, {strictStringCheck: false}>>(true);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | Tagged<number, 'Tag'>, {strictStringCheck: false}>>(boolean);
expectType<IsStringLiteral<Tagged<'foo' | 'bar', 'Tag'> | number, {strictStringCheck: false}>>(boolean);

// Uncollapsed unions (e.g., `'foo' | 'bar' | (string & {})`)
expectType<IsStringLiteral<'foo' | 'bar' | (string & {})>>(false);
expectType<IsStringLiteral<LiteralUnion<'foo' | 'bar', string>>>(false);
expectType<IsStringLiteral<LiteralUnion<'onClick' | 'onMouseDown', `on${string}`>>>(false);
expectType<IsStringLiteral<LiteralUnion<'press' | 'onClick' | 'onMouseDown', `on${string}`>>>(boolean);
expectType<IsStringLiteral<LiteralUnion<'foo' | 'bar', number>>>(boolean);
expectType<IsStringLiteral<Tagged<LiteralUnion<'foo' | 'bar', string>, 'Tag'>>>(false);
expectType<IsStringLiteral<Tagged<LiteralUnion<'click' | 'onMouseDown', `on${string}`>, 'Tag'>>>(boolean);
