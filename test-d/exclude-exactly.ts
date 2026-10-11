import {expectTypeOf} from 'nz';
import type {ExcludeExactly} from '../index.d.ts';

expectTypeOf<ExcludeExactly<number, '1'>>().toBe<number>();
expectTypeOf<ExcludeExactly<number, number>>().toBe<never>();
expectTypeOf<ExcludeExactly<0, number>>().toBe<0>();
expectTypeOf<ExcludeExactly<string, '1'>>().toBe<string>();
expectTypeOf<ExcludeExactly<string, string>>().toBe<never>();
expectTypeOf<ExcludeExactly<'0', string>>().toBe<'0'>();

expectTypeOf<ExcludeExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>>().toBe<{a: 0}>();
expectTypeOf<ExcludeExactly<{a: 0} | {readonly a: 0}, {a: 0}>>().toBe<{readonly a: 0}>();
expectTypeOf<ExcludeExactly<{readonly a: 0}, {readonly a: 0}>>().toBe<never>();

// `never` excludes nothing
expectTypeOf<ExcludeExactly<0 | 1 | 2, never>>().toBe<0 | 1 | 2>();
expectTypeOf<ExcludeExactly<never, never>>().toBe<never>();
expectTypeOf<ExcludeExactly<any, never>>().toBe<any>();
expectTypeOf<ExcludeExactly<unknown, never>>().toBe<unknown>();

// Excluding from `unknown`/`any`
expectTypeOf<ExcludeExactly<unknown, string>>().toBe<unknown>();
expectTypeOf<ExcludeExactly<[unknown], [number]>>().toBe<[unknown]>();
expectTypeOf<ExcludeExactly<unknown[], number[]>>().toBe<unknown[]>();
expectTypeOf<ExcludeExactly<{a: unknown}, {a: number}>>().toBe<{a: unknown}>();
expectTypeOf<ExcludeExactly<number[] | unknown[], number[]>>().toBe<unknown[]>();
expectTypeOf<ExcludeExactly<any, string>>().toBe<any>();
expectTypeOf<ExcludeExactly<[any], [number]>>().toBe<[any]>();
expectTypeOf<ExcludeExactly<any[], number[]>>().toBe<any[]>();
expectTypeOf<ExcludeExactly<{a: any}, {a: number}>>().toBe<{a: any}>();
expectTypeOf<ExcludeExactly<number[] | any[], number[]>>().toBe<any[]>();

// Excluding `unknown`/`any`
expectTypeOf<ExcludeExactly<unknown, unknown>>().toBe<never>();
expectTypeOf<ExcludeExactly<any, any>>().toBe<never>();
expectTypeOf<ExcludeExactly<unknown, any>>().toBe<unknown>();
expectTypeOf<ExcludeExactly<any, unknown>>().toBe<any>();
expectTypeOf<ExcludeExactly<string | number, unknown>>().toBe<string | number>();
expectTypeOf<ExcludeExactly<string | number, any>>().toBe<string | number>();
expectTypeOf<ExcludeExactly<never, any>>().toBe<never>();
expectTypeOf<ExcludeExactly<never, unknown>>().toBe<never>();

// Unions
expectTypeOf<ExcludeExactly<0 | 1 | 2, 0 | 1>>().toBe<2>();
expectTypeOf<ExcludeExactly<0 | 1 | 2, 0 | 1 | 2>>().toBe<never>();
expectTypeOf<ExcludeExactly<'1' | 2 | true | null, '1' | boolean | undefined>>().toBe<2 | null>();
expectTypeOf<ExcludeExactly<0 | '' | null | undefined | false, 0 | string | undefined>>().toBe<'' | null | false>();
expectTypeOf<ExcludeExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0}
>>().toBe<{readonly a?: 0}>();
expectTypeOf<ExcludeExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}
>>().toBe<never>();
