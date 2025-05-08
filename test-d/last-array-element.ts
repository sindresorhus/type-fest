import {expectType} from 'tsd';
import type {LastArrayElement} from '../index.d.ts';

declare function lastOf<V extends readonly unknown[]>(array: V): LastArrayElement<V>;
const array: ['foo', 2, 'bar'] = ['foo', 2, 'bar'];
const mixedArray: ['bar', 'foo', 2] = ['bar', 'foo', 2];

expectType<'bar'>(lastOf(array));
expectType<2>(lastOf(mixedArray));
expectType<string>(lastOf(['a', 'b', 'c']));
expectType<string | number>(lastOf(['a', 'b', 1]));
expectType<1>(lastOf(['a', 'b', 1] as const));

declare const leadingSpreadTuple: [...string[], object, number];
expectType<number>(lastOf(leadingSpreadTuple));

declare const trailingSpreadTuple1: [string, ...number[]];
expectType<number | string>(lastOf(trailingSpreadTuple1));

declare const trailingSpreadTuple2: [string, boolean, ...number[]];
expectType<number | boolean>(lastOf(trailingSpreadTuple2));

// eslint-disable-next-line @typescript-eslint/array-type
declare const trailingSpreadTuple3: ['foo', true, ...(1 | '2')[]];
expectType<true | 1 | '2'>(lastOf(trailingSpreadTuple3));
