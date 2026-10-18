import {expectTypeOf} from 'nz';
import type {DigitCharacter, Get, Paths} from '../index.d.ts';

type NonStrict = {strict: false};

declare const get: <ObjectType, Path extends string | ReadonlyArray<string | number>>(object: ObjectType, path: Path) => Get<ObjectType, Path, NonStrict>;

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
expectTypeOf(get(withDictionary, ['baz', 'something', 'qux', 0, 'x'] as const)).toBe<boolean>();

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

// A non-literal index can be any element of a tuple
expectTypeOf<Get<{list: [{key: string}]}, `list.${number}.key`>>().toBe<string | undefined>();
expectTypeOf<Get<WithTuples, `foo.${number}`, NonStrict>>().toBe<{bar: number} | {baz: boolean}>();
expectTypeOf<Get<WithTuples, `foo[${number}].baz`, NonStrict>>().toBe<boolean | undefined>();
expectTypeOf<Get<WithTuples, `foo.${number}.typo`>>().toBe<unknown>();
expectTypeOf<Get<readonly [string, number], number>>().toBe<string | number | undefined>();
expectTypeOf<Get<[string?], `${number}`, NonStrict>>().toBe<string | undefined>();
expectTypeOf<Get<[any], `${number}`>>().toBe<any>();
expectTypeOf<Get<[[1, 2], [3]], `${number}.${number}`, NonStrict>>().toBe<1 | 2 | 3>();
expectTypeOf<Get<Array<[string, number]>, `${number}.${number}`>>().toBe<string | number | undefined>();
expectTypeOf<Get<[string] | number[], `${number}`, NonStrict>>().toBe<string | number>();
expectTypeOf<Get<[string] | undefined, `${number}`, NonStrict>>().toBe<string | undefined>();

// An index from a `number` variable can be any element of a tuple. (https://github.com/sindresorhus/type-fest/issues/567)
{
	const object = {array: [{a: 1}, {a: 2}]} as const;
	const getFromObject = <Path extends string>(path: Path) => path as Get<typeof object, Path>;
	const index = 0 as number;

	expectTypeOf(getFromObject(`array[${index}].a`)).toBe<1 | 2 | undefined>();
	expectTypeOf(getFromObject(`array.${index}.a`)).toBe<1 | 2 | undefined>();

	// `as const` makes the array a tuple, so a literal index past its end does not exist.
	expectTypeOf(getFromObject('array[10].a')).toBe<unknown>();
	expectTypeOf(getFromObject('array.10.a')).toBe<unknown>();
}

type EmptyTuple = Parameters<() => {}>;

expectTypeOf<Get<EmptyTuple, '-1', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<EmptyTuple, '0', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<EmptyTuple, '1', NonStrict>>().toBe<unknown>();
expectTypeOf<Get<EmptyTuple, `${number}`>>().toBe<unknown>();
expectTypeOf<Get<readonly [], number>>().toBe<unknown>();
expectTypeOf<Get<EmptyTuple | [string], `${number}`, NonStrict>>().toBe<string | undefined>();
expectTypeOf<Get<[[], [string]], `${number}.${number}`, NonStrict>>().toBe<string | undefined>();
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

// A key that only some members of a union have resolves to `undefined` for the other members, like TypeScript treats a union in `in` narrowing. (https://github.com/sindresorhus/type-fest/issues/1205)
type WithNestedUnion = {data: {user: {id: string} | {error: string}}};
expectTypeOf<Get<WithNestedUnion, 'data.user.id'>>().toBe<string | undefined>();

// A key every member of the union shares is found, because then it is in the intersection.
expectTypeOf<Get<{data: {user: {id: string} | {id: string; extra: number}}}, 'data.user.id'>>().toBe<string>();

// Stopping at the union reads the union itself.
expectTypeOf<Get<WithNestedUnion, 'data.user'>>().toBe<{id: string} | {error: string}>();

// Declaring the key as absent on the members that do not have it gives the same result.
expectTypeOf<Get<{data: {user: {id: string} | {error: string; id?: never}}}, 'data.user.id'>>().toBe<string | undefined>();

// Known limitation: a numeric segment that lands in the rest of a variadic tuple answers the union of every element type, because a variadic tuple has an unbounded `length` and TypeScript cannot recover the rest element type. The positions the tuple declares itself are correct.
type WithVariadicTuple = {t: [1, [2, {a: string}], ...Array<{b: number}>]};
expectTypeOf<Get<WithVariadicTuple, 't.0', NonStrict>>().toBe<1>();
expectTypeOf<Get<WithVariadicTuple, 't.1', NonStrict>>().toBe<[2, {a: string}]>();
expectTypeOf<Get<WithVariadicTuple, 't.2', NonStrict>>().toBe<1 | [2, {a: string}] | {b: number}>();
// With `strict` (the default), it also has `undefined`, like the docs example.
expectTypeOf<Get<WithVariadicTuple, 't.2'>>().toBe<1 | [2, {a: string}] | {b: number} | undefined>();
expectTypeOf<Get<WithVariadicTuple, 't.2.b', NonStrict>>().toBe<number | undefined>();
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

// A string reads like an array-like object.
expectTypeOf<Get<string, 'length'>>().toBe<number>();
expectTypeOf<Get<string, '0'>>().toBe<string | undefined>();

// An empty key is not an index, like for arrays.
expectTypeOf<Get<WithArrayLikeIndexAndMember, ['']>>().toBe<unknown>();
expectTypeOf<Get<{a: ArrayLike<string>}, 'a.'>>().toBe<unknown>();
expectTypeOf<Get<{a: ArrayLike<string>}, 'a[]'>>().toBe<unknown>();
expectTypeOf<Get<string, ['']>>().toBe<unknown>();
expectTypeOf<Get<string[], ['']>>().toBe<unknown>();

// A non-literal index can be any item of an array-like object.
type WithArrayLike = {list: ArrayLike<{name: string}>};
expectTypeOf<Get<WithArrayLike, `list.${number}.name`>>().toBe<string | undefined>();
expectTypeOf<Get<WithArrayLike, `list[${number}].name`, NonStrict>>().toBe<string>();
expectTypeOf<Get<WithArrayLike, ['list', number, 'name']>>().toBe<string | undefined>();
expectTypeOf<Get<WithArrayLike, `list.${number}.name`>>().toBe<Get<WithArrayLike, 'list.0.name'>>();
expectTypeOf<Get<WithArrayLike, `list.${number}.typo`>>().toBe<unknown>();
expectTypeOf<Get<WithArrayLike, `list.${number}` | 'list.length'>>().toBe<number | {name: string} | undefined>();
expectTypeOf<Get<WithArrayLike, Paths<WithArrayLike>>>().toBe<ArrayLike<{name: string}> | string | number | {name: string} | undefined>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, `${number}`, NonStrict>>().toBe<string>();
expectTypeOf<Get<{bytes: Uint8Array}, `bytes.${number}`>>().toBe<number | undefined>();
expectTypeOf<Get<string, number>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string> | undefined, `${number}`, NonStrict>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string> | [boolean], `${number}`, NonStrict>>().toBe<string | boolean>();
expectTypeOf<Get<ArrayLike<string> | {a: 1}, `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<any>, `${number}`>>().toBe<any>();
expectTypeOf<Get<ArrayLike<unknown>, `${number}`>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<never>, `${number}`>>().toBe<undefined>();

// A `string` variable is not an index, like for arrays.
expectTypeOf<Get<WithArrayLike, `list.${string}`>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, [string]>>().toBe<unknown>();
expectTypeOf<Get<string[], [string]>>().toBe<unknown>();

// A variable cannot read an object without a matching index signature, like TypeScript reports for `object[key]`. A union of the keys can.
type WithNamedKeys = {users: {alice: {age: number}; bob: {age: string}}};
expectTypeOf<Get<WithNamedKeys, `users.${string}.age`>>().toBe<unknown>();
expectTypeOf<Get<WithNamedKeys, `users.${keyof WithNamedKeys['users']}.age`>>().toBe<number | string>();
expectTypeOf<Get<{users: Record<string, {age: number}>}, `users.${string}.age`>>().toBe<number | undefined>();
expectTypeOf<Get<{0: 'a'; 1: 'b'}, `${number}`>>().toBe<unknown>();
expectTypeOf<Get<{map: {[key: number]: string}}, `map.${string}`>>().toBe<unknown>();

// A non-literal index reads built-in array-like objects: `IArguments` and typed arrays.
expectTypeOf<Get<IArguments, `${number}`>>().toBe<any>();
expectTypeOf<Get<IArguments, number>>().toBe<any>();
expectTypeOf<Get<Uint8Array, number>>().toBe<number | undefined>();
expectTypeOf<Get<Float64Array, `${number}`, NonStrict>>().toBe<number>();
expectTypeOf<Get<BigInt64Array, `${number}`>>().toBe<bigint | undefined>();
expectTypeOf<Get<{data: {big: BigInt64Array}}, ['data', 'big', number], NonStrict>>().toBe<bigint>();
expectTypeOf<Get<{bytes: Uint8Array}, `bytes.${number}.typo`>>().toBe<unknown>();

// A non-literal index reads a character of a string, a `String` object, a string literal, and a branded string.
expectTypeOf<Get<string, `${number}`, NonStrict>>().toBe<string>();
expectTypeOf<Get<String, `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<String, number>>().toBe<string | undefined>();
expectTypeOf<Get<'abc', `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<string & {brand: 'x'}, `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<{name: string}, `name.${number}.length`>>().toBe<number | undefined>();
expectTypeOf<Get<{names: string[]}, `names.${number}.${number}`, NonStrict>>().toBe<string>();
expectTypeOf<Get<{names: string[]}, ['names', number, number]>>().toBe<string | undefined>();

// A non-literal index reads array-like interfaces, classes, and intersections.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ArrayLikeInterface {
	[index: number]: {id: number};
	length: number;
}

class ArrayLikeClass {
	[index: number]: boolean;
	length = 0;
}

expectTypeOf<Get<ArrayLikeInterface, `${number}.id`>>().toBe<number | undefined>();
expectTypeOf<Get<ArrayLikeInterface, [number, 'id'], NonStrict>>().toBe<number>();
expectTypeOf<Get<ArrayLikeInterface, number>>().toBe<{id: number} | undefined>();
expectTypeOf<Get<ArrayLikeClass, `${number}`>>().toBe<boolean | undefined>();
expectTypeOf<Get<Record<number, string> & {length: number}, `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string> & {extra: 1}, `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<{a: 1}> & ArrayLike<{b: 2}>, `${number}.b`, NonStrict>>().toBe<2>();

// A non-literal index reads the index signature, and a literal one still reads the declared member.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ArrayLikeInterfaceWithMembers {
	[index: number]: string;
	length: number;
	0: 'first';
}

expectTypeOf<Get<ArrayLikeInterfaceWithMembers, '0'>>().toBe<'first'>();
expectTypeOf<Get<ArrayLikeInterfaceWithMembers, `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, `${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<{[index: number]: 'a' | 'b'; 0: 'a'; 1: 'b'; length: 2}, `${number}`>>().toBe<'a' | 'b' | undefined>();
expectTypeOf<Get<{[index: number]: 'a' | 'b'; 0: 'a'; 1: 'b'; length: 2}, '1'>>().toBe<'b'>();

// A number index signature without a `length: number` is not array-like, but still answers a non-literal index, without `undefined` (a documented limitation). Other iterables have no index.
expectTypeOf<Get<{[index: number]: string}, `${number}`>>().toBe<string>();
expectTypeOf<Get<{[index: number]: string; length?: number}, `${number}`>>().toBe<string>();
expectTypeOf<Get<{[index: number]: string; length: string}, `${number}`>>().toBe<string>();
expectTypeOf<Get<Iterable<string>, `${number}`>>().toBe<unknown>();
expectTypeOf<Get<Map<number, string>, number>>().toBe<unknown>();

// A literal key of an array-like object must be digits only, so a numeric string in another form is not an index. A number path is read in its canonical string form.
expectTypeOf<Get<ArrayLike<string>, '-0'>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, '0x1'>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, '1e3'>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, ' 1'>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, '1 '>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, ['1.5']>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, [1.5]>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, [1e3]>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string>, 0x1>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string>, `${1 | 2}`>>().toBe<string | undefined>();

// A pattern key that is not exactly `${number}` is not an index, like for arrays.
expectTypeOf<Get<ArrayLike<string>, `${number}px`>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, `-${number}`>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, `1${number}`>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<string>, `${bigint}`>>().toBe<unknown>();
expectTypeOf<Get<string[], `${number}px`>>().toBe<unknown>();
expectTypeOf<Get<string[], `-${number}`>>().toBe<unknown>();
expectTypeOf<Get<string[], `${bigint}`>>().toBe<unknown>();

// An empty segment later in a path is not an index either.
expectTypeOf<Get<{a: ArrayLike<{b: 1}>}, 'a..b'>>().toBe<unknown>();
expectTypeOf<Get<{a: ArrayLike<{b: 1}>}, 'a[].b'>>().toBe<unknown>();
expectTypeOf<Get<{a: ArrayLike<{b: 1}>}, ['a', '', 'b']>>().toBe<unknown>();
expectTypeOf<Get<{a: Array<{b: 1}>}, 'a..b'>>().toBe<unknown>();
expectTypeOf<Get<ArrayLike<{a: 1}>, `${number}..a`>>().toBe<unknown>();

// A non-literal index reads nested array-like objects, and array-like objects inside arrays, tuples, and records.
type WithNestedArrayLike = {matrix: ArrayLike<ArrayLike<{v: 1}>>};
expectTypeOf<Get<WithNestedArrayLike, `matrix.${number}.${number}.v`>>().toBe<1 | undefined>();
expectTypeOf<Get<WithNestedArrayLike, `matrix[${number}][${number}].v`, NonStrict>>().toBe<1>();
expectTypeOf<Get<WithNestedArrayLike, ['matrix', number, number, 'v']>>().toBe<1 | undefined>();
expectTypeOf<Get<WithNestedArrayLike, `matrix.${number}.0.v`>>().toBe<1 | undefined>();
expectTypeOf<Get<WithNestedArrayLike, `matrix.${number}.length`>>().toBe<number | undefined>();
expectTypeOf<Get<WithNestedArrayLike, `matrix.${number}.${number}.typo`>>().toBe<unknown>();
expectTypeOf<Get<WithNestedArrayLike, Paths<WithNestedArrayLike>>>().toBe<ArrayLike<ArrayLike<{v: 1}>> | ArrayLike<{v: 1}> | number | 1 | undefined | {v: 1}>();
expectTypeOf<Get<Array<ArrayLike<{v: 1}>>, `${number}.${number}.v`>>().toBe<1 | undefined>();
expectTypeOf<Get<Array<ArrayLike<{v: 1}>>, [number, number, 'v'], NonStrict>>().toBe<1>();
expectTypeOf<Get<[ArrayLike<{v: 1}>, string], `0.${number}.v`>>().toBe<1 | undefined>();
expectTypeOf<Get<[ArrayLike<{v: 1}>, string], `1.${number}`>>().toBe<string | undefined>();
expectTypeOf<Get<[ArrayLike<{v: 1}>, string], `${number}.${number}`, NonStrict>>().toBe<string | {v: 1}>();
expectTypeOf<Get<Record<string, ArrayLike<{v: 1}>>, `key.${number}.v`>>().toBe<1 | undefined>();
expectTypeOf<Get<Record<string, ArrayLike<{v: 1}>>, `${string}.${number}.v`>>().toBe<1 | undefined>();
expectTypeOf<Get<ArrayLike<ArrayLike<string>>, `${number}.${number}`, NonStrict>>().toBe<string>();
expectTypeOf<Get<ArrayLike<string[]>, `${number}.${number}`, NonStrict>>().toBe<string>();
expectTypeOf<Get<Uint8Array[], `${number}.${number}`, NonStrict>>().toBe<number>();

// A non-literal index through an optional or nullable array-like object, or into nullable items, adds `undefined` even with `strict: false`.
expectTypeOf<Get<{list?: ArrayLike<{v: 1}>}, `list.${number}.v`>>().toBe<1 | undefined>();
expectTypeOf<Get<{list?: ArrayLike<{v: 1}>}, `list.${number}.v`, NonStrict>>().toBe<1 | undefined>();
expectTypeOf<Get<{list?: ArrayLike<{v: 1}>}, `list.${number}.typo`>>().toBe<unknown>();
expectTypeOf<Get<{list: ArrayLike<{v: 1}> | null}, `list.${number}.v`, NonStrict>>().toBe<1 | undefined>();
expectTypeOf<Get<ArrayLike<{a: 1} | null>, `${number}.a`, NonStrict>>().toBe<1 | undefined>();
expectTypeOf<Get<ArrayLike<null>, `${number}.a`>>().toBe<undefined>();
expectTypeOf<Get<ArrayLike<undefined>, `${number}`, NonStrict>>().toBe<undefined>();
expectTypeOf<Get<string | null, `${number}`, NonStrict>>().toBe<string | undefined>();
expectTypeOf<Get<string | undefined, number, NonStrict>>().toBe<string | undefined>();

// A non-literal index reads every member of a union that mixes array-like objects, arrays, tuples, and objects.
type WithMixedLists = {list: ArrayLike<{v: 1}> | Array<{v: 2}> | [{v: 3}] | {v: 4}};
expectTypeOf<Get<WithMixedLists, `list.${number}.v`, NonStrict>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<Get<WithMixedLists, ['list', number, 'v']>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<Get<WithMixedLists, 'list.0.v', NonStrict>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<Get<WithMixedLists, 'list.v', NonStrict>>().toBe<4 | undefined>();
expectTypeOf<Get<{s: string | string[]}, `s.${number}`, NonStrict>>().toBe<string>();
expectTypeOf<Get<{s: string | string[]}, `s.${number}.${number}`, NonStrict>>().toBe<string>();
expectTypeOf<Get<string | ArrayLike<number>, `${number}`>>().toBe<string | number | undefined>();
expectTypeOf<Get<Uint8Array | string[], `${number}`, NonStrict>>().toBe<string | number>();
expectTypeOf<Get<Uint8Array | {a: 1}, number, NonStrict>>().toBe<number | undefined>();
expectTypeOf<Get<string | number, `${number}`, NonStrict>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string> | {a: 1}, `${number}` | 'a', NonStrict>>().toBe<string | 1 | undefined>();

// A union of paths, and an `any` segment, read an array-like object like an array.
expectTypeOf<Get<ArrayLike<string>, [number] | ['length']>>().toBe<string | number | undefined>();
expectTypeOf<Get<ArrayLike<string>, [any]>>().toBe<Get<string[], [any]>>();

// `any`, `never`, and `unknown` as the subject or the item, with a non-literal index.
expectTypeOf<Get<any, `${number}`>>().toBe<any>();
expectTypeOf<Get<never, `${number}`>>().toBe<never>();
expectTypeOf<Get<unknown, `${number}`>>().toBe<unknown>();
expectTypeOf<Get<{a: any}, `a.${number}`>>().toBe<any>();
expectTypeOf<Get<{a: unknown}, `a.${number}`>>().toBe<unknown>();
expectTypeOf<Get<{a: never}, `a.${number}`>>().toBe<never>();
expectTypeOf<Get<ArrayLike<never>, number, NonStrict>>().toBe<never>();
expectTypeOf<Get<ArrayLike<any>, `${number}.a.b`>>().toBe<any>();

// The default options and an explicit `strict: true` or `strict: boolean` all add `undefined` for a non-literal index.
expectTypeOf<Get<ArrayLike<string>, `${number}`, {}>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string>, `${number}`, {strict: true}>>().toBe<string | undefined>();
expectTypeOf<Get<ArrayLike<string>, `${number}`, {strict: boolean}>>().toBe<string | undefined>();

// `Paths` with bracket notation gives non-literal indexes that `Get` reads.
expectTypeOf<Get<WithArrayLike, Paths<WithArrayLike, {bracketNotation: true}>>>().toBe<ArrayLike<{name: string}> | string | number | {name: string} | undefined>();

// An index from a `number` variable reads an array-like object in the `get` function, in a template literal path and in an `as const` array path.
{
	const index = 0 as number;
	const object = {list: [] as ArrayLike<{name: string}>, bytes: new Uint8Array(), text: 'abc', nested: [] as ArrayLike<ArrayLike<{v: 1}>>};

	expectTypeOf(get(object, `list.${index}.name`)).toBe<string>();
	expectTypeOf(get(object, `list[${index}].name`)).toBe<string>();
	expectTypeOf(get(object, ['list', index, 'name'] as const)).toBe<string>();
	expectTypeOf(get(object, `list.${index}`)).toBe<{name: string}>();
	expectTypeOf(get(object, `bytes[${index}]`)).toBe<number>();
	expectTypeOf(get(object, ['bytes', index] as const)).toBe<number>();
	expectTypeOf(get(object, `text.${index}`)).toBe<string>();
	expectTypeOf(get(object, ['text', index] as const)).toBe<string>();
	expectTypeOf(get(object, `list.${index}.name.${index}`)).toBe<string>();
	expectTypeOf(get(object, `nested[${index}][${index}].v`)).toBe<1>();

	// A typo, a `string` variable, or a `bigint` variable is still not a valid index.
	const key = 'key' as string;
	const bigIndex = 0n as bigint;
	expectTypeOf(get(object, `list.${index}.typo`)).toBe<unknown>();
	expectTypeOf(get(object, `list.${key}`)).toBe<unknown>();
	expectTypeOf(get(object, ['list', key] as const)).toBe<unknown>();
	expectTypeOf(get(object, `list.${bigIndex}.name`)).toBe<unknown>();
}

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

// `Paths<BaseType>` is always a valid path, even for a generic `BaseType`. `Paths` gives both `'1'` and `1` for a number key, and a generic `Paths` may be a number. (https://github.com/sindresorhus/type-fest/issues/991)
type WrapperOfGeneric<GenericType extends {}> = {
	value: Get<GenericType, Paths<GenericType>>;
};
type WithNumberKey = {1: boolean};
expectTypeOf<Get<WithNumberKey, Paths<WithNumberKey>>>().toBe<boolean>();
expectTypeOf<WrapperOfGeneric<WithNumberKey>['value']>().toBe<boolean>();
expectTypeOf<WrapperOfGeneric<{key: number}>['value']>().toBe<number>();
expectTypeOf<WrapperOfGeneric<{a: {b: string}}>['value']>().toBe<string | {b: string}>();

// A number path reads the same key as its string form.
expectTypeOf<Get<WithNumberKey, 1>>().toBe<boolean>();
expectTypeOf<Get<[string, number], 1>>().toBe<number>();
expectTypeOf<Get<string[], 0>>().toBe<string | undefined>();
expectTypeOf<Get<{[-1]: 'a'}, -1>>().toBe<'a'>();
expectTypeOf<Get<{1: 'a'; 2: 'b'}, 1 | 2>>().toBe<'a' | 'b'>();
expectTypeOf<Get<{1: 'a'; b: 2}, 1 | 'b'>>().toBe<'a' | 2>();

// A number with a dot is read as a dotted path, like its string form.
expectTypeOf<Get<{1: {2: 'x'}}, 1.2>>().toBe<'x'>();
expectTypeOf<Get<{1.5: 'x'}, 1.5>>().toBe<unknown>();

// A string path cannot read a key that contains a dot, but the array form can. (https://github.com/sindresorhus/type-fest/issues/1372)
expectTypeOf<Get<{'a.b': {c: number}}, 'a.b.c'>>().toBe<unknown>();
expectTypeOf<Get<{'a.b': {c: number}}, ['a.b', 'c']>>().toBe<number>();

// A number in an array path reads the same key as its string form.
type WithArrays = {
	list: Array<{name: string}>;
	tuple: [string, {id: number}];
	1: {2: boolean};
};
expectTypeOf<Get<WithArrays, ['list', 0, 'name']>>().toBe<string | undefined>();
expectTypeOf<Get<WithArrays, ['list', 0, 'name']>>().toBe<Get<WithArrays, ['list', '0', 'name']>>();
expectTypeOf<Get<WithArrays, ['list', 0, 'name']>>().toBe<Get<WithArrays, 'list[0].name'>>();
expectTypeOf<Get<WithArrays, ['list', 0, 'name'], NonStrict>>().toBe<string>();
expectTypeOf<Get<WithArrays, ['tuple', 0]>>().toBe<string>();
expectTypeOf<Get<WithArrays, ['tuple', 1, 'id']>>().toBe<number>();
expectTypeOf<Get<WithArrays, ['tuple', 2]>>().toBe<unknown>();
expectTypeOf<Get<WithArrays, [1, 2]>>().toBe<boolean>();
expectTypeOf<Get<WithArrays, readonly ['list', 0]>>().toBe<{name: string} | undefined>();
expectTypeOf<Get<string[][], [number, number], NonStrict>>().toBe<string>();
expectTypeOf<Get<WithArrays, ['list', number, 'name'], NonStrict>>().toBe<string>();
expectTypeOf<Get<WithArrays, [0]>>().toBe<unknown>();
expectTypeOf<Get<WithArrayLikeIndexAndMember, [-1]>>().toBe<unknown>();

// A segment must be a string or a number.
// @ts-expect-error
type InvalidBooleanSegment = Get<WithArrays, ['list', true]>;
// @ts-expect-error
type InvalidBigintSegment = Get<WithArrays, ['list', 0n]>;
// @ts-expect-error
type InvalidSymbolSegment = Get<WithArrays, ['list', symbol]>;
// @ts-expect-error
type InvalidUndefinedSegment = Get<WithArrays, ['list', undefined]>;
// @ts-expect-error
type InvalidOptionalSegment = Get<WithArrays, ['list', 0?]>;

// A number in an array path is one segment, even if it has a dot.
expectTypeOf<Get<{1.5: 'x'}, [1.5]>>().toBe<'x'>();
expectTypeOf<Get<{1: {5: 'x'}}, [1.5]>>().toBe<unknown>();

// A number segment reads tuples, number and numeric string keys, and index signatures.
expectTypeOf<Get<{a: readonly [1, 2]}, readonly ['a', 1]>>().toBe<2>();
expectTypeOf<Get<{a: {'0': 'x'}}, ['a', 0]>>().toBe<'x'>();
expectTypeOf<Get<{a: {0: 'x'}}, ['a', '0']>>().toBe<'x'>();
expectTypeOf<Get<{a: {[key: number]: string}}, ['a', 5]>>().toBe<string>();
expectTypeOf<Get<Record<number, string>, [5]>>().toBe<string>();
expectTypeOf<Get<Record<string, string>, [5]>>().toBe<string | undefined>();
expectTypeOf<Get<[[1, [2, 3]]], [0, 1, 0]>>().toBe<2>();
expectTypeOf<Get<string[], [0, 'length']>>().toBe<number | undefined>();

// A number segment that the subject, or some of its members, does not have.
expectTypeOf<Get<{a: [1, 2]}, ['a', -1]>>().toBe<unknown>();
expectTypeOf<Get<{a: [1, 2]}, ['a', 1.5]>>().toBe<unknown>();
expectTypeOf<Get<{a: 1}, ['a', 0]>>().toBe<unknown>();
expectTypeOf<Get<{a: null}, ['a', 0]>>().toBe<undefined>();
expectTypeOf<Get<{a: {b: 1} | null}, ['a', 'b'], NonStrict>>().toBe<1 | undefined>();
expectTypeOf<Get<{a?: [1, 2]}, ['a', 1]>>().toBe<2 | undefined>();
expectTypeOf<Get<{a: [1, 2]} | {a: [3]}, ['a', 1]>>().toBe<2 | undefined>();

// A union segment, or a union of paths, reads each key.
expectTypeOf<Get<{a: [1, 2]}, ['a', 0 | 1]>>().toBe<1 | 2>();
expectTypeOf<Get<{a: {b: 1; 0: 2}}, ['a', 0 | 'b']>>().toBe<1 | 2>();
expectTypeOf<Get<{a: 1; 0: 2}, [0] | ['a']>>().toBe<1 | 2>();
expectTypeOf<Get<{a: 1}, [never]>>().toBe<never>();
expectTypeOf<Get<[1, 2, 3], [0 | 2]>>().toBe<1 | 3>();
expectTypeOf<Get<{a: [1, 2]}, ['a', 1 | 5]>>().toBe<2 | undefined>();
expectTypeOf<Get<{a: [1, 2]}, ['a', number]>>().toBe<1 | 2 | undefined>();
expectTypeOf<Get<{a: 1}, [] | ['a']>>().toBe<1 | {a: 1}>();

// An array path of unknown length can have any keys.
expectTypeOf<Get<{a: 1}, string[]>>().toBe<unknown>();
expectTypeOf<Get<{a: 1}, readonly string[]>>().toBe<unknown>();
expectTypeOf<Get<{a: {b: 1}}, ['a', ...string[]]>>().toBe<unknown>();
expectTypeOf<Get<any, string[]>>().toBe<unknown>();
expectTypeOf<Get<never, string[]>>().toBe<unknown>();
expectTypeOf<Get<{a: 1}, Array<string | number>>>().toBe<unknown>();
expectTypeOf<Get<{a: 1}, [...string[], 'a']>>().toBe<unknown>();
expectTypeOf<Get<{a: [1, 2]}, ['a', ...number[]]>>().toBe<unknown>();
expectTypeOf<Get<{a: {b: 1}}, ['a', 'b', ...string[]]>>().toBe<unknown>();
expectTypeOf<Get<string[], number[]>>().toBe<unknown>();

// `unknown` absorbs the result of the other paths in a union.
expectTypeOf<Get<{a: 1}, ['a'] | string[]>>().toBe<unknown>();

// The array form reads each key as written, so a key can have a dot, brackets, or be empty.
expectTypeOf<Get<{a: {'b.c': 1}}, ['a', 'b.c']>>().toBe<1>();
expectTypeOf<Get<{a: {'b[0]': 1}}, ['a', 'b[0]']>>().toBe<1>();
expectTypeOf<Get<{a: {'[0]': 1}}, ['a', '[0]']>>().toBe<1>();
expectTypeOf<Get<{a: {'': 1}}, ['a', '']>>().toBe<1>();
expectTypeOf<Get<{'': {'': 1}}, ['', '']>>().toBe<1>();
expectTypeOf<Get<{a: {'b.c': 1}}, 'a.b.c'>>().toBe<unknown>();

// Number and string segments can be mixed in one path.
expectTypeOf<Get<{0: {1: {2: 'deep'}}}, [0, 1, 2]>>().toBe<'deep'>();
expectTypeOf<Get<{0: {1: {2: 'deep'}}}, ['0', 1, '2']>>().toBe<'deep'>();
expectTypeOf<Get<{a: Array<{b: [1, {c: 2}]}>}, ['a', 0, 'b', 1, 'c']>>().toBe<2 | undefined>();
expectTypeOf<Get<{a: Array<{b: [1, {c: 2}]}>}, ['a', 0, 'b', 1, 'c'], NonStrict>>().toBe<2>();

// A number segment reads readonly arrays, optional tuple elements, and strings.
expectTypeOf<Get<{a: readonly string[]}, ['a', 0]>>().toBe<string | undefined>();
expectTypeOf<Get<{a: readonly string[]}, ['a', 0], NonStrict>>().toBe<string>();
expectTypeOf<Get<{a: [first?: string]}, ['a', 0]>>().toBe<string | undefined>();
expectTypeOf<Get<{a: string}, ['a', 0]>>().toBe<string | undefined>();

// A non-literal segment reads an index signature.
expectTypeOf<Get<{a: string[]}, ['a', `${number}`]>>().toBe<string | undefined>();
expectTypeOf<Get<Record<string, {b: 1}>, [string, 'b']>>().toBe<1 | undefined>();

// A path that goes past a primitive value.
expectTypeOf<Get<{a: 1}, ['a', 'b', 'c', 'd']>>().toBe<unknown>();

// `any` and `never` as the path or as a segment.
expectTypeOf<Get<{a: {b: 1}}, any>>().toBe<unknown>();
expectTypeOf<Get<{a: {b: 1}}, never>>().toBe<never>();
expectTypeOf<Get<{a: {b: 1}}, ['a', any]>>().toBe<any>();
expectTypeOf<Get<{a: {b: 1}}, [never, 'b']>>().toBe<never>();
expectTypeOf<Get<{a: {b: 1}}, ['a', never]>>().toBe<never>();

// An empty path gives the subject, even for `any`, `never`, and `unknown`.
expectTypeOf<Get<any, []>>().toBe<any>();
expectTypeOf<Get<never, []>>().toBe<never>();
expectTypeOf<Get<unknown, []>>().toBe<unknown>();
expectTypeOf<Get<string[], readonly []>>().toBe<string[]>();

// A number segment in the `get` function.
expectTypeOf(get(apiResponse, ['hits', 'hits', 0, '_source', 'name', 0, 'given', 1] as const)).toBe<string>();

// A number path that the subject does not have, or a non-literal `number`, reads like its string form.
expectTypeOf<Get<{1: 'a'}, 2>>().toBe<unknown>();
expectTypeOf<Get<{a: 1}, 0, NonStrict>>().toBe<unknown>();
expectTypeOf<Get<string[], number>>().toBe<string | undefined>();
expectTypeOf<Get<{a: 1}, number>>().toBe<unknown>();

// `any`, `never`, and `unknown` subjects with a number path, or a number in an array path.
expectTypeOf<Get<any, 1>>().toBe<any>();
expectTypeOf<Get<never, 1>>().toBe<never>();
expectTypeOf<Get<unknown, 1>>().toBe<unknown>();
expectTypeOf<Get<any, ['a', 0]>>().toBe<any>();
expectTypeOf<Get<never, ['a', 0]>>().toBe<never>();
expectTypeOf<Get<unknown, ['a', 0]>>().toBe<unknown>();

// A key that only some members of a union have, at any depth. (https://github.com/sindresorhus/type-fest/issues/1205)
type DiscriminatedUnion = {data: {type: 'type1'; someValue: number} | {type: 'type2'; someValue: string} | {type: 'type3'}};
expectTypeOf<Get<DiscriminatedUnion, 'data.someValue'>>().toBe<number | string | undefined>();
expectTypeOf<Get<DiscriminatedUnion, 'data.someValue', NonStrict>>().toBe<number | string | undefined>();
expectTypeOf<Get<DiscriminatedUnion, 'data.type'>>().toBe<'type1' | 'type2' | 'type3'>();
expectTypeOf<Get<{a: number} | {b: string}, 'a'>>().toBe<number | undefined>();
expectTypeOf<Get<{data: {value: {count: 1}} | {other: true}}, 'data.value.count'>>().toBe<1 | undefined>();
expectTypeOf<Get<{a: string | {b: number}}, 'a.b'>>().toBe<number | undefined>();
expectTypeOf<Get<{a: string[] | {x: 1}}, 'a.0'>>().toBe<string | undefined>();
expectTypeOf<Get<{a: [1, 2] | {x: 1}}, 'a.x'>>().toBe<1 | undefined>();
expectTypeOf<Get<{a: {b: number} | null}, 'a.b'>>().toBe<number | undefined>();

// A key that no member of a union has resolves to `unknown`, like a key the subject does not have, so a typo still shows up.
expectTypeOf<Get<DiscriminatedUnion, 'data.typo'>>().toBe<unknown>();
expectTypeOf<Get<{a: 1} | {b: 2}, 'typo'>>().toBe<unknown>();
expectTypeOf<Get<{a: boolean}, 'a.typo'>>().toBe<unknown>();

// A typo behind an optional or nullable property, or an array index, still resolves to `unknown`, because the nullish member does not have the key either.
expectTypeOf<Get<{a?: {b: 1}}, 'a.typo'>>().toBe<unknown>();
expectTypeOf<Get<{a: {b: 1} | null}, 'a.typo'>>().toBe<unknown>();
expectTypeOf<Get<{a: Array<{b: 1}>}, 'a.0.typo'>>().toBe<unknown>();
expectTypeOf<Get<{t: [1, ...Array<{b: number}>]}, 't.2.typo'>>().toBe<unknown>();
expectTypeOf<Get<{a?: {b: 1}}, 'a.b'>>().toBe<1 | undefined>();
expectTypeOf<Get<null, 'a'>>().toBe<undefined>();
expectTypeOf<Get<{a: null}, 'a.b'>>().toBe<undefined>();

// A value type that a marker could collide with is not mistaken for a missing key. A `unique symbol` marker would be merged into `symbol`, and an `extends` check would match `{}` and `object`.
expectTypeOf<Get<{a: symbol}, 'a'>>().toBe<symbol>();
expectTypeOf<Get<{a: {}}, 'a'>>().toBe<{}>();
expectTypeOf<Get<{a: {}}, 'a', NonStrict>>().toBe<{}>();
expectTypeOf<Get<{a: object}, 'a'>>().toBe<object>();
expectTypeOf<Get<{a: {b: {}}}, 'a.b'>>().toBe<{}>();
expectTypeOf<Get<{a: symbol} | {b: 1}, 'a'>>().toBe<symbol | undefined>();
expectTypeOf<Get<{a: {}} | {b: 1}, 'a'>>().toBe<{} | undefined>();
expectTypeOf<Get<{a: object} | {b: 1}, 'a'>>().toBe<object | undefined>();

// The `undefined` for a union member without the key is added even with `strict: false`, like reading through a nullish value.
expectTypeOf<Get<{a: 1} | {b: 2}, 'a', NonStrict>>().toBe<1 | undefined>();
expectTypeOf<Get<{a?: {b: 1}}, 'a.b', NonStrict>>().toBe<1 | undefined>();

// The value types `any` and `unknown` are kept, and a member with a `never` value cannot exist, so it does not count as having the key.
expectTypeOf<Get<{a: any} | {b: 1}, 'a'>>().toBe<any>();
expectTypeOf<Get<{a: unknown} | {b: 1}, 'a'>>().toBe<unknown>();
expectTypeOf<Get<{a: never} | {b: 1}, 'a'>>().toBe<unknown>();

// Every path `Paths` gives for a union resolves to a type, never `unknown`.
type ModelWithUnions = {user: {id: string; name: string} | {error: string}; items: Array<{a: 1} | {b: 2}>};
expectTypeOf<unknown extends Get<ModelWithUnions, Paths<ModelWithUnions>> ? true : false>().toBe<false>();

// `Get` does not compute every path of the base type, so a type with very many paths does not hit the instantiation limit.
type WideKey = `${DigitCharacter}${DigitCharacter}`;
type Wide = Record<WideKey, Record<WideKey, Record<WideKey, string>>>;
expectTypeOf<Get<Wide, '00.11.22'>>().toBe<string>();
