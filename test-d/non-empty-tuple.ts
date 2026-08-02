import {expectType} from 'tsd';
import type {NonEmptyTuple} from '../index.d.ts';

declare const sum: (...numbers: NonEmptyTuple<number>) => number;

expectType<number>(sum(1, 2, 3));
expectType<number>(sum(1));

// @ts-expect-error
sum();
