import {expectType} from 'tsd';
import {ConditionalPick, Primitive} from '..';

class Awesome {
	name!: string;
	successes!: number;
	failures!: bigint;

	run(): void {
		// Empty
	}
}

interface Example {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
}

declare const exampleConditionalPick: ConditionalPick<Example, string>;
expectType< {a: string}>(exampleConditionalPick);

declare const awesomeConditionalPick: ConditionalPick<Awesome, Primitive>;
expectType<{name: string; successes: number; failures: bigint}>(awesomeConditionalPick);

declare const exampleConditionalPickWithUndefined: ConditionalPick<Example, string | undefined>;
expectType<{a: string; c?: string}>(exampleConditionalPickWithUndefined);
