import {expectType} from 'tsd';
import type {UniqueExclude} from '../../source/internal/type.d.ts';

// `{readonly a: t}` should not be equal to `{a: t}` because of assignability.
expectType<{a: 0}>({} as UniqueExclude<{a: 0} | {readonly a: 0}, {readonly a: 0}>);
expectType<{readonly a: 0}>({} as UniqueExclude<{readonly a: 0}, {a: 0}>);

expectType<never>({} as UniqueExclude<{readonly a: 0}, {readonly a: 0}>);
expectType<number>({} as UniqueExclude<0 | 1 | number, 1>);
expectType<never>({} as UniqueExclude<0 | 1 | number, number>);

// `unknown` cannot be excluded like `unknown\T` in any cases.
expectType<unknown>({} as UniqueExclude<unknown, string>);
expectType<[unknown]>({} as UniqueExclude<[unknown], [number]>);
expectType<unknown[]>({} as UniqueExclude<unknown[], number[]>);
expectType<{a: unknown}>({} as UniqueExclude<{a: unknown}, {a: number}>);

// `unknown` and `any` exclude themselves.
expectType<never>({} as UniqueExclude<unknown, unknown>);
expectType<unknown>({} as UniqueExclude<unknown, any>);
expectType<never>({} as UniqueExclude<any, any>);
expectType<any>({} as UniqueExclude<any, unknown>);

// `unknown` and `any` don't exclude other types.
expectType<string>({} as UniqueExclude<string, unknown>);
expectType<string>({} as UniqueExclude<string, any>);

expectType<unknown[]>({} as UniqueExclude<number[] | unknown[], number[]>);
