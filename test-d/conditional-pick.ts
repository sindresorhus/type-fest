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

// A matching index signature must retain the required declared fields and their narrower types.
type IndexedUnknownPick = ConditionalPick<{[key: string]: unknown; readonly id: string; note?: string}, unknown>;
({id: 'request'}) satisfies IndexedUnknownPick;
({id: 'request', note: 'memo', dynamic: 1}) satisfies IndexedUnknownPick;
expectTypeOf<{}>().not.toBeAssignableTo<IndexedUnknownPick>();
expectTypeOf<{id: number}>().not.toBeAssignableTo<IndexedUnknownPick>();
declare const indexedUnknownPick: IndexedUnknownPick;
expectTypeOf(indexedUnknownPick.id).toBe<string>();
expectTypeOf(indexedUnknownPick.note).toBe<string | undefined>();

// Named fields keep their modifiers, and JSON-like dynamic entries remain unknown.
expectTypeOf(indexedUnknownPick['dynamic']).toBe<unknown>();
// @ts-expect-error A valid string still cannot replace the retained readonly field.
indexedUnknownPick.id = 'changed';
expectTypeOf<{id: string; note: undefined}>().not.toBeAssignableTo<IndexedUnknownPick>();

// Match declared values separately when a permissive signature also matches the condition.
declare const pickedFromAnyIndex: ConditionalPick<{[key: string]: any; name: string; count: number}, string>;
expectTypeOf(pickedFromAnyIndex.name).toBe<string>();
expectTypeOf(pickedFromAnyIndex['count']).toBe<any>();

// Numeric, pattern and symbol signatures preserve the narrower declared members they cover.
declare const pickedNumericIndex: ConditionalPick<{[key: number]: unknown; readonly 0: string; 1?: number}, unknown>;
expectTypeOf(pickedNumericIndex[0]).toBe<string>();
expectTypeOf(pickedNumericIndex[1]).toBe<number | undefined>();
declare const pickedPatternIndex: ConditionalPick<{[key: `data-${string}`]: unknown; readonly 'data-id': string; 'data-note'?: string}, unknown>;
expectTypeOf(pickedPatternIndex['data-id']).toBe<string>();
expectTypeOf(pickedPatternIndex['data-note']).toBe<string | undefined>();
declare const retainedSymbol: unique symbol;
declare const pickedSymbolIndex: ConditionalPick<{[key: symbol]: unknown; readonly [retainedSymbol]: string}, unknown>;
expectTypeOf(pickedSymbolIndex[retainedSymbol]).toBe<string>();

// Array selection remains an object of matching indices, without array methods.
expectTypeOf<ConditionalPick<readonly [string, number?], string>>().toBe<{readonly 0: string}>();
expectTypeOf<ConditionalPick<[string, number?, ...boolean[]], number | undefined>>().toBe<{1?: number}>();
expectTypeOf<ConditionalPick<string[], string>>().toBe<{[index: number]: string}>();
expectTypeOf<ConditionalPick<readonly boolean[], boolean>>().toBe<{readonly [index: number]: boolean}>();
expectTypeOf<ConditionalPick<[string, ...number[]], unknown>>().toBe<{[index: number]: string | number; 0: string}>();
expectTypeOf<'map'>().not.toBeAssignableTo<keyof ConditionalPick<string[], string>>();

// Primitive inputs retain the property object selected by Pick.
expectTypeOf<ConditionalPick<string, number>>().toBe<Pick<string, 'length'>>();
expectTypeOf<ConditionalPick<number, () => number>>().toBe<Pick<number, 'valueOf'>>();
expectTypeOf<ConditionalPick<any, string>>().toBe<Pick<any, PropertyKey>>();
expectTypeOf<ConditionalPick<never, unknown>>().toBe<never>();
expectTypeOf<ConditionalPick<unknown, unknown>>().toBe<never>();
expectTypeOf<ConditionalPick<{value: never; other: string}, never>>().toBe<{value: never}>();

function _readPickedId<Base extends {id: string}>(value: ConditionalPick<Base, unknown>): string {
	return value.id;
}

function _keepPickedObject<Condition>(value: ConditionalPick<{id: string; count: number}, Condition>): object {
	return value;
}

declare function pickStringFields<const Input>(input: Input): ConditionalPick<Input, string>;
const inferredStringFields = pickStringFields({id: 'request', count: 1});
expectTypeOf(inferredStringFields).toBe<{readonly id: 'request'}>();
declare function needsCount(value: {count: unknown}): void;
// @ts-expect-error A nonmatching declared field is absent from the inferred result.
needsCount(inferredStringFields);
