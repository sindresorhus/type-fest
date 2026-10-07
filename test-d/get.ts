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
// A non-literal path is read as a single key.
expectTypeOf<Get<Record<string, number>, string>>().toEqualTypeOf<number | undefined>();
expectTypeOf<Get<{a: {b: number}}, string>>().toEqualTypeOf<unknown>();
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

// Known limitation: a path that descends past a union whose members do not share their keys resolves to `unknown`, because `keyof` of a union is the intersection of the members' keys. `Paths` still accepts that path. See the note in the docs.
type WithNestedUnion = {data: {user: {id: string} | {error: string}}};
expectTypeOf<Get<WithNestedUnion, 'data.user.id'>>().toEqualTypeOf<unknown>();

// A key every member of the union shares is found, because then it is in the intersection.
expectTypeOf<Get<{data: {user: {id: string} | {id: string; extra: number}}}, 'data.user.id'>>().toEqualTypeOf<string>();

// The workaround for the union limitation above: stop at the union and read the key from it.
expectTypeOf<Get<WithNestedUnion, 'data.user'>>().toEqualTypeOf<{id: string} | {error: string}>();

// Known limitation: a numeric segment that lands in the rest of a variadic tuple answers the union of every element type, because a variadic tuple has an unbounded `length` and TypeScript cannot recover the rest element type. The positions the tuple declares itself are correct.
type WithVariadicTuple = {t: [1, [2, {a: string}], ...Array<{b: number}>]};
expectTypeOf<Get<WithVariadicTuple, 't.0', NonStrict>>().toEqualTypeOf<1>();
expectTypeOf<Get<WithVariadicTuple, 't.1', NonStrict>>().toEqualTypeOf<[2, {a: string}]>();
expectTypeOf<Get<WithVariadicTuple, 't.2', NonStrict>>().toEqualTypeOf<1 | [2, {a: string}] | {b: number}>();
// With `strict` (the default), it also has `undefined`, like the docs example.
expectTypeOf<Get<WithVariadicTuple, 't.2'>>().toEqualTypeOf<1 | [2, {a: string}] | {b: number} | undefined>();
expectTypeOf<Get<WithVariadicTuple, 't.2.b', NonStrict>>().toEqualTypeOf<unknown>();
expectTypeOf<Get<{tuple: [string, ...Array<{z: number}>]}, 'tuple.0', NonStrict>>().toEqualTypeOf<string>();
expectTypeOf<Get<{tuple: [string, ...Array<{z: number}>]}, 'tuple.1', NonStrict>>().toEqualTypeOf<string | {z: number}>();

// A number index signature covers every numeric key, so `'0' extends keyof` is false for a subject that declares `0` outright, and reading it must still answer the declared member type, like TypeScript's own indexed access.
type WithNumberIndexAndMember = {[k: number]: string; 0: 'x'};

expectTypeOf<Get<WithNumberIndexAndMember, '0', NonStrict>>().toEqualTypeOf<'x'>();
expectTypeOf<Get<WithNumberIndexAndMember, '0'>>().toEqualTypeOf<'x'>();
expectTypeOf<Get<WithNumberIndexAndMember, '1', NonStrict>>().toEqualTypeOf<string>();

// A declared member stays precise even when the number index signature also has an array-like `length`.
type WithArrayLikeIndexAndMember = WithNumberIndexAndMember & {length: number};
expectTypeOf<Get<WithArrayLikeIndexAndMember, '0', NonStrict>>().toEqualTypeOf<'x'>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, '0'>>().toEqualTypeOf<'x'>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, '1', NonStrict>>().toEqualTypeOf<string>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, '1'>>().toEqualTypeOf<string | undefined>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, 'length'>>().toEqualTypeOf<number>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, ['-1']>>().toBeUnknown();
expectTypeOf<Get<WithArrayLikeIndexAndMember, ['1.2']>>().toBeUnknown();
expectTypeOf<Get<string, 'length'>>().toEqualTypeOf<number>();
expectTypeOf<Get<string, '0'>>().toEqualTypeOf<string | undefined>();

// A key the subject does not have at all still answers the signature. No `undefined` is added for a number index signature, which is a documented limitation.
expectTypeOf<Get<{[k: number]: string}, '5', NonStrict>>().toEqualTypeOf<string>();
expectTypeOf<Get<{[k: number]: string}, '5'>>().toEqualTypeOf<string>();

// A string index signature still answers a key it does not have, and `unknown` for a subject without one.
expectTypeOf<Get<{[k: string]: boolean; a: true}, 'a', NonStrict>>().toEqualTypeOf<true>();
expectTypeOf<Get<{[k: string]: boolean}, 'nope', NonStrict>>().toEqualTypeOf<boolean>();
expectTypeOf<Get<{a: {b: number}}, 'a.nope', NonStrict>>().toBeUnknown();

// A single-segment pattern path is one path segment, so it reads the key the pattern names.
expectTypeOf<Get<{[k: `v${number}`]: {a: 1}}, `v${number}`>>().toEqualTypeOf<{a: 1}>();
expectTypeOf<Get<string[], `[${number}]`>>().toEqualTypeOf<string | undefined>();
expectTypeOf<Get<{[k: Lowercase<string>]: number}, Lowercase<string>>>().toEqualTypeOf<number>();
