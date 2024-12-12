import {expectType} from 'tsd';
import type {ArrayTailDeep} from '../index';

declare const getArrayTailDeep: <T extends readonly unknown[], Deep extends number = 1>(array: T, deep?: Deep) => ArrayTailDeep<T, Deep>;

expectType<[]>(getArrayTailDeep([]));
expectType<[]>(getArrayTailDeep(['a']));
expectType<[]>(getArrayTailDeep(['a', 'b', 1, 2] as unknown as [string | number]));

expectType<[]>(getArrayTailDeep([] as const));
expectType<[]>(getArrayTailDeep(['a'] as const));
expectType<['b', 'c']>(getArrayTailDeep(['a', 'b', 'c'] as const));
expectType<['c']>(getArrayTailDeep(['a', 'b', 'c'] as const, 2));
expectType<[]>(getArrayTailDeep(['a', 'b', 'c'] as const, 3));
expectType<[]>(getArrayTailDeep(['a', 'b', 'c'] as const, 10));

// Optional elements tests
expectType<[undefined, 'c']>(getArrayTailDeep(['a', 'b', undefined, 'c'] as const, 2));

// Mixed optional/required
type MixedArray = [string, boolean?, undefined?, number?];
expectType<[undefined?, number?]>(getArrayTailDeep(['hello'] as MixedArray, 2));

// Optional numbers
expectType<[undefined, 3]>(getArrayTailDeep([1, 2, undefined, 3] as const, 2));

// Complex mixed case
type ComplexArray = [string, number, boolean, number?, string?];
expectType<[boolean, number?, string?]>(getArrayTailDeep(['test', 1, false] as ComplexArray, 2));

// All optional elements
expectType<['c'?]>([] as ArrayTailDeep<['a'?, 'b'?, 'c'?], 2>);

// Union of tuples
expectType<[] | ['c']>([] as ArrayTailDeep<[] | ['a', 'b', 'c'], 2>);
