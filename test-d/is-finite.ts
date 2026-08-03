import {expectType} from 'tsd';
import type {IsFinite, NegativeInfinity, PositiveInfinity} from '../index.d.ts';

declare const never: never;

expectType<IsFinite<0>>(true);
expectType<IsFinite<1>>(true);
expectType<IsFinite<-1>>(true);
expectType<IsFinite<1.5>>(true);
expectType<IsFinite<1n>>(true);
expectType<IsFinite<-1n>>(true);
expectType<IsFinite<number>>({} as boolean);
expectType<IsFinite<bigint>>(true);
expectType<IsFinite<any>>({} as boolean);
expectType<IsFinite<never>>(never);

expectType<IsFinite<PositiveInfinity>>(false);
expectType<IsFinite<NegativeInfinity>>(false);

expectType<IsFinite<1 | 2>>(true);
expectType<IsFinite<1 | PositiveInfinity>>({} as boolean);
expectType<IsFinite<PositiveInfinity | NegativeInfinity>>(false);

// @ts-expect-error
type Invalid = IsFinite<string>;

// @ts-expect-error
type Unknown = IsFinite<unknown>;
