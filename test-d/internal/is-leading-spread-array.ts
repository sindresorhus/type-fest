import {expectType} from 'tsd';
import type {IsLeadingSpreadArray} from '../../source/internal/array.js';

expectType<IsLeadingSpreadArray<[1, 2, 3]>>(false);
expectType<IsLeadingSpreadArray<readonly [1, 2, 3]>>(false);
expectType<IsLeadingSpreadArray<[1, 2, 3?]>>(false);
expectType<IsLeadingSpreadArray<[number, number]>>(false);
expectType<IsLeadingSpreadArray<[1, ...string[], 3]>>(false);
expectType<IsLeadingSpreadArray<[1, ...string[]]>>(false);
expectType<IsLeadingSpreadArray<[string, ...string[]]>>(false);

expectType<IsLeadingSpreadArray<[...string[], '1']>>(true);
expectType<IsLeadingSpreadArray<[...string[], string]>>(true);
expectType<IsLeadingSpreadArray<[...string[], 1, 2, 3]>>(true);
