import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {ValueOf} from '../index.d.ts';

const value: ValueOf<{a: 1; b: 2; c: 3}> = 3;
const valueRestricted: ValueOf<{a: 1; b: 2; c: 3}, 'a'> = 1;

expectAssignable<1 | 2 | 3>(value);
expectNotAssignable<4>(value);

expectType<1>(valueRestricted);
expectNotAssignable<2>(valueRestricted);
expectNotAssignable<4>(valueRestricted);
