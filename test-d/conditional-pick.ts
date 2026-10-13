import {expectTypeOf} from 'nz';
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
expectTypeOf(exampleConditionalPick).toBe<{a: string}>();

declare const awesomeConditionalPick: ConditionalPick<Awesome, Primitive>;
expectTypeOf(awesomeConditionalPick).toBe<{name: string; successes: number; failures: bigint}>();

declare const exampleConditionalPickWithUndefined: ConditionalPick<Example, string | undefined>;
expectTypeOf(exampleConditionalPickWithUndefined).toBe<{a: string; c?: string}>();

// Returns `never` when no keys match the condition
declare const noMatchingKeys: ConditionalPick<Example, number>;
expectTypeOf(noMatchingKeys).toBe<never>();

declare const noMatchingKeys2: ConditionalPick<{a: string; b: number}, boolean>;
expectTypeOf(noMatchingKeys2).toBe<never>();

// Distributes over union types, so each member contributes the keys that match the condition
type ExampleUnion =
	| {kind: 'a'; aValue: string; shared: number}
	| {kind: 'b'; bValue: string; shared: number};

declare const unionConditionalPick: ConditionalPick<ExampleUnion, string>;
expectTypeOf(unionConditionalPick).toBe<{kind: 'a'; aValue: string} | {kind: 'b'; bValue: string}>();

// A member with no matching keys becomes `{}` rather than being dropped, like `ConditionalExcept` does for a member it empties. The result is only `never` when no member has a matching key.
declare const unionConditionalPickWithNoMatchInOneMember: ConditionalPick<{a: string} | {b: number}, string>;
expectTypeOf(unionConditionalPickWithNoMatchInOneMember).toBe<{a: string} | {}>();

declare const unionConditionalPickWithNoMatchInAnyMember: ConditionalPick<{a: string} | {b: number}, boolean>;
expectTypeOf(unionConditionalPickWithNoMatchInAnyMember).toBe<never>();

// A member that is not an object, like `undefined`, has no keys to pick, so it is dropped rather than becoming `{}`.
declare const nullableConditionalPick: ConditionalPick<{a: string; b: number} | undefined, string>;
expectTypeOf(nullableConditionalPick).toBe<{a: string}>();

// Declared keys are still picked when a non-matching index signature widens `keyof` (https://github.com/sindresorhus/type-fest/issues/1501)
declare const indexSignatureConditionalPick: ConditionalPick<{[x: string]: unknown; a: string; b: number}, string>;
expectTypeOf(indexSignatureConditionalPick).toBe<{a: string}>();
