import {expectTypeOf} from 'nz';
import type {NonEmptyTuple} from '../index.d.ts';

declare const sum: (...numbers: NonEmptyTuple<number>) => number;

expectTypeOf(sum(1, 2, 3)).toBe<number>();
expectTypeOf(sum(1)).toBe<number>();

// @ts-expect-error
sum();
