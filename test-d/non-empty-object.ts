import {expectTypeOf} from 'nz';
import type {NonEmptyObject, RequireAtLeastOne} from '../index.d.ts';

type TestType1 = {
	a: string;
	b: boolean;
};

type TestType2 = {
	a?: string;
	b?: boolean;
};

type TestType3 = {
	a: string;
	b?: boolean;
};

type TestType4 = {};

declare const test1: NonEmptyObject<TestType1>;
declare const test2: NonEmptyObject<TestType2>;
declare const test3: NonEmptyObject<TestType3>;
declare const test4: NonEmptyObject<TestType4>;

expectTypeOf(test1).toBe<TestType1>();
expectTypeOf(test2).toBe<RequireAtLeastOne<TestType2>>();
expectTypeOf(test3).toBe<TestType3>();
expectTypeOf(test4).toBe<never>();

// Unions are checked member by member, since `keyof` only sees the shared keys of a union.
declare const testUnion: NonEmptyObject<TestType2 | {c?: symbol}>;
expectTypeOf(testUnion).toBe<RequireAtLeastOne<TestType2, 'a' | 'b'> | RequireAtLeastOne<{c?: symbol}, 'c'>>();
({a: 1}) satisfies NonEmptyObject<{a?: 1} | {b?: 2}>;
({b: 2}) satisfies NonEmptyObject<{a?: 1} | {b?: 2}>;

// Known limitation: an index signature counts as a required key, so a type with one accepts an empty object. This keeps a dictionary usable, since every non-empty value of it is accepted.
({}) satisfies NonEmptyObject<Record<string, unknown>>;
({a: 1}) satisfies NonEmptyObject<Record<string, unknown>>;
({a: 1, b: 2}) satisfies NonEmptyObject<{[k: string]: number | undefined; a?: number}>;
({b: 2}) satisfies NonEmptyObject<{[k: string]: number | undefined; a?: number}>;
({}) satisfies NonEmptyObject<{[k: `data-${string}`]: string}>;
expectTypeOf<NonEmptyObject<Record<string, number>>>().toBe<Record<string, number>>();
expectTypeOf<NonEmptyObject<string[]>>().toBe<string[]>();

// Empty inputs remain rejected, while sentinel inputs keep their established constraints.
expectTypeOf<{}>().not.toBeAssignableTo<NonEmptyObject<{value?: string; enabled?: boolean}>>();
expectTypeOf<NonEmptyObject<any>>().toBe<any>();
expectTypeOf<NonEmptyObject<never>>().toBe<never>();
// @ts-expect-error Unknown does not meet the object constraint.
type InvalidUnknownObject = NonEmptyObject<unknown>;

// A required field is retained even beside an open dictionary or with an impossible value type.
type IndexedRequest = {[key: string]: unknown; readonly id: string; label?: string};
declare const indexedRequest: NonEmptyObject<IndexedRequest>;
expectTypeOf(indexedRequest.id).toBe<string>();
expectTypeOf<{label: string}>().not.toBeAssignableTo<NonEmptyObject<IndexedRequest>>();
// @ts-expect-error An otherwise valid value cannot replace a readonly field.
indexedRequest.id = 'changed';
expectTypeOf<{value: string}>().not.toBeAssignableTo<NonEmptyObject<{id: never; value?: string}>>();
expectTypeOf<NonEmptyObject<Array<string | undefined>>>().toBe<Array<string | undefined>>();

function makeUpdate<const Value>(value: Value): NonEmptyObject<{readonly value?: Value; label?: string}> {
	return {value};
}

function _readUpdate<Value>(update: NonEmptyObject<{readonly value?: Value; label?: string}>): Value | undefined {
	return update.value;
}

const inferredUpdate = makeUpdate({id: 'kept'});
expectTypeOf(inferredUpdate.value).toBe<{readonly id: 'kept'} | undefined>();
// @ts-expect-error A compatible value cannot replace a readonly property.
inferredUpdate.value = {id: 'kept'};

// A signature supplies no required field, while an index signature retains optional named fields.
expectTypeOf<NonEmptyObject<() => void>>().toBe<never>();
declare const optionalIndexed: NonEmptyObject<{[key: string]: unknown; readonly value?: number}>;
expectTypeOf(optionalIndexed.value).toBe<number | undefined>();
// @ts-expect-error A compatible value cannot replace the retained readonly field.
optionalIndexed.value = 1;

function _keepArray<Value>(values: Value[]): NonEmptyObject<Value[]> {
	return values;
}

// Each member's own requiredness matters even when the members have the same keys.
type SharedKeyRequest = NonEmptyObject<{kind: 'fixed'; readonly value?: number} | {kind?: 'loose'; readonly value?: string}>;
({kind: 'fixed'}) satisfies SharedKeyRequest;
({value: 'ready'}) satisfies SharedKeyRequest;
expectTypeOf<{}>().not.toBeAssignableTo<SharedKeyRequest>();
expectTypeOf<{kind: 'fixed'; value: string}>().not.toBeAssignableTo<SharedKeyRequest>();
declare const sharedKeyRequest: SharedKeyRequest;
// @ts-expect-error Requiring at least one field retains readonly fields in both members.
sharedKeyRequest.value = undefined;

// A selected optional field can explicitly contain undefined only when its declaration permits it.
({value: undefined}) satisfies NonEmptyObject<{readonly value?: number | undefined; label?: string}>;
expectTypeOf<{value: undefined}>().not.toBeAssignableTo<NonEmptyObject<{value?: number; label?: string}>>();
expectTypeOf<{impossible: undefined}>().not.toBeAssignableTo<NonEmptyObject<{impossible?: never; label?: string}>>();
({value: undefined}) satisfies NonEmptyObject<{value?: unknown}>;
expectTypeOf<{}>().not.toBeAssignableTo<NonEmptyObject<{value?: unknown}>>();

function _readGenericKeyUpdate<Key extends PropertyKey, Value>(update: NonEmptyObject<Partial<Record<Key, Value>>>): Partial<Record<Key, Value>> {
	return update;
}

type OptionalObjectUpdate = NonEmptyObject<{readonly first?: {id: string}; second?: {amount: number} | undefined}>;
({second: undefined}) satisfies OptionalObjectUpdate;
expectTypeOf<{first: {id: number}}>().not.toBeAssignableTo<OptionalObjectUpdate>();
declare const optionalObjectUpdate: OptionalObjectUpdate;
// @ts-expect-error Requiring a field never makes its readonly owner writable.
optionalObjectUpdate.first = {id: 'changed'};
