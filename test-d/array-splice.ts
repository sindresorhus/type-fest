import {expectType} from 'tsd';
import type {ArraySplice} from '../index.d.ts';

// Test fixed array
type TestTuple = ['a', 'b', 'c', 'd'];

declare const tuple0: ArraySplice<TestTuple, 2, 1>;
expectType<['a', 'b', 'd']>(tuple0);

declare const tuple1: ArraySplice<TestTuple, 2, 1, ['e', 'f']>;
expectType<['a', 'b', 'e', 'f', 'd']>(tuple1);

declare const tuple2: ArraySplice<TestTuple, 2, 0, ['e', 'f']>;
expectType<['a', 'b', 'e', 'f', 'c', 'd']>(tuple2);

declare const tuple3: ArraySplice<TestTuple, 0, 1>;
expectType<['b', 'c', 'd']>(tuple3);

declare const tuple4: ArraySplice<TestTuple, 0, 1, ['e', 'f']>;
expectType<['e', 'f', 'b', 'c', 'd']>(tuple4);

// Test variable array
type TestArray = ['a', 'b', 'c', 'd', ...number[]];

declare const array0: ArraySplice<TestArray, 2, 1>;
expectType<['a', 'b', 'd', ...number[]]>(array0);

declare const array1: ArraySplice<TestArray, 2, 1, ['e', 'f']>;
expectType<['a', 'b', 'e', 'f', 'd', ...number[]]>(array1);

declare const array2: ArraySplice<TestArray, 6, 0, ['e', 'f']>;
expectType<['a', 'b', 'c', 'd', number, number, 'e', 'f', ...number[]]>(array2);
