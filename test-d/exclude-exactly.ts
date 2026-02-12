import {expectType} from 'tsd';
import type {ExcludeExactly} from '../index.d.ts';

expectType<number>({} as ExcludeExactly<number, '1'>);
expectType<never>({} as ExcludeExactly<number, number>);
expectType<0>({} as ExcludeExactly<0, number>);
expectType<string>({} as ExcludeExactly<string, '1'>);
expectType<never>({} as ExcludeExactly<string, string>);

// `{readonly a: t}` should not be equal to `{a: t}` because of assignability.
expectType<{a: 0}>({} as ExcludeExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>);
expectType<{readonly a: 0}>({} as ExcludeExactly<{readonly a: 0}, {a: 0}>);
expectType<never>({} as ExcludeExactly<{readonly a: 0}, {readonly a: 0}>);

// `never` does nothing.
expectType<0 | 1 | 2>({} as ExcludeExactly<0 | 1 | 2, never>);
expectType<never>({} as ExcludeExactly<never, never>);

// Edge cases.
expectType<never>({} as ExcludeExactly<never, never>);
expectType<any>({} as ExcludeExactly<any, never>);
expectType<unknown>({} as ExcludeExactly<unknown, never>);

// `unknown` cannot be excluded like `unknown\T` in any cases.
expectType<unknown>({} as ExcludeExactly<unknown, string>);
expectType<[unknown]>({} as ExcludeExactly<[unknown], [number]>);
expectType<unknown[]>({} as ExcludeExactly<unknown[], number[]>);
expectType<{a: unknown}>({} as ExcludeExactly<{a: unknown}, {a: number}>);
expectType<unknown[]>({} as ExcludeExactly<number[] | unknown[], number[]>);

// `unknown` excludes `unknown`, `any` excludes `any`.
expectType<never>({} as ExcludeExactly<unknown, unknown>);
expectType<unknown>({} as ExcludeExactly<unknown, any>);
expectType<never>({} as ExcludeExactly<any, any>);
expectType<any>({} as ExcludeExactly<any, unknown>);
expectType<string | number>({} as ExcludeExactly<string | number, unknown>);
expectType<string | number>({} as ExcludeExactly<string | number, any>);

// Union
expectType<2>({} as ExcludeExactly<0 | 1 | 2, 0 | 1>);
expectType<never>({} as ExcludeExactly<0 | 1 | 2, 0 | 1 | 2>);
expectType<{readonly a?: 0}>({} as ExcludeExactly<{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}, {a: 0} | {readonly a: 0} | {a?: 0}>);
expectType<never>({} as ExcludeExactly<{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}, {a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}>);
