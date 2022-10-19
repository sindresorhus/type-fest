import {expectTypeOf} from 'expect-type';
import type {ConditionalPick, Primitive} from '../index';

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

declare const exampleConditionalPick: ConditionalPick<Example, string>;
expectTypeOf(exampleConditionalPick).toEqualTypeOf< {a: string}>();

declare const awesomeConditionalPick: ConditionalPick<Awesome, Primitive>;
expectTypeOf(awesomeConditionalPick).toEqualTypeOf<{name: string; successes: number; failures: bigint}>();

declare const exampleConditionalPickWithUndefined: ConditionalPick<Example, string | undefined>;
expectTypeOf(exampleConditionalPickWithUndefined).toEqualTypeOf<{a: string; c?: string}>();
