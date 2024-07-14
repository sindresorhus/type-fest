import {expectType} from 'tsd';
import type {ArrayTail} from '../index';

declare const getArrayTail: <T extends readonly unknown[]>(array: T) => ArrayTail<T>;

expectType<[]>(getArrayTail([]));
expectType<[]>(getArrayTail(['a']));
expectType<[]>(getArrayTail(['a', 'b', 'c']));

expectType<[]>(getArrayTail([] as const));
expectType<[]>(getArrayTail(['a'] as const));
expectType<['b', 'c']>(getArrayTail(['a', 'b', 'c'] as const));
