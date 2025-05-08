import {expectType} from 'tsd';
import type {
	IsLiteral,
	IsStringLiteral,
	IsNumericLiteral,
	IsBooleanLiteral,
	IsSymbolLiteral,
	Tagged,
} from '../index.d.ts';

const stringLiteral = '';
const numberLiteral = 1;
// Note: tsd warns on direct literal usage so we cast to the literal type
const bigintLiteral = BigInt(1) as 1n;
const booleanLiteral = true;
const symbolLiteral = Symbol('');

declare const _string: string;
declare const _number: number;
declare const _bigint: bigint;
declare const _boolean: boolean;
declare const _symbol: symbol;

// Literals should be true
expectType<IsLiteral<typeof stringLiteral>>(true);
expectType<IsLiteral<typeof numberLiteral>>(true);
expectType<IsLiteral<typeof bigintLiteral>>(true);
expectType<IsLiteral<typeof booleanLiteral>>(true);
expectType<IsLiteral<typeof symbolLiteral>>(true);

// Primitives should be false
expectType<IsLiteral<typeof _string>>(false);
expectType<IsLiteral<typeof _number>>(false);
expectType<IsLiteral<typeof _bigint>>(false);
expectType<IsLiteral<typeof _boolean>>(false);
expectType<IsLiteral<typeof _symbol>>(false);

// Null, undefined, and non-primitives should fail all literal checks
expectType<IsLiteral<null>>(false);
expectType<IsLiteral<undefined>>(false);
expectType<IsLiteral<any>>(false);
expectType<IsLiteral<never>>(false);

expectType<IsStringLiteral<typeof stringLiteral>>(true);
expectType<IsStringLiteral<typeof _string>>(false);

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

// Strings with union of literals and non-literals return `boolean`
expectType<IsStringLiteral<Uppercase<string> | 'abc'>>({} as boolean);
expectType<IsStringLiteral<Lowercase<string> | 'Abc'>>({} as boolean);
expectType<IsStringLiteral<null | '1' | '2' | '3'>>({} as boolean);

// Boundary types
expectType<IsStringLiteral<any>>(false);
expectType<IsStringLiteral<never>>(false);

expectType<IsNumericLiteral<typeof numberLiteral>>(true);
expectType<IsNumericLiteral<typeof bigintLiteral>>(true);
expectType<IsNumericLiteral<typeof _number>>(false);
expectType<IsNumericLiteral<typeof _bigint>>(false);

expectType<IsBooleanLiteral<typeof booleanLiteral>>(true);
expectType<IsBooleanLiteral<typeof _boolean>>(false);

expectType<IsSymbolLiteral<typeof symbolLiteral>>(true);
expectType<IsSymbolLiteral<typeof _symbol>>(false);

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
expectType<IsNumericLiteral<Tagged<number, 'Tag'>>>(false);
expectType<IsBooleanLiteral<Tagged<boolean, 'Tag'>>>(false);
