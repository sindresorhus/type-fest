import {expectTypeOf} from 'nz';
import type {Get, IsEqual, Join, LiteralUnion, ParsePath, Paths, TupleOf} from '../index.d.ts';

// Dot notation
expectTypeOf<ParsePath<'foo'>>().toBe<['foo']>();
expectTypeOf<ParsePath<'foo.bar.baz'>>().toBe<['foo', 'bar', 'baz']>();
expectTypeOf<ParsePath<'foo.0.bar'>>().toBe<['foo', 0, 'bar']>();
expectTypeOf<ParsePath<'matrix.10.20'>>().toBe<['matrix', 10, 20]>();
expectTypeOf<ParsePath<'0'>>().toBe<[0]>();
expectTypeOf<ParsePath<'a.4294967295'>>().toBe<['a', 4_294_967_295]>();
expectTypeOf<ParsePath<'a.9007199254740991'>>().toBe<['a', 9_007_199_254_740_991]>();
expectTypeOf<ParsePath<'a.b-c.d_e.$f'>>().toBe<['a', 'b-c', 'd_e', '$f']>();
expectTypeOf<ParsePath<'a.constructor.__proto__'>>().toBe<['a', 'constructor', '__proto__']>();
expectTypeOf<ParsePath<'a.length'>>().toBe<['a', 'length']>();
expectTypeOf<ParsePath<'a.b c.d'>>().toBe<['a', 'b c', 'd']>();
expectTypeOf<ParsePath<'ä.ö.ü'>>().toBe<['ä', 'ö', 'ü']>();
expectTypeOf<ParsePath<'a.10'>>().toBe<['a', 10]>();
expectTypeOf<ParsePath<'0.0'>>().toBe<[0, 0]>();
expectTypeOf<ParsePath<'a.1.0'>>().toBe<['a', 1, 0]>();

// An integer larger than the largest array index is still a number.
expectTypeOf<ParsePath<'a.4294967296'>>().toBe<['a', 4_294_967_296]>();

// A long path does not hit the recursion limit.
expectTypeOf<ParsePath<'a.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0'>>().toBe<['a', ...TupleOf<60, 0>]>();

// A number with a fraction is two keys, because the dot separates them.
expectTypeOf<ParsePath<'1.5'>>().toBe<[1, 5]>();
expectTypeOf<ParsePath<'a.1.5'>>().toBe<['a', 1, 5]>();
expectTypeOf<ParsePath<'a[0.5]'>>().toBe<['a', 0, 5]>();

// Bracket notation
expectTypeOf<ParsePath<'foo[0].bar.baz'>>().toBe<['foo', 0, 'bar', 'baz']>();
expectTypeOf<ParsePath<'[0]'>>().toBe<[0]>();
expectTypeOf<ParsePath<'[0][1]'>>().toBe<[0, 1]>();
expectTypeOf<ParsePath<'a[0][1].b'>>().toBe<['a', 0, 1, 'b']>();
expectTypeOf<ParsePath<'a[0].1'>>().toBe<['a', 0, 1]>();
expectTypeOf<ParsePath<'a[10]'>>().toBe<['a', 10]>();
expectTypeOf<ParsePath<'a[0][1][2][3]'>>().toBe<['a', 0, 1, 2, 3]>();
expectTypeOf<ParsePath<'a[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]'>>().toBe<['a', ...TupleOf<30, 0>]>();
expectTypeOf<ParsePath<'a.b[0].c[1].d'>>().toBe<['a', 'b', 0, 'c', 1, 'd']>();
expectTypeOf<ParsePath<'[0].a'>>().toBe<[0, 'a']>();
expectTypeOf<ParsePath<'a[01]'>>().toBe<['a', '01']>();

// A long bracket path does not hit the recursion limit.
type TenIndexes = '[0][1][2][3][4][5][6][7][8][9]';
type HundredIndexes = `${TenIndexes}${TenIndexes}${TenIndexes}${TenIndexes}${TenIndexes}${TenIndexes}${TenIndexes}${TenIndexes}${TenIndexes}${TenIndexes}`;
type Ten = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
type Hundred = [...Ten, ...Ten, ...Ten, ...Ten, ...Ten, ...Ten, ...Ten, ...Ten, ...Ten, ...Ten];
expectTypeOf<ParsePath<`a${HundredIndexes}.b`>>().toBe<['a', ...Hundred, 'b']>();
expectTypeOf<Get<{a: unknown[]}, `a${HundredIndexes}`>>().toBe<unknown>();

// Quotes in brackets are kept as part of the key, like `Get` does.
expectTypeOf<ParsePath<'a["b"]'>>().toBe<['a', '"b"']>();
expectTypeOf<ParsePath<'a[\'b\']'>>().toBe<['a', '\'b\'']>();
expectTypeOf<Get<{a: {'"b"': 1}}, ParsePath<'a["b"]'>>>().toBe<1>();
expectTypeOf<Get<{a: {'"b"': 1}}, ParsePath<'a["b"]'>>>().toBe<Get<{a: {'"b"': 1}}, 'a["b"]'>>();

// A dot right before a bracket gives an empty key, like `Get` does.
expectTypeOf<ParsePath<'a.[0]'>>().toBe<['a', '', 0]>();
expectTypeOf<ParsePath<'a[0].[1]'>>().toBe<['a', 0, '', 1]>();
expectTypeOf<ParsePath<'[0].[1]'>>().toBe<[0, '', 1]>();
expectTypeOf<Get<{a: {'': [1]}}, ParsePath<'a.[0]'>>>().toBe<1>();
expectTypeOf<Get<{a: {'': [1]}}, ParsePath<'a.[0]'>>>().toBe<Get<{a: {'': [1]}}, 'a.[0]'>>();

// A key right after a closing bracket, without a dot, is joined to the bracketed key, like `Get` does.
expectTypeOf<ParsePath<'a[0]b'>>().toBe<['a', '0b']>();
expectTypeOf<ParsePath<'[0]a'>>().toBe<['0a']>();
expectTypeOf<ParsePath<'a[0][b]c'>>().toBe<['a', 0, 'bc']>();
expectTypeOf<Get<{a: [{bc: 1}]}, ParsePath<'a[0][b]c'>>>().toBe<Get<{a: [{bc: 1}]}, 'a[0][b]c'>>();

// Bracket and dot notation give the same tuple.
expectTypeOf<ParsePath<'a[0].b[1]'>>().toBe<['a', 0, 'b', 1]>();
expectTypeOf<ParsePath<'a.0.b.1'>>().toBe<['a', 0, 'b', 1]>();

// A non-numeric key in brackets is read like dot notation, like `Get` does.
expectTypeOf<ParsePath<'a[b].c'>>().toBe<['a', 'b', 'c']>();
expectTypeOf<ParsePath<'[a]'>>().toBe<['a']>();
expectTypeOf<ParsePath<'a[b][0]'>>().toBe<['a', 'b', 0]>();

// Unmatched brackets are kept as part of the key.
expectTypeOf<ParsePath<'a[0'>>().toBe<['a[0']>();
expectTypeOf<ParsePath<'a]0'>>().toBe<['a]0']>();
expectTypeOf<ParsePath<'a[0]]'>>().toBe<['a', '0]']>();
expectTypeOf<Get<{a: {'0]': 1}}, ParsePath<'a[0]]'>>>().toBe<Get<{a: {'0]': 1}}, 'a[0]]'>>();

// Nested brackets keep the inner brackets as part of the key.
expectTypeOf<ParsePath<'a[[0]]'>>().toBe<['a', '[0]']>();
expectTypeOf<Get<{a: {'[0]': 1}}, ParsePath<'a[[0]]'>>>().toBe<Get<{a: {'[0]': 1}}, 'a[[0]]'>>();

// Escapes are not supported, so a backslash is part of the key.
expectTypeOf<ParsePath<'a.\\.b'>>().toBe<['a', '\\', 'b']>();

// Empty keys
expectTypeOf<ParsePath<''>>().toBe<['']>();
expectTypeOf<ParsePath<'a.'>>().toBe<['a', '']>();
expectTypeOf<ParsePath<'.a'>>().toBe<['', 'a']>();
expectTypeOf<ParsePath<'a..b'>>().toBe<['a', '', 'b']>();
expectTypeOf<ParsePath<'a[]'>>().toBe<['a', '']>();
expectTypeOf<ParsePath<'[]'>>().toBe<['']>();
expectTypeOf<ParsePath<'.'>>().toBe<['', '']>();
expectTypeOf<ParsePath<'..'>>().toBe<['', '', '']>();
expectTypeOf<ParsePath<'a.1.'>>().toBe<['a', 1, '']>();

// Only a non-negative integer in its plain form is an array index.
expectTypeOf<ParsePath<'a.01'>>().toBe<['a', '01']>();
expectTypeOf<ParsePath<'a.00'>>().toBe<['a', '00']>();
expectTypeOf<ParsePath<'a.-1'>>().toBe<['a', '-1']>();
expectTypeOf<ParsePath<'a[-1]'>>().toBe<['a', '-1']>();
expectTypeOf<ParsePath<'a.-0'>>().toBe<['a', '-0']>();
expectTypeOf<ParsePath<'a.1e3'>>().toBe<['a', '1e3']>();
expectTypeOf<ParsePath<'a.0x10'>>().toBe<['a', '0x10']>();
expectTypeOf<ParsePath<'a. 1'>>().toBe<['a', ' 1']>();
expectTypeOf<ParsePath<'a.1_000'>>().toBe<['a', '1_000']>();
expectTypeOf<ParsePath<'a.Infinity'>>().toBe<['a', 'Infinity']>();
expectTypeOf<ParsePath<'a.NaN'>>().toBe<['a', 'NaN']>();
expectTypeOf<ParsePath<'a.+1'>>().toBe<['a', '+1']>();
expectTypeOf<ParsePath<'a.1 '>>().toBe<['a', '1 ']>();
expectTypeOf<ParsePath<'a.0b1'>>().toBe<['a', '0b1']>();
expectTypeOf<ParsePath<'a.0o7'>>().toBe<['a', '0o7']>();
expectTypeOf<ParsePath<'a.1n'>>().toBe<['a', '1n']>();
expectTypeOf<ParsePath<'a.1a'>>().toBe<['a', '1a']>();
expectTypeOf<ParsePath<'a.1e-7'>>().toBe<['a', '1e-7']>();
expectTypeOf<ParsePath<'a.1e+21'>>().toBe<['a', '1e+21']>();
expectTypeOf<ParsePath<'a.5e-324'>>().toBe<['a', '5e-324']>();
expectTypeOf<ParsePath<'a.1e21'>>().toBe<['a', '1e21']>();
expectTypeOf<ParsePath<'a.0.1e5'>>().toBe<['a', 0, '1e5']>();
expectTypeOf<ParsePath<'a.e'>>().toBe<['a', 'e']>();
expectTypeOf<ParsePath<'a.1e'>>().toBe<['a', '1e']>();
expectTypeOf<ParsePath<'a.e1'>>().toBe<['a', 'e1']>();
expectTypeOf<ParsePath<'a.-Infinity'>>().toBe<['a', '-Infinity']>();

// An integer whose number prints differently stays a string, because its number form would read a different key.
expectTypeOf<ParsePath<'a.9007199254740993'>>().toBe<['a', '9007199254740993']>();
expectTypeOf<ParsePath<'a.1000000000000000000000'>>().toBe<['a', '1000000000000000000000']>();
expectTypeOf<ParsePath<'a.100000000000000000000000'>>().toBe<['a', '100000000000000000000000']>();
expectTypeOf<ParsePath<'a.123456789012345678'>>().toBe<['a', '123456789012345678']>();
expectTypeOf<ParsePath<'a.12345678901234567890'>>().toBe<['a', '12345678901234567890']>();

// Template literal placeholders
expectTypeOf<ParsePath<`a.${number}.b`>>().toBe<['a', number, 'b']>();
expectTypeOf<ParsePath<`a[${number}].b`>>().toBe<['a', number, 'b']>();
expectTypeOf<ParsePath<`a.${string}`>>().toBe<['a', string]>();
expectTypeOf<ParsePath<`a.v${number}`>>().toBe<['a', `v${number}`]>();
expectTypeOf<ParsePath<`${number}`>>().toBe<[number]>();
expectTypeOf<ParsePath<`[${number}]`>>().toBe<[number]>();
expectTypeOf<ParsePath<`a[${number}][${number}]`>>().toBe<['a', number, number]>();
expectTypeOf<ParsePath<`${number}.${number}`>>().toBe<[number, number]>();
expectTypeOf<ParsePath<`${string}.${string}`>>().toBe<[string, string]>();
expectTypeOf<ParsePath<`a[${string}]`>>().toBe<['a', string]>();
expectTypeOf<ParsePath<`a${string}b.c`>>().toBe<[`a${string}b`, 'c']>();
expectTypeOf<ParsePath<`a.${bigint}`>>().toBe<['a', `${bigint}`]>();
expectTypeOf<ParsePath<`a.${number}x`>>().toBe<['a', `${number}x`]>();
expectTypeOf<ParsePath<`${number}.x`>>().toBe<[number, 'x']>();
expectTypeOf<ParsePath<`${string}.a`>>().toBe<[string, 'a']>();
expectTypeOf<ParsePath<`${number}[0]`>>().toBe<[number, 0]>();
expectTypeOf<ParsePath<`a.${any}`>>().toBe<['a', any]>();
expectTypeOf<ParsePath<`-${number}`>>().toBe<[`-${number}`]>();
expectTypeOf<ParsePath<`${number}e${number}`>>().toBe<[`${number}e${number}`]>();
expectTypeOf<ParsePath<`a.${Uppercase<'b'>}`>>().toBe<['a', 'B']>();

// A placeholder is one key, even though a value of it could have a dot.
expectTypeOf<ParsePath<`a.${string}.b`>>().toBe<['a', string, 'b']>();
expectTypeOf<ParsePath<Uppercase<string>>>().toBe<[Uppercase<string>]>();

// A union inside a template literal gives a union of tuples.
expectTypeOf<ParsePath<`a.${'b' | 'c'}`>>().toBe<['a', 'b'] | ['a', 'c']>();
expectTypeOf<ParsePath<`a.${0 | 1}`>>().toBe<['a', 0] | ['a', 1]>();
expectTypeOf<ParsePath<`${boolean}`>>().toBe<['false'] | ['true']>();
expectTypeOf<ParsePath<`a.${'0' | 'b'}.c`>>().toBe<['a', 0, 'c'] | ['a', 'b', 'c']>();
expectTypeOf<ParsePath<`${'a' | 'b'}.${'c' | 'd'}`>>().toBe<['a', 'c'] | ['a', 'd'] | ['b', 'c'] | ['b', 'd']>();

// A number path is read like its string form.
expectTypeOf<ParsePath<0>>().toBe<[0]>();
expectTypeOf<ParsePath<42>>().toBe<[42]>();
expectTypeOf<ParsePath<number>>().toBe<[number]>();
expectTypeOf<ParsePath<-1>>().toBe<['-1']>();
expectTypeOf<ParsePath<1.5>>().toBe<[1, 5]>();
expectTypeOf<ParsePath<0.5>>().toBe<[0, 5]>();
expectTypeOf<ParsePath<-1.5>>().toBe<['-1', 5]>();
expectTypeOf<ParsePath<1e21>>().toBe<['1e+21']>();
expectTypeOf<ParsePath<0 | 1>>().toBe<[0] | [1]>();
expectTypeOf<ParsePath<-0>>().toBe<[0]>();
expectTypeOf<ParsePath<0x10>>().toBe<[16]>();
expectTypeOf<ParsePath<1e-7>>().toBe<['1e-7']>();

// Unions distribute.
expectTypeOf<ParsePath<'a' | 'b[0]'>>().toBe<['a'] | ['b', 0]>();
expectTypeOf<ParsePath<1 | 'a.b'>>().toBe<[1] | ['a', 'b']>();
expectTypeOf<ParsePath<'a.0' | 'a[0]'>>().toBe<['a', 0]>();
expectTypeOf<ParsePath<'a' | `b.${number}`>>().toBe<['a'] | ['b', number]>();
expectTypeOf<ParsePath<number | 'a'>>().toBe<[number] | ['a']>();

// A union with `string` gives `Array<string | number>` for the `string` member.
expectTypeOf<ParsePath<string | number>>().toBe<Array<string | number> | [number]>();

// A non-literal path can have any keys.
expectTypeOf<ParsePath<string>>().toBe<Array<string | number>>();
expectTypeOf<ParsePath<any>>().toBe<Array<string | number>>();
expectTypeOf<ParsePath<never>>().toBe<never>();

// The `string` in a `LiteralUnion` can have any keys too. (`LiteralUnion` makes it `string & {}`.)
expectTypeOf<ParsePath<string & {}>>().toBe<Array<string | number>>();
expectTypeOf<ParsePath<LiteralUnion<'a.b', string>>>().toBe<['a', 'b'] | Array<string | number>>();

// The `number` in a `LiteralUnion` stays `number & {}`, which reads like `number`.
expectTypeOf<ParsePath<LiteralUnion<'a', number>>>().toBe<['a'] | [number & Record<never, never>]>();

// @ts-expect-error
type UnknownPath = ParsePath<unknown>;
// @ts-expect-error
type SymbolPath = ParsePath<symbol>;
// @ts-expect-error
type ArrayPath = ParsePath<['a']>;

// Index segments are numbers, not strings, and the tuple is exact.
expectTypeOf<['foo', '0', 'bar']>().not.toBeAssignableTo<ParsePath<'foo[0].bar'>>();
expectTypeOf<['foo', 0, 'bar']>().toBeAssignableTo<ParsePath<'foo[0].bar'>>();
expectTypeOf<['foo', 1, 'bar']>().not.toBeAssignableTo<ParsePath<'foo[0].bar'>>();
expectTypeOf<['foo', 0]>().not.toBeAssignableTo<ParsePath<'foo[0].bar'>>();
expectTypeOf<['foo', 0, 'bar']>().toBeAssignableTo<ParsePath<`foo[${number}].bar`>>();
expectTypeOf<['foo', '0', 'bar']>().not.toBeAssignableTo<ParsePath<`foo[${number}].bar`>>();

// The result is a mutable tuple: it is assignable to a readonly tuple, but a readonly tuple is not assignable to it.
expectTypeOf<ParsePath<'a.0'>>().toBeAssignableTo<readonly ['a', 0]>();
expectTypeOf<readonly ['a', 0]>().not.toBeAssignableTo<ParsePath<'a.0'>>();

// The result is a tuple, so it has a fixed length and a union of its keys as elements.
expectTypeOf<ParsePath<`a.${string}`>['length']>().toBe<2>();
expectTypeOf<ParsePath<'a.b[0]'>[number]>().toBe<'a' | 'b' | 0>();

// With `Paths`
type FormValues = {
	name: string;
	tags: string[];
	pair: [string, {id: number}];
	address: {
		city: string;
	};
};

expectTypeOf<ParsePath<Paths<FormValues>>>().toBe<
	| ['name']
	| ['tags']
	| ['pair']
	| ['address']
	| ['tags', number]
	| ['pair', 0]
	| ['pair', 1]
	| ['pair', 1, 'id']
	| ['address', 'city']
>();
expectTypeOf<ParsePath<Paths<FormValues, {bracketNotation: true}>>>().toBe<ParsePath<Paths<FormValues>>>();
expectTypeOf<ParsePath<Paths<FormValues, {leavesOnly: true}>>>().toBe<['name'] | ['tags', number] | ['pair', 0] | ['pair', 1, 'id'] | ['address', 'city']>();

// `Paths` gives both `1` and `'1'` for a number key, which parse to the same tuple.
expectTypeOf<ParsePath<Paths<{1: {2: string}}>>>().toBe<[1] | [1, 2]>();
expectTypeOf<ParsePath<Paths<string[]>>>().toBe<[number]>();
expectTypeOf<ParsePath<Paths<Record<string, {name: string}>, {leavesOnly: true}>>>().toBe<[string, 'name']>();
expectTypeOf<ParsePath<Paths<{0: {1: 'x'}}>>>().toBe<[0] | [0, 1]>();
expectTypeOf<ParsePath<Paths<Record<number, {a: 1}>>>>().toBe<[number] | [number, 'a']>();
expectTypeOf<ParsePath<Paths<string[][]>>>().toBe<[number] | [number, number]>();
expectTypeOf<ParsePath<Paths<{readonly a: readonly [1, {b: 2}]}>>>().toBe<['a'] | ['a', 0] | ['a', 1] | ['a', 1, 'b']>();
expectTypeOf<ParsePath<Paths<{a?: {b?: number}}>>>().toBe<['a'] | ['a', 'b']>();
expectTypeOf<ParsePath<Paths<{a: 1} | {b: {c: 2}}>>>().toBe<['a'] | ['b'] | ['b', 'c']>();
expectTypeOf<ParsePath<Paths<{tuple: [string, ...number[]]}>>>().toBe<['tuple'] | ['tuple', number]>();
expectTypeOf<ParsePath<Paths<{a: {b: {c: {d: 1}}}}, {maxRecursionDepth: 1}>>>().toBe<['a'] | ['a', 'b']>();
expectTypeOf<ParsePath<Paths<{a: Array<{b: 1}>}, {recurseIntoArrays: false}>>>().toBe<['a']>();
expectTypeOf<ParsePath<Paths<{a: Array<{b: 1}>}, {bracketNotation: true}>>>().toBe<['a'] | ['a', number] | ['a', number, 'b']>();
expectTypeOf<ParsePath<Paths<{}>>>().toBe<never>();
expectTypeOf<ParsePath<Paths<any>>>().toBe<never>();
expectTypeOf<ParsePath<Paths<{a?: string[]}>>>().toBe<['a'] | ['a', number]>();
expectTypeOf<ParsePath<Paths<{a?: {b: 1}; c: {d?: 2; e: [1]}}, {requiredOnly: true}>>>().toBe<['c'] | ['c', 'e'] | ['c', 'e', 0]>();
expectTypeOf<ParsePath<Paths<{a: {b: {c: 1}}; d: [1, 2]}, {depth: 1}>>>().toBe<['a', 'b'] | ['d', 0] | ['d', 1]>();
expectTypeOf<ParsePath<Paths<{a: Array<{b: 1}>; t: [1]}, {leavesOnly: true; bracketNotation: true}>>>().toBe<['a', number, 'b'] | ['t', 0]>();
expectTypeOf<ParsePath<LiteralUnion<Paths<FormValues, {leavesOnly: true}>, string>>>().toBe<
	| ['name']
	| ['tags', number]
	| ['pair', 0]
	| ['pair', 1, 'id']
	| ['address', 'city']
	| Array<string | number>
>();

// With `Get`
type User = {
	friends: Array<{name: string}>;
	tuple: [string, {id: number}];
};

expectTypeOf<Get<User, ParsePath<'friends[0].name'>>>().toBe<Get<User, 'friends[0].name'>>();
expectTypeOf<Get<User, ParsePath<'tuple.1.id'>>>().toBe<number>();
expectTypeOf<Get<User, ParsePath<'tuple.2'>>>().toBe<unknown>();

// `Get` reads the parsed path the same way as the string path.
type Nested = {
	list: Array<{name: string; tags: string[]}>;
	matrix: number[][];
	tuple: [string, {id: number}];
	record: Record<string, {value: boolean}>;
	optional?: {deep?: {value: string}};
	union: {kind: 'a'; a: number} | {kind: 'b'; b: string};
	0: {1: 'numeric keys'};
	'': {'': 'empty keys'};
};

// Every path from `Paths` reads the same value in its parsed form.
type ParsedPathReadsSameValue<BaseType, Path = Paths<BaseType>> = Path extends string | number ? IsEqual<Get<BaseType, ParsePath<Path>>, Get<BaseType, Path>> : never;
expectTypeOf<ParsedPathReadsSameValue<Nested>>().toBe<true>();
expectTypeOf<ParsedPathReadsSameValue<Nested, Paths<Nested, {bracketNotation: true}>>>().toBe<true>();

// A parsed path is a valid `Get` path, even for a generic path or `BaseType`.
type GetParsedPath<BaseType, Path extends string | number> = Get<BaseType, ParsePath<Path>>;
expectTypeOf<GetParsedPath<Nested, 'tuple.1.id'>>().toBe<number>();
expectTypeOf<GetParsedPath<Nested, 0>>().toBe<{1: 'numeric keys'}>();
type GetValueAtAnyPath<BaseType> = Get<BaseType, ParsePath<Paths<BaseType>>>;
expectTypeOf<GetValueAtAnyPath<{a: {b: 1}; c: [2]}>>().toBe<1 | 2 | [2] | {b: 1}>();

expectTypeOf<Get<Nested, ParsePath<'list'>>>().toBe<Get<Nested, 'list'>>();
expectTypeOf<Get<Nested, ParsePath<'list[0]'>>>().toBe<Get<Nested, 'list[0]'>>();
expectTypeOf<Get<Nested, ParsePath<'list.0.name'>>>().toBe<Get<Nested, 'list.0.name'>>();
expectTypeOf<Get<Nested, ParsePath<'list[0].tags[1]'>>>().toBe<Get<Nested, 'list[0].tags[1]'>>();
expectTypeOf<Get<Nested, ParsePath<`list.${number}.name`>>>().toBe<Get<Nested, `list.${number}.name`>>();
expectTypeOf<Get<Nested, ParsePath<'matrix[0][1]'>>>().toBe<Get<Nested, 'matrix[0][1]'>>();
expectTypeOf<Get<Nested, ParsePath<'tuple[0]'>>>().toBe<Get<Nested, 'tuple[0]'>>();
expectTypeOf<Get<Nested, ParsePath<'tuple.1.id'>>>().toBe<Get<Nested, 'tuple.1.id'>>();
expectTypeOf<Get<Nested, ParsePath<'tuple.01'>>>().toBe<Get<Nested, 'tuple.01'>>();
expectTypeOf<Get<Nested, ParsePath<'tuple.01'>>>().toBe<unknown>();
expectTypeOf<Get<Nested, ParsePath<'tuple.-1'>>>().toBe<Get<Nested, 'tuple.-1'>>();
expectTypeOf<Get<Nested, ParsePath<'record.foo.value'>>>().toBe<Get<Nested, 'record.foo.value'>>();
expectTypeOf<Get<Nested, ParsePath<'record.0.value'>>>().toBe<Get<Nested, 'record.0.value'>>();
expectTypeOf<Get<Nested, ParsePath<'optional.deep.value'>>>().toBe<Get<Nested, 'optional.deep.value'>>();
expectTypeOf<Get<Nested, ParsePath<'union.a'>>>().toBe<Get<Nested, 'union.a'>>();
expectTypeOf<Get<Nested, ParsePath<'0.1'>>>().toBe<Get<Nested, '0.1'>>();
expectTypeOf<Get<Nested, ParsePath<0>>>().toBe<Get<Nested, 0>>();
expectTypeOf<Get<Nested, ParsePath<'.'>>>().toBe<Get<Nested, '.'>>();
expectTypeOf<Get<Nested, ParsePath<'typo'>>>().toBe<unknown>();
expectTypeOf<Get<Nested, ParsePath<'list.0.name' | 'tuple.0'>>>().toBe<Get<Nested, 'list.0.name' | 'tuple.0'>>();
expectTypeOf<Get<Nested, ParsePath<'tuple.1.id'>, {strict: false}>>().toBe<number>();
expectTypeOf<Get<Nested, ParsePath<'list[0].name'>, {strict: false}>>().toBe<string>();
expectTypeOf<Get<Nested, ParsePath<string>>>().toBe<unknown>();

// A key with brackets cannot be read, like with `Get`.
expectTypeOf<Get<{'c[0]': 1}, ParsePath<'c[0]'>>>().toBe<unknown>();

// With `Join`
expectTypeOf<Join<ParsePath<'a[0].b'>, '.'>>().toBe<'a.0.b'>();
expectTypeOf<Join<ParsePath<'a.0.b'>, '.'>>().toBe<'a.0.b'>();
expectTypeOf<Join<ParsePath<`a.${number}`>, '.'>>().toBe<`a.${number}`>();

// In a function signature
declare function parsePath<const Path extends string>(path: Path): ParsePath<Path>;

expectTypeOf(parsePath('users[0].name')).toBe<['users', 0, 'name']>();
declare const dynamicPath: string;
expectTypeOf(parsePath(dynamicPath)).toBe<Array<string | number>>();
expectTypeOf(parsePath('')).toBe<['']>();
expectTypeOf(parsePath('a[0][1].b')).toBe<['a', 0, 1, 'b']>();
expectTypeOf(parsePath('a.01')).toBe<['a', '01']>();
declare const unionPath: 'a.0' | 'b';
expectTypeOf(parsePath(unionPath)).toBe<['a', 0] | ['b']>();

// As the path parameter of a typed `get`
declare function getPath<BaseType, const Path extends ParsePath<Paths<BaseType>>>(object: BaseType, path: Path): Get<BaseType, Path>;
declare const nested: Nested;

expectTypeOf(getPath(nested, ['list'])).toBe<Nested['list']>();
expectTypeOf(getPath(nested, ['list', 0, 'name'])).toBe<string | undefined>();
expectTypeOf(getPath(nested, ['tuple', 1, 'id'])).toBe<number>();
expectTypeOf(getPath(nested, ['matrix', 0, 1])).toBe<number | undefined>();
expectTypeOf(getPath(nested, [0, 1])).toBe<'numeric keys'>();
expectTypeOf(getPath(nested, ['record', 'anything', 'value'])).toBe<boolean | undefined>();
expectTypeOf(getPath(nested, ['union', 'a'])).toBe<number | undefined>();
expectTypeOf(getPath(nested, ['', ''])).toBe<'empty keys'>();

// @ts-expect-error
getPath(nested, ['list', '0', 'name']);
// @ts-expect-error
getPath(nested, ['tuple', 2]);
// @ts-expect-error
getPath(nested, ['typo']);
// @ts-expect-error
getPath(nested, 'list.0.name');
// @ts-expect-error
getPath(nested, ['list', 0, 'typo']);
// @ts-expect-error
getPath(nested, []);

// The result is a mutable tuple, so a readonly path variable is not accepted. An inline `as const` path is accepted, because of the `const` type parameter.
declare const readonlyPath: readonly ['list', 0];
// @ts-expect-error
getPath(nested, readonlyPath);
expectTypeOf(getPath(nested, ['list', 0] as const)).toBe<{name: string; tags: string[]} | undefined>();

// `Readonly` makes a parameter accept both readonly and mutable paths.
declare function getReadonlyPath<BaseType, const Path extends Readonly<ParsePath<Paths<BaseType>>>>(object: BaseType, path: Path): Get<BaseType, Path>;
declare const mutablePath: ['tuple', 1, 'id'];

expectTypeOf(getReadonlyPath(nested, readonlyPath)).toBe<{name: string; tags: string[]} | undefined>();
expectTypeOf(getReadonlyPath(nested, mutablePath)).toBe<number>();
expectTypeOf(getReadonlyPath(nested, ['list', 0, 'name'])).toBe<string | undefined>();
expectTypeOf<Readonly<ParsePath<'a.0' | 'b'>>>().toBe<readonly ['a', 0] | readonly ['b']>();

// @ts-expect-error
getReadonlyPath(nested, ['tuple', 2]);
// @ts-expect-error
getReadonlyPath(nested, ['list', '0']);

// A union of paths is a union of tuples, so a parameter constrained to it can infer a tuple of string literals without `const`, even when the call has a contextual type.
declare function getPathWithoutConst<BaseType, Path extends ParsePath<Paths<BaseType>>>(object: BaseType, path: Path): Get<BaseType, Path>;

expectTypeOf(getPathWithoutConst(nested, ['optional', 'deep', 'value'])).toBe<string | undefined>();

// Without `const`, a number index is not inferred as a literal, so TypeScript infers the whole constraint, and the result is a union of every value. This pins a TypeScript limitation, not a goal.
expectTypeOf(getPathWithoutConst(nested, ['tuple', 1, 'id'])).toBe<Get<Nested, ParsePath<Paths<Nested>>>>();
