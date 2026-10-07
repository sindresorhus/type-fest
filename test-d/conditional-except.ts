import {expectType} from 'tsd';
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
expectType<{b?: string | number; c?: string; d: Record<string, unknown>}>(exampleConditionalExcept);

declare const awesomeConditionalExcept: ConditionalExcept<Awesome, Primitive>;
expectType<{run: () => void}>(awesomeConditionalExcept);

declare const exampleConditionalExceptWithUndefined: ConditionalExcept<Example, string | undefined>;
expectType<{b?: string | number; d: Record<string, unknown>}>(exampleConditionalExceptWithUndefined);

// Distributes over union types, so each member keeps only the keys that do not match the condition, the way `ConditionalPick` distributes. `IsEqual` forces the lazy result to resolve, which `expectType` alone does not.
expectType<true>({} as IsEqual<ConditionalExcept<{a: string} | {b: number}, string>, {} | {b: number}>);
expectType<true>({} as IsEqual<ConditionalExcept<{a: number} | {b: boolean}, string>, {a: number} | {b: boolean}>);
expectType<true>({} as IsEqual<ConditionalExcept<{aValue: string; keep: 1} | {bValue: string; keep: 2}, string>, {keep: 1} | {keep: 2}>);
