import {expectType} from 'tsd';
import type {IsNumberLike} from '../../source/internal/numeric.d';

expectType<IsNumberLike<'1'>>(true);
expectType<IsNumberLike<1>>(true);
expectType<IsNumberLike<'-1.1'>>(true);
expectType<IsNumberLike< -1.1>>(true);
expectType<IsNumberLike<'foo'>>(false);
