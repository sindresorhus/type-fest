import {expectType} from 'tsd';
import type {BuildTuple} from '../../source/internal/index.d.ts';

expectType<BuildTuple<3, null>>([null, null, null]);
expectType<BuildTuple<5, 0>>([0, 0, 0, 0, 0]);
expectType<BuildTuple<0, 0>>([]);
expectType<BuildTuple<2 | 3, 0>>({} as [0, 0] | [0, 0, 0]);
expectType<BuildTuple<number, 0>>({} as Array<0>);
