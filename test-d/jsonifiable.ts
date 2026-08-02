import {expectAssignable, expectNotAssignable} from 'tsd';
import type {Jsonifiable} from '../index.d.ts';

expectAssignable<Jsonifiable>(1);
expectAssignable<Jsonifiable>('');
expectAssignable<Jsonifiable>(null);
expectAssignable<Jsonifiable>(new Date());
expectAssignable<Jsonifiable>({a: new Date()});
expectAssignable<Jsonifiable>([new Date()]);
expectAssignable<Jsonifiable>({a: undefined});
expectAssignable<Jsonifiable>([1, 2, 3] as const);
expectAssignable<Jsonifiable>({a: new Date()} as const);
expectAssignable<Jsonifiable>({a: {deeply: {nested: {toJsonObject: new Date()}}}});
expectAssignable<Jsonifiable>({toJSON: () => new Date()});
expectAssignable<Jsonifiable>({
	toJSON() {
		return {
			foo: {
				toJSON() {
					return {bar: 'bar'};
				},
			},
		};
	},
});

expectNotAssignable<Jsonifiable>(undefined);
expectNotAssignable<Jsonifiable>(new Map());
expectNotAssignable<Jsonifiable>({a: new Map()});
expectNotAssignable<Jsonifiable>([new Map()]);
