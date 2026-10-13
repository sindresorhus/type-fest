import {expectTypeOf} from 'nz';
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

expectTypeOf(get(apiResponse, 'hits.hits[0]._source.name')).toBe<Array<{given: string[]; family: string}>>();
expectTypeOf(get(apiResponse, 'hits.hits.0._source.name')).toBe<Array<{given: string[]; family: string}>>();

expectTypeOf(get(apiResponse, 'hits.hits[0]._source.name[0].given[0]')).toBe<string>();

// TypeScript is structurally typed. It's *possible* this value exists even though it's not on the parent interface, so the type is `unknown`.
expectTypeOf(get(apiResponse, 'hits.someNonsense.notTheRightPath')).toBe<unknown>();

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
expectTypeOf(get(withDictionary, ['baz', 'something', 'qux', '0', 'x'] as const)).toBe<boolean>();

// Should work with dynamic keys
declare const someKey: string;
expectTypeOf(get(withDictionary, ['foo', someKey, 'bar'] as const)).toBe<number>();

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

expectTypeOf<Get<WithTuples, 'foo[0].bar', NonStrict>>().toBe<number>();
expectTypeOf<Get<WithTuples, 'foo.0.bar', NonStrict>>().toBe<number>();

expectTypeOf<Get<WithTuples, 'foo[1].baz', NonStrict>>().toBe<boolean>();
expectTypeOf<Get<WithTuples, 'foo[1].bar', NonStrict>>().toBe<unknown>();

expectTypeOf<Get<WithTuples, 'foo[-1]', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<WithTuples, 'foo[999]', NonStrict>>().toBe<unknown>();

type EmptyTuple = Parameters<() => {}>;

expectTypeOf<Get<EmptyTuple, '-1', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<EmptyTuple, '0', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<EmptyTuple, '1', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<EmptyTuple, 'length', NonStrict>>().toBe<0>();

type WithNumberKeys = {
	foo: {
		1: {
			bar: number;
		};
	};
};

expectTypeOf<Get<WithNumberKeys, 'foo[1].bar', NonStrict>>().toBe<number>();
expectTypeOf<Get<WithNumberKeys, 'foo.1.bar', NonStrict>>().toBe<number>();

expectTypeOf<Get<WithNumberKeys, 'foo[2].bar', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<WithNumberKeys, 'foo.2.bar', NonStrict>>().toBe<unknown>();

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

expectTypeOf<Get<WithModifiers, 'foo[0].bar.baz', NonStrict>>().toBe<{qux: number} | undefined>();
expectTypeOf<Get<WithModifiers, 'foo[0].abc.def.ghi', NonStrict>>().toBe<string | undefined>();
// Test bracket notation
expectTypeOf<Get<number[], '[0]', NonStrict>>().toBe<number>();
// NOTE: This would fail if `[0][0]` was converted into `00`:
expectTypeOf<Get<number[], '[0][0]', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<number[][][], '[0][0][0]', NonStrict>>().toBe<number>();
expectTypeOf<Get<number[][][], '[0][0][0][0]', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<{a: {b: Array<Array<Array<{id: number}>>>}}, 'a.b[0][0][0].id', NonStrict>>().toBe<number>();
expectTypeOf<Get<{a: {b: Array<Array<Array<{id: number}>>>}}, ['a', 'b', '0', '0', '0', 'id'], NonStrict>>().toBe<number>();

// Test strict version:
expectTypeOf<Get<string[], '0'>>().toBe<string | undefined>();
expectTypeOf<Get<Record<string, number>, 'foo'>>().toBe<number | undefined>();
// A non-literal path is read as a single key.
expectTypeOf<Get<Record<string, number>, string>>().toBe<number | undefined>();
expectTypeOf<Get<{a: {b: number}}, string>>().toBe<unknown>();
expectTypeOf<Get<Record<'a' | 'b', number>, 'a'>>().toBe<number>();
expectTypeOf<Get<Record<1 | 2, string>, '1'>>().toBe<string>();
expectTypeOf<Get<{1: boolean}, '1'>>().toBe<boolean>();
expectTypeOf<Get<[number, string], '0'>>().toBe<number>();
expectTypeOf<Get<{[key: string]: string; a: string}, 'a'>>().toBe<string>();

expectTypeOf<Get<WithDictionary, 'foo.whatever'>>().toBe<{bar: number} | undefined>();
expectTypeOf<Get<WithDictionary, 'foo.whatever.bar'>>().toBe<number | undefined>();
expectTypeOf<Get<WithDictionary, 'baz.whatever.qux[3].x'>>().toBe<boolean | undefined>();
expectTypeOf<Get<WithDictionary, ['baz', 'whatever', 'qux', '3', 'x']>>().toBe<boolean | undefined>();

// Test array index out of bounds
expectTypeOf<Get<{a: []}, 'a[0]'>>().toBe<unknown>();
expectTypeOf<Get<{a: readonly []}, 'a[0]'>>().toBe<unknown>();

// Test empty path array
expectTypeOf<WithDictionary>().toBe<Get<WithDictionary, []>>();
expectTypeOf<WithDictionary>().toBe<Get<WithDictionary, readonly []>>();

// eslint-disable-next-line no-lone-blocks
{
	type Foo = {
		array: string[];
	};

	type FooPaths = `array.${number}`;
	expectTypeOf<Get<Foo, FooPaths>>().toBe<string | undefined>();

	type FooPaths2 = 'array.1';
	expectTypeOf<Get<Foo, FooPaths2>>().toBe<string | undefined>();
}

// Known limitation: a path that descends past a union whose members do not share their keys resolves to `unknown`, because `keyof` of a union is the intersection of the members' keys. `Paths` still accepts that path. See the note in the docs.
type WithNestedUnion = {data: {user: {id: string} | {error: string}}};
expectTypeOf<Get<WithNestedUnion, 'data.user.id'>>().toBe<unknown>();

// A key every member of the union shares is found, because then it is in the intersection.
expectTypeOf<Get<{data: {user: {id: string} | {id: string; extra: number}}}, 'data.user.id'>>().toBe<string>();

// The workaround for the union limitation above: stop at the union and read the key from it.
expectTypeOf<Get<WithNestedUnion, 'data.user'>>().toBe<{id: string} | {error: string}>();

// Another workaround: declare the key as absent on the members that do not have it, so every member has the key.
expectTypeOf<Get<{data: {user: {id: string} | {error: string; id?: never}}}, 'data.user.id'>>().toBe<string | undefined>();

// Known limitation: a numeric segment that lands in the rest of a variadic tuple answers the union of every element type, because a variadic tuple has an unbounded `length` and TypeScript cannot recover the rest element type. The positions the tuple declares itself are correct.
type WithVariadicTuple = {t: [1, [2, {a: string}], ...Array<{b: number}>]};
expectTypeOf<Get<WithVariadicTuple, 't.0', NonStrict>>().toBe<1>();
expectTypeOf<Get<WithVariadicTuple, 't.1', NonStrict>>().toBe<[2, {a: string}]>();
expectTypeOf<Get<WithVariadicTuple, 't.2', NonStrict>>().toBe<1 | [2, {a: string}] | {b: number}>();
// With `strict` (the default), it also has `undefined`, like the docs example.
expectTypeOf<Get<WithVariadicTuple, 't.2'>>().toBe<1 | [2, {a: string}] | {b: number} | undefined>();
expectTypeOf<Get<WithVariadicTuple, 't.2.b', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<{tuple: [string, ...Array<{z: number}>]}, 'tuple.0', NonStrict>>().toBe<string>();
expectTypeOf<Get<{tuple: [string, ...Array<{z: number}>]}, 'tuple.1', NonStrict>>().toBe<string | {z: number}>();

// A number index signature covers every numeric key, so `'0' extends keyof` is false for a subject that declares `0` outright, and reading it must still answer the declared member type, like TypeScript's own indexed access.
type WithNumberIndexAndMember = {[k: number]: string; 0: 'x'};

expectTypeOf<Get<WithNumberIndexAndMember, '0', NonStrict>>().toBe<'x'>();
expectTypeOf<Get<WithNumberIndexAndMember, '0'>>().toBe<'x'>();
expectTypeOf<Get<WithNumberIndexAndMember, '1', NonStrict>>().toBe<string>();

// A declared member stays precise even when the number index signature also has an array-like `length`.
type WithArrayLikeIndexAndMember = WithNumberIndexAndMember & {length: number};
expectTypeOf<Get<WithArrayLikeIndexAndMember, '0', NonStrict>>().toBe<'x'>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, '0'>>().toBe<'x'>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, '1', NonStrict>>().toBe<string>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, '1'>>().toBe<string | undefined>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, 'length'>>().toBe<number>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, ['-1']>>().toBe<unknown>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, ['1.2']>>().toBe<unknown>();
expectTypeOf<Get<string, 'length'>>().toBe<number>();
expectTypeOf<Get<string, '0'>>().toBe<string | undefined>();

// A key the subject does not have at all still answers the signature. No `undefined` is added for a number index signature, which is a documented limitation.
expectTypeOf<Get<{[k: number]: string}, '5', NonStrict>>().toBe<string>();
expectTypeOf<Get<{[k: number]: string}, '5'>>().toBe<string>();

// A string index signature still answers a key it does not have, and `unknown` for a subject without one.
expectTypeOf<Get<{[k: string]: boolean; a: true}, 'a', NonStrict>>().toBe<true>();
expectTypeOf<Get<{[k: string]: boolean}, 'nope', NonStrict>>().toBe<boolean>();
expectTypeOf<Get<{a: {b: number}}, 'a.nope', NonStrict>>().toBe<unknown>();

// A single-segment pattern path is one path segment, so it reads the key the pattern names.
expectTypeOf<Get<{[k: `v${number}`]: {a: 1}}, `v${number}`>>().toBe<{a: 1}>();
expectTypeOf<Get<string[], `[${number}]`>>().toBe<string | undefined>();
expectTypeOf<Get<{[k: Lowercase<string>]: number}, Lowercase<string>>>().toBe<number>();
