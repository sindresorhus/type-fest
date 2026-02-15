import {expectType} from 'tsd';
import type {ExcludeExactly} from '../index.d.ts';

expectType<number>({} as ExcludeExactly<number, '1'>);
expectType<never>({} as ExcludeExactly<number, number>);
expectType<0>({} as ExcludeExactly<0, number>);
expectType<string>({} as ExcludeExactly<string, '1'>);
expectType<never>({} as ExcludeExactly<string, string>);
expectType<'0'>({} as ExcludeExactly<'0', string>);

expectType<{a: 0}>({} as ExcludeExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>);
expectType<{readonly a: 0}>({} as ExcludeExactly<{a: 0} | {readonly a: 0}, {a: 0}>);
expectType<never>({} as ExcludeExactly<{readonly a: 0}, {readonly a: 0}>);

// `never` excludes nothing
expectType<0 | 1 | 2>({} as ExcludeExactly<0 | 1 | 2, never>);
expectType<never>({} as ExcludeExactly<never, never>);
expectType<any>({} as ExcludeExactly<any, never>);
expectType<unknown>({} as ExcludeExactly<unknown, never>);

// Excluding from `unknown`/`any`
expectType<unknown>({} as ExcludeExactly<unknown, string>);
expectType<[unknown]>({} as ExcludeExactly<[unknown], [number]>);
expectType<unknown[]>({} as ExcludeExactly<unknown[], number[]>);
expectType<{a: unknown}>({} as ExcludeExactly<{a: unknown}, {a: number}>);
expectType<unknown[]>({} as ExcludeExactly<number[] | unknown[], number[]>);
expectType<any>({} as ExcludeExactly<any, string>);
expectType<[any]>({} as ExcludeExactly<[any], [number]>);
expectType<any[]>({} as ExcludeExactly<any[], number[]>);
expectType<{a: any}>({} as ExcludeExactly<{a: any}, {a: number}>);
expectType<any[]>({} as ExcludeExactly<number[] | any[], number[]>);

// Excluding `unknown`/`any`
expectType<never>({} as ExcludeExactly<unknown, unknown>);
expectType<never>({} as ExcludeExactly<any, any>);
expectType<unknown>({} as ExcludeExactly<unknown, any>);
expectType<any>({} as ExcludeExactly<any, unknown>);
expectType<string | number>({} as ExcludeExactly<string | number, unknown>);
expectType<string | number>({} as ExcludeExactly<string | number, any>);
expectType<never>({} as ExcludeExactly<never, any>);
expectType<never>({} as ExcludeExactly<never, unknown>);

// Unions
expectType<2>({} as ExcludeExactly<0 | 1 | 2, 0 | 1>);
expectType<never>({} as ExcludeExactly<0 | 1 | 2, 0 | 1 | 2>);
expectType<{readonly a?: 0}>({} as ExcludeExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}, {a: 0} | {readonly a: 0} | {a?: 0}
>);
expectType<never>({} as ExcludeExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}, {a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}
>);
