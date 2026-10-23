import {expectTypeOf} from 'nz';
import type {ConditionalExcept, ConditionalKeys, ConditionalPick} from '../index.d.ts';

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
