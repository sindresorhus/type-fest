import {expectType} from 'tsd';
import type {ExtendsStrict} from '../source/extends-strict.d.ts';

expectType<ExtendsStrict<number | string, string>>(false);
expectType<ExtendsStrict<string, number | string>>(true);
expectType<ExtendsStrict<string, string>>(true);
expectType<ExtendsStrict<never, never>>(true);

expectType<ExtendsStrict<never, string>>(false);
expectType<ExtendsStrict<string, never>>(false);
expectType<ExtendsStrict<string, any>>(true);
expectType<ExtendsStrict<any, never>>(false);
expectType<ExtendsStrict<never, any>>(false);
expectType<ExtendsStrict<any, any>>(true);

expectType<ExtendsStrict<string | string[], string>>(false);
expectType<ExtendsStrict<1, number>>(true);
expectType<ExtendsStrict<number, 1>>(false);
expectType<ExtendsStrict<'foo', 'foo' | 'bar'>>(true);
expectType<ExtendsStrict<'foo' | 'bar', 'foo'>>(false);
