import {expectAssignable, expectNotAssignable} from 'tsd';
import type {Jsonifiable} from '..';

expectAssignable<Jsonifiable>(1);
expectAssignable<Jsonifiable>('');
expectAssignable<Jsonifiable>(null);
expectAssignable<Jsonifiable>(new Date());
expectAssignable<Jsonifiable>({a: new Date()});
expectAssignable<Jsonifiable>([new Date()]);

expectNotAssignable<Jsonifiable>(undefined);
expectNotAssignable<Jsonifiable>(new Map());
expectNotAssignable<Jsonifiable>({a: new Map()});
expectNotAssignable<Jsonifiable>([new Map()]);
expectNotAssignable<Jsonifiable>({a: undefined});
