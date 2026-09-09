import {expectType} from 'tsd';
import type {LeadingStaticPartOfMiddleSpreadArray} from '../../../source/internal/array.d.ts';

expectType<LeadingStaticPartOfMiddleSpreadArray<[1, 2, ...string[], 3]>>(null! as [1, 2]);
expectType<LeadingStaticPartOfMiddleSpreadArray<readonly [1, 2, ...string[], 3]>>(null! as [1, 2]);
