import {expectType} from 'tsd';
import type {Except} from '../index.d.ts';

declare const except: Except<{a: number; b: string}, 'b'>;
expectType<{a: number}>(except);
// @ts-expect-error
const _a: unknown = except.b;

const nonStrict = {
	a: 1,
	b: '2',
};

const nonStrictAssignment: typeof except = nonStrict; // No error

declare const strictExcept: Except<{a: number; b: string}, 'b', {requireExactProps: true}>;

// @ts-expect-error
const strictAssignment: typeof strictExcept = nonStrict;

// Generic properties
type Example = {
	[key: string]: unknown;
	foo: number;
	bar: string;
};

const test: Except<Example, 'bar', {requireExactProps: false}> = {foo: 123, bar: 'asdf'};
expectType<number>(test.foo);
expectType<unknown>(test['bar']);
