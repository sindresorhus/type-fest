import {expectType, expectError} from 'tsd';
import type {Except} from '../index';

declare const except: Except<{a: number; b: string}, 'b'>;
expectType<{a: number}>(except);
expectError(except.b);

const nonStrict = {
	a: 1,
	b: '2',
};

const nonStrictAssignment: typeof except = nonStrict; // No error

declare const strictExcept: Except<{a: number; b: string}, 'b', {requireExactProps: true}>;

expectError(() => {
	const strictAssignment: typeof strictExcept = nonStrict;
});

// Generic properties
type Example = {
	[key: string]: unknown;
	foo: number;
	bar: string;
};

const test: Except<Example, 'bar', {requireExactProps: false}> = {foo: 123, bar: 'asdf'};
expectType<number>(test.foo);
// eslint-disable-next-line @typescript-eslint/dot-notation
expectType<unknown>(test['bar']);
