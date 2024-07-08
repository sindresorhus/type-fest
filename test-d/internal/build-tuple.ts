import {expectType} from 'tsd';
import type {BuildTuple} from '../../source/internal';

expectType<BuildTuple<3, null>>([null, null, null]);
expectType<BuildTuple<5, 0>>([0, 0, 0, 0, 0]);
expectType<BuildTuple<0, 0>>([]);
