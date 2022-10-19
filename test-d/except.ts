import {expectType} from 'tsd';
import type {Except} from '../index';

declare const except: Except<{a: number; b: string}, 'b'>;
expectType<{a: number}>(except);

// Generic properties
type Example = {
	[key: string]: unknown;
	foo: number;
	bar: string;
};

const test: Except<Example, 'bar'> = {foo: 123, bar: 'asdf'};
expectType<number>(test.foo);
// eslint-disable-next-line @typescript-eslint/dot-notation
expectType<unknown>(test['bar']);
