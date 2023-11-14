import {expectType} from 'tsd';
import type {NewArray} from '../../source/internal';

expectType<NewArray<3>>([null, null, null]);
expectType<NewArray<5, 0>>([0, 0, 0, 0, 0]);
expectType<NewArray<0, 0>>([]);
