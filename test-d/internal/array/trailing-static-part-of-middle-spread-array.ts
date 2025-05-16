import {expectType} from 'tsd';
import type {TrailingStaticPartOfMiddleSpreadArray} from '../../../source/internal/array.js';

expectType<TrailingStaticPartOfMiddleSpreadArray<[1, ...string[], 2, 3 ]>>(null! as [2, 3]);
expectType<TrailingStaticPartOfMiddleSpreadArray<readonly [1, ...string[], 2, 3]>>(null! as [2, 3]);
