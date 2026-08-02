import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {UnknownArray} from '../index.d.ts';

declare const foo: readonly [];
declare const bar: {
	readonly array: unknown[];
};

expectAssignable<UnknownArray>(foo);
expectAssignable<UnknownArray>(bar.array);
expectAssignable<UnknownArray>([]);
expectAssignable<UnknownArray>(['foo']);

expectNotAssignable<UnknownArray>(null);
expectNotAssignable<UnknownArray>(undefined);
expectNotAssignable<UnknownArray>({});
expectNotAssignable<UnknownArray>({0: 1});
expectNotAssignable<UnknownArray>(1);
expectNotAssignable<UnknownArray>(Date);

type IsArray<T> = T extends UnknownArray ? true : false;

declare const string: IsArray<string>;
expectType<false>(string);
declare const array: IsArray<[]>;
expectType<true>(array);
declare const tuple: IsArray<['foo']>;
expectType<true>(tuple);
declare const readonlyArray: IsArray<readonly number[]>;
expectType<true>(readonlyArray);
declare const leadingSpread: IsArray<readonly [number, ...string[]]>;
expectType<true>(leadingSpread);
declare const trailingSpread: IsArray<readonly [...string[], number]>;
expectType<true>(trailingSpread);
