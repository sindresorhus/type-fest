import {expectType} from 'tsd';
import type {StaticPartOfLeadingSpreadArray} from '../../../source/internal/array.js';

expectType<StaticPartOfLeadingSpreadArray<[...string[], 1, 2, 3 ]>>(null! as [1, 2, 3]);
expectType<StaticPartOfLeadingSpreadArray<readonly [...string[], 1, 2, 3]>>(null! as [1, 2, 3]);
