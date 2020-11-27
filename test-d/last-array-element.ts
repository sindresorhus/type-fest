import {expectType} from 'tsd';
import {LastArrayElement} from '../ts41';

declare function lastOf<V extends any[]>(array: V): LastArrayElement<V>;
const array = ['foo', 2];

expectType<number>(lastOf(array));
expectType<string>(lastOf(array.reverse()));
