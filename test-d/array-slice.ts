import {expectType} from 'tsd';
import type {ArraySlice} from '../index';

expectType<ArraySlice<[0, 1, 2, 3]>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3]>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], 1>>([1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], 1, 2>>([1]);
expectType<ArraySlice<[0, 1, 2, 3], 1, -1>>([1, 2]);
expectType<ArraySlice<[0, 1, 2, 3], -1, -1>>([]);
expectType<ArraySlice<[0, 1, 2, 3], -2, -1>>([2]);
expectType<ArraySlice<[0, 1, 2, 3], -100>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], -100, 4>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], -100, 3>>([0, 1, 2]);
expectType<ArraySlice<[0, 1, 2, 3], -100, -1>>([0, 1, 2]);
expectType<ArraySlice<[0, 1, 2, 3], 2, 1>>([]);
expectType<ArraySlice<[0, 1, 2, 3], -10, 1>>([0]);
expectType<ArraySlice<[0, 1, 2, 3], 0, -3>>([0]);
expectType<ArraySlice<[0, 1, 2, 3], 0, -4>>([]);
expectType<ArraySlice<[], -10, 1>>([]);
expectType<ArraySlice<[]>>([]);

expectType<ArraySlice<[1, 2, 3, ...string[]], 0, 3>>([1, 2, 3]);
expectType<ArraySlice<[1, 2, 3, ...string[]], 1, 5>>([2, 3, null! as string, null! as string]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 1, 5>>([2, 3, null! as (string | 4 | 5), null! as (string | 4 | 5)]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 0>>([1, 2, 3, ...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 1>>([2, 3, ...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 3>>([...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 10>>([...(null! as string[]), 4, 5]);
