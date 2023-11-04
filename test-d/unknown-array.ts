import {expectAssignable, expectError, expectNotAssignable, expectType} from 'tsd';
import type {UnknownArray} from '../index';

declare const foo: readonly [];
declare const bar: {
	readonly array: unknown[];
};

expectAssignable<UnknownArray>(foo);
expectAssignable<UnknownArray>(bar.array);
expectAssignable<UnknownArray>([]);
expectAssignable<UnknownArray>(['foo']);

expectNotAssignable<UnknownArray>(null);
expectNotAssignable(undefined);
expectNotAssignable({});
expectNotAssignable({0: 1});
expectNotAssignable(1);
expectNotAssignable(Date);
