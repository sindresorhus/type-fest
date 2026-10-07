import {expectType} from 'tsd';
import type {IsEqual} from '../../index.d.ts';
import type {TupleLength} from '../../source/internal/index.d.ts';

expectType<IsEqual<TupleLength<[]>, 0>>(true);
expectType<IsEqual<TupleLength<[string, number, boolean]>, 3>>(true);

// An array of unknown length has no tuple length to report.
expectType<IsEqual<TupleLength<string[]>, never>>(true);

// A union reports the length of every member that has one. The empty tuple's length is `0`, and the array of unknown length drops out entirely.
expectType<IsEqual<TupleLength<[] | [1, 2, 3] | number[]>, 0 | 3>>(true);
