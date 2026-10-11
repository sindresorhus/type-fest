import {expectTypeOf} from 'nz';
import type {CollapseLiterals} from '../../source/internal/object.d.ts';

declare const sym1: unique symbol;
declare const sym2: unique symbol;

// Uncollapsed unions
expectTypeOf<CollapseLiterals<'foo' | 'bar' | (string & {})>>().toBe<string>();
expectTypeOf<CollapseLiterals<1 | 2 | (number & {})>>().toBe<number>();
expectTypeOf<CollapseLiterals<typeof sym1 | typeof sym2 | (symbol & {})>>().toBe<symbol>();
expectTypeOf<CollapseLiterals<1n | 2n | (bigint & {})>>().toBe<bigint>();
expectTypeOf<CollapseLiterals<'onChange' | 'onClick' | (`on${string}` & {})>>().toBe<`on${string}`>();
expectTypeOf<CollapseLiterals<'change' | 'click' | (`on${string}` & {})>>().toBe<'change' | 'click' | `on${string}`>();
expectTypeOf<CollapseLiterals<'drag' | 'onChange' | 'onClick' | (`on${string}` & {})>>().toBe<'drag' | `on${string}`>();

expectTypeOf<CollapseLiterals<null | undefined | 'foo' | 'bar' | (string & {})>>().toBe<null | undefined | string>();
expectTypeOf<CollapseLiterals<'foo' | 'BAR' | (Uppercase<string> & {}) | number>>().toBe<'foo' | Uppercase<string> | number>();
expectTypeOf<CollapseLiterals<typeof sym1 | 'foo' | 'bar' | (number & {})>>().toBe<typeof sym1 | 'foo' | 'bar' | number>();

// Already collapsed unions are returned as-is
expectTypeOf<CollapseLiterals<string>>().toBe<string>();
expectTypeOf<CollapseLiterals<bigint>>().toBe<bigint>();
expectTypeOf<CollapseLiterals<false>>().toBe<false>();
expectTypeOf<CollapseLiterals<number | bigint>>().toBe<number | bigint>();
expectTypeOf({} as any as CollapseLiterals<null | undefined>).toBe<null | undefined>();
expectTypeOf<CollapseLiterals<'foo' | 'bar'>>().toBe<'foo' | 'bar'>();
expectTypeOf<CollapseLiterals<string | number | boolean>>().toBe<string | number | boolean>();
expectTypeOf<CollapseLiterals<unknown>>().toBe<unknown>();
expectTypeOf<CollapseLiterals<string[] | [string, string]>>().toBe<string[] | [string, string]>();
expectTypeOf<CollapseLiterals<Record<string, string> | {a: string; b: number}>>().toBe<Record<string, string> | {a: string; b: number}>();

// Boundary types
expectTypeOf<CollapseLiterals<{}>>().toBe<{}>();
expectTypeOf<CollapseLiterals<never>>().toBe<never>();
expectTypeOf<CollapseLiterals<any>>().toBe<any>();
