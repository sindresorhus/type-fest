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
expectType<{a: string}>(exampleConditionalPick);

declare const awesomeConditionalPick: ConditionalPick<Awesome, Primitive>;
expectType<{name: string; successes: number; failures: bigint}>(awesomeConditionalPick);

declare const exampleConditionalPickWithUndefined: ConditionalPick<Example, string | undefined>;
expectType<{a: string; c?: string}>(exampleConditionalPickWithUndefined);

// Returns `never` when no keys match the condition
declare const noMatchingKeys: ConditionalPick<Example, number>;
expectType<never>(noMatchingKeys);

declare const noMatchingKeys2: ConditionalPick<{a: string; b: number}, boolean>;
expectType<never>(noMatchingKeys2);

// Declared keys are still picked when a non-matching index signature widens `keyof` (https://github.com/sindresorhus/type-fest/issues/1501)
declare const indexSignaturePick: ConditionalPick<{[x: string]: unknown; a: string; b: number}, string>;
expectType<{a: string}>(indexSignaturePick);
