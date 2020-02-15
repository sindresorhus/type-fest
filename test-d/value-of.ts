import {expectType, expectError} from 'tsd';
import {ValueOf} from '..';

const value: ValueOf<{ a: 1; b: 2; c: 3 }> = 3;

expectType<1 | 2 | 3>(value);
expectError<4>(value);
