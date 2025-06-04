import {expectType} from 'tsd';
import type {CountOf} from '../source/count-of.d.ts';

// Base case
expectType<CountOf<[], 1>>(0);
expectType<CountOf<[1, 2, 3], 2>>(1);
expectType<CountOf<[1, 2, 1, 1], 1>>(3);
expectType<CountOf<['a', 'b', 'a'], 'a'>>(2);
expectType<CountOf<[false, true, true], true>>(2);

expectType<CountOf<[{a: 1}, {b: 1}], {a: 1}>>(1);
expectType<CountOf<[{b: 1}, [string]], [string]>>(1);

// Readonly
expectType<CountOf<readonly [1, 'b', 'b'], 'b'>>(2);
expectType<CountOf<readonly ['c', 2, 1], 2>>(1);

// Union and edge types
expectType<CountOf<[1 | 2, 2], 2>>(1);
expectType<CountOf<[true | 1, boolean], boolean>>(1);
expectType<CountOf<[undefined, 1, 3], undefined>>(1);
expectType<CountOf<[1, null, 3, null], null>>(2);

declare function getCount<const T extends unknown[], const I>(array: T, item: I): CountOf<T, I>;

expectType<2>(getCount(['a', 'b', 'a'], 'a'));
