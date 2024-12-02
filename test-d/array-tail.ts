import {expectType} from 'tsd';
import type {ArrayTail} from '../index';

declare const getArrayTail: <T extends readonly unknown[]>(array: T) => ArrayTail<T>;

expectType<[]>(getArrayTail([]));
expectType<[]>(getArrayTail(['a']));
expectType<[]>(getArrayTail(['a', 'b', 'c']));

expectType<[]>(getArrayTail([] as const));
expectType<[]>(getArrayTail(['a'] as const));
expectType<['b', 'c']>(getArrayTail(['a', 'b', 'c'] as const));

// Optional elements tests
expectType<[undefined, 'c']>(getArrayTail(['a', undefined, 'c'] as const));

// Mixed optional/required
type MixedArray = [string, undefined?, number?];
expectType<[undefined?, number?]>(getArrayTail(['hello'] as MixedArray));

// Optional numbers
expectType<[undefined, 3]>(getArrayTail([1, undefined, 3] as const));

// Complex mixed case
type ComplexArray = [string, boolean, number?, string?];
expectType<[boolean, number?, string?]>(getArrayTail(['test', false] as ComplexArray));
