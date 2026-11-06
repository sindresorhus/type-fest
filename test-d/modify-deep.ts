import {expectTypeOf} from 'nz';
import type {JsonValue, MergeDeepOptions, ModifyDeep, Tagged} from '../index.d.ts';

type Foo = {
	a: string;
	b: {
		c: number;
		d: boolean;
	};
};

// A nested `never` key removes that key at depth, while the other nested keys keep their values.
declare const modified: ModifyDeep<Foo, {b: {c: never}}>;
expectTypeOf(modified).toBe<{a: string; b: {d: boolean}}>();

// A top-level `never` key removes the whole key.
expectTypeOf<ModifyDeep<Foo, {a: never}>>().toBe<{b: {c: number; d: boolean}}>();

// A nested override and removal happen together.
declare const both: ModifyDeep<{a: {x: string; y: number}}, {a: {x: boolean; y: never}}>;
expectTypeOf(both).toBe<{a: {x: boolean}}>();

// Sibling keys that are not mentioned are merged in, like `MergeDeep`.
declare const merged: ModifyDeep<{a: {x: string}; b: {y: number}}, {a: {x: never}; b: {z: boolean}}>;
expectTypeOf(merged).toBe<{a: {}; b: {y: number; z: boolean}}>();

// `any` and `unknown` values are kept.
expectTypeOf<ModifyDeep<{a: any; b: unknown}, {c: never}>>().toBe<{a: any; b: unknown}>();

// Modifiers of kept keys are preserved.
declare const modifiers: ModifyDeep<{a: {readonly x?: string; y: number}}, {a: {y: never}}>;
expectTypeOf(modifiers).toBe<{a: {readonly x?: string}}>();

// Index signatures are kept, and a `never` key against one is removed.
declare const indexed: ModifyDeep<{a: {[key: string]: string; fixed: string}}, {a: {fixed: never}}>;
expectTypeOf(indexed).toBe<{a: {[key: string]: string}}>();

// Array and tuple elements are kept; a `never` element type is not removed.
declare const array: ModifyDeep<{a: string[]; t: [never, 2]}, {a: never}>;
expectTypeOf(array).toBe<{t: [never, 2]}>();

// Built-in types are left as they are.
declare const builtIns: ModifyDeep<{d: Date; m: Map<string, number>; f: () => void}, {d: never}>;
expectTypeOf(builtIns).toBe<{m: Map<string, number>; f: () => void}>();

// With `recurseIntoArrays`, object elements are merged and their `never` keys removed.
declare const recursed: ModifyDeep<{a: [{x: string; y: number}]}, {a: [{x: never}]}, {recurseIntoArrays: true}>;
expectTypeOf(recursed).toBe<{a: [{y: number}]}>();

// Options are passed to `MergeDeep`.
declare const spread: ModifyDeep<{a: string[]}, {a: number[]}, {arrayMergeMode: 'spread'}>;
expectTypeOf(spread).toBe<{a: Array<string | number>}>();

// Unions are distributed at each level.
expectTypeOf<ModifyDeep<{a: {x: string}} | {b: {y: number}}, {a: {x: never}}>>().toBe<{a: {}} | {a: {}; b: {y: number}}>();

// An optional `never` key is kept at depth too: its value type is `never | undefined`, not exactly `never`.
declare const optionalNested: ModifyDeep<{a: {x?: never; y: number}}, {a: {y: never}}>;
expectTypeOf(optionalNested).toBe<{a: {x?: never}}>();

// Removing a key at the top level means the result no longer satisfies the original type.
expectTypeOf<ModifyDeep<Foo, {a: never}>>().not.toBeAssignableTo<Foo>();

// Top and empty types.
expectTypeOf<ModifyDeep<never, {a: never}>>().toBe<never>();
expectTypeOf<ModifyDeep<any, {a: never}>>().toBe<any>();
expectTypeOf<ModifyDeep<Foo, never>>().toBe<never>();
expectTypeOf<ModifyDeep<Foo, any>>().toBe<any>();
expectTypeOf<ModifyDeep<unknown, {a: never}>>().toBe<never>();
expectTypeOf<ModifyDeep<Foo, {}>>().toBe<Foo>();

// The `never` key is removed at three levels of nesting.
expectTypeOf<ModifyDeep<{a: {b: {c: string; d: number}}}, {a: {b: {c: never}}}>>().toBe<{a: {b: {d: number}}}>();

// A symbol key can be removed at depth.
declare const symbolKey: unique symbol;
expectTypeOf<ModifyDeep<{a: {[symbolKey]: string; b: number}}, {a: {[symbolKey]: never}}>>().toBe<{a: {b: number}}>();

// A numeric key can be removed at depth.
expectTypeOf<ModifyDeep<{a: {0: string; 1: number}}, {a: {0: never}}>>().toBe<{a: {1: number}}>();

// A replaced readonly tuple keeps its `readonly` modifier.
expectTypeOf<ModifyDeep<{a: readonly [1, 2]}, {a: readonly [9, 8]}>>().toBe<{a: readonly [9, 8]}>();

// An optional parent with a non-optional `never` modifier keeps the parent.
expectTypeOf<ModifyDeep<{a?: {x: number}}, {a: {x: never}}>>().toBe<{a: {}}>();

// An optional parent with an optional `never` modifier keeps the optionality.
expectTypeOf<ModifyDeep<{a?: {x: number}}, {a?: {x: never}}>>().toBe<{a?: {}}>();

// With `recurseIntoArrays`, a `Map` value inside an array element is kept while the `never` key is removed.
declare const recursedMap: ModifyDeep<{a: [{x: string; m: Map<string, string>}]}, {a: [{x: never}]}, {recurseIntoArrays: true}>;
expectTypeOf(recursedMap).toBe<{a: [{m: Map<string, string>}]}>();

// With `recurseIntoArrays`, removal works two levels deep inside an array element.
declare const recursedDeep: ModifyDeep<{a: [{x: {y: string; z: number}}]}, {a: [{x: {y: never}}]}, {recurseIntoArrays: true}>;
expectTypeOf(recursedDeep).toBe<{a: [{x: {z: number}}]}>();

// The `object` type and `object` values are kept as they are.
expectTypeOf<ModifyDeep<object, object>>().toBe<object>();
expectTypeOf<ModifyDeep<{a: object}, {}>>().toBe<{a: object}>();

// A getter becomes a readonly property, like in any mapped type.
expectTypeOf<ModifyDeep<{a: {get x(): number; y: string}}, {a: {y: never}}>>().toBe<{a: {readonly x: number}}>();

// A `Promise` value is kept as it is.
expectTypeOf<ModifyDeep<{p: Promise<string>; q: number}, {q: never}>>().toBe<{p: Promise<string>}>();

// With `recurseIntoArrays`, a `never` element keeps its position.
declare const recursedNeverElement: ModifyDeep<{a: [never, 2]}, {a: [never, 3]}, {recurseIntoArrays: true}>;
expectTypeOf(recursedNeverElement).toBe<{a: [never, 3]}>();

// `recurseIntoArrays` and `arrayMergeMode: 'spread'` together still remove `never` keys.
declare const recursedSpread: ModifyDeep<{a: [{x: string; y: number}]}, {a: [{x: never}]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(recursedSpread).toBe<{a: [{y: number}]}>();

// A value union is distributed at depth.
expectTypeOf<ModifyDeep<{a: {b: {c: string} | {d: number}}}, {a: {b: {c: never}}}>>().toBe<{a: {b: {} | {d: number}}}>();
expectTypeOf<ModifyDeep<{a: {x: string} | {y: number}}, {a: {x: never}}>>().toBe<{a: {} | {y: number}}>();

// `never` on both sides gives `never`.
expectTypeOf<ModifyDeep<never, never>>().toBe<never>();

// An optional key inside a kept object is kept.
expectTypeOf<ModifyDeep<{a: {b?: string; c: number}}, {a: {c: never}}>>().toBe<{a: {b?: string}}>();

// Recursive JSON values stay assignable without exhausting type instantiation.
declare const json: ModifyDeep<{data: JsonValue; obsolete: string}, {obsolete: never}>;
const jsonValue: JsonValue = json.data;

// Copied readonly arrays and variadic tuples keep their shapes and object elements unchanged.
expectTypeOf<ModifyDeep<{items: ReadonlyArray<{keep: string; obsolete: never}>}, {}>>().toBe<{items: ReadonlyArray<{keep: string; obsolete: never}>}>();
expectTypeOf<ModifyDeep<{items: readonly [{keep: 1; obsolete: never}?, ...Array<{keep: 2; obsolete: never}>]}, {}>>().toBe<{items: readonly [{keep: 1; obsolete: never}?, ...Array<{keep: 2; obsolete: never}>]}>();

// Removing `then` from a plain object must not make it look like a promise.
expectTypeOf<ModifyDeep<{then: string; keep: number}, {then: never}>>().toBe<{keep: number}>();
expectTypeOf<ModifyDeep<{value: {then: string; keep: number}}, {value: {then: never}}>>().toBe<{value: {keep: number}}>();

// An actual promise remains intact, including its custom properties.
type CustomPromise = Promise<string> & {readonly metadata: never};
expectTypeOf<ModifyDeep<{promise: CustomPromise; obsolete: string}, {obsolete: never}>>().toBe<{promise: CustomPromise}>();

// Shared index signatures keep the destination value when the source value is `never` (documented limitation).
expectTypeOf<ModifyDeep<Record<string, string>, Record<string, never>>>().toBe<Record<string, string>>();
expectTypeOf<ModifyDeep<{dictionary: Record<string, string>; keep: number}, {dictionary: Record<string, never>}>>().toBe<{dictionary: Record<string, string>; keep: number}>();

// A source-only index signature with the `never` value type is still removed.
expectTypeOf<ModifyDeep<{}, Record<string, never>>>().toBe<{}>();

// Cleanup reaches objects copied from either input even when they have no matching merge partner.
type CopiedObjects = ModifyDeep<{existing: {keep: string; obsolete: never}}, {added: {keep: number; obsolete: never}}>;
expectTypeOf<CopiedObjects>().toBe<{existing: {keep: string}; added: {keep: number}}>();

// Replacing an array copies the source elements unchanged; recursive merging retains destination fields and removes `never` keys.
type DestinationItems = {items: Array<{id: string; secret: string}>};
type SourceItems = {items: Array<{secret: never; enabled: boolean}>};
expectTypeOf<ModifyDeep<DestinationItems, SourceItems>>().toBe<SourceItems>();
expectTypeOf<ModifyDeep<DestinationItems, SourceItems, {recurseIntoArrays: true}>>().toBe<{items: Array<{id: string; enabled: boolean}>}>();

// A numeric modifier key removes the canonical string key at depth.
expectTypeOf<ModifyDeep<{value: {'0': string; keep: boolean}}, {value: {0: never}}>>().toBe<{value: {keep: boolean}}>();

// Optional `then?: never` is kept as a forbidden property, rather than removed or treated as a promise.
expectTypeOf<ModifyDeep<{value: {then?: never; keep: string}}, {}>>().toBe<{value: {then?: never; keep: string}}>();

// Source union members stay separate, with each variant removing only its own key.
type Settings = {settings: {name: string; count: number}};
type SettingsModifier = {settings: {name: never}} | {settings: {count: never}};
expectTypeOf<ModifyDeep<Settings, SettingsModifier>>().toBe<{settings: {count: number}} | {settings: {name: string}}>();

// Generic call signatures and attached object properties are left intact.
type Identity = (<Value>(value: Value) => Value) & {metadata: {obsolete: never}};
declare const identity: ModifyDeep<{callback: Identity; obsolete: string}, {obsolete: never}>;
expectTypeOf(identity.callback).toBe<Identity>();
expectTypeOf(identity.callback({id: 1})).toBe<{id: number}>();

// Recursive JSON values can also be assigned into the modified object without narrowing the payload.
expectTypeOf<{data: JsonValue}>().toBeAssignableTo<ModifyDeep<{data: JsonValue; obsolete: string}, {obsolete: never}>>();

// Copied arrays keep their elements, additional properties, brands, and readonly modifiers.
type IdentifiedItems = Array<{keep: string; obsolete: never}> & {readonly id: string};
expectTypeOf<ModifyDeep<{items: IdentifiedItems}, {}>>().toBe<{items: IdentifiedItems}>();
type ReadonlyIdentifiedItems = ReadonlyArray<{keep: string; obsolete: never}> & {readonly id: string};
expectTypeOf<ModifyDeep<{items: ReadonlyIdentifiedItems}, {}>>().toBe<{items: ReadonlyIdentifiedItems}>();
type ValidatedItems = Tagged<string[], 'ValidatedItems'>;
expectTypeOf<ModifyDeep<{items: ValidatedItems; obsolete: boolean}, {obsolete: never}>>().toBe<{items: ValidatedItems}>();
expectTypeOf<{items: string[]}>().not.toBeAssignableTo<ModifyDeep<{items: ValidatedItems}, {}>>();

// Additional array properties are preserved unchanged as part of the array shape.
type ItemsWithMetadata = string[] & {metadata: {obsolete: never}; removed: never};
expectTypeOf<ModifyDeep<{items: ItemsWithMetadata}, {}>>().toBe<{items: ItemsWithMetadata}>();

// Untouched recursive tuples remain usable without eagerly expanding their elements.
type Expression = number | [Expression, '+' | '-', Expression];
declare const expression: ModifyDeep<{expression: Expression; obsolete: string}, {obsolete: never}>;
const expressionValue: Expression = expression.expression;
expectTypeOf<{expression: Expression}>().toBeAssignableTo<typeof expression>();
type ExpressionTail = Extract<typeof expression.expression, unknown[]> extends [unknown, ...infer Tail] ? Tail : never;
expectTypeOf<ExpressionTail>().toBe<['+' | '-', Expression]>();

// An explicitly merged thenable is a record, so its `never` keys are removed while `then` is retained.
type ThenableWithMetadata = {then: PromiseLike<string>['then']; obsolete: string};
expectTypeOf<ModifyDeep<{value: ThenableWithMetadata}, {value: {obsolete: never}}>>().toBe<{value: {then: ThenableWithMetadata['then']}}>();

type ThenableRecord = {then: ThenableWithMetadata['then']; metadata: never; nested: {obsolete: never; keep: string}};
expectTypeOf<ModifyDeep<ThenableRecord, {}>>().toBe<{then: ThenableRecord['then']; nested: {keep: string}}>();

// Only tuple elements that participate in recursive merging are cleaned; unmatched tails and empty-side copies stay unchanged.
type TupleWithTail = {items: [{keep: string; obsolete: string}, {keep: number; obsolete: never}]};
expectTypeOf<ModifyDeep<TupleWithTail, {items: [{obsolete: never}]}, {recurseIntoArrays: true}>>().toBe<{items: [{keep: string}, {keep: number; obsolete: never}]}>();
expectTypeOf<ModifyDeep<{items: [{obsolete: never}]}, {items: []}, {recurseIntoArrays: true}>>().toBe<{items: [{obsolete: never}]}>();

// Enabling recursive merging does not traverse a source-only array without a matching destination array.
expectTypeOf<ModifyDeep<{}, SourceItems, {recurseIntoArrays: true}>>().toBe<SourceItems>();

// A merged property that becomes `never` is removed even when the source value is not `never`.
expectTypeOf<ModifyDeep<{value: never; keep: string}, {value: number}>>().toBe<{keep: string}>();

// The internal removal mode does not interfere with generic or indexed user options.
function constructModifiedWithOptions<Options extends MergeDeepOptions>(value: string): ModifyDeep<{keep: number; obsolete: boolean}, {id: string; obsolete: never}, Options> {
	return {keep: 1, id: value};
}

expectTypeOf<ModifyDeep<DestinationItems, SourceItems, {recurseIntoArrays: true; [key: string]: unknown}>>().toBe<{items: Array<{id: string; enabled: boolean}>}>();

// Cleaning a generic payload cannot remove its containing object or hide its known properties.
function readCopiedGenericPayload<Value extends string>(value: ModifyDeep<{x: {id: string; payload: Value}}, {obsolete: never}>): string {
	return value.x.id;
}

function readMergedGenericPayload<Value>(value: ModifyDeep<{x: {id: string; payload: Value}}, {x: {keep: true}}>): string {
	return value.x.id;
}

function readOptionalGenericPayload<Value>(value: ModifyDeep<{x?: {id: string; payload: Value}}, {}>): string | undefined {
	return value.x?.id;
}

function readGenericEnvelope<Value>(value: ModifyDeep<{x: {id: string; payload: Value}}, {}>): {x: {id: string}} {
	return value;
}

expectTypeOf<ModifyDeep<{x: {id: string; payload: any}}, {}>>().toBe<{x: {id: string; payload: any}}>();
expectTypeOf<ModifyDeep<{x: {id: string; payload: never}}, {}>>().toBe<{x: {id: string}}>();
expectTypeOf<ModifyDeep<{x: {id: string; payload: unknown}}, {}>>().toBe<{x: {id: string; payload: unknown}}>();

// A shared optional `never` key remains optional; required-value reads must not turn it into a removal marker.
expectTypeOf<ModifyDeep<{value: string}, {value?: never}>>().toBe<{value?: never}>();
expectTypeOf<ModifyDeep<{value: never}, {value: any}>>().toBe<{value: any}>();
expectTypeOf<ModifyDeep<{value: never}, {value: string | undefined}>>().toBe<{value: undefined}>();

// A generic `then` field cannot make its containing object disappear during thenable detection.
function readCopiedGenericThen<Value extends string>(value: ModifyDeep<{x: {id: string; then: Value}}, {}>): string {
	return value.x.id;
}

function readMergedGenericThen<Value extends string>(value: ModifyDeep<{x: {id: string; then: Value}}, {x: {keep: true}}>): string {
	return value.x.id;
}

function readSourceOnlyGenericThen<Value extends string>(value: ModifyDeep<{}, {x: {id: string; then: Value}}>): string {
	return value.x.id;
}

function readGenericThenEnvelope<Value extends string>(value: ModifyDeep<{x: {id: string; then: Value}}, {}>): {x: {id: string}} {
	return value;
}

expectTypeOf<ModifyDeep<{x: {id: string; then: any}}, {}>>().toBe<{x: {id: string; then: any}}>();
expectTypeOf<ModifyDeep<{x: {id: string; then: never}}, {}>>().toBe<{x: {id: string}}>();
expectTypeOf<ModifyDeep<{x: {id: string; then: unknown}}, {}>>().toBe<{x: {id: string; then: unknown}}>();

// Lazy normalization still merges class properties at the root and inside records.
declare class DestinationShape {
	id: string;
	obsolete: boolean;
}

declare class ModifierShape {
	obsolete: never;
	enabled: true;
}

expectTypeOf<ModifyDeep<DestinationShape, ModifierShape>>().toBe<{id: string; enabled: true}>();
expectTypeOf<ModifyDeep<{value: DestinationShape}, {value: ModifierShape}>>().toBe<{value: {id: string; enabled: true}}>();

// Nullable modifiers merge their record variant while keeping `null` as a replacement.
type NullableModifier = ModifyDeep<{value: {id: string; obsolete: boolean}}, {value: {obsolete: never; enabled: true} | null}>;
expectTypeOf<NullableModifier>().toBe<{value: {id: string; enabled: true} | null}>();
expectTypeOf<{value: {enabled: true}}>().not.toBeAssignableTo<NullableModifier>();
({value: null}) satisfies NullableModifier;
({value: {id: 'item', enabled: true}}) satisfies NullableModifier;
expectTypeOf<ModifyDeep<{value: {id: string; obsolete: boolean}}, {readonly value?: {obsolete: never; enabled: true} | null | undefined}>>()
	.toBe<{readonly value?: {id: string; enabled: true} | null | undefined}>();
expectTypeOf<ModifyDeep<[{id: string; obsolete: boolean}], [{obsolete: never; enabled: true} | null], {recurseIntoArrays: true}>>()
	.toBe<[{id: string; enabled: true} | null]>();

function readNullableGenericPayload<Value>(value: ModifyDeep<{value: {id: string; payload: Value}}, {value: {enabled: true} | null}>): string | undefined {
	return value.value?.id;
}
