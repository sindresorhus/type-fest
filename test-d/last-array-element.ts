import {expectType} from 'tsd';
import {LastArrayElement} from '..';

declare function lastOf<V extends any[], L extends LastArrayElement<V>>(array: V): L;
const array = ['foo', 2];

expectType<number>(lastOf(array));
expectType<string>(lastOf(array.reverse()));
