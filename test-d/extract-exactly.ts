import {expectType} from 'tsd';
import type {ExtractExactly} from '../index.d.ts';

expectType<never>({} as ExtractExactly<number, '1'>);
expectType<number>({} as ExtractExactly<number, number>);
expectType<never>({} as ExtractExactly<0, number>);
expectType<never>({} as ExtractExactly<string, '1'>);
expectType<string>({} as ExtractExactly<string, string>);
expectType<never>({} as ExtractExactly<'0', string>);

expectType<{readonly a: 0}>({} as ExtractExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>);
expectType<{a: 0}>({} as ExtractExactly<{a: 0} | {readonly a: 0}, {a: 0}>);
expectType<{readonly a: 0}>({} as ExtractExactly<{readonly a: 0}, {readonly a: 0}>);

// `never` extracts nothing
expectType<never>({} as ExtractExactly<0 | 1 | 2, never>);
expectType<never>({} as ExtractExactly<never, never>);
expectType<never>({} as ExtractExactly<any, never>);
expectType<never>({} as ExtractExactly<unknown, never>);

// Extracting from `unknown`/`any`
expectType<never>({} as ExtractExactly<unknown, string>);
expectType<never>({} as ExtractExactly<[unknown], [number]>);
expectType<never>({} as ExtractExactly<unknown[], number[]>);
expectType<never>({} as ExtractExactly<{a: unknown}, {a: number}>);
expectType<number[]>({} as ExtractExactly<number[] | unknown[], number[]>);
expectType<never>({} as ExtractExactly<any, string>);
expectType<never>({} as ExtractExactly<[any], [number]>);
expectType<never>({} as ExtractExactly<any[], number[]>);
expectType<never>({} as ExtractExactly<{a: any}, {a: number}>);
expectType<number[]>({} as ExtractExactly<number[] | any[], number[]>);

// Extracting `unknown`/`any`
expectType<unknown>({} as ExtractExactly<unknown, unknown>);
expectType<any>({} as ExtractExactly<any, any>);
expectType<never>({} as ExtractExactly<unknown, any>);
expectType<never>({} as ExtractExactly<any, unknown>);
expectType<never>({} as ExtractExactly<string | number, unknown>);
expectType<never>({} as ExtractExactly<string | number, any>);
expectType<never>({} as ExtractExactly<never, any>);
expectType<never>({} as ExtractExactly<never, unknown>);

// Unions
expectType<0 | 1>({} as ExtractExactly<0 | 1 | 2, 0 | 1>);
expectType<0 | 1 | 2>({} as ExtractExactly<0 | 1 | 2, 0 | 1 | 2>);
expectType<'1' | true>({} as ExtractExactly<'1' | 2 | true | null, '1' | boolean | undefined>);
expectType<0 | undefined>({} as ExtractExactly<0 | '' | null | undefined | false, 0 | string | undefined>);
expectType<{a: 0} | {readonly a: 0} | {a?: 0}>({} as ExtractExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0}
>);
expectType<{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}>({} as ExtractExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}
>);
