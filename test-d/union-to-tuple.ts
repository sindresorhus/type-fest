import {expectAssignable, expectError, expectType} from 'tsd';
import type {UnionToUnsortedTuple} from '../index';

type Options = UnionToUnsortedTuple<'a' | 'b' | 'c'>;

const options: Options = ['a', 'b', 'c'];

expectAssignable<Options>(options);
expectType<'a'>(options[0]);
expectType<'b'>(options[1]);
expectType<'c'>(options[2]);
expectError(options[0] = 'b');
