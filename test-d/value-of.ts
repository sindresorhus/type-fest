import {expectTypeOf} from 'nz';
import type {KeysOfUnion, ValueOf} from '../index.d.ts';

const value: ValueOf<{a: 1; b: 2; c: 3}> = 3;
const valueRestricted: ValueOf<{a: 1; b: 2; c: 3}, 'a'> = 1;

expectTypeOf(value).toBeAssignableTo<1 | 2 | 3>();
expectTypeOf(value).not.toBeAssignableTo<4>();

expectTypeOf(valueRestricted).toBe<1>();
expectTypeOf(valueRestricted).not.toBeAssignableTo<2>();
expectTypeOf(valueRestricted).not.toBeAssignableTo<4>();

// `keyof` of a union is the intersection of its members' keys, so the default key was empty for a union of objects that share nothing, and the value came out as `never`. The doc promises a union of the object's values, and this one has values.
declare const unionOfObjects: ValueOf<{a: 1} | {b: 2}>;
expectTypeOf(unionOfObjects).toBe<1 | 2>();

declare const threeWayUnion: ValueOf<{a: 1} | {b: 2} | {c: 3}>;
expectTypeOf(threeWayUnion).toBe<1 | 2 | 3>();

declare const unionOfObjectsSharedKey: ValueOf<{a: 1} | {a: 2}>;
expectTypeOf(unionOfObjectsSharedKey).toBe<1 | 2>();

// Asking for one member's key reads the value at the keys a member actually has, so a key the other member lacks contributes nothing rather than poisoning the whole result.
declare const oneKeyOfUnion: ValueOf<{a: 1} | {b: 2}, 'a'>;
expectTypeOf(oneKeyOfUnion).toBe<1>();

declare const unionWithNull: ValueOf<{a: 1} | {b: 2} | null>;
expectTypeOf(unionWithNull).toBe<1 | 2>();

// A generic object's value at a key is one of its values.
function valueOfGeneric<ObjectType extends object, Key extends keyof ObjectType>(object: ObjectType, key: Key): ValueOf<ObjectType, Key> {
	return object[key];
}

function valueOfGenericConstraint<ObjectType extends {a: number}>(object: ObjectType): ValueOf<ObjectType, 'a'> {
	return object.a;
}

// Generic indexed reads stay usable in both directions.
function _readSelectedValue<ObjectType extends object, Key extends keyof ObjectType>(selected: ValueOf<ObjectType, Key>): ObjectType[Key] {
	return selected;
}

// A large union stays within the instantiation limit.
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MemberName = `${0 | 1 | 2 | 3 | 4}${Digit}`;
type LargeUnion = {[Member in MemberName]: Record<`${Member}_${Digit}${0 | 1 | 2 | 3 | 4}`, Member>}[MemberName];
expectTypeOf<ValueOf<LargeUnion>>().toBe<MemberName>();

expectTypeOf<ValueOf<any>>().toBe<any>();
expectTypeOf<ValueOf<never>>().toBe<never>();
expectTypeOf<ValueOf<unknown>>().toBe<never>();
// @ts-expect-error A selected key must belong to at least one union member.
type MissingValueKey = ValueOf<{id: number} | {name: string}, 'missing'>;

// An index signature that covers the key contributes its value, even when another member's index signature has a different domain.
expectTypeOf<ValueOf<{[key: string]: string} | {a: 1; [key: `x${string}`]: 2}, `x${string}`>>().toBe<string | 2>();
expectTypeOf<ValueOf<{[key: string]: 's'} | {[key: number]: 'n'}, number>>().toBe<'s' | 'n'>();

// A broad key reads every named property it covers, because `object[key]` with `key: string` can return `retries`.
expectTypeOf<ValueOf<Record<string, string> | {retries: number}, string>>().toBe<string | number>();

// A member that has none of the keys does not contribute its index signature's value.
expectTypeOf<ValueOf<{[key: symbol]: boolean} | {a: 1}, 'a'>>().toBe<1>();

// A generic object without a constraint keeps its value assignable.
function _valueOfUnconstrainedGeneric<ObjectType, Key extends keyof ObjectType>(object: ObjectType, key: Key): ValueOf<ObjectType, Key> {
	return object[key];
}

// Works with objects
expectTypeOf<ValueOf<{a: 1; b: 2} | {a: 3; c: 4}, 'a'>>().toBe<1 | 3>();

// Works with arrays
expectTypeOf<ValueOf<string[] | [number, boolean], number>>().toBe<string | number | boolean>();

// Works with index signatures
expectTypeOf<ValueOf<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, string>>().toBe<string>();

expectTypeOf<ValueOf<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, number>>().toBe<string | number>();

// Works with functions
expectTypeOf<ValueOf<(() => void) | {(): void; a: 1} | {(): void; a: 2}, 'a'>>().toBe<1 | 2>();

// Ignores objects where `Key` is missing
expectTypeOf<ValueOf<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; d: 6} | {e: 7}, 'a'>>().toBe<1 | 3 | 5>();

// Adds `undefined` when the key is optional
expectTypeOf<ValueOf<{readonly a?: 1; b: 2} | {a: 3; c: 4}, 'a'>>().toBe<1 | 3 | undefined>();

// Works when `Key` is a union
expectTypeOf<ValueOf<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; b: 6} | {e: 7}, 'a' | 'b'>>().toBe<1 | 2 | 3 | 5 | 6>();

// @ts-expect-error - Errors if `Key` is missing from all of the objects
type MissingObjectKey = ValueOf<{a: 1; b: 2} | {a: 3; c: 4}, 'd'>;

// Returns `any` when `Key` is `any`
expectTypeOf<ValueOf<{a: 1; b: 2} | {a: 3; c: 4}, any>>().toBe<any>();

// Returns `never` when `Key` is `never`
expectTypeOf<ValueOf<{a: 1; b: 2} | {a: 3; c: 4}, never>>().toBe<never>();
// A `never` key reads the index signature of a single object (limitation)
expectTypeOf<ValueOf<Record<string, number>, never>>().toBe<number>();

// Conflicting discriminants do not hide a value present in only one member.
type Result = {kind: 'success'; value: string} | {kind: 'failure'; error: Error};
expectTypeOf<ValueOf<Result, 'value' | 'error'>>().toBe<string | Error>();
// @ts-expect-error A key absent from every member is rejected.
type MissingResultValue = ValueOf<Result, 'missing'>;

// Optional symbol properties contribute `undefined`, while absent properties contribute nothing.
declare const token: unique symbol;
expectTypeOf<ValueOf<{readonly [token]?: string} | {[token]: number} | {id: string}, typeof token>>().toBe<string | number | undefined>();

// Empty and nullish members do not introduce `undefined` into a required property's value.
expectTypeOf<ValueOf<{value: string} | {} | null | undefined, 'value'>>().toBe<string>();
expectTypeOf<ValueOf<unknown, never>>().toBe<never>();
expectTypeOf<ValueOf<never, 'value'>>().toBe<never>();
expectTypeOf<ValueOf<any, 'value'>>().toBe<any>();

// Read a single type, preserve nested objects, and do not add unrelated property values.
expectTypeOf<ValueOf<{id: number; name: string}, 'id'>>().toBe<number>();
expectTypeOf<ValueOf<{data: {id: number}} | {data: {name: string}}, 'data'>>().toBe<{id: number} | {name: string}>();
expectTypeOf<ValueOf<Result, 'value'>>().not.toBeAssignableTo<Error>();

// The documentation examples.
type DocumentedResult =
	| {status: 'success'; value: string}
	| {status: 'failure'; error: Error};
expectTypeOf<ValueOf<DocumentedResult, 'status'>>().toBe<'success' | 'failure'>();
expectTypeOf<ValueOf<DocumentedResult, 'value'>>().toBe<string>();
expectTypeOf<ValueOf<DocumentedResult, 'error'>>().toBe<Error>();
expectTypeOf<ValueOf<DocumentedResult, 'value' | 'error'>>().toBe<string | Error>();
expectTypeOf<ValueOf<Record<string, string> | {retries: number}, string>>().toBe<string | number>();

// Declared nullish values are retained, even though missing properties are ignored.
expectTypeOf<ValueOf<{value: null} | {value: undefined} | {other: true}, 'value'>>().toBe<null | undefined>();
expectTypeOf<ValueOf<{value?: never} | {other: true}, 'value'>>().toBe<undefined>();
expectTypeOf<ValueOf<{value: never} | {value: 1}, 'value'>>().toBe<1>();
expectTypeOf<ValueOf<{value: never} | {other: true}, 'value'>>().toBe<never>();
expectTypeOf<ValueOf<{value: unknown} | {value: 1}, 'value'>>().toBe<unknown>();
expectTypeOf<ValueOf<{value: any} | {value: 1}, 'value'>>().toBe<any>();

// Different spellings of a numeric key follow `keyof`, without alias conversion.
type NumericKeys = {0: 'number'} | {'0': 'string'};
expectTypeOf<ValueOf<NumericKeys, 0>>().toBe<'number'>();
expectTypeOf<ValueOf<NumericKeys, '0'>>().toBe<'string'>();
expectTypeOf<ValueOf<NumericKeys, 0 | '0'>>().toBe<'number' | 'string'>();
// @ts-expect-error Numeric key aliases are not added to the key constraint.
type NumericAlias = ValueOf<{0: 'zero'}, '0'>;

// Unique symbols can be selected independently or together with string keys.
declare const otherToken: unique symbol;
type SymbolKeys = {[token]: 1; name: 'first'} | {[otherToken]: 2; name: 'second'};
expectTypeOf<ValueOf<SymbolKeys, typeof token>>().toBe<1>();
expectTypeOf<ValueOf<SymbolKeys, typeof token | typeof otherToken>>().toBe<1 | 2>();
expectTypeOf<ValueOf<SymbolKeys, typeof token | 'name'>>().toBe<1 | 'first' | 'second'>();
// @ts-expect-error A broad symbol key needs a symbol index signature.
type BroadSymbol = ValueOf<SymbolKeys, symbol>;

// Literal keys read named properties even when an index signature is present.
type SymbolIndex = {[key: symbol]: unknown; [token]: string} | {[token]: number};
expectTypeOf<ValueOf<SymbolIndex, typeof token>>().toBe<string | number>();
expectTypeOf<ValueOf<SymbolIndex, symbol>>().toBe<unknown>();
expectTypeOf<ValueOf<{[key: string]: unknown; id: 1} | {id: 2}, 'id'>>().toBe<1 | 2>();
expectTypeOf<ValueOf<{[key: number]: string} | {0: number}, 0>>().toBe<string | number>();

// A broad key reads the index signatures and the named properties it covers, since `object[key]` with a broad `key` can return any of them.
type IndexUnion = {[key: string]: string; label: 'text'} | {[key: number]: number; label: true};
expectTypeOf<ValueOf<IndexUnion, string>>().toBe<string | true>();
expectTypeOf<ValueOf<IndexUnion, number>>().toBe<string | number>();
expectTypeOf<ValueOf<IndexUnion, 'label'>>().toBe<'text' | true>();
expectTypeOf<ValueOf<Record<string, 1> | {name: 2}, string | 'name'>>().toBe<1 | 2>();

type MixedIndexUnion = {[key: number]: string; label: true} | {[key: symbol]: boolean; label: false};
expectTypeOf<ValueOf<MixedIndexUnion, number>>().toBe<string>();
expectTypeOf<ValueOf<MixedIndexUnion, symbol>>().toBe<boolean>();
expectTypeOf<ValueOf<MixedIndexUnion, number | symbol>>().toBe<string | boolean>();
expectTypeOf<ValueOf<MixedIndexUnion, number | 'label'>>().toBe<string | boolean>();

// Template index signatures retain their native domain.
type DataAttributes = {[key: `data-${string}`]: string} | {id: number};
expectTypeOf<ValueOf<DataAttributes, `data-${string}`>>().toBe<string>();
expectTypeOf<ValueOf<DataAttributes, 'data-name' | 'id'>>().toBe<string | number>();
// @ts-expect-error An arbitrary string is outside the template index domain.
type InvalidDataAttribute = ValueOf<DataAttributes, 'name'>;

// Arrays and tuples support numeric indices, optional elements, rest elements, and named keys.
expectTypeOf<ValueOf<readonly string[] | readonly [number, boolean], number>>().toBe<string | number | boolean>();
expectTypeOf<ValueOf<[1] | [2, 3], '0'>>().toBe<1 | 2>();
expectTypeOf<ValueOf<[1] | [2, 3], '1'>>().toBe<3>();
expectTypeOf<ValueOf<readonly [first?: 1] | readonly [2], '0'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValueOf<[] | [1, 2], number>>().toBe<1 | 2>();
expectTypeOf<ValueOf<[1, ...string[]] | readonly [2, ...boolean[]], number>>().toBe<1 | 2 | string | boolean>();
expectTypeOf<ValueOf<[1] | [2, 3], 'length'>>().toBe<1 | 2>();
expectTypeOf<ValueOf<string[] | {length: 'unknown'}, 'length'>>().toBe<number | 'unknown'>();

// Callable and constructable types retain their declared properties.
type Constructor = {new(): {id: number}; kind: 'factory'};
expectTypeOf<ValueOf<Constructor | {kind: 'instance'}, 'kind'>>().toBe<'factory' | 'instance'>();
expectTypeOf<ValueOf<{(): void; readonly state?: 'ready'} | {state: 'busy'}, 'state'>>().toBe<'ready' | 'busy' | undefined>();

// Intersections contribute all their keys and preserve value intersections.
type Entity = {id: number} & {name: string};
expectTypeOf<ValueOf<Entity | {active: boolean}, 'id' | 'name' | 'active'>>().toBe<number | string | boolean>();
expectTypeOf<ValueOf<({value: {id: number}} & {value: {name: string}}) | {value: null}, 'value'>>().toBe<({id: number} & {name: string}) | null>();

// Primitive members participate through their native keys; keyless members contribute nothing.
expectTypeOf<ValueOf<string | {length: false}, 'length'>>().toBe<number | false>();
expectTypeOf<ValueOf<void | number | {value: 1} | null | undefined, 'value'>>().toBe<1>();

// Generic composition works with both shared keys and all member keys.
type AllValues<Union> = ValueOf<Union, KeysOfUnion<Union>>;
expectTypeOf<AllValues<Result>>().toBe<string | Error>();
type SharedValues<Union, Key extends keyof Union> = ValueOf<Union, Key>;
expectTypeOf<SharedValues<Result, 'kind'>>().toBe<'success' | 'failure'>();
type ValuesByKey<Union> = {[Key in KeysOfUnion<Union>]: ValueOf<Union, Key>};
expectTypeOf<ValuesByKey<Result>>().toBe<{kind: 'success' | 'failure'; value: string; error: Error}>();

// Special inputs and keys.
expectTypeOf<ValueOf<any, never>>().toBe<any>();
expectTypeOf<ValueOf<any, any>>().toBe<any>();
expectTypeOf<ValueOf<never, any>>().toBe<never>();
expectTypeOf<ValueOf<never, never>>().toBe<never>();
expectTypeOf<ValueOf<{}, never>>().toBe<never>();
expectTypeOf<ValueOf<object, never>>().toBe<never>();
expectTypeOf<ValueOf<null, never>>().toBe<never>();
expectTypeOf<ValueOf<undefined, never>>().toBe<never>();
expectTypeOf<ValueOf<void, never>>().toBe<never>();
expectTypeOf<ValueOf<{value: 1}, never>>().toBe<never>();
expectTypeOf<ValueOf<unknown | {value: 1}, never>>().toBe<never>();
expectTypeOf<ValueOf<any | {value: 1}, 'value'>>().toBe<any>();

// Reject malformed or partly invalid key selections.
// @ts-expect-error The key must belong to at least one union member.
type UnknownKey = ValueOf<unknown, 'value'>;
// @ts-expect-error Every selected key must belong to at least one union member.
type PartlyInvalidKeys = ValueOf<Result, 'value' | 'missing'>;
// @ts-expect-error `unknown` cannot be used as a property key.
type UnknownPropertyKey = ValueOf<Result, unknown>;
// @ts-expect-error Objects cannot be used as property keys.
type ObjectPropertyKey = ValueOf<Result, {kind: 'value'}>;

// Realistic messages have disjoint payloads, optional metadata, and a payload-free member.
type Message =
	| {kind: 'text'; content: string; sender?: {name: string}}
	| {kind: 'attachment'; file: {name: string; size: number}; sender: {id: number}}
	| {kind: 'closed'; reason: 'timeout' | 'requested'};
expectTypeOf<ValueOf<Message, 'kind'>>().toBe<'text' | 'attachment' | 'closed'>();
expectTypeOf<ValueOf<Message, 'content' | 'file'>>().toBe<string | {name: string; size: number}>();
expectTypeOf<ValueOf<Message, 'sender'>>().toBe<{name: string} | {id: number} | undefined>();
expectTypeOf<ValueOf<Message, 'reason'>>().toBe<'timeout' | 'requested'>();
expectTypeOf<ValueOf<Exclude<Message, {kind: 'closed'}>, 'sender'>>().toBe<{name: string} | {id: number} | undefined>();

// An unselected property cannot widen the result, even when its value is `any` or `unknown`.
type UnselectedSpecialValues = {selected: 1; unrelated: any} | {selected: 2; unrelated: unknown} | {unrelated: undefined};
expectTypeOf<ValueOf<UnselectedSpecialValues, 'selected'>>().toBe<1 | 2>();
expectTypeOf<ValueOf<UnselectedSpecialValues, 'unrelated'>>().toBe<any>();
expectTypeOf<ValueOf<{selected: 1} | {unrelated: unknown}, 'selected'>>().toBe<1>();
expectTypeOf<ValueOf<{selected: 1} | {unrelated: any}, 'selected'>>().toBe<1>();

// Property values are returned intact, without unwrapping, invoking, or making them mutable.
type StoredValues =
	| {value: Promise<{id: number}>}
	| {value: readonly [string, number]}
	| {value: ReadonlyMap<string, boolean>}
	| {value: () => Date};
expectTypeOf<ValueOf<StoredValues, 'value'>>().toBe<Promise<{id: number}> | readonly [string, number] | ReadonlyMap<string, boolean> | (() => Date)>();
expectTypeOf<ValueOf<{value: readonly string[]} | {value: number[]}, 'value'>>().toBe<readonly string[] | number[]>();
expectTypeOf<ValueOf<{value: {readonly id: number}} | {value: null}, 'value'>>().toBe<{readonly id: number} | null>();
expectTypeOf<ValueOf<{value: () => 1} | {value: (name: string) => 2}, 'value'>>().toBe<(() => 1) | ((name: string) => 2)>();
expectTypeOf<ValueOf<{value: Date} | {value: RegExp}, 'value'>>().toBe<Date | RegExp>();
expectTypeOf<ValueOf<{value: Set<string>} | {value: Map<string, number>}, 'value'>>().toBe<Set<string> | Map<string, number>>();

// Optionality belongs to the selected property, including when all selected values are absent.
expectTypeOf<ValueOf<{first?: 1} | {second?: 2}, 'first' | 'second'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValueOf<{value?: undefined} | {other: 1}, 'value'>>().toBe<undefined>();
expectTypeOf<ValueOf<{first: never} | {second: never}, 'first' | 'second'>>().toBe<never>();
expectTypeOf<ValueOf<{first?: never} | {second: never}, 'first' | 'second'>>().toBe<undefined>();
expectTypeOf<ValueOf<{readonly value: 1} | {value: 2}, 'value'>>().toBe<1 | 2>();
expectTypeOf<ValueOf<{readonly value?: null} | {value: false}, 'value'>>().toBe<null | false | undefined>();

// Three separate index domains do not leak values into one another.
type SeparateIndexDomains = {[key: string]: 'text'} | {[key: number]: 'number'} | {[key: symbol]: 'symbol'};
expectTypeOf<ValueOf<SeparateIndexDomains, string>>().toBe<'text'>();
expectTypeOf<ValueOf<SeparateIndexDomains, number>>().toBe<'text' | 'number'>();
expectTypeOf<ValueOf<SeparateIndexDomains, symbol>>().toBe<'symbol'>();
expectTypeOf<ValueOf<SeparateIndexDomains, string | symbol>>().toBe<'text' | 'symbol'>();
expectTypeOf<ValueOf<SeparateIndexDomains, PropertyKey>>().toBe<'text' | 'number' | 'symbol'>();
expectTypeOf<ValueOf<SeparateIndexDomains, 'name' | 0 | typeof token>>().toBe<'text' | 'number' | 'symbol'>();
expectTypeOf<ValueOf<SeparateIndexDomains, '0'>>().toBe<'text'>();

// A named property can be narrower than its index signature.
type NamedIndexProperties =
	| {[key: string]: string | number; name: 'indexed'; count: 1}
	| {name: 'named'; count?: 2; active: true};
expectTypeOf<ValueOf<NamedIndexProperties, 'name'>>().toBe<'indexed' | 'named'>();
expectTypeOf<ValueOf<NamedIndexProperties, 'count'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValueOf<NamedIndexProperties, 'active'>>().toBe<string | number | true>();
expectTypeOf<ValueOf<NamedIndexProperties, string>>().toBe<string | number | true | undefined>();
expectTypeOf<ValueOf<Readonly<Record<string, 1>> | {value?: 2}, 'value'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValueOf<Partial<Record<string, 1>> | {value: 2}, string>>().toBe<1 | 2 | undefined>();

// Separate template domains do not leak into one another, while a template key also reads the named properties it covers.
type AttributeDomains =
	| {[key: `data-${string}`]: {data: string}}
	| {[key: `aria-${string}`]: {aria: boolean}}
	| {'data-id': {id: number}; title: 'named'};
expectTypeOf<ValueOf<AttributeDomains, `data-${string}`>>().toBe<{data: string} | {id: number}>();
expectTypeOf<ValueOf<AttributeDomains, `aria-${string}`>>().toBe<{aria: boolean}>();
expectTypeOf<ValueOf<AttributeDomains, `data-${string}` | `aria-${string}`>>().toBe<{data: string} | {aria: boolean} | {id: number}>();
expectTypeOf<ValueOf<AttributeDomains, 'data-id'>>().toBe<{data: string} | {id: number}>();
expectTypeOf<ValueOf<AttributeDomains, 'aria-label' | 'title'>>().toBe<'named' | {aria: boolean}>();
expectTypeOf<ValueOf<AttributeDomains, `data-user-${string}`>>().toBe<{data: string}>();
expectTypeOf<ValueOf<AttributeDomains, `data-${number}`>>().toBe<{data: string}>();
// @ts-expect-error A broad string is not covered by a template index signature.
type BroadAttributeKey = ValueOf<AttributeDomains, string>;
// @ts-expect-error A valid template domain does not make a second domain valid.
type MixedAttributeKeys = ValueOf<AttributeDomains, `data-${string}` | `other-${string}`>;

// A broad key also reads the named properties that a narrower key in the same selection names.
expectTypeOf<ValueOf<Record<number, 1> | {0: 2}, number | 0>>().toBe<1 | 2>();
expectTypeOf<ValueOf<Record<symbol, 1> | {[token]: 2}, symbol | typeof token>>().toBe<1 | 2>();
expectTypeOf<ValueOf<Record<`data-${string}`, 1> | {'data-id': 2}, `data-${string}` | 'data-id'>>().toBe<1 | 2>();

// Well-known symbol properties are ordinary selectable keys, with no string conversion.
type IterableValues = {[Symbol.iterator]: () => ArrayIterator<string>} | {[Symbol.toStringTag]: 'custom'};
expectTypeOf<ValueOf<IterableValues, typeof Symbol.iterator>>().toBe<() => ArrayIterator<string>>();
expectTypeOf<ValueOf<IterableValues, typeof Symbol.toStringTag>>().toBe<'custom'>();
expectTypeOf<ValueOf<IterableValues, typeof Symbol.iterator | typeof Symbol.toStringTag>>().toBe<(() => ArrayIterator<string>) | 'custom'>();
// @ts-expect-error The string spelling of a symbol is a different property key.
type StringifiedSymbolKey = ValueOf<IterableValues, 'Symbol.iterator'>;
// @ts-expect-error An unrelated unique symbol is absent from every member.
type MissingSymbolKey = ValueOf<{[token]: 1}, typeof otherToken>;

// Numeric tuple indexes include out-of-bounds reads; string indexes require a declared tuple key.
expectTypeOf<ValueOf<[1] | [2, 3], 1>>().toBe<3 | undefined>();
expectTypeOf<ValueOf<[] | [1], 0>>().toBe<1 | undefined>();
expectTypeOf<ValueOf<string[] | [1], '0'>>().toBe<1>();
expectTypeOf<ValueOf<string[] | [1, 2], '1'>>().toBe<2>();
expectTypeOf<ValueOf<[first?: 1] | readonly [], number>>().toBe<1 | undefined>();
expectTypeOf<ValueOf<readonly [1, ...string[]] | [], 'length'>>().toBe<number>();
expectTypeOf<ValueOf<[first?: 1] | [2, 3], 'length'>>().toBe<0 | 1 | 2>();
expectTypeOf<ValueOf<[1] | {0: false}, 0>>().toBe<1 | false>();
expectTypeOf<ValueOf<[1] | {0: false}, '0'>>().toBe<1>();
// @ts-expect-error Arrays expose a numeric index signature, not a broad string index signature.
type ArrayStringIndex = ValueOf<string[], string>;
// @ts-expect-error A tuple's numeric index signature does not add undeclared string indexes.
type MissingTupleStringIndex = ValueOf<[1] | [2, 3], '2'>;

// An array method is present only on mutable members, and its full signature is preserved.
expectTypeOf<ValueOf<string[] | readonly number[], 'push'>>().toBe<string[]['push']>();
expectTypeOf<ValueOf<string[] | {push: false}, 'push'>>().toBe<string[]['push'] | false>();
expectTypeOf<ValueOf<ReadonlyMap<string, number> | {size: 'pending'}, 'size'>>().toBe<number | 'pending'>();

// Class instances expose inherited public properties, but do not expose constructor statics or protected state.
declare class BaseRecord {
	readonly id: number;
	protected internal: boolean;
}
declare class NamedRecord extends BaseRecord {
	static category: 'record';
	name: string;
	get displayName(): string;
}
type RecordOrError = NamedRecord | {error: Error};
expectTypeOf<ValueOf<RecordOrError, 'id'>>().toBe<number>();
expectTypeOf<ValueOf<RecordOrError, 'name' | 'displayName'>>().toBe<string>();
expectTypeOf<ValueOf<RecordOrError, 'id' | 'error'>>().toBe<number | Error>();
expectTypeOf<ValueOf<typeof NamedRecord | {category: 'other'}, 'category'>>().toBe<'record' | 'other'>();
// @ts-expect-error The constructor's prototype is not a property of a class instance.
type InstancePrototypeKey = ValueOf<RecordOrError, 'prototype'>;
// @ts-expect-error Protected instance properties are not keys of a class instance.
type ProtectedInstanceKey = ValueOf<RecordOrError, 'internal'>;
// @ts-expect-error A static property is not an instance property.
type StaticInstanceKey = ValueOf<RecordOrError, 'category'>;

// Existing generic transformations preserve member-specific keys and selected value types.
expectTypeOf<ValueOf<Partial<DocumentedResult>, 'status'>>().toBe<'success' | 'failure' | undefined>();
expectTypeOf<ValueOf<Partial<DocumentedResult>, 'value' | 'error'>>().toBe<string | Error | undefined>();
expectTypeOf<ValueOf<Required<{value?: 1} | {error?: 2}>, 'value' | 'error'>>().toBe<1 | 2>();
expectTypeOf<ValueOf<Readonly<DocumentedResult>, 'value' | 'error'>>().toBe<string | Error>();
expectTypeOf<ValueOf<DocumentedResult & {requestId: number}, 'requestId'>>().toBe<number>();
expectTypeOf<ValueOf<DocumentedResult & {requestId: number}, 'value' | 'requestId'>>().toBe<string | number>();
expectTypeOf<ValueOf<Extract<DocumentedResult, {status: 'failure'}>, 'error'>>().toBe<Error>();
expectTypeOf<ValuesByKey<{first?: 1} | {second: 2}>>().toBe<{first: 1 | undefined; second: 2}>();
expectTypeOf<AllValues<{readonly first?: 1} | {second: 2}>>().toBe<1 | 2 | undefined>();
expectTypeOf<AllValues<{kind: 'success'; value: 1} | {kind: 'failure'; error: false}>>().toBe<'success' | 'failure' | 1 | false>();
expectTypeOf<SharedValues<{shared: 1; first: 2} | {shared?: 3; second: 4}, 'shared'>>().toBe<1 | 3 | undefined>();

// A member made impossible by conflicting discriminants cannot contribute a value.
type ImpossibleMember = {kind: 'first'; hidden: 1} & {kind: 'second'; hidden: 2};
expectTypeOf<ValueOf<ImpossibleMember | {value: 3}, 'value'>>().toBe<3>();
// @ts-expect-error A key present only in a `never` member is not selectable.
type ImpossibleMemberKey = ValueOf<ImpossibleMember | {value: 3}, 'hidden'>;

// Keyless members add no values and cannot make an invalid selection valid.
expectTypeOf<ValueOf<object | {value: 1}, 'value'>>().toBe<1>();
expectTypeOf<ValueOf<() => void, never>>().toBe<never>();
expectTypeOf<ValueOf<never | {value: 1}, 'value'>>().toBe<1>();
expectTypeOf<ValueOf<any, string | number | symbol>>().toBe<any>();
// @ts-expect-error `object` has no declared keys.
type ObjectInputKey = ValueOf<object, 'value'>;
// @ts-expect-error An empty object has no declared keys.
type EmptyObjectInputKey = ValueOf<{}, 'value'>;
// @ts-expect-error Adding a keyless member does not add new keys.
type EmptyMemberMissingKey = ValueOf<{} | {value: 1}, 'missing'>;
// @ts-expect-error A broad string does not select a finite set of named keys.
type FiniteStringKeys = ValueOf<{first: 1} | {second: 2}, string>;
// @ts-expect-error A broad number does not select a finite set of numeric keys.
type FiniteNumberKeys = ValueOf<{0: 1} | {1: 2}, number>;
// @ts-expect-error A partly invalid numeric key union is rejected in full.
type PartlyInvalidNumericKeys = ValueOf<{0: 1} | {1: 2}, 0 | 2>;
// @ts-expect-error A partly invalid symbol key union is rejected in full.
type PartlyInvalidSymbolKeys = ValueOf<{[token]: 1}, typeof token | typeof otherToken>;
// @ts-expect-error A valid string key does not permit a key from an absent numeric domain.
type InvalidMixedKeyDomains = ValueOf<{value: 1}, 'value' | number>;
