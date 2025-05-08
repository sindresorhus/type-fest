import {expectType} from 'tsd';
import type {ConditionalExcept, Primitive} from '../index.d.ts';

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
expectType<{b?: string | number; c?: string; d: Record<string, unknown>}>(exampleConditionalExcept);

declare const awesomeConditionalExcept: ConditionalExcept<Awesome, Primitive>;
expectType<{run: () => void}>(awesomeConditionalExcept);

declare const exampleConditionalExceptWithUndefined: ConditionalExcept<Example, string | undefined>;
expectType<{b?: string | number; d: Record<string, unknown>}>(exampleConditionalExceptWithUndefined);
