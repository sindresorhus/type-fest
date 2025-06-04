import {expectType} from 'tsd';
import type {IndexOf, LastIndexOf} from '../index.d.ts';

// IndexOf

// Basic cases
expectType<IndexOf<[], 1>>(-1);
expectType<IndexOf<[1, 2, 3], 1>>(0);
expectType<IndexOf<[1, 2, 3], 2>>(1);
expectType<IndexOf<[1, 2, 3], 4>>(-1);

expectType<IndexOf<[{a: 1}, {a: 1}, {b: 1}], {a: 1}>>(0);
expectType<IndexOf<[{b: 1}, [string]], [string]>>(1);

// Duplicate values
expectType<IndexOf<[1, 2, 1], 1>>(0);
expectType<IndexOf<[true, false, true], true>>(0);

// Readonly and tuple
expectType<IndexOf<readonly [1, 2, 3], 2>>(1);
expectType<IndexOf<readonly ['a', 'c', 'c'], 'c'>>(1);

// Edge: optional/union types
expectType<IndexOf<[1 | 2, 3], 1>>(-1);
expectType<IndexOf<[undefined, 1, 3], undefined>>(0);
expectType<IndexOf<[1, null, 3, null], null>>(1);

// LastIndexOf

// Basic cases
expectType<LastIndexOf<[], 1>>(-1);
expectType<LastIndexOf<[1], 1>>(0);
expectType<LastIndexOf<[1, 2, 3], 2>>(1);
expectType<LastIndexOf<[1, 2, 3], 4>>(-1);

expectType<LastIndexOf<[{a: 1}, {a: 1}, {b: 1}], {a: 1}>>(1);
expectType<LastIndexOf<[{b: 1}, [string], [string]], [string]>>(2);

// Duplicate values
expectType<LastIndexOf<[1, 2, 1], 1>>(2);
expectType<LastIndexOf<[true, false, true], true>>(2);

// Readonly and tuple
expectType<LastIndexOf<readonly [1, 2, 3], 2>>(1);
expectType<LastIndexOf<readonly ['a', 'c', 'c'], 'c'>>(2);

// Edge: optional/union types
expectType<LastIndexOf<[1 | 2, 3, 2], 2>>(2);
expectType<LastIndexOf<[undefined, 1, 3], undefined>>(0);
expectType<LastIndexOf<[1, null, 3, null], null>>(3);
