import {expectAssignable, expectNotAssignable} from 'tsd';
import type {UnknownSet} from '../index.d.ts';

declare const foo: ReadonlySet<string>;
declare const bar: {
	readonly set: ReadonlySet<number>;
};

expectAssignable<UnknownSet>(foo);
expectAssignable<UnknownSet>(bar.set);
expectAssignable<UnknownSet>(new Set());
expectAssignable<UnknownSet>(new Set('foo'));

expectNotAssignable<UnknownSet>(null);
expectNotAssignable<UnknownSet>(undefined);
expectNotAssignable<UnknownSet>({});
expectNotAssignable<UnknownSet>([]);
expectNotAssignable<UnknownSet>({0: 1});
expectNotAssignable<UnknownSet>(1);
expectNotAssignable<UnknownSet>(Date);
