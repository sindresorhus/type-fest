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

// NoInfer: Condition should not be inferred from usage
// When using ConditionalPick, Condition should be used as filter parameter
// NoInfer prevents Condition from driving backward inference
type ConditionalPickNoInfer = ConditionalPick<{a: string; b: number}, string>;
declare const conditionalPickNoInfer: ConditionalPickNoInfer;
expectType<{a: string}>(conditionalPickNoInfer);

// Verify Condition works correctly - picks properties whose value type extends Condition
type ConditionalPickString = ConditionalPick<{a: string; b: number; c: boolean}, string>;
declare const picksStrings: ConditionalPickString;
expectType<{a: string}>(picksStrings);

type ConditionalPickNumber = ConditionalPick<{a: string; b: number; c: boolean}, number>;
declare const picksNumbers: ConditionalPickNumber;
expectType<{b: number}>(picksNumbers);

type ConditionalPickBoolean = ConditionalPick<{a: string; b: number; c: boolean}, boolean>;
declare const picksBooleans: ConditionalPickBoolean;
expectType<{c: boolean}>(picksBooleans);
