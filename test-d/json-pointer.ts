import {expectTypeOf} from 'nz';
import type {JsonPointer, JsonPointerOptions, StringRepeat} from '../index.d.ts';

// Basic
expectTypeOf<JsonPointer<{foo: string}>>().toBe<'' | '/foo'>();

type DeepObject = {
	a: {
		b: {
			c: {
				d: string;
			};
		};
		b2: number[];
		b3: boolean;
	};
};

type DeepPointer = '' | '/a' | '/a/b' | '/a/b/c' | '/a/b/c/d' | '/a/b2' | '/a/b3' | `/a/b2/${number}`;
expectTypeOf<JsonPointer<DeepObject>>().toBe<DeepPointer>();

// Test for interface
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InterfaceType extends DeepObject {}
expectTypeOf<JsonPointer<InterfaceType>>().toBe<DeepPointer>();

// Types without string or number keys
expectTypeOf<JsonPointer<{}>>().toBe<''>();
expectTypeOf<JsonPointer<object>>().toBe<''>();
expectTypeOf<JsonPointer<{[Symbol.iterator]: string}>>().toBe<''>();
expectTypeOf<JsonPointer<{[Symbol.iterator]: string; a: string}>>().toBe<'' | '/a'>();

// `any`, `never`, and `unknown`
expectTypeOf<JsonPointer<never>>().toBe<never>();
expectTypeOf<JsonPointer<any>>().toBe<'' | `/${string}`>();
expectTypeOf<JsonPointer<unknown>>().toBe<'' | `/${string}`>();
expectTypeOf<JsonPointer<any[]>>().toBe<'' | `/${number}`>();
expectTypeOf<JsonPointer<unknown[]>>().toBe<'' | `/${number}`>();
expectTypeOf<JsonPointer<never[]>>().toBe<'' | `/${number}`>();

// Primitive and non-recursive values
expectTypeOf<JsonPointer<string>>().toBe<''>();
expectTypeOf<JsonPointer<number>>().toBe<''>();
expectTypeOf<JsonPointer<null>>().toBe<''>();
expectTypeOf<JsonPointer<undefined>>().toBe<''>();
expectTypeOf<JsonPointer<void>>().toBe<''>();
expectTypeOf<JsonPointer<symbol>>().toBe<''>();
expectTypeOf<JsonPointer<bigint>>().toBe<''>();
expectTypeOf<JsonPointer<boolean>>().toBe<''>();
expectTypeOf<JsonPointer<Date>>().toBe<''>();
expectTypeOf<JsonPointer<RegExp>>().toBe<''>();
expectTypeOf<JsonPointer<Uint8Array>>().toBe<''>();
expectTypeOf<JsonPointer<ArrayBuffer>>().toBe<''>();
expectTypeOf<JsonPointer<() => void>>().toBe<''>();
expectTypeOf<JsonPointer<Map<string, number>>>().toBe<''>();
expectTypeOf<JsonPointer<ReadonlyMap<string, number>>>().toBe<''>();
expectTypeOf<JsonPointer<Set<string>>>().toBe<''>();
expectTypeOf<JsonPointer<ReadonlySet<string>>>().toBe<''>();
expectTypeOf<JsonPointer<WeakMap<{a: string}, number>>>().toBe<''>();
expectTypeOf<JsonPointer<WeakSet<{a: string}>>>().toBe<''>();
expectTypeOf<JsonPointer<Promise<{a: string}>>>().toBe<''>();
expectTypeOf<JsonPointer<() => void | {a: string}>>().toBe<''>();

// A non-recursive value is a leaf
expectTypeOf<JsonPointer<{date: Date}>>().toBe<'' | '/date'>();
expectTypeOf<JsonPointer<{map: Map<string, {a: string}>}>>().toBe<'' | '/map'>();
expectTypeOf<JsonPointer<{set: Set<{a: string}>}>>().toBe<'' | '/set'>();
expectTypeOf<JsonPointer<{fn: () => void}>>().toBe<'' | '/fn'>();
expectTypeOf<JsonPointer<{empty: {}}>>().toBe<'' | '/empty'>();
expectTypeOf<JsonPointer<{a: object}>>().toBe<'' | '/a'>();
expectTypeOf<JsonPointer<{nil: null}>>().toBe<'' | '/nil'>();
expectTypeOf<JsonPointer<{optional: undefined}>>().toBe<'' | '/optional'>();
expectTypeOf<JsonPointer<{a: any}>>().toBe<'' | '/a'>();
expectTypeOf<JsonPointer<{a: never}>>().toBe<'' | '/a'>();
expectTypeOf<JsonPointer<{a: unknown}>>().toBe<'' | '/a'>();
expectTypeOf<JsonPointer<{a: {b: any; c: string}}>>().toBe<'' | '/a' | '/a/b' | '/a/c'>();
expectTypeOf<JsonPointer<{a: void; b: symbol; c: bigint; d: true}>>().toBe<'' | '/a' | '/b' | '/c' | '/d'>();
expectTypeOf<JsonPointer<{re: RegExp; bytes: Uint8Array}>>().toBe<'' | '/re' | '/bytes'>();
expectTypeOf<JsonPointer<{p: Promise<{a: string}>}>>().toBe<'' | '/p'>();
expectTypeOf<JsonPointer<{a: Date | {b: string}}>>().toBe<'' | '/a' | '/a/b'>();

// A class instance is walked, but a constructor is a leaf
declare class Model {
	a: string;
	b: number;
}

expectTypeOf<JsonPointer<Model>>().toBe<'' | '/a' | '/b'>();
expectTypeOf<JsonPointer<{ctor: typeof Model}>>().toBe<'' | '/ctor'>();

// Optional properties
expectTypeOf<JsonPointer<{a?: {b?: string}}>>().toBe<'' | '/a' | '/a/b'>();
expectTypeOf<JsonPointer<{a?: {b: string} | undefined}>>().toBe<'' | '/a' | '/a/b'>();
expectTypeOf<JsonPointer<{a?: string; b: {c?: number}}>>().toBe<'' | '/a' | '/b' | '/b/c'>();

// Unions
expectTypeOf<JsonPointer<{a: {b: string} | {c: number}}>>().toBe<'' | '/a' | '/a/b' | '/a/c'>();
expectTypeOf<JsonPointer<{foo: string} | {bar: number}>>().toBe<'' | '/foo' | '/bar'>();
expectTypeOf<JsonPointer<string | {foo: string}>>().toBe<'' | '/foo'>();
expectTypeOf<JsonPointer<{a: string} & {b: number}>>().toBe<'' | '/a' | '/b'>();
expectTypeOf<JsonPointer<{a: string} & {b?: {c: number}}>>().toBe<'' | '/a' | '/b' | '/b/c'>();
expectTypeOf<JsonPointer<{a: string} | null | undefined>>().toBe<'' | '/a'>();
expectTypeOf<JsonPointer<Array<{a: string}> | {b: string}>>().toBe<'' | '/b' | `/${number}` | `/${number}/a`>();

// Arrays
expectTypeOf<JsonPointer<Array<{foo: string}>>>().toBe<'' | `/${number}` | `/${number}/foo`>();
expectTypeOf<JsonPointer<{foo: Array<{bar: boolean[]}>}>>().toBe<'' | '/foo' | `/foo/${number}` | `/foo/${number}/bar` | `/foo/${number}/bar/${number}`>();
expectTypeOf<JsonPointer<ReadonlyArray<{foo: string}>>>().toBe<'' | `/${number}` | `/${number}/foo`>();
expectTypeOf<JsonPointer<{foo: readonly string[]}>>().toBe<'' | '/foo' | `/foo/${number}`>();
expectTypeOf<JsonPointer<string[][]>>().toBe<'' | `/${number}` | `/${number}/${number}`>();
expectTypeOf<JsonPointer<Array<[{a: string}]>>>().toBe<'' | `/${number}` | `/${number}/0` | `/${number}/0/a`>();
expectTypeOf<JsonPointer<Array<[]>>>().toBe<'' | `/${number}`>();
expectTypeOf<JsonPointer<{a: Array<{b: string}>; c: Array<{d: number}>}>>().toBe<'' | '/a' | `/a/${number}` | `/a/${number}/b` | '/c' | `/c/${number}` | `/c/${number}/d`>();

// Tuples
expectTypeOf<JsonPointer<[]>>().toBe<''>();
expectTypeOf<JsonPointer<[string]>>().toBe<'' | '/0'>();
expectTypeOf<JsonPointer<[{foo: string}, string]>>().toBe<'' | '/0' | '/0/foo' | '/1'>();
expectTypeOf<JsonPointer<{empty: []}>>().toBe<'' | '/empty'>();
expectTypeOf<JsonPointer<{tuple: [string, number?]}>>().toBe<'' | '/tuple' | '/tuple/0' | '/tuple/1'>();
expectTypeOf<JsonPointer<{tuple: [string, {bar: string}]}>>().toBe<'' | '/tuple' | '/tuple/0' | '/tuple/1' | '/tuple/1/bar'>();
expectTypeOf<JsonPointer<readonly [string, {bar: string}]>>().toBe<'' | '/0' | '/1' | '/1/bar'>();
expectTypeOf<JsonPointer<readonly [string, {a: string}?]>>().toBe<'' | '/0' | '/1' | '/1/a'>();

// Tuples with a rest element
expectTypeOf<JsonPointer<[{a: string}, ...Array<{b: number}>]>>().toBe<'' | '/0' | '/0/a' | `/${number}` | `/${number}/b`>();
expectTypeOf<JsonPointer<[{a: string}, {b: number}, ...Array<{c: number}>]>>().toBe<'' | '/0' | '/0/a' | '/1' | '/1/b' | `/${number}` | `/${number}/c`>();
expectTypeOf<JsonPointer<[...Array<{a: string}>, {b: number}]>>().toBe<'' | `/${number}` | `/${number}/a` | `/${number}/b`>();
expectTypeOf<JsonPointer<[string, number?, ...boolean[]]>>().toBe<'' | `/${number}`>();

// Object keys that need escaping
expectTypeOf<JsonPointer<{'a/b': string}>>().toBe<'' | '/a~1b'>();
expectTypeOf<JsonPointer<{'a~b': string}>>().toBe<'' | '/a~0b'>();
expectTypeOf<JsonPointer<{'a~/b': string}>>().toBe<'' | '/a~0~1b'>();
expectTypeOf<JsonPointer<{'a/b/c': string}>>().toBe<'' | '/a~1b~1c'>();
expectTypeOf<JsonPointer<{'~1': string}>>().toBe<'' | '/~01'>();
expectTypeOf<JsonPointer<{'a/b': {c: string}}>>().toBe<'' | '/a~1b' | '/a~1b/c'>();
expectTypeOf<JsonPointer<{'a.b': {c: string}}>>().toBe<'' | '/a.b' | '/a.b/c'>();
expectTypeOf<JsonPointer<{'': string}>>().toBe<'' | '/'>();
expectTypeOf<JsonPointer<{'': {x: string}}>>().toBe<'' | '/' | '//x'>();
expectTypeOf<JsonPointer<{'/': {'~': string}}>>().toBe<'' | '/~1' | '/~1/~0'>();
expectTypeOf<JsonPointer<{'ä/ö': string}>>().toBe<'' | '/ä~1ö'>();
expectTypeOf<JsonPointer<{'~': string}>>().toBe<'' | '/~0'>();
expectTypeOf<JsonPointer<{'a~~b': string}>>().toBe<'' | '/a~0~0b'>();
expectTypeOf<JsonPointer<{'~0': string}>>().toBe<'' | '/~00'>();
expectTypeOf<JsonPointer<{'a/b': {'c~d': string}}>>().toBe<'' | '/a~1b' | '/a~1b/c~0d'>();
expectTypeOf<JsonPointer<{'a/b': {'': string}}>>().toBe<'' | '/a~1b' | '/a~1b/'>();
// A long key with many escaped characters does not hit the recursion limit.
expectTypeOf<JsonPointer<Record<StringRepeat<'~', 100>, string>>>().toBe<'' | `/${StringRepeat<'~0', 100>}`>();
expectTypeOf<JsonPointer<Record<StringRepeat<'/', 100>, string>>>().toBe<'' | `/${StringRepeat<'~1', 100>}`>();
// An unescaped slash or tilde names a different key.
expectTypeOf<'/a/b'>().not.toBeAssignableTo<JsonPointer<{'a/b': string}>>();
expectTypeOf<'/a~1b'>().toBeAssignableTo<JsonPointer<{'a/b': string}>>();
expectTypeOf<'/a~b'>().not.toBeAssignableTo<JsonPointer<{'a~b': string}>>();
expectTypeOf<'/a~0b'>().toBeAssignableTo<JsonPointer<{'a~b': string}>>();

// Numeric keys and enums
expectTypeOf<JsonPointer<{0: string; 1: {a: string}}>>().toBe<'' | '/0' | '/1' | '/1/a'>();
expectTypeOf<JsonPointer<Record<1, unknown>>>().toBe<'' | '/1'>();
expectTypeOf<JsonPointer<Record<1 | 2, {a: string}>>>().toBe<'' | '/1' | '/1/a' | '/2' | '/2/a'>();
expectTypeOf<JsonPointer<Record<-1, {a: string}>>>().toBe<'' | '/-1' | '/-1/a'>();
expectTypeOf<JsonPointer<Record<1.5, string>>>().toBe<'' | '/1.5'>();

enum NumericKey {
	First = 1,
	Second = 2,
}

enum StringKey {
	First = 'first',
	Second = 'second',
}

expectTypeOf<JsonPointer<Record<NumericKey, {a: string}>>>().toBe<'' | '/1' | '/2' | '/1/a' | '/2/a'>();
expectTypeOf<JsonPointer<Record<StringKey, string>>>().toBe<'' | '/first' | '/second'>();

// Index signatures
expectTypeOf<JsonPointer<Record<string, {a: string}>>>().toBe<'' | `/${string}`>();
expectTypeOf<JsonPointer<Record<number, {a: string}>>>().toBe<'' | `/${number}` | `/${number}/a`>();
expectTypeOf<JsonPointer<{[key: `a${number}`]: string}>>().toBe<'' | `/a${number}`>();
expectTypeOf<JsonPointer<{[key: `a/b${number}`]: string}>>().toBe<'' | `/a~1b${number}`>();
expectTypeOf<JsonPointer<{[key: `a~${number}`]: {b: string}}>>().toBe<'' | `/a~0${number}` | `/a~0${number}/b`>();
expectTypeOf<JsonPointer<{a: Record<string, {b: string}>}>>().toBe<'' | '/a' | `/a/${string}`>();
expectTypeOf<JsonPointer<{a: Record<number, {b: string}>}>>().toBe<'' | '/a' | `/a/${number}` | `/a/${number}/b`>();
expectTypeOf<JsonPointer<{[key: `${string}-id`]: {x: string}}>>().toBe<'' | `/${string}-id` | `/${string}-id/x`>();
expectTypeOf<JsonPointer<{[key: string]: string | number; id: number}>>().toBe<'' | `/${string}`>();

// A union value distributes
expectTypeOf<JsonPointer<{a: string[] | {b: string}}>>().toBe<'' | '/a' | '/a/b' | `/a/${number}`>();

// The issue's example used brackets, but RFC 6901 array indices are bare digits
type Person = {
	firstName: string;
	lastName: string;
};

type Family = {
	members: Person[];
};

expectTypeOf<JsonPointer<Family>>().toBe<'' | '/members' | `/members/${number}` | `/members/${number}/firstName` | `/members/${number}/lastName`>();
expectTypeOf<'/members/[0]/firstName'>().not.toBeAssignableTo<JsonPointer<Family>>();
// The RFC 6902 `-` append token does not point at an existing value.
expectTypeOf<'/members/-'>().not.toBeAssignableTo<JsonPointer<Family>>();
// The URI fragment form is not a JSON Pointer.
expectTypeOf<'#/members/0'>().not.toBeAssignableTo<JsonPointer<Family>>();
// The `${number}` index token also accepts strings that are not valid array indices.
expectTypeOf<'/members/00'>().toBeAssignableTo<JsonPointer<Family>>();
expectTypeOf<'/members/1.5'>().toBeAssignableTo<JsonPointer<Family>>();

// A circular type stops at `maxRecursionDepth`
type Node = {
	value: string;
	next?: Node;
};

expectTypeOf<'/next/next/next/next/next/next'>().toBeAssignableTo<JsonPointer<Node>>();
expectTypeOf<'/next/next/next/next/next/next/next'>().not.toBeAssignableTo<JsonPointer<Node>>();
expectTypeOf<'/next/next/next/next/next/value'>().toBeAssignableTo<JsonPointer<Node>>();

// Mutual recursion stops at the same depth
type MutualA = {b: MutualB; name: string};
type MutualB = {a: MutualA};

expectTypeOf<'/b/a/b/a/b/a'>().toBeAssignableTo<JsonPointer<MutualA>>();
expectTypeOf<'/b/a/b/a/b/a/b'>().not.toBeAssignableTo<JsonPointer<MutualA>>();

// A generic recursive type stops at the same depth
type Tree<Value> = {value: Value; children: Array<Tree<Value>>};

expectTypeOf<'/children/0/children/1/value'>().toBeAssignableTo<JsonPointer<Tree<string>>>();
expectTypeOf<'/children/0/children/1/children/2'>().toBeAssignableTo<JsonPointer<Tree<string>>>();
expectTypeOf<'/children/0/children/1/children/2/children/3'>().not.toBeAssignableTo<JsonPointer<Tree<string>>>();

// `maxRecursionDepth`
expectTypeOf<JsonPointer<{a: {b: {c: string}}}, {maxRecursionDepth: 0}>>().toBe<'' | '/a'>();
expectTypeOf<JsonPointer<{a: {b: {c: string}}}, {maxRecursionDepth: 1}>>().toBe<'' | '/a' | '/a/b'>();
expectTypeOf<JsonPointer<{a: {b: {c: string}}}, {maxRecursionDepth: 2}>>().toBe<'' | '/a' | '/a/b' | '/a/b/c'>();
expectTypeOf<JsonPointer<{a: {b: {c: string}}}, {maxRecursionDepth: 10}>>().toBe<'' | '/a' | '/a/b' | '/a/b/c'>();

// The default depth allows exactly six reference tokens
type SevenLevel = {
	l1: {
		l2: {
			l3: {
				l4: {
					l5: {
						l6: {
							l7: string;
						};
					};
				};
			};
		};
	};
};

expectTypeOf<JsonPointer<SevenLevel>>().toBe<'' | '/l1' | '/l1/l2' | '/l1/l2/l3' | '/l1/l2/l3/l4' | '/l1/l2/l3/l4/l5' | '/l1/l2/l3/l4/l5/l6'>();
expectTypeOf<'/l1/l2/l3/l4/l5/l6/l7'>().not.toBeAssignableTo<JsonPointer<SevenLevel>>();

// A higher limit adds deeper tokens
type RecursiveFoo = {foo: RecursiveFoo};
expectTypeOf<'/foo/foo/foo/foo/foo/foo/foo/foo/foo/foo/foo'>().toBeAssignableTo<JsonPointer<RecursiveFoo, {maxRecursionDepth: 10}>>();
expectTypeOf<'/foo/foo/foo/foo/foo/foo/foo/foo/foo/foo/foo/foo'>().not.toBeAssignableTo<JsonPointer<RecursiveFoo, {maxRecursionDepth: 10}>>();

// An array index is a top-level token, so depth `0` still includes it
expectTypeOf<JsonPointer<string[], {maxRecursionDepth: 0}>>().toBe<'' | `/${number}`>();

// A non-literal depth stops at the top-level properties
expectTypeOf<JsonPointer<{a: {b: string}}, {maxRecursionDepth: number}>>().toBe<'' | '/a'>();

// Options fall back to the defaults, like any other option
expectTypeOf<JsonPointer<{a: {b: string}}, JsonPointerOptions>>().toBe<JsonPointer<{a: {b: string}}>>();
expectTypeOf<JsonPointer<{a: {b: string}}, Partial<JsonPointerOptions>>>().toBe<JsonPointer<{a: {b: string}}>>();
expectTypeOf<JsonPointer<{a: {b: string}}, {maxRecursionDepth: 1} & JsonPointerOptions>>().toBe<JsonPointer<{a: {b: string}}, {maxRecursionDepth: 1}>>();

// @ts-expect-error `maxRecursionDepth` must be a number
type InvalidOptions = JsonPointer<{a: string}, {maxRecursionDepth: string}>;

declare function forwardOptions<Type, Options extends JsonPointerOptions>(value: Type, options?: Options): JsonPointer<Type, Options>;
expectTypeOf(forwardOptions<{a: {b: string}}, JsonPointerOptions>({a: {b: 'x'}})).toBe<JsonPointer<{a: {b: string}}>>();

// The result can be used as a generic constraint
type PointerConstraint<Value, Pointer extends JsonPointer<Value>> = Pointer;
type ValidPointer = PointerConstraint<{a: {b: string}}, '/a/b'>;
expectTypeOf<ValidPointer>().toBe<'/a/b'>();
// @ts-expect-error The pointer must name a property of the value type
type InvalidPointer = PointerConstraint<{a: {b: string}}, '/a/c'>;

// Function parameters
declare function patch<Type>(value: Type, pointer: JsonPointer<Type>): void;

patch({a: {b: 1}}, '');
patch({a: {b: 1}}, '/a');
patch({a: {b: 1}}, '/a/b');

// @ts-expect-error
patch({a: {b: 1}}, '/a/c');

// @ts-expect-error
patch({a: {b: 1}}, 'a');

declare const familyPointer: JsonPointer<Family>;
patch({members: [] as Person[]}, familyPointer);

declare function setPointer(pointer: JsonPointer<{a: {b: string}}>): void;
setPointer('');
setPointer('/a');
setPointer('/a/b');

// @ts-expect-error
setPointer('foo');

// @ts-expect-error
setPointer('/a/c');

// Negative assignability
expectTypeOf<'/a/c'>().not.toBeAssignableTo<JsonPointer<{a: {b: 1}}>>();
expectTypeOf<'a'>().not.toBeAssignableTo<JsonPointer<{a: {b: 1}}>>();
expectTypeOf<'/a/b'>().toBeAssignableTo<JsonPointer<{a: {b: 1}}>>();
expectTypeOf<'/foo'>().not.toBeAssignableTo<JsonPointer<{}>>();
expectTypeOf<'/tuple/2'>().not.toBeAssignableTo<JsonPointer<{tuple: [string, {bar: string}]}>>();

// A wide type still checks the pointer syntax
expectTypeOf<'/foo'>().toBeAssignableTo<JsonPointer<any>>();
expectTypeOf<'foo'>().not.toBeAssignableTo<JsonPointer<any>>();
expectTypeOf<'/foo'>().toBeAssignableTo<JsonPointer<unknown>>();
expectTypeOf<'foo'>().not.toBeAssignableTo<JsonPointer<unknown>>();
