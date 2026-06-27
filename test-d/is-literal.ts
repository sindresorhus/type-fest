import {expectType} from 'tsd';
import type {IsLiteral} from '../index.d.ts';

const stringLiteral = '';
const numberLiteral = 1;
const bigintLiteral = 1n;
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

// Missing generic parameter
// @ts-expect-error
type A0 = IsLiteral;
