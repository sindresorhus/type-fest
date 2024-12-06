import {expectType} from 'tsd';
import type {IfLiteral, IfStringLiteral, IfNumericLiteral, IfBooleanLiteral, IfSymbolLiteral} from '../index';

// `IfLiteral` should return `true`/`false` if only `T` is specified
expectType<IfLiteral<'literal'>>(true);
expectType<IfLiteral<{literal: 0}>>(false);
expectType<IfLiteral<8.9, 'T', 'F'>>('T');
expectType<IfLiteral<{}, 'T', 'F'>>('F');

// `IfStringLiteral` should return `true`/`false` if only `T` is specified
expectType<IfStringLiteral<'literal'>>(true);
expectType<IfStringLiteral<0>>(false);
expectType<IfStringLiteral<'string literal', 'T', 'F'>>('T');
expectType<IfStringLiteral<true, 'T', 'F'>>('F');

// `IfNumericLiteral` should return `true`/`false` if only `T` is specified
expectType<IfNumericLiteral<0>>(true);
expectType<IfNumericLiteral<true>>(false);
expectType<IfNumericLiteral<3.41, 'T', 'F'>>('T');
expectType<IfNumericLiteral<'not numeric', 'T', 'F'>>('F');

// `IfBooleanLiteral` should return `true`/`false` if only `T` is specified
expectType<IfBooleanLiteral<false>>(true);
expectType<IfBooleanLiteral<undefined>>(false);
expectType<IfBooleanLiteral<true, 'T', 'F'>>('T');
expectType<IfBooleanLiteral<0.8, 'T', 'F'>>('F');

// `IfSymbolLiteral` should return `true`/`false` if only `T` is specified
const symbolLiteral = Symbol('');
expectType<IfSymbolLiteral<typeof symbolLiteral>>(true);
expectType<IfSymbolLiteral<null>>(false);
expectType<IfSymbolLiteral<typeof symbolLiteral, 'T', 'F'>>('T');
expectType<IfSymbolLiteral<Date, 'T', 'F'>>('F');

// Missing generic parameter
// @ts-expect-error
type A0 = IfLiteral;
// @ts-expect-error
type A1 = IfStringLiteral;
// @ts-expect-error
type A2 = IfNumericLiteral;
// @ts-expect-error
type A3 = IfBooleanLiteral;
// @ts-expect-error
type A4 = IfSymbolLiteral;
