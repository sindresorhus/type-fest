import {expectType} from 'tsd';
import type {NormalizedKeys} from '../../source/internal/object.d.ts';

declare const sym: unique symbol;

expectType<0 | '0' | 1 | '1'>({} as NormalizedKeys<0 | '1'>);
expectType<-1 | '-1' | '-1.5' | -1.5 | 'foo' | typeof sym>({} as NormalizedKeys<-1 | '-1.5' | 'foo' | typeof sym>);
expectType<string | number>({} as NormalizedKeys<string>);
expectType<number | `${number}`>({} as NormalizedKeys<number>);
expectType<number | `${number}`>({} as NormalizedKeys<`${number}`>);
expectType<symbol>({} as NormalizedKeys<symbol>);

// Boundary cases
expectType<any>({} as NormalizedKeys<any>);
expectType<never>({} as NormalizedKeys<never>);

// Can only be `PropertyKey`
// @ts-expect-error
type T1 = NormalizedKeys<boolean>;
// @ts-expect-error
type T2 = NormalizedKeys<string[]>;
// @ts-expect-error
type T3 = NormalizedKeys<unknown>;
