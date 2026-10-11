import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {TupleLength} from '../../source/internal/index.d.ts';

expectTypeOf<IsEqual<TupleLength<[]>, 0>>().toBe<true>();
expectTypeOf<IsEqual<TupleLength<[string, number, boolean]>, 3>>().toBe<true>();

// An array of unknown length has no tuple length to report.
expectTypeOf<IsEqual<TupleLength<string[]>, never>>().toBe<true>();

// A union reports the length of every member that has one. The empty tuple's length is `0`, and the array of unknown length drops out entirely.
expectTypeOf<IsEqual<TupleLength<[] | [1, 2, 3] | number[]>, 0 | 3>>().toBe<true>();
