import {expectType} from 'tsd';
import type {Not} from '../../source/internal/index.d.ts';

expectType<Not<true>>(false);
expectType<Not<false>>(true);
// FIXME
expectType<Not<boolean>>(null! as boolean);
