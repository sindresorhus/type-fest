import {expectAssignable, expectNotAssignable} from 'tsd';
import type {UnknownMap} from '../index.d.ts';

declare const foo: ReadonlyMap<string, number>;
declare const bar: {
	readonly map: ReadonlyMap<number, string>;
};

expectAssignable<UnknownMap>(foo);
expectAssignable<UnknownMap>(bar.map);
expectAssignable<UnknownMap>(new Map());
expectAssignable<UnknownMap>(new Map([['foo', 1]]));

expectNotAssignable<UnknownMap>(null);
expectNotAssignable<UnknownMap>(undefined);
expectNotAssignable<UnknownMap>({});
expectNotAssignable<UnknownMap>([]);
expectNotAssignable<UnknownMap>({0: 1});
expectNotAssignable<UnknownMap>(1);
