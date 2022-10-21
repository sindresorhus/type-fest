import {expectAssignable, expectNotAssignable} from 'tsd';
import type {Jsonifiable} from '..';

expectAssignable<Jsonifiable>(1);
expectAssignable<Jsonifiable>('');
expectAssignable<Jsonifiable>(null);
expectAssignable<Jsonifiable>(new Date());
expectAssignable<Jsonifiable>({a: new Date()});
expectAssignable<Jsonifiable>([new Date()]);
expectAssignable<Jsonifiable>({a: undefined});
expectAssignable<Jsonifiable>([1, 2, 3] as const);
expectAssignable<Jsonifiable>({a: new Date()} as const);

expectNotAssignable<Jsonifiable>(undefined);
expectNotAssignable<Jsonifiable>(new Map());
expectNotAssignable<Jsonifiable>({a: new Map()});
expectNotAssignable<Jsonifiable>([new Map()]);
expectNotAssignable<Jsonifiable>({toJSON: () => new Date()});
