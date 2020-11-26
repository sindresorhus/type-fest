import {expectType} from 'tsd';
import {TakeLast} from '..';

declare function lastOf<V extends any[], L extends TakeLast<V>>(array: V): L;
const array = ['foo', 2];

expectType<number>(lastOf(array));
expectType<string>(lastOf(array.reverse()));
