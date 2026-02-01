import {expectType} from 'tsd';
import type {ExcludeExactly} from '../../source/internal/type.d.ts';

expectType<number>({} as ExcludeExactly<0 | 1 | number, '1'>);
expectType<never>({} as ExcludeExactly<0 | 1 | number, number>);
expectType<string>({} as ExcludeExactly<'0' | '1' | string, '1'>);
expectType<never>({} as ExcludeExactly<'0' | '1' | string, string>);

// `{readonly a: t}` should not be equal to `{a: t}` because of assignability.
expectType<{a: 0}>({} as ExcludeExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>);
expectType<{readonly a: 0}>({} as ExcludeExactly<{readonly a: 0}, {a: 0}>);
expectType<never>({} as ExcludeExactly<{readonly a: 0}, {readonly a: 0}>);

// `never` does nothing.
expectType<0 | 1 | 2>({} as ExcludeExactly<0 | 1 | 2, never>);
expectType<never>({} as ExcludeExactly<never, never>);

// `unknown` cannot be excluded like `unknown\T` in any cases.
expectType<unknown>({} as ExcludeExactly<unknown, string>);
expectType<[unknown]>({} as ExcludeExactly<[unknown], [number]>);
expectType<unknown[]>({} as ExcludeExactly<unknown[], number[]>);
expectType<{a: unknown}>({} as ExcludeExactly<{a: unknown}, {a: number}>);
expectType<unknown[]>({} as ExcludeExactly<number[] | unknown[], number[]>);

// `unknown` and `any` exclude themselves.
expectType<never>({} as ExcludeExactly<unknown, unknown>);
expectType<never>({} as ExcludeExactly<unknown, any>);
expectType<never>({} as ExcludeExactly<any, any>);
expectType<never>({} as ExcludeExactly<any, unknown>);

// `unknown` and `any` exclude other types.
expectType<never>({} as ExcludeExactly<string | number, unknown>);
expectType<never>({} as ExcludeExactly<string | number, any>);

// Union
expectType<2>({} as ExcludeExactly<0 | 1 | 2, 0 | 1>);
expectType<never>({} as ExcludeExactly<0 | 1 | 2, 0 | 1 | 2>);
expectType<{readonly a?: 0}>({} as ExcludeExactly<{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}, {a: 0} | {readonly a: 0} | {a?: 0}>);
expectType<never>({} as ExcludeExactly<{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}, {a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}>);
