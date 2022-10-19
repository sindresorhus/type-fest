import {expectTypeOf} from 'expect-type';
import type {Except} from '../index';

declare const except: Except<{a: number; b: string}, 'b'>;
expectTypeOf(except).toEqualTypeOf<{a: number}>();

// Generic properties
type Example = {
	[key: string]: unknown;
	foo: number;
	bar: string;
};

const test: Except<Example, 'bar'> = {foo: 123, bar: 'asdf'};
expectTypeOf(test.foo).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/dot-notation
expectTypeOf(test['bar']).toEqualTypeOf<unknown>();
