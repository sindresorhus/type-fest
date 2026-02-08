import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {EmptyArray, IsEmptyArray} from '../index.d.ts';

// EmptyArray — Assignability
declare let emptyArray: EmptyArray;
expectAssignable<EmptyArray>([]);
expectAssignable<never[]>(emptyArray);

// Non-empty arrays should not be assignable
expectNotAssignable<EmptyArray>([1]);
expectNotAssignable<EmptyArray>([undefined]);
expectNotAssignable<EmptyArray>(['a', 'b']);

// Non-array types should not be assignable
// @ts-expect-error
emptyArray = {};
// @ts-expect-error
emptyArray = 42;
// @ts-expect-error
emptyArray = null;
// @ts-expect-error
emptyArray = 'string';

// @ts-expect-error
emptyArray.length = 1;

// Readonly compatibility
expectAssignable<readonly never[]>(emptyArray);

// IsEmptyArray — Basic cases
expectType<IsEmptyArray<[]>>(true);
expectType<IsEmptyArray<never[]>>(true);
expectType<IsEmptyArray<readonly []>>(true);
expectType<IsEmptyArray<readonly never[]>>(true);

// IsEmptyArray — Non-empty cases
expectType<IsEmptyArray<[1]>>(false);
expectType<IsEmptyArray<[string, number]>>(false);
expectType<IsEmptyArray<readonly [1]>>(false);
expectType<IsEmptyArray<string[]>>(false);
expectType<IsEmptyArray<readonly string[]>>(false);

// IsEmptyArray — Edge cases
expectType<IsEmptyArray<any>>(false);
expectType<IsEmptyArray<never>>(false);

// IsEmptyArray — Union behavior
expectType<IsEmptyArray<[] | [1]>>({} as boolean);
expectType<IsEmptyArray<readonly [] | readonly [1]>>({} as boolean);

// IsEmptyArray — More non-empty/array boundaries
expectType<IsEmptyArray<[never]>>(false);
expectType<IsEmptyArray<unknown[]>>(false);
expectType<IsEmptyArray<any[]>>(false);
