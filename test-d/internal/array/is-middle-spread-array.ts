import {expectType} from 'tsd';
import type {IsMiddleSpreadArray} from '../../../source/internal/array.js';

expectType<IsMiddleSpreadArray<[1, 2, 3]>>(false);
expectType<IsMiddleSpreadArray<readonly [1, 2, 3]>>(false);
expectType<IsMiddleSpreadArray<[1, 2, 3?]>>(false);
expectType<IsMiddleSpreadArray<[number, number]>>(false);
expectType<IsMiddleSpreadArray<[...string[], 1]>>(false);
expectType<IsMiddleSpreadArray<[...string[], string]>>(false);
expectType<IsMiddleSpreadArray<['1', ...string[]]>>(false);
expectType<IsMiddleSpreadArray<[string, ...string[]]>>(false);
expectType<IsMiddleSpreadArray<[1, 2, ...string[]]>>(false);
expectType<IsMiddleSpreadArray<[...string[]]>>(false);

expectType<IsMiddleSpreadArray<[1, ...string[], 3]>>(true);
expectType<IsMiddleSpreadArray<[1, 2, ...string[], 3]>>(true);
expectType<IsMiddleSpreadArray<[1, 2, ...string[], 3, 4]>>(true);

