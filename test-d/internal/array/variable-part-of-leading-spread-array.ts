import {expectType} from 'tsd';
import type {VariablePartOfLeadingSpreadArray} from '../../../source/internal/array.js';

expectType<VariablePartOfLeadingSpreadArray<[...string[], 1, 2, 3 ]>>(null! as string[]);
expectType<VariablePartOfLeadingSpreadArray<readonly [...string[], 1, 2, 3]>>(null! as string[]);
