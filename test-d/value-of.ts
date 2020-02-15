import {expectType} from 'tsd';
import {ValueOf} from '..';

const value: ValueOf<[1, 2, 3]> = 1;

expectType<1 | 2 | 3>(value);
