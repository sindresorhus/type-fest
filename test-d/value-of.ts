import {expectType, expectError} from 'tsd';
import {ValueOf} from '..';

const value: ValueOf<[1, 2, 3]> = 1;

expectType<1 | 2 | 3>(value);
expectError<4>(value);
