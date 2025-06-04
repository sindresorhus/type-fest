import {expectType} from 'tsd';
import type {VariablePartOfMiddleSpreadArray} from '../../../source/internal/array.js';

expectType<VariablePartOfMiddleSpreadArray<[1, 2, ...string[], 3]>>(null! as string[]);
expectType<VariablePartOfMiddleSpreadArray<readonly [1, 2, ...string[], 3]>>(null! as string[]);
