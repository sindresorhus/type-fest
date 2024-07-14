import {expectType} from 'tsd';
import type {NonEmptyTuple} from '../index';

declare const sum: (...numbers: NonEmptyTuple<number>) => number;

expectType<number>(sum(1, 2, 3));
expectType<number>(sum(1));

// @ts-expect-error
sum();
