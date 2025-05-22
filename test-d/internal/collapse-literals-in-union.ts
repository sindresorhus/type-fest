import {expectType} from 'tsd';
import type {CollapseLiterals} from '../../source/internal/object.js';

declare const sym1: unique symbol;
declare const sym2: unique symbol;

// Uncollapsed unions
expectType<string>({} as CollapseLiterals<'foo' | 'bar' | (string & {})>);
expectType<number>({} as CollapseLiterals<1 | 2 | (number & {})>);
expectType<symbol>({} as CollapseLiterals<typeof sym1 | typeof sym2 | (symbol & {})>);
expectType<bigint>({} as CollapseLiterals<1n | 2n | (bigint & {})>);
expectType<`on${string}`>({} as CollapseLiterals<'onChange' | 'onClick' | (`on${string}` & {})>);
expectType<'change' | 'click' | `on${string}`>({} as CollapseLiterals<'change' | 'click' | (`on${string}` & {})>);
expectType<'drag' | `on${string}`>({} as CollapseLiterals<'drag' | 'onChange' | 'onClick' | (`on${string}` & {})>);

expectType<null | undefined | string>({} as CollapseLiterals<null | undefined | 'foo' | 'bar' | (string & {})>);
expectType<'foo' | Uppercase<string> | number>({} as CollapseLiterals<'foo' | 'BAR' | (Uppercase<string> & {}) | number>);
expectType<typeof sym1 | 'foo' | 'bar' | number>({} as CollapseLiterals<typeof sym1 | 'foo' | 'bar' | (number & {})>);

// Already collapsed unions are returned as-is
expectType<string>({} as CollapseLiterals<string>);
expectType<bigint>({} as CollapseLiterals<bigint>);
expectType<false>({} as CollapseLiterals<false>);
expectType<number | bigint>({} as CollapseLiterals<number | bigint>);
expectType<null | undefined>({} as any as CollapseLiterals<null | undefined>);
expectType<'foo' | 'bar'>({} as CollapseLiterals<'foo' | 'bar'>);
expectType<string | number | boolean>({} as CollapseLiterals<string | number | boolean>);
expectType<unknown>({} as CollapseLiterals<unknown>);
expectType<string[] | [string, string]>({} as CollapseLiterals<string[] | [string, string]>);
expectType<Record<string, string> | {a: string; b: number}>(
	{} as CollapseLiterals<Record<string, string> | {a: string; b: number}>,
);

// Boundary types
expectType<{}>({} as CollapseLiterals<{}>);
expectType<never>({} as CollapseLiterals<never>);
expectType<any>({} as CollapseLiterals<any>);
