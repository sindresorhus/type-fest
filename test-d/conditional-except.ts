import {expectTypeOf} from 'nz';
import type {ConditionalExcept, Primitive, IsEqual} from '../index.d.ts';

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
expectTypeOf(exampleConditionalExcept).toBe<{b?: string | number; c?: string; d: Record<string, unknown>}>();

declare const awesomeConditionalExcept: ConditionalExcept<Awesome, Primitive>;
expectTypeOf(awesomeConditionalExcept).toBe<{run: () => void}>();

declare const exampleConditionalExceptWithUndefined: ConditionalExcept<Example, string | undefined>;
expectTypeOf(exampleConditionalExceptWithUndefined).toBe<{b?: string | number; d: Record<string, unknown>}>();

// Distributes over union types, so each member keeps only the keys that do not match the condition, the way `ConditionalPick` distributes. `IsEqual` forces the lazy result to resolve, which `expectType` alone does not.
expectTypeOf<IsEqual<ConditionalExcept<{a: string} | {b: number}, string>, {} | {b: number}>>().toBe<true>();
expectTypeOf<IsEqual<ConditionalExcept<{a: number} | {b: boolean}, string>, {a: number} | {b: boolean}>>().toBe<true>();
expectTypeOf<IsEqual<ConditionalExcept<{aValue: string; keep: 1} | {bValue: string; keep: 2}, string>, {keep: 1} | {keep: 2}>>().toBe<true>();

// Declared keys are still excluded when a non-matching index signature widens `keyof` (https://github.com/sindresorhus/type-fest/issues/1501)
declare const indexSignatureConditionalExcept: ConditionalExcept<{[x: string]: unknown; a: string; b: number}, string>;
expectTypeOf(indexSignatureConditionalExcept).toBe<{[x: string]: unknown; b: number}>();
