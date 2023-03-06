import {expectError, expectType} from 'tsd';
import type {
	IsLiteral,
	IsStringLiteral,
	IsNumericLiteral,
	IsBooleanLiteral,
	IsSymbolLiteral,
	IsUndefinedLiteral,
	IsNullLiteral,
} from '../index';

const stringLiteral = '';
const numberLiteral = 1;
// @ts-expect-error (suppress BigInt literal tsd warning)
const bigintLiteral = 1n;
const booleanLiteral = true;
const symbolLiteral = Symbol('');

declare const _string: string;
declare const _number: number;
declare const _bigint: bigint;
declare const _boolean: boolean;
declare const _symbol: symbol;
declare const _undefined: undefined;
declare const _null: null;

// Literals should be true
expectType<IsLiteral<typeof stringLiteral>>(true);
expectType<IsLiteral<typeof numberLiteral>>(true);
expectType<IsLiteral<typeof bigintLiteral>>(true);
expectType<IsLiteral<typeof booleanLiteral>>(true);
expectType<IsLiteral<typeof symbolLiteral>>(true);
expectType<IsLiteral<null>>(true);
expectType<IsLiteral<undefined>>(true);

// Primitives and others should be false
expectType<IsLiteral<typeof _string>>(false);
expectType<IsLiteral<typeof _number>>(false);
expectType<IsLiteral<typeof _bigint>>(false);
expectType<IsLiteral<typeof _boolean>>(false);
expectType<IsLiteral<typeof _symbol>>(false);
// Fix: expectType<IsLiteral<typeof _null>>(false);
// Fix: expectType<IsLiteral<typeof _undefined>>(false);
expectType<IsLiteral<any>>(false);
expectType<IsLiteral<never>>(false);

expectType<IsStringLiteral<typeof stringLiteral>>(true);
expectType<IsStringLiteral<typeof _string>>(false);

expectType<IsNumericLiteral<typeof numberLiteral>>(true);
expectType<IsNumericLiteral<typeof bigintLiteral>>(true);
expectType<IsNumericLiteral<typeof _number>>(false);
expectType<IsNumericLiteral<typeof _bigint>>(false);

expectType<IsBooleanLiteral<typeof booleanLiteral>>(true);
expectType<IsBooleanLiteral<typeof _boolean>>(false);

expectType<IsSymbolLiteral<typeof symbolLiteral>>(true);
expectType<IsSymbolLiteral<typeof _symbol>>(false);

expectType<IsNullLiteral<null>>(true);
// Fix: expectType<IsNullLiteral<typeof _null>>(false);

expectType<IsUndefinedLiteral<undefined>>(true);
// Fix: expectType<IsUndefinedLiteral<typeof _undefined>>(false);

declare const anything: any;

// Missing generic parameter
expectError<IsLiteral>(anything);
expectError<IsStringLiteral>(anything);
expectError<IsNumericLiteral>(anything);
expectError<IsBooleanLiteral>(anything);
expectError<IsSymbolLiteral>(anything);
expectError<IsNullLiteral>(anything);
expectError<IsUndefinedLiteral>(anything);
