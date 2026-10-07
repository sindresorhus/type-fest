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

// Distributes over union types, so each member contributes the keys that match the condition
type ExampleUnion =
	| {kind: 'a'; aValue: string; shared: number}
	| {kind: 'b'; bValue: string; shared: number};

declare const unionConditionalPick: ConditionalPick<ExampleUnion, string>;
expectType<{kind: 'a'; aValue: string} | {kind: 'b'; bValue: string}>(unionConditionalPick);

// A member with no matching keys becomes `{}` rather than being dropped, like `ConditionalExcept` does for a member it empties. The result is only `never` when no member has a matching key.
declare const unionConditionalPickWithNoMatchInOneMember: ConditionalPick<{a: string} | {b: number}, string>;
expectType<{a: string} | {}>(unionConditionalPickWithNoMatchInOneMember);

declare const unionConditionalPickWithNoMatchInAnyMember: ConditionalPick<{a: string} | {b: number}, boolean>;
expectType<never>(unionConditionalPickWithNoMatchInAnyMember);

// A member that is not an object, like `undefined`, has no keys to pick, so it is dropped rather than becoming `{}`.
declare const nullableConditionalPick: ConditionalPick<{a: string; b: number} | undefined, string>;
expectType<{a: string}>(nullableConditionalPick);
