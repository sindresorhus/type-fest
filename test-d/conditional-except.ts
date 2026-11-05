import {expectTypeOf} from 'nz';
import type {ConditionalExcept, ConditionalKeysOptions, IsEqual, Primitive} from '../index.d.ts';

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

// `strict: false` excludes a key when any member of its value union matches
expectTypeOf<ConditionalExcept<{date?: Date; name: string}, Date, {strict: false}>>().toBe<{name: string}>();
expectTypeOf<ConditionalExcept<{date?: Date; name: string}, Date>>().toBe<{date?: Date; name: string}>();
expectTypeOf<ConditionalExcept<{a: string; b: string | number; c?: string; d: boolean}, string, {strict: false}>>()
	.toBe<{d: boolean}>();
expectTypeOf<ConditionalExcept<{a: Date | string | undefined; b: number}, Date, {strict: false}>>()
	.toBe<{b: number}>();
expectTypeOf<ConditionalExcept<{[x: string]: unknown; a: string | number; b: boolean}, string, {strict: false}>>()
	.toBe<{[x: string]: unknown; b: boolean}>();

// Loose mode keeps the existing `any`/`unknown`/`never` behavior for each value
expectTypeOf<ConditionalExcept<{a: any; b: unknown; c: never; d: string}, string, {strict: false}>>()
	.toBe<{b: unknown; c: never}>();
expectTypeOf<ConditionalExcept<{a: never; b: string}, never, {strict: false}>>()
	.toBe<{a: never; b: string}>();

// The default and explicit strict options keep the whole-value rule
expectTypeOf<ConditionalExcept<{a: string; b: string | number}, string, {strict: true}>>().toBe<{b: string | number}>();
expectTypeOf<ConditionalExcept<{a: string; b: string | number}, string, {}>>().toBe<{b: string | number}>();
expectTypeOf<ConditionalExcept<{a: string; b: string | number}, string, {strict: boolean}>>().toBe<{b: string | number}>();
expectTypeOf<ConditionalExcept<{[x: string]: unknown; a: string | number; b: boolean}, string, {strict: true}>>()
	.toBe<{[x: string]: unknown; a: string | number; b: boolean}>();

// Loose mode excludes a key when any member of its value union matches
expectTypeOf<ConditionalExcept<{a?: string; b: string}, undefined, {strict: false}>>().toBe<{b: string}>();
expectTypeOf<ConditionalExcept<{a?: Date | null; b: string}, Date, {strict: false}>>().toBe<{b: string}>();
expectTypeOf<ConditionalExcept<{a: never}, string, {strict: false}>>().toBe<{a: never}>();

// Loose mode distributes over top-level unions like the strict default
expectTypeOf<IsEqual<ConditionalExcept<{a: string} | {b: string | number}, string, {strict: false}>, {}>>().toBe<true>();
expectTypeOf<IsEqual<ConditionalExcept<{a: string} | {b: number}, string, {strict: false}>, {} | {b: number}>>().toBe<true>();

// Loose mode reuses the index-signature normalization
expectTypeOf<ConditionalExcept<{[x: string]: string | number; a: string; b: number}, string, {strict: false}>>()
	.toBe<{b: number}>();
expectTypeOf<ConditionalExcept<[string, number, string | boolean], string, {strict: false}>[1]>().toBe<number>();

// Primitives and `any` keep their existing behavior
expectTypeOf<ConditionalExcept<string, number, {strict: false}>>().toBe<string>();
expectTypeOf<ConditionalExcept<any, string, {strict: false}>>().toBe<{}>();

function _readGenericConditionalExcept<Options extends ConditionalKeysOptions>(value: ConditionalExcept<{a: string; b: string | number}, string, Options>): string | number {
	// @ts-expect-error A generic option reads as the default strict mode, so `a` is excluded.
	expectTypeOf(value.a).toBe<never>();
	return value.b;
}

// Distributes over union types, so each member keeps only the keys that do not match the condition, the way `ConditionalPick` distributes. `IsEqual` forces the lazy result to resolve, which `expectType` alone does not.
expectTypeOf<IsEqual<ConditionalExcept<{a: string} | {b: number}, string>, {} | {b: number}>>().toBe<true>();
expectTypeOf<IsEqual<ConditionalExcept<{a: number} | {b: boolean}, string>, {a: number} | {b: boolean}>>().toBe<true>();
expectTypeOf<IsEqual<ConditionalExcept<{aValue: string; keep: 1} | {bValue: string; keep: 2}, string>, {keep: 1} | {keep: 2}>>().toBe<true>();

// Declared keys are still excluded when a non-matching index signature widens `keyof` (https://github.com/sindresorhus/type-fest/issues/1501)
declare const indexSignatureConditionalExcept: ConditionalExcept<{[x: string]: unknown; a: string; b: number}, string>;
expectTypeOf(indexSignatureConditionalExcept).toBe<{[x: string]: unknown; b: number}>();

// Removing a matching index signature must preserve declared fields that do not match.
type IndexedRetryOptions = {[key: string]: any; readonly retries: number; label: string};
expectTypeOf<ConditionalExcept<IndexedRetryOptions, string>>().toBe<{readonly retries: number}>();
declare const filteredRetryOptions: ConditionalExcept<IndexedRetryOptions, string>;
expectTypeOf(filteredRetryOptions.retries).toBe<number>();
expectTypeOf<{retries: 'bad'}>().not.toBeAssignableTo<ConditionalExcept<IndexedRetryOptions, string>>();
expectTypeOf<ConditionalExcept<{[key: number]: any; readonly 0: string; 1: number}, number>>().toBe<{readonly 0: string}>();
expectTypeOf<ConditionalExcept<{[key: `flag${string}`]: any; readonly flagCount: number; flagName: string}, string>>().toBe<{readonly flagCount: number}>();

// Retained named fields keep their required, readonly, and optional modifiers.
expectTypeOf<{}>().not.toBeAssignableTo<ConditionalExcept<IndexedRetryOptions, string>>();
// @ts-expect-error A retained readonly field rejects an otherwise valid numeric value.
filteredRetryOptions.retries = 3;
type OptionalIndexedOptions = {[key: string]: any; readonly count?: number; explicit?: boolean | undefined; label: string};
expectTypeOf<ConditionalExcept<OptionalIndexedOptions, string>>().toBe<{readonly count?: number; explicit?: boolean | undefined}>();
expectTypeOf<{explicit: undefined}>().toBeAssignableTo<ConditionalExcept<OptionalIndexedOptions, string>>();
expectTypeOf<{count: undefined}>().not.toBeAssignableTo<ConditionalExcept<OptionalIndexedOptions, string>>();

declare const retryKey: unique symbol;
expectTypeOf<ConditionalExcept<{[key: symbol]: any; readonly [retryKey]: number}, string>>().toBe<{readonly [retryKey]: number}>();

enum CountKey {
	First,
}

// A matching declared enum key does not make its nonmatching numeric index signature disappear.
expectTypeOf<ConditionalExcept<{[key: number]: unknown; readonly [CountKey.First]: string; keep: number}, string>>()
	.toBe<{[key: number]: unknown; keep: number}>();

// The same filtering rule applies independently to discriminated union members.
type IndexedResponses = {[key: string]: any; kind: 'success'; value: number} | {[key: string]: any; kind: 'failure'; reason: string};
expectTypeOf<ConditionalExcept<IndexedResponses, number>>().toBe<{kind: 'success'} | {kind: 'failure'; reason: string}>();
expectTypeOf<{kind: 'failure'; reason: 1}>().not.toBeAssignableTo<ConditionalExcept<IndexedResponses, number>>();

// No-match identity retains call signatures; matching array keys exclude elements, not array methods.
type CallbackWithCount = ((value: string) => number) & {readonly count: number};
expectTypeOf<ConditionalExcept<CallbackWithCount, boolean>>().toBe<CallbackWithCount>();
expectTypeOf<ConditionalExcept<readonly [string, number], string>[1]>().toBe<number>();
expectTypeOf<ConditionalExcept<[string, number], string>['length']>().toBe<2>();
expectTypeOf<ConditionalExcept<string, boolean>>().toBe<string>();
expectTypeOf<ConditionalExcept<never, string>>().toBe<never>();
expectTypeOf<ConditionalExcept<unknown, string>>().toBe<unknown>();
expectTypeOf<ConditionalExcept<any, string>>().toBe<{}>();
expectTypeOf<ConditionalExcept<{value: never; keep: unknown}, never>>().toBe<{keep: unknown}>();

function filteredPayload<Value>(data: Value): ConditionalExcept<{label: string; payload: {data: Value}}, string> {
	return {payload: {data}};
}

function _readFilteredPayload<Value>(value: ConditionalExcept<{label: string; payload: {data: Value}}, string>): Value {
	return value.payload.data;
}

expectTypeOf(filteredPayload({id: 1} as const).payload.data).toBe<{readonly id: 1}>();
// @ts-expect-error A matching string field is no longer part of the filtered API result.
expectTypeOf(filteredPayload(1).label).toBe<string>();
