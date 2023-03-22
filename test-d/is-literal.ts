import {expectError, expectType} from 'tsd';
import type {
	IsLiteral,
	IsStringLiteral,
	IsNumericLiteral,
	IsBooleanLiteral,
	IsSymbolLiteral,
} from '../index';

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

expectType<IsNumericLiteral<typeof numberLiteral>>(true);
expectType<IsNumericLiteral<typeof bigintLiteral>>(true);
expectType<IsNumericLiteral<typeof _number>>(false);
expectType<IsNumericLiteral<typeof _bigint>>(false);

expectType<IsBooleanLiteral<typeof booleanLiteral>>(true);
expectType<IsBooleanLiteral<typeof _boolean>>(false);

expectType<IsSymbolLiteral<typeof symbolLiteral>>(true);
expectType<IsSymbolLiteral<typeof _symbol>>(false);

declare const anything: any;

// Missing generic parameter
expectError<IsLiteral>(anything);
expectError<IsStringLiteral>(anything);
expectError<IsNumericLiteral>(anything);
expectError<IsBooleanLiteral>(anything);
expectError<IsSymbolLiteral>(anything);
