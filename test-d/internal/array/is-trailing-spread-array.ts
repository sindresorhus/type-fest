import {expectType} from 'tsd';
import type {IsTrailingSpreadArray} from '../../../source/internal/array.js';

expectType<IsTrailingSpreadArray<[1, 2, 3]>>(false);
expectType<IsTrailingSpreadArray<readonly [1, 2, 3]>>(false);
expectType<IsTrailingSpreadArray<[1, 2, 3?]>>(false);
expectType<IsTrailingSpreadArray<[number, number]>>(false);
expectType<IsTrailingSpreadArray<[1, ...string[], 3]>>(false);
expectType<IsTrailingSpreadArray<[...string[], 1]>>(false);
expectType<IsTrailingSpreadArray<[...string[], string]>>(false);
expectType<IsTrailingSpreadArray<[...string[]]>>(false);

expectType<IsTrailingSpreadArray<['1', ...string[]]>>(true);
expectType<IsTrailingSpreadArray<[string, ...string[]]>>(true);
expectType<IsTrailingSpreadArray<[1, 2, ...string[]]>>(true);
