import {expectAssignable} from 'tsd';
import {UnionToTuple} from '..';

declare type Union = 'A' | 'B';
declare const tuple: UnionToTuple<Union>;
expectAssignable<readonly ['A', 'B']>(tuple);
