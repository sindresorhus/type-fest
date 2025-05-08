import {expectType} from 'tsd';
import type {IsNumberLike} from '../../source/internal/numeric.d.d.ts';

expectType<IsNumberLike<'1'>>(true);
expectType<IsNumberLike<1>>(true);
expectType<IsNumberLike<'-1.1'>>(true);
expectType<IsNumberLike< -1.1>>(true);
expectType<IsNumberLike<'foo'>>(false);
