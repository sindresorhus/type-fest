import {expectType} from 'tsd';
import type {ConditionalPick, Primitive} from '../index.d.ts';

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
expectType< {a: string}>(exampleConditionalPick);

declare const awesomeConditionalPick: ConditionalPick<Awesome, Primitive>;
expectType<{name: string; successes: number; failures: bigint}>(awesomeConditionalPick);

declare const exampleConditionalPickWithUndefined: ConditionalPick<Example, string | undefined>;
expectType<{a: string; c?: string}>(exampleConditionalPickWithUndefined);
