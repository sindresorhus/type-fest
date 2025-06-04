import {expectType} from 'tsd';
import type {IndicesOf} from '../index.d.ts';

// Base case
expectType<IndicesOf<[], 1>>([]);
expectType<IndicesOf<[1, 2, 3], 2>>([1]);
expectType<IndicesOf<[1, 2, 1, 1], 1>>([0, 2, 3]);
expectType<IndicesOf<['a', 'b', 'a'], 'a'>>([0, 2]);
expectType<IndicesOf<[false, true, true], true>>([1, 2]);

expectType<IndicesOf<[{a: 1}, {b: 1}], {a: 1}>>([0]);
expectType<IndicesOf<[{b: 1}, [string]], [string]>>([1]);

// Readonly
expectType<IndicesOf<readonly [1, 'b', 'b'], 'b'>>([1, 2]);
expectType<IndicesOf<readonly ['c', 2, 1], 2>>([1]);

// Union and edge types
expectType<IndicesOf<[1 | 2, 2], 2>>([1]);
expectType<IndicesOf<[true | 1, boolean], boolean>>([1]);
expectType<IndicesOf<[undefined, 1, 3], undefined>>([0]);
expectType<IndicesOf<[1, null, 3, null], null>>([1, 3]);

declare function getIndices<const T extends unknown[], const I>(array: T, item: I): IndicesOf<T, I>;

expectType<[0, 2]>(getIndices(['a', 'b', 'a'], 'a'));
