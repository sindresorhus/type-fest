import {expectTypeOf} from 'nz';
import type {DigitCharacter, Get, Paths} from '../index.d.ts';

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

// A number path that the subject does not have, or a non-literal `number`, reads like its string form.
expectTypeOf<Get<{1: 'a'}, 2>>().toBe<unknown>();
expectTypeOf<Get<{a: 1}, 0, NonStrict>>().toBe<unknown>();
expectTypeOf<Get<string[], number>>().toBe<string | undefined>();
expectTypeOf<Get<{a: 1}, number>>().toBe<unknown>();

// `any`, `never`, and `unknown` subjects with a number path.
expectTypeOf<Get<any, 1>>().toBe<any>();
expectTypeOf<Get<never, 1>>().toBe<never>();
expectTypeOf<Get<unknown, 1>>().toBe<unknown>();

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
