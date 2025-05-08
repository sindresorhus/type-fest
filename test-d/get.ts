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

// TypeScript is structurally typed. It's *possible* this value exists even though it's not on the parent interface, so the type is `unknown`.
expectTypeOf(get(apiResponse, 'hits.someNonsense.notTheRightPath')).toBeUnknown();

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
expectTypeOf<Get<WithTuples, 'foo[1].bar', NonStrict>>().toBeUnknown();

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

expectTypeOf<Get<WithNumberKeys, 'foo[2].bar', NonStrict>>().toBeUnknown();
expectTypeOf<Get<WithNumberKeys, 'foo.2.bar', NonStrict>>().toBeUnknown();

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
expectTypeOf<Get<number[], '[0][0]', NonStrict>>().toBeUnknown();
expectTypeOf<Get<number[][][], '[0][0][0]', NonStrict>>().toBeNumber();
expectTypeOf<Get<number[][][], '[0][0][0][0]', NonStrict>>().toBeUnknown();
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
