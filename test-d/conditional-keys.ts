import {expectTypeOf} from 'nz';
import type {ConditionalExcept, ConditionalKeys, ConditionalKeysOptions, ConditionalPick} from '../index.d.ts';

type Example = {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
	e: never;
};

declare const exampleConditionalKeys: ConditionalKeys<Example, string>;
expectTypeOf(exampleConditionalKeys).toBe<'a'>();

declare const exampleConditionalKeysWithUndefined: ConditionalKeys<Example, string | undefined>;
expectTypeOf(exampleConditionalKeysWithUndefined).toBe<'a' | 'c'>();

declare const exampleConditionalKeysTargetingNever: ConditionalKeys<Example, never>;
expectTypeOf(exampleConditionalKeysTargetingNever).toBe<'e'>();

// Readonly modifiers
expectTypeOf<ConditionalKeys<{readonly a: string; readonly b: number; c: Uppercase<string>}, string>>().toBe<'a' | 'c'>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b: number}, string>>().toBe<never>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b?: number}, string | undefined>>().toBe<'a'>();

// Optional modifiers
expectTypeOf<ConditionalKeys<{a?: string; b: string}, string>>().toBe<'b'>();
expectTypeOf<ConditionalKeys<{a?: string; b?: string}, string>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a?: string; b: string}, undefined>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a?: string; b: string}, string | undefined>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b: string}, string | undefined>>().toBe<'a' | 'b'>();

// Union in property values
expectTypeOf<ConditionalKeys<{a: boolean | number}, boolean>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: boolean | number; b: boolean; c: number}, boolean | number>>().toBe<'a' | 'b' | 'c'>();
expectTypeOf<ConditionalKeys<{a?: boolean | number; readonly b: boolean | number}, boolean | number>>().toBe<'b'>();
expectTypeOf<ConditionalKeys<{a?: boolean | number; readonly b?: boolean; c: bigint | number}, boolean | number | undefined>>().toBe<'a' | 'b'>();

// `never` as condition
expectTypeOf<ConditionalKeys<{a: string; b: number}, never>>().toBe<never>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b?: number}, never>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: never; b: never}, never>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{a: never; b: never}, any>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{a?: never; b?: never}, never>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a?: never; b?: never}, undefined>>().toBe<'a' | 'b'>();

// Unions
expectTypeOf<ConditionalKeys<{a: string} | {b: number}, string | number>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {b: number}, string>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {b: number}, number>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {a: number}, number>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {a: number}, string | number>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a: string; b: bigint} | {a: number; b: string; c: boolean}, string | number | bigint>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{a: string} | {a: Lowercase<string>; b: Uppercase<string>}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<[number] | {length: number}, number>>().toBe<never>();

// `any`/`unknown` as condition
expectTypeOf<ConditionalKeys<{a?: string; b: string | number; readonly c: boolean; readonly d?: bigint; e: never}, any>>().toBe<'a' | 'b' | 'c' | 'd' | 'e'>();
expectTypeOf<ConditionalKeys<{a?: string; b: string | number; readonly c: boolean; readonly d?: bigint; e: never}, unknown>>().toBe<'a' | 'b' | 'c' | 'd' | 'e'>();

// Index signatures
expectTypeOf<ConditionalKeys<{[x: string]: boolean}, boolean>>().toBe<string | number>();
expectTypeOf<ConditionalKeys<{[x: string]: string; a: string}, string>>().toBe<string | number>();
expectTypeOf<ConditionalKeys<{[x: Uppercase<string>]: string; a: string}, string>>().toBe<Uppercase<string> | 'a'>();
expectTypeOf<ConditionalKeys<{[x: Uppercase<string>]: string; [x: number]: number; a: number}, number>>().toBe<number | 'a'>();

// Declared keys are still matched when a non-matching index signature widens `keyof` (https://github.com/sindresorhus/type-fest/issues/1501)
expectTypeOf<ConditionalKeys<{[x: string]: unknown; a: string; b: number}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: string]: unknown; a: string; b: number}, number>>().toBe<'b'>();
expectTypeOf<ConditionalKeys<{[x: string]: string | number; a: string; b: number}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: number]: unknown; [x: string]: unknown; a: string; b: number}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: symbol]: unknown; a: string}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: string]: unknown; a?: string}, string | undefined>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: string]: unknown; a: string}, boolean>>().toBe<never>();
expectTypeOf<ConditionalKeys<{[x: `data-${string}`]: unknown; 'data-known': string}, string>>().toBe<'data-known'>();
expectTypeOf<ConditionalKeys<{[x: Uppercase<string>]: unknown; a: string}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: Uppercase<string>]: unknown; A: string; a: string}, string>>().toBe<'A' | 'a'>();
expectTypeOf<ConditionalKeys<{[x: string]: unknown} & {a: string; b: number}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: string]: unknown; a: string; b: number} | {[x: string]: unknown; a: string; c: string}, string>>().toBe<'a'>();
// A pattern index signature that matches still contributes, and subsumes the literal keys it covers
expectTypeOf<ConditionalKeys<{[x: `data-${string}`]: string; 'data-known': string}, string>>().toBe<`data-${string}`>();

// Arrays and tuples
expectTypeOf<ConditionalKeys<[string, number, string], string>>().toBe<'0' | '2'>();
expectTypeOf<ConditionalKeys<[string, string, string | number], string>>().toBe<'0' | '1'>();
expectTypeOf<ConditionalKeys<[string, number, string], any>>().toBe<'0' | '1' | '2'>();
expectTypeOf<ConditionalKeys<[string, string?, string?], string>>().toBe<'0'>();
expectTypeOf<ConditionalKeys<[string, string?, string?], string | undefined>>().toBe<'0' | '1' | '2'>();
expectTypeOf<ConditionalKeys<[string, number, ...boolean[]], boolean>>().toBe<never>();
expectTypeOf<ConditionalKeys<[string, number?, ...boolean[]], string | number | boolean>>().toBe<'0'>();
expectTypeOf<ConditionalKeys<[string?, number?, ...boolean[]], number | undefined>>().toBe<'1'>();
expectTypeOf<ConditionalKeys<[string, number, ...boolean[]], string | number | boolean>>().toBe<'0' | '1' | number>();
expectTypeOf<ConditionalKeys<[bigint, ...number[], bigint], bigint>>().toBe<'0'>();
expectTypeOf<ConditionalKeys<[...boolean[], string, string], string>>().toBe<never>();
expectTypeOf<ConditionalKeys<[...string[], string, string], string>>().toBe<number>();
expectTypeOf<ConditionalKeys<string[], string>>().toBe<number>();
expectTypeOf<ConditionalKeys<string[], number>>().toBe<never>();

// Primitives
expectTypeOf<ConditionalKeys<string, number>>().toBe<'length'>();
expectTypeOf<ConditionalKeys<number, () => number>>().toBe<'valueOf'>();

// Boundary cases
expectTypeOf<ConditionalKeys<{}, boolean>>().toBe<never>();
expectTypeOf<ConditionalKeys<any, boolean>>().toBe<PropertyKey>();
expectTypeOf<ConditionalKeys<never, boolean>>().toBe<never>();

// `strict: false` matches any member of a union value type
expectTypeOf<ConditionalKeys<{date?: Date}, Date, {strict: false}>>().toBe<'date'>();
expectTypeOf<ConditionalKeys<{a: string; b: string | number; c?: string}, string, {strict: false}>>().toBe<'a' | 'b' | 'c'>();
expectTypeOf<ConditionalKeys<{a: Date | string | undefined}, Date, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a: boolean | number}, boolean, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a?: string; b: string}, undefined, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a?: string; b: number}, string, {strict: false}>>().toBe<'a'>();

// The default is still strict
expectTypeOf<ConditionalKeys<{date?: Date}, Date>>().toBe<never>();
expectTypeOf<ConditionalKeys<{date?: Date}, Date, {}>>().toBe<never>();
expectTypeOf<ConditionalKeys<{date?: Date}, Date, {strict: true}>>().toBe<never>();
expectTypeOf<ConditionalKeys<{date?: Date}, Date, {strict: boolean}>>().toBe<never>();

// Loose mode keeps the existing `any`/`unknown`/`never` behavior, except that `never` has no members
expectTypeOf<ConditionalKeys<{a: any; b: unknown; c: never; d: string}, string, {strict: false}>>().toBe<'a' | 'd'>();
expectTypeOf<ConditionalKeys<{a: never; b: never}, never, {strict: false}>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: never; b: never}, any, {strict: false}>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: unknown; b: string}, string, {strict: false}>>().toBe<'b'>();

// Index signatures and arrays keep their existing normalization
expectTypeOf<ConditionalKeys<{[x: string]: unknown; a: string; b: number}, string, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{[x: string]: string | number; a: string}, string, {strict: false}>>().toBe<string | number>();
expectTypeOf<ConditionalKeys<[string, number, string | boolean], string, {strict: false}>>().toBe<'0' | '2'>();
// A rest element makes the numeric index signature match when any element type does.
expectTypeOf<ConditionalKeys<[string, number, ...boolean[]], boolean, {strict: false}>>().toBe<number>();

// Top-level unions and primitives are unchanged
expectTypeOf<ConditionalKeys<{a: string} | {b: string}, string, {strict: false}>>().toBe<never>();
expectTypeOf<ConditionalKeys<string, number, {strict: false}>>().toBe<'length'>();
expectTypeOf<ConditionalKeys<any, boolean, {strict: false}>>().toBe<PropertyKey>();
expectTypeOf<ConditionalKeys<never, boolean, {strict: false}>>().toBe<never>();

// Loose mode matches a union member even when the other members do not
expectTypeOf<ConditionalKeys<{a: string | null}, string, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a: Date | null}, Date, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a?: Date | null}, Date, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a: boolean | undefined}, undefined, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{readonly a?: Date}, Date, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a: number | boolean}, string, {strict: false}>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: never}, string, {strict: false}>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: unknown}, unknown, {strict: false}>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a: unknown}, string, {strict: false}>>().toBe<never>();

// Loose mode reuses the array and index-signature normalization
expectTypeOf<ConditionalKeys<readonly [string, number, string | boolean], string, {strict: false}>>().toBe<'0' | '2'>();
expectTypeOf<ConditionalKeys<[string, string?, string?], string | undefined, {strict: false}>>().toBe<'0' | '1' | '2'>();
expectTypeOf<ConditionalKeys<{[x: number]: string | boolean}, string, {strict: false}>>().toBe<number>();
expectTypeOf<ConditionalKeys<{[x: string]: string | number; a: string; b: number}, string, {strict: false}>>().toBe<string | number>();

// A shared key is compared as the union of its members, like the strict default
expectTypeOf<ConditionalKeys<{a: string} | {a: string | number}, string, {strict: false}>>().toBe<'a'>();

// A generic option uses the default strict mode until it is resolved
type GenericOptionsKeys<Options extends ConditionalKeysOptions> = ConditionalKeys<{a: string; b: string | number}, string, Options>;
expectTypeOf<GenericOptionsKeys<{strict: false}>>().toBe<'a' | 'b'>();
function _readKeysWithGenericOptions<Options extends ConditionalKeysOptions>(value: {a: string; b: string | number}, key: GenericOptionsKeys<Options>): string {
	return value[key];
}

// A primitive and an object can share a key without sharing their other properties.
expectTypeOf<ConditionalKeys<string | {length: 1; name: string}, number>>().toBe<'length'>();
expectTypeOf<ConditionalKeys<unknown, unknown>>().toBe<never>();
expectTypeOf<ConditionalKeys<null | undefined, unknown>>().toBe<never>();

// Symbol signatures also retain their declared members and optional read types.
declare const declaredSymbol: unique symbol;
expectTypeOf<ConditionalKeys<{[key: symbol]: unknown; readonly [declaredSymbol]?: string; name: number}, string | undefined>>().toBe<typeof declaredSymbol>();
expectTypeOf<ConditionalKeys<{readonly name?: string; id: number} | {name: string; active: boolean}, string>>().toBe<never>();
expectTypeOf<ConditionalKeys<{readonly name?: string; id: number} | {name: string; active: boolean}, string | undefined>>().toBe<'name'>();

function _readMatchingValue<Base, Condition>(value: Base, key: ConditionalKeys<Base, Condition>): Base[ConditionalKeys<Base, Condition>] {
	return value[key];
}

function _readConstrainedMatchingKey<Base, Condition, Key extends ConditionalKeys<Base, Condition>>(value: Base, key: Key): Base[Key] {
	return value[key];
}

function _matchingKeyOfBase<Base, Condition>(key: ConditionalKeys<Base, Condition>): keyof Base {
	return key;
}

// One inferred model can supply its matching keys, picked fields and remaining fields.
declare function stringFields<const Value extends object>(value: Value): {
	keys: Array<ConditionalKeys<Value, string>>;
	matching: ConditionalPick<Value, string>;
	remaining: ConditionalExcept<Value, string>;
};
const inferredStringFields = stringFields({name: 'session', count: 3, active: true});
expectTypeOf(inferredStringFields.keys).toBe<Array<'name'>>();
expectTypeOf(inferredStringFields.matching).toBe<{readonly name: 'session'}>();
expectTypeOf(inferredStringFields.remaining).toBe<{readonly count: 3; readonly active: true}>();
// @ts-expect-error The original model's readonly fields stay readonly after selecting them.
inferredStringFields.matching.name = 'session';

// Matching enum and literal declarations keep both accepted key spellings.
enum ConditionalStringField {
	Name = 'name',
}

enum ConditionalNumericField {
	Zero = 0,
}

expectTypeOf<'name'>().toBeAssignableTo<ConditionalKeys<{[ConditionalStringField.Name]: string} & {name: string; keep: number}, string>>();
expectTypeOf<'0'>().toBeAssignableTo<ConditionalKeys<{[ConditionalNumericField.Zero]: string} & {'0': string; keep: number}, string>>();

// Shared values are compared as a union, including a member whose value is impossible.
expectTypeOf<ConditionalKeys<{name: never; left: boolean} | {name: string; right: number}, string>>().toBe<'name'>();
expectTypeOf<ConditionalKeys<{[key: string]: unknown; readonly name?: string} | {[key: string]: unknown; name: string}, string | undefined>>().toBe<'name'>();

// A numeric index is broader than its declared enum member even though number extends that member.
expectTypeOf<ConditionalKeys<{[key: number]: unknown; readonly [ConditionalNumericField.Zero]: string; keep: number}, string>>()
	.toBe<ConditionalNumericField.Zero>();

// Declared matches survive across different index domains and beside symbol or pattern signatures.
type SharedIndexedFields = {[key: string]: unknown; readonly label: string} | {[key: number]: unknown; label: string; keep: number};
expectTypeOf<ConditionalKeys<SharedIndexedFields, string>>().toBe<'label'>();
type DistinctPatternFields = {[key: `left-${string}`]: unknown; readonly label: string} | {[key: `right-${string}`]: unknown; label: string};
expectTypeOf<ConditionalKeys<DistinctPatternFields, string>>().toBe<'label'>();
expectTypeOf<ConditionalKeys<{[key: `event-${string}`]: unknown; readonly 'event-ready': string; 'event-count': number}, string>>().toBe<'event-ready'>();
expectTypeOf<ConditionalKeys<{readonly [key: symbol]: unknown; readonly [Symbol.iterator]: () => Iterator<string>}, Function>>().toBe<typeof Symbol.iterator>();
declare function numericPropertyKeys<Key extends string>(input: Record<Key, number>): ConditionalKeys<Record<Key, number>, number>;
expectTypeOf(numericPropertyKeys({left: 1, right: 2})).toBe<'left' | 'right'>();
