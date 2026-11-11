import {expectTypeOf} from 'nz';
import type {KeysOfUnion, ValueOf, ValuesOfUnion} from '../index.d.ts';

// Works with objects
expectTypeOf<ValuesOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, 'a'>>().toBe<1 | 3>();

// Works with arrays
expectTypeOf<ValuesOfUnion<string[] | [number, boolean], number>>().toBe<string | number | boolean>();

// Works with index signatures
expectTypeOf<ValuesOfUnion<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, string>>().toBe<string>();

expectTypeOf<ValuesOfUnion<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, number>>().toBe<string | number>();

// Works with functions
expectTypeOf<ValuesOfUnion<(() => void) | {(): void; a: 1} | {(): void; a: 2}, 'a'>>().toBe<1 | 2>();

// Ignores objects where `Key` is missing
expectTypeOf<ValuesOfUnion<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; d: 6} | {e: 7}, 'a'>>().toBe<1 | 3 | 5>();

// Adds `undefined` when the key is optional
expectTypeOf<ValuesOfUnion<{readonly a?: 1; b: 2} | {a: 3; c: 4}, 'a'>>().toBe<1 | 3 | undefined>();

// Works when `Key` is a union
expectTypeOf<ValuesOfUnion<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; b: 6} | {e: 7}, 'a' | 'b'>>().toBe<1 | 2 | 3 | 5 | 6>();

// @ts-expect-error - Errors if `Key` is missing from all of the objects
type MissingObjectKey = ValuesOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, 'd'>;

// Returns `any` when `Key` is `any`
expectTypeOf<ValuesOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, any>>().toBe<any>();

// Returns `never` when `Key` is `never`
expectTypeOf<ValuesOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, never>>().toBe<never>();

// Conflicting discriminants do not hide a value present in only one member.
type Result = {kind: 'success'; value: string} | {kind: 'failure'; error: Error};
expectTypeOf<ValuesOfUnion<Result, 'value' | 'error'>>().toBe<string | Error>();
// @ts-expect-error A key absent from every member is rejected.
type MissingResultValue = ValuesOfUnion<Result, 'missing'>;

// Optional symbol properties contribute `undefined`, while absent properties contribute nothing.
declare const token: unique symbol;
expectTypeOf<ValuesOfUnion<{readonly [token]?: string} | {[token]: number} | {id: string}, typeof token>>().toBe<string | number | undefined>();

// Empty and nullish members do not introduce `undefined` into a required property's value.
expectTypeOf<ValuesOfUnion<{value: string} | {} | null | undefined, 'value'>>().toBe<string>();
expectTypeOf<ValuesOfUnion<unknown, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<never, 'value'>>().toBe<never>();
expectTypeOf<ValuesOfUnion<any, 'value'>>().toBe<any>();

// Read a single type, preserve nested objects, and do not add unrelated property values.
expectTypeOf<ValuesOfUnion<{id: number; name: string}, 'id'>>().toBe<number>();
expectTypeOf<ValuesOfUnion<{data: {id: number}} | {data: {name: string}}, 'data'>>().toBe<{id: number} | {name: string}>();
expectTypeOf<ValuesOfUnion<Result, 'value'>>().not.toBeAssignableTo<Error>();

// The documentation examples.
type DocumentedResult =
	| {status: 'success'; value: string}
	| {status: 'failure'; error: Error};
expectTypeOf<ValuesOfUnion<DocumentedResult, 'status'>>().toBe<'success' | 'failure'>();
expectTypeOf<ValuesOfUnion<DocumentedResult, 'value'>>().toBe<string>();
expectTypeOf<ValuesOfUnion<DocumentedResult, 'error'>>().toBe<Error>();
expectTypeOf<ValuesOfUnion<DocumentedResult, 'value' | 'error'>>().toBe<string | Error>();
expectTypeOf<ValuesOfUnion<Record<string, string> | {retries: number}, string>>().toBe<string>();
expectTypeOf<ValueOf<Record<string, string> | {retries: number}, string>>().toBe<string | number>();

// Declared nullish values are retained, even though missing properties are ignored.
expectTypeOf<ValuesOfUnion<{value: null} | {value: undefined} | {other: true}, 'value'>>().toBe<null | undefined>();
expectTypeOf<ValuesOfUnion<{value?: never} | {other: true}, 'value'>>().toBe<undefined>();
expectTypeOf<ValuesOfUnion<{value: never} | {value: 1}, 'value'>>().toBe<1>();
expectTypeOf<ValuesOfUnion<{value: never} | {other: true}, 'value'>>().toBe<never>();
expectTypeOf<ValuesOfUnion<{value: unknown} | {value: 1}, 'value'>>().toBe<unknown>();
expectTypeOf<ValuesOfUnion<{value: any} | {value: 1}, 'value'>>().toBe<any>();

// Different spellings of a numeric key follow `keyof`, without alias conversion.
type NumericKeys = {0: 'number'} | {'0': 'string'};
expectTypeOf<ValuesOfUnion<NumericKeys, 0>>().toBe<'number'>();
expectTypeOf<ValuesOfUnion<NumericKeys, '0'>>().toBe<'string'>();
expectTypeOf<ValuesOfUnion<NumericKeys, 0 | '0'>>().toBe<'number' | 'string'>();
// @ts-expect-error Numeric key aliases are not added to the key constraint.
type NumericAlias = ValuesOfUnion<{0: 'zero'}, '0'>;

// Unique symbols can be selected independently or together with string keys.
declare const otherToken: unique symbol;
type SymbolKeys = {[token]: 1; name: 'first'} | {[otherToken]: 2; name: 'second'};
expectTypeOf<ValuesOfUnion<SymbolKeys, typeof token>>().toBe<1>();
expectTypeOf<ValuesOfUnion<SymbolKeys, typeof token | typeof otherToken>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<SymbolKeys, typeof token | 'name'>>().toBe<1 | 'first' | 'second'>();
// @ts-expect-error A broad symbol key needs a symbol index signature.
type BroadSymbol = ValuesOfUnion<SymbolKeys, symbol>;

// Literal keys read named properties even when an index signature is present.
type SymbolIndex = {[key: symbol]: unknown; [token]: string} | {[token]: number};
expectTypeOf<ValuesOfUnion<SymbolIndex, typeof token>>().toBe<string | number>();
expectTypeOf<ValuesOfUnion<SymbolIndex, symbol>>().toBe<unknown>();
expectTypeOf<ValuesOfUnion<{[key: string]: unknown; id: 1} | {id: 2}, 'id'>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<{[key: number]: string} | {0: number}, 0>>().toBe<string | number>();

// Broad keys select only members with a matching index signature.
type IndexUnion = {[key: string]: string; label: 'text'} | {[key: number]: number; label: true};
expectTypeOf<ValuesOfUnion<IndexUnion, string>>().toBe<string>();
expectTypeOf<ValueOf<IndexUnion, string>>().toBe<string | true>();
expectTypeOf<ValuesOfUnion<IndexUnion, number>>().toBe<string | number>();
expectTypeOf<ValuesOfUnion<IndexUnion, 'label'>>().toBe<'text' | true>();
expectTypeOf<ValuesOfUnion<Record<string, 1> | {name: 2}, string | 'name'>>().toBe<1>();

type MixedIndexUnion = {[key: number]: string; label: true} | {[key: symbol]: boolean; label: false};
expectTypeOf<ValuesOfUnion<MixedIndexUnion, number>>().toBe<string>();
expectTypeOf<ValueOf<MixedIndexUnion, number>>().toBe<string | boolean>();
expectTypeOf<ValuesOfUnion<MixedIndexUnion, symbol>>().toBe<boolean>();
expectTypeOf<ValueOf<MixedIndexUnion, symbol>>().toBe<string | boolean>();
expectTypeOf<ValuesOfUnion<MixedIndexUnion, number | symbol>>().toBe<string | boolean>();
expectTypeOf<ValuesOfUnion<MixedIndexUnion, number | 'label'>>().toBe<string | boolean>();

// Template index signatures retain their native domain.
type DataAttributes = {[key: `data-${string}`]: string} | {id: number};
expectTypeOf<ValuesOfUnion<DataAttributes, `data-${string}`>>().toBe<string>();
expectTypeOf<ValuesOfUnion<DataAttributes, 'data-name' | 'id'>>().toBe<string | number>();
// @ts-expect-error An arbitrary string is outside the template index domain.
type InvalidDataAttribute = ValuesOfUnion<DataAttributes, 'name'>;

// Arrays and tuples support numeric indices, optional elements, rest elements, and named keys.
expectTypeOf<ValuesOfUnion<readonly string[] | readonly [number, boolean], number>>().toBe<string | number | boolean>();
expectTypeOf<ValuesOfUnion<[1] | [2, 3], '0'>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<[1] | [2, 3], '1'>>().toBe<3>();
expectTypeOf<ValuesOfUnion<readonly [first?: 1] | readonly [2], '0'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValuesOfUnion<[] | [1, 2], number>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<[1, ...string[]] | readonly [2, ...boolean[]], number>>().toBe<1 | 2 | string | boolean>();
expectTypeOf<ValuesOfUnion<[1] | [2, 3], 'length'>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<string[] | {length: 'unknown'}, 'length'>>().toBe<number | 'unknown'>();

// Callable and constructable types retain their declared properties.
type Constructor = {new(): {id: number}; kind: 'factory'};
expectTypeOf<ValuesOfUnion<Constructor | {kind: 'instance'}, 'kind'>>().toBe<'factory' | 'instance'>();
expectTypeOf<ValuesOfUnion<{(): void; readonly state?: 'ready'} | {state: 'busy'}, 'state'>>().toBe<'ready' | 'busy' | undefined>();

// Intersections contribute all their keys and preserve value intersections.
type Entity = {id: number} & {name: string};
expectTypeOf<ValuesOfUnion<Entity | {active: boolean}, 'id' | 'name' | 'active'>>().toBe<number | string | boolean>();
expectTypeOf<ValuesOfUnion<({value: {id: number}} & {value: {name: string}}) | {value: null}, 'value'>>().toBe<({id: number} & {name: string}) | null>();

// Primitive members participate through their native keys; keyless members contribute nothing.
expectTypeOf<ValuesOfUnion<string | {length: false}, 'length'>>().toBe<number | false>();
expectTypeOf<ValuesOfUnion<void | number | {value: 1} | null | undefined, 'value'>>().toBe<1>();

// Generic composition works with both shared keys and all member keys.
type AllValues<Union> = ValuesOfUnion<Union, KeysOfUnion<Union>>;
expectTypeOf<AllValues<Result>>().toBe<string | Error>();
type SharedValues<Union, Key extends keyof Union> = ValuesOfUnion<Union, Key>;
expectTypeOf<SharedValues<Result, 'kind'>>().toBe<'success' | 'failure'>();
type ValuesByKey<Union> = {[Key in KeysOfUnion<Union>]: ValuesOfUnion<Union, Key>};
expectTypeOf<ValuesByKey<Result>>().toBe<{kind: 'success' | 'failure'; value: string; error: Error}>();

// A large union of distinct keys remains usable.
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MemberName = `field${Digit}${Digit}`;
type LargeUnion = {[Key in MemberName]: Record<Key, Key>}[MemberName];
expectTypeOf<ValuesOfUnion<LargeUnion, MemberName>>().toBe<MemberName>();

// Special inputs and keys.
expectTypeOf<ValuesOfUnion<any, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<any, any>>().toBe<any>();
expectTypeOf<ValuesOfUnion<never, any>>().toBe<never>();
expectTypeOf<ValuesOfUnion<never, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<{}, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<object, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<null, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<undefined, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<void, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<{value: 1}, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<unknown | {value: 1}, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<any | {value: 1}, 'value'>>().toBe<any>();

// Reject malformed or partly invalid key selections.
// @ts-expect-error The key must belong to at least one union member.
type UnknownKey = ValuesOfUnion<unknown, 'value'>;
// @ts-expect-error Every selected key must belong to at least one union member.
type PartlyInvalidKeys = ValuesOfUnion<Result, 'value' | 'missing'>;
// @ts-expect-error `unknown` cannot be used as a property key.
type UnknownPropertyKey = ValuesOfUnion<Result, unknown>;
// @ts-expect-error Objects cannot be used as property keys.
type ObjectPropertyKey = ValuesOfUnion<Result, {kind: 'value'}>;
// @ts-expect-error The key argument is required.
type MissingKeyArgument = ValuesOfUnion<Result>;

// Realistic messages have disjoint payloads, optional metadata, and a payload-free member.
type Message =
	| {kind: 'text'; content: string; sender?: {name: string}}
	| {kind: 'attachment'; file: {name: string; size: number}; sender: {id: number}}
	| {kind: 'closed'; reason: 'timeout' | 'requested'};
expectTypeOf<ValuesOfUnion<Message, 'kind'>>().toBe<'text' | 'attachment' | 'closed'>();
expectTypeOf<ValuesOfUnion<Message, 'content' | 'file'>>().toBe<string | {name: string; size: number}>();
expectTypeOf<ValuesOfUnion<Message, 'sender'>>().toBe<{name: string} | {id: number} | undefined>();
expectTypeOf<ValuesOfUnion<Message, 'reason'>>().toBe<'timeout' | 'requested'>();
expectTypeOf<ValuesOfUnion<Exclude<Message, {kind: 'closed'}>, 'sender'>>().toBe<{name: string} | {id: number} | undefined>();

// An unselected property cannot widen the result, even when its value is `any` or `unknown`.
type UnselectedSpecialValues = {selected: 1; unrelated: any} | {selected: 2; unrelated: unknown} | {unrelated: undefined};
expectTypeOf<ValuesOfUnion<UnselectedSpecialValues, 'selected'>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<UnselectedSpecialValues, 'unrelated'>>().toBe<any>();
expectTypeOf<ValuesOfUnion<{selected: 1} | {unrelated: unknown}, 'selected'>>().toBe<1>();
expectTypeOf<ValuesOfUnion<{selected: 1} | {unrelated: any}, 'selected'>>().toBe<1>();

// Property values are returned intact, without unwrapping, invoking, or making them mutable.
type StoredValues =
	| {value: Promise<{id: number}>}
	| {value: readonly [string, number]}
	| {value: ReadonlyMap<string, boolean>}
	| {value: () => Date};
expectTypeOf<ValuesOfUnion<StoredValues, 'value'>>().toBe<Promise<{id: number}> | readonly [string, number] | ReadonlyMap<string, boolean> | (() => Date)>();
expectTypeOf<ValuesOfUnion<{value: readonly string[]} | {value: number[]}, 'value'>>().toBe<readonly string[] | number[]>();
expectTypeOf<ValuesOfUnion<{value: {readonly id: number}} | {value: null}, 'value'>>().toBe<{readonly id: number} | null>();
expectTypeOf<ValuesOfUnion<{value: () => 1} | {value: (name: string) => 2}, 'value'>>().toBe<(() => 1) | ((name: string) => 2)>();
expectTypeOf<ValuesOfUnion<{value: Date} | {value: RegExp}, 'value'>>().toBe<Date | RegExp>();
expectTypeOf<ValuesOfUnion<{value: Set<string>} | {value: Map<string, number>}, 'value'>>().toBe<Set<string> | Map<string, number>>();

// Optionality belongs to the selected property, including when all selected values are absent.
expectTypeOf<ValuesOfUnion<{first?: 1} | {second?: 2}, 'first' | 'second'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValuesOfUnion<{value?: undefined} | {other: 1}, 'value'>>().toBe<undefined>();
expectTypeOf<ValuesOfUnion<{first: never} | {second: never}, 'first' | 'second'>>().toBe<never>();
expectTypeOf<ValuesOfUnion<{first?: never} | {second: never}, 'first' | 'second'>>().toBe<undefined>();
expectTypeOf<ValuesOfUnion<{readonly value: 1} | {value: 2}, 'value'>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<{readonly value?: null} | {value: false}, 'value'>>().toBe<null | false | undefined>();

// Three separate index domains do not leak values into one another.
type SeparateIndexDomains = {[key: string]: 'text'} | {[key: number]: 'number'} | {[key: symbol]: 'symbol'};
expectTypeOf<ValuesOfUnion<SeparateIndexDomains, string>>().toBe<'text'>();
expectTypeOf<ValuesOfUnion<SeparateIndexDomains, number>>().toBe<'text' | 'number'>();
expectTypeOf<ValuesOfUnion<SeparateIndexDomains, symbol>>().toBe<'symbol'>();
expectTypeOf<ValuesOfUnion<SeparateIndexDomains, string | symbol>>().toBe<'text' | 'symbol'>();
expectTypeOf<ValuesOfUnion<SeparateIndexDomains, PropertyKey>>().toBe<'text' | 'number' | 'symbol'>();
expectTypeOf<ValuesOfUnion<SeparateIndexDomains, 'name' | 0 | typeof token>>().toBe<'text' | 'number' | 'symbol'>();
expectTypeOf<ValuesOfUnion<SeparateIndexDomains, '0'>>().toBe<'text'>();

// A named property can be narrower than its index signature.
type NamedIndexProperties =
	| {[key: string]: string | number; name: 'indexed'; count: 1}
	| {name: 'named'; count?: 2; active: true};
expectTypeOf<ValuesOfUnion<NamedIndexProperties, 'name'>>().toBe<'indexed' | 'named'>();
expectTypeOf<ValuesOfUnion<NamedIndexProperties, 'count'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValuesOfUnion<NamedIndexProperties, 'active'>>().toBe<string | number | true>();
expectTypeOf<ValuesOfUnion<NamedIndexProperties, string>>().toBe<string | number>();
expectTypeOf<ValuesOfUnion<Readonly<Record<string, 1>> | {value?: 2}, 'value'>>().toBe<1 | 2 | undefined>();
expectTypeOf<ValuesOfUnion<Partial<Record<string, 1>> | {value: 2}, string>>().toBe<1 | undefined>();

// Separate template domains select only matching members, even for narrower template keys.
type AttributeDomains =
	| {[key: `data-${string}`]: {data: string}}
	| {[key: `aria-${string}`]: {aria: boolean}}
	| {'data-id': {id: number}; title: 'named'};
expectTypeOf<ValuesOfUnion<AttributeDomains, `data-${string}`>>().toBe<{data: string}>();
expectTypeOf<ValuesOfUnion<AttributeDomains, `aria-${string}`>>().toBe<{aria: boolean}>();
expectTypeOf<ValuesOfUnion<AttributeDomains, `data-${string}` | `aria-${string}`>>().toBe<{data: string} | {aria: boolean}>();
expectTypeOf<ValuesOfUnion<AttributeDomains, 'data-id'>>().toBe<{data: string} | {id: number}>();
expectTypeOf<ValuesOfUnion<AttributeDomains, 'aria-label' | 'title'>>().toBe<'named' | {aria: boolean}>();
expectTypeOf<ValuesOfUnion<AttributeDomains, `data-user-${string}`>>().toBe<{data: string}>();
expectTypeOf<ValuesOfUnion<AttributeDomains, `data-${number}`>>().toBe<{data: string}>();
// @ts-expect-error A broad string is not covered by a template index signature.
type BroadAttributeKey = ValuesOfUnion<AttributeDomains, string>;
// @ts-expect-error A valid template domain does not make a second domain valid.
type MixedAttributeKeys = ValuesOfUnion<AttributeDomains, `data-${string}` | `other-${string}`>;

// A broad index domain absorbs narrower keys before member distribution.
expectTypeOf<ValuesOfUnion<Record<number, 1> | {0: 2}, number | 0>>().toBe<1>();
expectTypeOf<ValuesOfUnion<Record<symbol, 1> | {[token]: 2}, symbol | typeof token>>().toBe<1>();
expectTypeOf<ValuesOfUnion<Record<`data-${string}`, 1> | {'data-id': 2}, `data-${string}` | 'data-id'>>().toBe<1>();

// Well-known symbol properties are ordinary selectable keys, with no string conversion.
type IterableValues = {[Symbol.iterator]: () => ArrayIterator<string>} | {[Symbol.toStringTag]: 'custom'};
expectTypeOf<ValuesOfUnion<IterableValues, typeof Symbol.iterator>>().toBe<() => ArrayIterator<string>>();
expectTypeOf<ValuesOfUnion<IterableValues, typeof Symbol.toStringTag>>().toBe<'custom'>();
expectTypeOf<ValuesOfUnion<IterableValues, typeof Symbol.iterator | typeof Symbol.toStringTag>>().toBe<(() => ArrayIterator<string>) | 'custom'>();
// @ts-expect-error The string spelling of a symbol is a different property key.
type StringifiedSymbolKey = ValuesOfUnion<IterableValues, 'Symbol.iterator'>;
// @ts-expect-error An unrelated unique symbol is absent from every member.
type MissingSymbolKey = ValuesOfUnion<{[token]: 1}, typeof otherToken>;

// Numeric tuple indexes include out-of-bounds reads; string indexes require a declared tuple key.
expectTypeOf<ValuesOfUnion<[1] | [2, 3], 1>>().toBe<3 | undefined>();
expectTypeOf<ValuesOfUnion<[] | [1], 0>>().toBe<1 | undefined>();
expectTypeOf<ValuesOfUnion<string[] | [1], '0'>>().toBe<1>();
expectTypeOf<ValuesOfUnion<string[] | [1, 2], '1'>>().toBe<2>();
expectTypeOf<ValuesOfUnion<[first?: 1] | readonly [], number>>().toBe<1 | undefined>();
expectTypeOf<ValuesOfUnion<readonly [1, ...string[]] | [], 'length'>>().toBe<number>();
expectTypeOf<ValuesOfUnion<[first?: 1] | [2, 3], 'length'>>().toBe<0 | 1 | 2>();
expectTypeOf<ValuesOfUnion<[1] | {0: false}, 0>>().toBe<1 | false>();
expectTypeOf<ValuesOfUnion<[1] | {0: false}, '0'>>().toBe<1>();
// @ts-expect-error Arrays expose a numeric index signature, not a broad string index signature.
type ArrayStringIndex = ValuesOfUnion<string[], string>;
// @ts-expect-error A tuple's numeric index signature does not add undeclared string indexes.
type MissingTupleStringIndex = ValuesOfUnion<[1] | [2, 3], '2'>;

// An array method is present only on mutable members, and its full signature is preserved.
expectTypeOf<ValuesOfUnion<string[] | readonly number[], 'push'>>().toBe<string[]['push']>();
expectTypeOf<ValuesOfUnion<string[] | {push: false}, 'push'>>().toBe<string[]['push'] | false>();
expectTypeOf<ValuesOfUnion<ReadonlyMap<string, number> | {size: 'pending'}, 'size'>>().toBe<number | 'pending'>();

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
expectTypeOf<ValuesOfUnion<RecordOrError, 'id'>>().toBe<number>();
expectTypeOf<ValuesOfUnion<RecordOrError, 'name' | 'displayName'>>().toBe<string>();
expectTypeOf<ValuesOfUnion<RecordOrError, 'id' | 'error'>>().toBe<number | Error>();
expectTypeOf<ValuesOfUnion<typeof NamedRecord | {category: 'other'}, 'category'>>().toBe<'record' | 'other'>();
// @ts-expect-error The constructor's prototype is not a property of a class instance.
type InstancePrototypeKey = ValuesOfUnion<RecordOrError, 'prototype'>;
// @ts-expect-error Protected instance properties are not keys of a class instance.
type ProtectedInstanceKey = ValuesOfUnion<RecordOrError, 'internal'>;
// @ts-expect-error A static property is not an instance property.
type StaticInstanceKey = ValuesOfUnion<RecordOrError, 'category'>;

// Existing generic transformations preserve member-specific keys and selected value types.
expectTypeOf<ValuesOfUnion<Partial<DocumentedResult>, 'status'>>().toBe<'success' | 'failure' | undefined>();
expectTypeOf<ValuesOfUnion<Partial<DocumentedResult>, 'value' | 'error'>>().toBe<string | Error | undefined>();
expectTypeOf<ValuesOfUnion<Required<{value?: 1} | {error?: 2}>, 'value' | 'error'>>().toBe<1 | 2>();
expectTypeOf<ValuesOfUnion<Readonly<DocumentedResult>, 'value' | 'error'>>().toBe<string | Error>();
expectTypeOf<ValuesOfUnion<DocumentedResult & {requestId: number}, 'requestId'>>().toBe<number>();
expectTypeOf<ValuesOfUnion<DocumentedResult & {requestId: number}, 'value' | 'requestId'>>().toBe<string | number>();
expectTypeOf<ValuesOfUnion<Extract<DocumentedResult, {status: 'failure'}>, 'error'>>().toBe<Error>();
expectTypeOf<ValuesByKey<{first?: 1} | {second: 2}>>().toBe<{first: 1 | undefined; second: 2}>();
expectTypeOf<AllValues<{readonly first?: 1} | {second: 2}>>().toBe<1 | 2 | undefined>();
expectTypeOf<AllValues<{kind: 'success'; value: 1} | {kind: 'failure'; error: false}>>().toBe<'success' | 'failure' | 1 | false>();
expectTypeOf<SharedValues<{shared: 1; first: 2} | {shared?: 3; second: 4}, 'shared'>>().toBe<1 | 3 | undefined>();

// A member made impossible by conflicting discriminants cannot contribute a value.
type ImpossibleMember = {kind: 'first'; hidden: 1} & {kind: 'second'; hidden: 2};
expectTypeOf<ValuesOfUnion<ImpossibleMember | {value: 3}, 'value'>>().toBe<3>();
// @ts-expect-error A key present only in a `never` member is not selectable.
type ImpossibleMemberKey = ValuesOfUnion<ImpossibleMember | {value: 3}, 'hidden'>;

// Keyless members add no values and cannot make an invalid selection valid.
expectTypeOf<ValuesOfUnion<object | {value: 1}, 'value'>>().toBe<1>();
expectTypeOf<ValuesOfUnion<() => void, never>>().toBe<never>();
expectTypeOf<ValuesOfUnion<never | {value: 1}, 'value'>>().toBe<1>();
expectTypeOf<ValuesOfUnion<any, string | number | symbol>>().toBe<any>();
// @ts-expect-error `object` has no declared keys.
type ObjectInputKey = ValuesOfUnion<object, 'value'>;
// @ts-expect-error An empty object has no declared keys.
type EmptyObjectInputKey = ValuesOfUnion<{}, 'value'>;
// @ts-expect-error Adding a keyless member does not add new keys.
type EmptyMemberMissingKey = ValuesOfUnion<{} | {value: 1}, 'missing'>;
// @ts-expect-error A broad string does not select a finite set of named keys.
type FiniteStringKeys = ValuesOfUnion<{first: 1} | {second: 2}, string>;
// @ts-expect-error A broad number does not select a finite set of numeric keys.
type FiniteNumberKeys = ValuesOfUnion<{0: 1} | {1: 2}, number>;
// @ts-expect-error A partly invalid numeric key union is rejected in full.
type PartlyInvalidNumericKeys = ValuesOfUnion<{0: 1} | {1: 2}, 0 | 2>;
// @ts-expect-error A partly invalid symbol key union is rejected in full.
type PartlyInvalidSymbolKeys = ValuesOfUnion<{[token]: 1}, typeof token | typeof otherToken>;
// @ts-expect-error A valid string key does not permit a key from an absent numeric domain.
type InvalidMixedKeyDomains = ValuesOfUnion<{value: 1}, 'value' | number>;
