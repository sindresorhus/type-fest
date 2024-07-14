import {expectType} from 'tsd';
import type {ArrayElement} from '../index';

declare const getArrayElement: <T extends readonly unknown[]>(array: T) => ArrayElement<T>;

expectType<string>(getArrayElement(['a', 'b', 'c']));
expectType<'a' | 'b' | 'c'>(getArrayElement(['a', 'b', 'c'] as const));
expectType<number>(getArrayElement([1, 2, 3]));
expectType<string | number>(getArrayElement(['a', 1]));

declare const notArray: ArrayElement<unknown>;

expectType<never>(getArrayElement([]));
expectType<never>(notArray);
