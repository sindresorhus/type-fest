import {expectTypeOf} from 'nz';
import type {ExtractExactly} from '../index.d.ts';

expectTypeOf<ExtractExactly<number, '1'>>().toBe<never>();
expectTypeOf<ExtractExactly<number, number>>().toBe<number>();
expectTypeOf<ExtractExactly<0, number>>().toBe<never>();
expectTypeOf<ExtractExactly<string, '1'>>().toBe<never>();
expectTypeOf<ExtractExactly<string, string>>().toBe<string>();
expectTypeOf<ExtractExactly<'0', string>>().toBe<never>();

expectTypeOf<ExtractExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>>().toBe<{readonly a: 0}>();
expectTypeOf<ExtractExactly<{a: 0} | {readonly a: 0}, {a: 0}>>().toBe<{a: 0}>();
expectTypeOf<ExtractExactly<{readonly a: 0}, {readonly a: 0}>>().toBe<{readonly a: 0}>();

// `never` extracts nothing
expectTypeOf<ExtractExactly<0 | 1 | 2, never>>().toBe<never>();
expectTypeOf<ExtractExactly<never, never>>().toBe<never>();
expectTypeOf<ExtractExactly<any, never>>().toBe<never>();
expectTypeOf<ExtractExactly<unknown, never>>().toBe<never>();

// Extracting from `unknown`/`any`
expectTypeOf<ExtractExactly<unknown, string>>().toBe<never>();
expectTypeOf<ExtractExactly<[unknown], [number]>>().toBe<never>();
expectTypeOf<ExtractExactly<unknown[], number[]>>().toBe<never>();
expectTypeOf<ExtractExactly<{a: unknown}, {a: number}>>().toBe<never>();
expectTypeOf<ExtractExactly<number[] | unknown[], number[]>>().toBe<number[]>();
expectTypeOf<ExtractExactly<any, string>>().toBe<never>();
expectTypeOf<ExtractExactly<[any], [number]>>().toBe<never>();
expectTypeOf<ExtractExactly<any[], number[]>>().toBe<never>();
expectTypeOf<ExtractExactly<{a: any}, {a: number}>>().toBe<never>();
expectTypeOf<ExtractExactly<number[] | any[], number[]>>().toBe<number[]>();

// Extracting `unknown`/`any`
expectTypeOf<ExtractExactly<unknown, unknown>>().toBe<unknown>();
expectTypeOf<ExtractExactly<any, any>>().toBe<any>();
expectTypeOf<ExtractExactly<unknown, any>>().toBe<never>();
expectTypeOf<ExtractExactly<any, unknown>>().toBe<never>();
expectTypeOf<ExtractExactly<string | number, unknown>>().toBe<never>();
expectTypeOf<ExtractExactly<string | number, any>>().toBe<never>();
expectTypeOf<ExtractExactly<never, any>>().toBe<never>();
expectTypeOf<ExtractExactly<never, unknown>>().toBe<never>();

// Unions
expectTypeOf<ExtractExactly<0 | 1 | 2, 0 | 1>>().toBe<0 | 1>();
expectTypeOf<ExtractExactly<0 | 1 | 2, 0 | 1 | 2>>().toBe<0 | 1 | 2>();
expectTypeOf<ExtractExactly<'1' | 2 | true | null, '1' | boolean | undefined>>().toBe<'1' | true>();
expectTypeOf<ExtractExactly<0 | '' | null | undefined | false, 0 | string | undefined>>().toBe<0 | undefined>();
expectTypeOf<ExtractExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0}
>>().toBe<{a: 0} | {readonly a: 0} | {a?: 0}>();
expectTypeOf<ExtractExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}
>>().toBe<{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}>();
