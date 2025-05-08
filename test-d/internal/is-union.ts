import {expectType} from 'tsd';
import type {IsUnion} from '../../source/internal/index.d.ts';

expectType<IsUnion<1>>(false);
expectType<IsUnion<true>>(false);
expectType<IsUnion<'foo'>>(false);
expectType<IsUnion<[]>>(false);
expectType<IsUnion<{}>>(false);
expectType<IsUnion<1 & {}>>(false);
expectType<IsUnion<never>>(false);
expectType<IsUnion<unknown>>(false);
expectType<IsUnion<any>>(false);

expectType<IsUnion<1 | 2>>(true);
expectType<IsUnion<'foo' | 'bar'>>(true);
expectType<IsUnion<'foo' | 'bar' | 1>>(true);
expectType<IsUnion<'foo' | 1>>(true);
expectType<IsUnion<[] | {}>>(true);
