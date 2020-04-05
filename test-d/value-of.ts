import {expectType, expectError, expectAssignable} from 'tsd';
import {ValueOf} from '..';

const value: ValueOf<{a: 1; b: 2; c: 3}> = 3;
const valueRestricted: ValueOf<{a: 1; b: 2; c: 3}, 'a'> = 1;

expectAssignable<1 | 2 | 3>(value);
expectError<4>(value);

expectType<1>(valueRestricted);
expectError<2>(valueRestricted);
expectError<4>(valueRestricted);
