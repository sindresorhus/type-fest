import {expectTypeOf} from 'expect-type';
import type {ConditionalExcept, Primitive} from '../index';

class Awesome {
	name!: string;
	successes!: number;
	failures!: bigint;

	run(): void {
		// Empty
	}
}

type Example = {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
};

declare const exampleConditionalExcept: ConditionalExcept<Example, string>;
expectTypeOf(exampleConditionalExcept).toEqualTypeOf<{b?: string | number; c?: string; d: Record<string, unknown>}>();

declare const awesomeConditionalExcept: ConditionalExcept<Awesome, Primitive>;
expectTypeOf(awesomeConditionalExcept).toEqualTypeOf<{run: () => void}>();

declare const exampleConditionalExceptWithUndefined: ConditionalExcept<Example, string | undefined>;
expectTypeOf(exampleConditionalExceptWithUndefined).toEqualTypeOf<{b?: string | number; d: Record<string, unknown>}>();
