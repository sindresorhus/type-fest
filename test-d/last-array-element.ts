import {expectType} from 'tsd';
import type {LastArrayElement} from '../index';

declare function lastOf<V extends readonly unknown[]>(array: V): LastArrayElement<V>;
const array: ['foo', 2, 'bar'] = ['foo', 2, 'bar'];
const mixedArray: ['bar', 'foo', 2] = ['bar', 'foo', 2];

expectType<'bar'>(lastOf(array));
expectType<2>(lastOf(mixedArray));
expectType<string>(lastOf(['a', 'b', 'c']));
expectType<string | number>(lastOf(['a', 'b', 1]));
expectType<1>(lastOf(['a', 'b', 1] as const));
