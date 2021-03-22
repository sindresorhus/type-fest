import {expectType} from 'tsd';
import {LastArrayElement} from '../ts41';

declare function lastOf<V extends [any, ...any]>(array: V): LastArrayElement<V>;
const array: ['foo', 2, 'bar'] = ['foo', 2, 'bar'];
const mixedArray: ['bar', 'foo', 2] = ['bar', 'foo', 2];

expectType<'bar'>(lastOf(array));
expectType<2>(lastOf(mixedArray));
