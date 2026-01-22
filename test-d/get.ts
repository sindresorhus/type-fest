import {expectTypeOf} from 'expect-type';
import type {Get} from '../index.d.ts';

type NonStrict = {strict: false};

declare const get: <ObjectType, Path extends string | readonly string[]>(object: ObjectType, path: Path) => Get<ObjectType, Path, NonStrict>;

type ApiResponse = {
	hits: {
		hits: Array<{
			_id: string;
			_source: {
				name: Array<{
					given: string[];
					family: string;
				}>;
				birthDate: string;
			};
		}>;
	};
};

declare const apiResponse: ApiResponse;

expectTypeOf(get(apiResponse, 'hits.hits[0]._source.name')).toEqualTypeOf<Array<{given: string[]; family: string}>>();
expectTypeOf(get(apiResponse, 'hits.hits.0._source.name')).toEqualTypeOf<Array<{given: string[]; family: string}>>();

expectTypeOf(get(apiResponse, 'hits.hits[0]._source.name[0].given[0]')).toBeString();

// When accessing a non-existent property, returns `undefined` (changed from `unknown` to support union distribution).
expectTypeOf(get(apiResponse, 'hits.someNonsense.notTheRightPath')).toEqualTypeOf<undefined>();

type WithDictionary = {
	foo: Record<string, {
		bar: number;
	}>;
	baz: Record<string, {
		qux: Array<{x: boolean}>;
	}>;
};

declare const withDictionary: WithDictionary;

// Should work with const array literal (non-const array is just a `string[]` and isn't useful)
expectTypeOf(get(withDictionary, ['baz', 'something', 'qux', '0', 'x'] as const)).toBeBoolean();

// Should work with dynamic keys
declare const someKey: string;
expectTypeOf(get(withDictionary, ['foo', someKey, 'bar'] as const)).toBeNumber();

// This interface uses a tuple type (as opposed to an array).
type WithTuples = {
	foo: [
		{
			bar: number;
		},
		{
			baz: boolean;
		},
	];
};

expectTypeOf<Get<WithTuples, 'foo[0].bar', NonStrict>>().toBeNumber();
expectTypeOf<Get<WithTuples, 'foo.0.bar', NonStrict>>().toBeNumber();

expectTypeOf<Get<WithTuples, 'foo[1].baz', NonStrict>>().toBeBoolean();
// Property 'bar' doesn't exist in foo[1], returns undefined
expectTypeOf<Get<WithTuples, 'foo[1].bar', NonStrict>>().toEqualTypeOf<undefined>();

expectTypeOf<Get<WithTuples, 'foo[-1]', NonStrict>>().toBeUnknown();
expectTypeOf<Get<WithTuples, 'foo[999]', NonStrict>>().toBeUnknown();

type EmptyTuple = Parameters<() => {}>;

expectTypeOf<Get<EmptyTuple, '-1', NonStrict>>().toBeUnknown();
expectTypeOf<Get<EmptyTuple, '0', NonStrict>>().toBeUnknown();
expectTypeOf<Get<EmptyTuple, '1', NonStrict>>().toBeUnknown();
expectTypeOf<Get<EmptyTuple, 'length', NonStrict>>().toEqualTypeOf<0>();

type WithNumberKeys = {
	foo: {
		1: {
			bar: number;
		};
	};
};

expectTypeOf<Get<WithNumberKeys, 'foo[1].bar', NonStrict>>().toBeNumber();
expectTypeOf<Get<WithNumberKeys, 'foo.1.bar', NonStrict>>().toBeNumber();

// Key '2' doesn't exist in foo, returns undefined
expectTypeOf<Get<WithNumberKeys, 'foo[2].bar', NonStrict>>().toEqualTypeOf<undefined>();
expectTypeOf<Get<WithNumberKeys, 'foo.2.bar', NonStrict>>().toEqualTypeOf<undefined>();

// Test `readonly`, `ReadonlyArray`, optional properties, and unions with null.

type WithModifiers = {
	foo: ReadonlyArray<{
		bar?: {
			readonly baz: {
				qux: number;
			};
		};
		abc: {
			def: {
				ghi: string;
			};
		} | null;
	}>;
};

expectTypeOf<Get<WithModifiers, 'foo[0].bar.baz', NonStrict>>().toEqualTypeOf<{qux: number} | undefined>();
expectTypeOf<Get<WithModifiers, 'foo[0].abc.def.ghi', NonStrict>>().toEqualTypeOf<string | undefined>();
// Test bracket notation
expectTypeOf<Get<number[], '[0]', NonStrict>>().toBeNumber();
// NOTE: This would fail if `[0][0]` was converted into `00`:
// Accessing index on a non-array (number) returns undefined
expectTypeOf<Get<number[], '[0][0]', NonStrict>>().toEqualTypeOf<undefined>();
expectTypeOf<Get<number[][][], '[0][0][0]', NonStrict>>().toBeNumber();
// Accessing index on a non-array (number) returns undefined
expectTypeOf<Get<number[][][], '[0][0][0][0]', NonStrict>>().toEqualTypeOf<undefined>();
expectTypeOf<Get<{a: {b: Array<Array<Array<{id: number}>>>}}, 'a.b[0][0][0].id', NonStrict>>().toBeNumber();
expectTypeOf<Get<{a: {b: Array<Array<Array<{id: number}>>>}}, ['a', 'b', '0', '0', '0', 'id'], NonStrict>>().toBeNumber();

// Test strict version:
expectTypeOf<Get<string[], '0'>>().toEqualTypeOf<string | undefined>();
expectTypeOf<Get<Record<string, number>, 'foo'>>().toEqualTypeOf<number | undefined>();
expectTypeOf<Get<Record<'a' | 'b', number>, 'a'>>().toEqualTypeOf<number>();
expectTypeOf<Get<Record<1 | 2, string>, '1'>>().toEqualTypeOf<string>();
expectTypeOf<Get<{1: boolean}, '1'>>().toBeBoolean();
expectTypeOf<Get<[number, string], '0'>>().toBeNumber();
expectTypeOf<Get<{[key: string]: string; a: string}, 'a'>>().toBeString();

expectTypeOf<Get<WithDictionary, 'foo.whatever'>>().toEqualTypeOf<{bar: number} | undefined>();
expectTypeOf<Get<WithDictionary, 'foo.whatever.bar'>>().toEqualTypeOf<number | undefined>();
expectTypeOf<Get<WithDictionary, 'baz.whatever.qux[3].x'>>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<Get<WithDictionary, ['baz', 'whatever', 'qux', '3', 'x']>>().toEqualTypeOf<boolean | undefined>();

// Test array index out of bounds
expectTypeOf<Get<{a: []}, 'a[0]'>>().toEqualTypeOf<unknown>();
expectTypeOf<Get<{a: readonly []}, 'a[0]'>>().toEqualTypeOf<unknown>();

// Test empty path array
expectTypeOf<WithDictionary>().toEqualTypeOf<Get<WithDictionary, []>>();
expectTypeOf<WithDictionary>().toEqualTypeOf<Get<WithDictionary, readonly []>>();

// eslint-disable-next-line no-lone-blocks
{
	type Foo = {
		array: string[];
	};

	type FooPaths = `array.${number}`;
	expectTypeOf<Get<Foo, FooPaths>>().toEqualTypeOf<string | undefined>();

	type FooPaths2 = 'array.1';
	expectTypeOf<Get<Foo, FooPaths2>>().toEqualTypeOf<string | undefined>();
}

// Test discriminated unions with partial properties (Issue #1205)

// Discriminated union where some members have a property and others don't
type TestDiscriminatedUnion = {
	data:
		| {type: 'type1'; someVal: number}
		| {type: 'type2'; someVal: string}
		| {type: 'type3'}; // `someVal` doesn't exist here
};

declare const testDiscriminatedUnion: TestDiscriminatedUnion;

// Property that exists in all union members - using the get function pattern from existing tests
expectTypeOf(get(testDiscriminatedUnion, ['data', 'type'] as const)).toEqualTypeOf<'type1' | 'type2' | 'type3'>();

// Property that exists only in some union members - should return the union of values plus undefined
expectTypeOf(get(testDiscriminatedUnion, ['data', 'someVal'] as const)).toEqualTypeOf<number | string | undefined>();

// Property that doesn't exist in any union member - should return undefined
expectTypeOf(get(testDiscriminatedUnion, ['data', 'nonExistent'] as const)).toEqualTypeOf<undefined>();

// Test nested unions
type TestNestedUnion = {
	outer:
		| {inner: {deep: number}}
		| {inner: {other: string}};
};

declare const testNestedUnion: TestNestedUnion;

// Each union member has 'inner', but inner's properties differ
expectTypeOf(get(testNestedUnion, ['outer', 'inner', 'deep'] as const)).toEqualTypeOf<number | undefined>();
expectTypeOf(get(testNestedUnion, ['outer', 'inner', 'other'] as const)).toEqualTypeOf<string | undefined>();

// Test union at root level
type TestRootUnion =
	| {a: number; common: string}
	| {b: boolean; common: string};

declare const testRootUnion: TestRootUnion;

expectTypeOf(get(testRootUnion, ['common'] as const)).toEqualTypeOf<string>();
expectTypeOf(get(testRootUnion, ['a'] as const)).toEqualTypeOf<number | undefined>();
expectTypeOf(get(testRootUnion, ['b'] as const)).toEqualTypeOf<boolean | undefined>();
