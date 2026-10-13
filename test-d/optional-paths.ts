import {expectTypeOf} from 'nz';
import type {OmitDeep, OptionalPaths, PickDeep} from '../index.d.ts';
import type {MapsSetsOrArrays, NonRecursiveType} from '../source/internal/type.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

expectTypeOf<OptionalPaths<{}>>().toBe<never>();
expectTypeOf<OptionalPaths<{a?: 1}>>().toBe<'a'>();
expectTypeOf<OptionalPaths<{a: 1}>>().toBe<never>();

expectTypeOf<OptionalPaths<{a: {b?: string; c: number}; d?: boolean}>>().toBe<'a.b' | 'd'>();
expectTypeOf<OptionalPaths<{a?: {b?: string; c: number}; d?: boolean}>>().toBe<'a' | 'a.b' | 'd'>();
expectTypeOf<OptionalPaths<{a?: string; b?: number; c: boolean}>>().toBe<'a' | 'b'>();
expectTypeOf<OptionalPaths<{a?: {b: {c?: string; d?: {e: number; f?: boolean}}}}>>().toBe<'a' | 'a.b.c' | 'a.b.d' | 'a.b.d.f'>();
expectTypeOf<OptionalPaths<{a: {b: {c: {d?: 1}}}}>>().toBe<'a.b.c.d'>();

expectTypeOf<OptionalPaths<{a?: {b: Array<{c?: string}>}}>>().toBe<'a' | `a.b.${number}.c`>();
expectTypeOf<OptionalPaths<{a?: {b: [{c?: string}, {d: {e?: number}}]}}>>().toBe<'a' | 'a.b.0.c' | 'a.b.1.d.e'>();

// Readonly modifiers
expectTypeOf<OptionalPaths<{readonly a?: string; readonly b: number}>>().toBe<'a'>();
expectTypeOf<OptionalPaths<{readonly a: {readonly b?: string; c: number}}>>().toBe<'a.b'>();

// Arrays
expectTypeOf<OptionalPaths<[]>>().toBe<never>();

expectTypeOf<OptionalPaths<[string?, number?, boolean?]>>().toBe<'0' | '1' | '2'>();
expectTypeOf<OptionalPaths<[string, number?, boolean?]>>().toBe<'1' | '2'>();
expectTypeOf<OptionalPaths<[string, number, boolean]>>().toBe<never>();
expectTypeOf<OptionalPaths<[string?, number?, boolean?, ...string[]]>>().toBe<'0' | '1' | '2'>();
expectTypeOf<OptionalPaths<[string, number?, boolean?, ...string[]]>>().toBe<'1' | '2'>();
expectTypeOf<OptionalPaths<[string, number, boolean, ...string[]]>>().toBe<never>();
expectTypeOf<OptionalPaths<[...string[], string, number]>>().toBe<never>();
expectTypeOf<OptionalPaths<[boolean, ...string[], string, number]>>().toBe<never>();

expectTypeOf<OptionalPaths<[{a?: string}, {b: {c?: number}}?, [string, boolean?]?]>>().toBe<'0.a' | '1' | '1.b.c' | '2' | '2.1'>();
expectTypeOf<OptionalPaths<[{a: {b?: string}}, ...Array<{c?: [string?]; d: {e?: number}}>]>>().toBe<'0.a.b' | `${number}.c` | `${number}.c.0` | `${number}.d.e`>();
expectTypeOf<OptionalPaths<[...Array<{a?: string; b: {c?: string}}>, {d: {e?: string}}]>>().toBe<`${number}.a` | `${number}.b.c` | `${number}.d.e`>();
expectTypeOf<OptionalPaths<[[{a?: number}], ...Array<[number?]>, {b: {c?: string}}]>>().toBe<'0.0.a' | `${number}.0` | `${number}.b.c`>();
expectTypeOf<OptionalPaths<[string, ...Array<[{a?: string}, ...Array<[string?, ...string[]]>]>]>>().toBe<`${number}.0.a` | `${number}.${number}.0`>();

expectTypeOf<OptionalPaths<string[]>>().toBe<never>();
expectTypeOf<OptionalPaths<Array<string | undefined>>>().toBe<never>();

// Readonly arrays
expectTypeOf<OptionalPaths<readonly []>>().toBe<never>();
expectTypeOf<OptionalPaths<readonly [string?, number?, boolean?]>>().toBe<'0' | '1' | '2'>();
expectTypeOf<OptionalPaths<readonly [...string[], string, number]>>().toBe<never>();
expectTypeOf<OptionalPaths<readonly [[{a?: number}], ...Array<[number?]>, {b: {c?: string}}]>>().toBe<'0.0.a' | `${number}.0` | `${number}.b.c`>();
expectTypeOf<OptionalPaths<readonly string[]>>().toBe<never>();

// Numeric keys give only string paths, unlike `Paths`, so the result can always be passed to `PickDeep` and `OmitDeep`.
expectTypeOf<OptionalPaths<{0?: string; 1: number; 2?: boolean}>>().toBe<'0' | '2'>();
expectTypeOf<OptionalPaths<{'0'?: string; '1': number; '2'?: boolean}>>().toBe<'0' | '2'>();
expectTypeOf<OptionalPaths<{1: {2?: string}}>>().toBe<'1.2'>();
expectTypeOf<OptionalPaths<[{1?: string}?]>>().toBe<'0' | '0.1'>();

// `any` / `never` / `{}` property values
expectTypeOf<OptionalPaths<{a: {b?: any; c?: never}; d?: {}}>>().toBe<'a.b' | 'a.c' | 'd'>();
expectTypeOf<OptionalPaths<[any, {a?: never}, {b?: any}, [unknown?], ...Array<{c?: {}}>]>>().toBe<'1.a' | '2.b' | '3.0' | `${number}.c`>();

// Union values
expectTypeOf<OptionalPaths<{a: {b?: number | {c?: string}}}>>().toBe<'a.b' | 'a.b.c'>();
expectTypeOf<OptionalPaths<{a?: {b: {c?: string} | {d?: number} | {e: {f?: boolean}}}}>>().toBe<'a' | 'a.b.c' | 'a.b.d' | 'a.b.e.f'>();
expectTypeOf<OptionalPaths<[{a?: string} | {b: {c: [[{e?: number}] | {d?: string}]}}]>>().toBe<'0.a' | '0.b.c.0.d' | '0.b.c.0.0.e'>();

// Unions
expectTypeOf<OptionalPaths<{a: {b?: 1}; c?: 2} | {x?: {y: 2}; z: 3}>>().toBe<'a.b' | 'c' | 'x'>();
expectTypeOf<OptionalPaths<[string, number?] | {x: string; y?: number}>>().toBe<'y' | '1'>();
expectTypeOf<OptionalPaths<
	| [...Array<{a?: string; b: {c?: string}}>, {d: {e?: string}}]
	| {f?: {g: [{h?: string}, {i: {j?: number}}]}}
	| {k: {l?: any; m?: never}; n?: {}}
>>().toBe<`${number}.a` | `${number}.b.c` | `${number}.d.e` | 'f' | 'f.g.0.h' | 'f.g.1.i.j' | 'k.l' | 'k.m' | 'n'>();

// Index signatures
expectTypeOf<OptionalPaths<{[key: string]: number}>>().toBe<never>();
expectTypeOf<OptionalPaths<{[key: string]: string; a?: 'a'; b: 'b'}>>().toBe<'a'>();
expectTypeOf<OptionalPaths<{a: {[key: string]: {b?: string}}}>>().toBe<`a.${string}.b`>();
expectTypeOf<OptionalPaths<{[key: string]: any; a?: {b?: string; c: number}; d?: boolean; e: {f?: string}}>>().toBe<'a' | 'a.b' | 'd' | 'e.f'>();

// Nested index signatures
expectTypeOf<OptionalPaths<{[key: string]: {[key: string]: object; a: {b?: string}; d?: {e: number}}}>>().toBe<`${string}.a.b` | `${string}.d`>();
expectTypeOf<OptionalPaths<{[key: string]: {[key: number]: {a?: {b: {c?: string}}}}}>>().toBe<`${string}.${number}.a` | `${string}.${number}.a.b.c`>();

// Non recursives
expectTypeOf<OptionalPaths<Date>>().toBe<never>();
expectTypeOf<OptionalPaths<() => string>>().toBe<never>();
expectTypeOf<OptionalPaths<Set<string>>>().toBe<never>();
expectTypeOf<OptionalPaths<{a?: {b: Function | {c?: Date}}}>>().toBe<'a' | 'a.b.c'>();
expectTypeOf<OptionalPaths<{a: Exclude<NonRecursiveType, Function>; b: Exclude<MapsSetsOrArrays, UnknownArray>}>>().toBe<never>();
expectTypeOf<OptionalPaths<{a?: Date; b?: Set<string>}>>().toBe<'a' | 'b'>();

// Functions with properties
expectTypeOf<OptionalPaths<{(): string; a?: string; b: {c?: number}}>>().toBe<'a' | 'b.c'>();
expectTypeOf<OptionalPaths<{(): string; a?: {b: {c?: string}}; d: {e?: string}}>>().toBe<'a' | 'a.b.c' | 'd.e'>();

// Recursive types
type Recursive1 = {foo?: Recursive1};
expectTypeOf<OptionalPaths<Recursive1>>().toBe<'foo' | 'foo.foo' | 'foo.foo.foo' | 'foo.foo.foo.foo' | 'foo.foo.foo.foo.foo' | 'foo.foo.foo.foo.foo.foo'>();
expectTypeOf<OptionalPaths<Recursive1, {maxRecursionDepth: 0}>>().toBe<'foo'>();
expectTypeOf<OptionalPaths<Recursive1, {maxRecursionDepth: 1}>>().toBe<'foo' | 'foo.foo'>();

type Recursive2 = {foo: {bar?: Recursive2}; baz: [Recursive2?]};
expectTypeOf<OptionalPaths<Recursive2>>().toBe<
	| 'foo.bar'
	| 'foo.bar.foo.bar'
	| 'foo.bar.foo.bar.foo.bar'

	| 'baz.0'
	| 'baz.0.baz.0'
	| 'baz.0.baz.0.baz.0'

	| 'foo.bar.baz.0'
	| 'foo.bar.baz.0.baz.0'

	| 'foo.bar.foo.bar.baz.0'
	| 'foo.bar.baz.0.foo.bar'

	| 'baz.0.foo.bar'
	| 'baz.0.foo.bar.foo.bar'

	| 'baz.0.baz.0.foo.bar'
	| 'baz.0.foo.bar.baz.0'
>();
expectTypeOf<OptionalPaths<Recursive2, {maxRecursionDepth: 3}>>().toBe<'foo.bar' | 'foo.bar.foo.bar' | 'baz.0' | 'baz.0.baz.0' | 'foo.bar.baz.0' | 'baz.0.foo.bar'>();

// Mutually circular recursive types
type Recursive3 = {foo?: Recursive4};
type Recursive4 = {bar?: Recursive3};
expectTypeOf<OptionalPaths<Recursive3>>().toBe<'foo' | 'foo.bar' | 'foo.bar.foo' | 'foo.bar.foo.bar' | 'foo.bar.foo.bar.foo' | 'foo.bar.foo.bar.foo.bar'>();
expectTypeOf<OptionalPaths<Recursive3, {maxRecursionDepth: 2}>>().toBe<'foo' | 'foo.bar' | 'foo.bar.foo'>();
expectTypeOf<OptionalPaths<Recursive4>>().toBe<'bar' | 'bar.foo' | 'bar.foo.bar' | 'bar.foo.bar.foo' | 'bar.foo.bar.foo.bar' | 'bar.foo.bar.foo.bar.foo'>();
expectTypeOf<OptionalPaths<Recursive4, {maxRecursionDepth: 1}>>().toBe<'bar' | 'bar.foo'>();

// Boundary cases
expectTypeOf<OptionalPaths<any>>().toBe<never>();
expectTypeOf<OptionalPaths<never>>().toBe<never>();

// Generic types
type OptionalPathsConstraint<T extends object, _U extends OptionalPaths<T>> = never;

type Generic1<T> = {bar: {baz?: T}};
type Test1<T> = OptionalPathsConstraint<Generic1<T>, 'bar.baz'>;
// @ts-expect-error
type Test2<T> = OptionalPathsConstraint<Generic1<T>, 'bar'>; // 'bar' is not optional

type Generic2<T, U> = {bar?: {baz: {qux?: T}; fizz: U | T | {buzz?: U}}};
type Test3<T extends object, U extends object> = OptionalPathsConstraint<
	Generic2<T, U>,
	'bar' | 'bar.baz.qux' | 'bar.fizz.buzz'
>;
// @ts-expect-error
type Test4<T extends object, U extends object> = OptionalPathsConstraint<Generic2<T, U>, 'bar.baz'>; // 'bar.baz' is not optional
// @ts-expect-error
type Test5<T extends object, U extends object> = OptionalPathsConstraint<Generic2<T, U>, 'bar.fizz'>; // 'bar.fizz' is not optional

// Composes with `PickDeep` and `OmitDeep`, including for a generic type.
type UserFields = {
	id: string;
	avatarUrl?: string;
	role?: string;
	preferences: {
		theme: string;
		alerts?: boolean;
	};
};
expectTypeOf<OmitDeep<UserFields, OptionalPaths<UserFields>>>().toBe<{id: string; preferences: {theme: string}}>();
expectTypeOf<PickDeep<UserFields, OptionalPaths<UserFields>>>().toBe<{avatarUrl?: string; role?: string; preferences: {alerts?: boolean}}>();

type MinimalObject<T extends object> = OmitDeep<T, OptionalPaths<T>>;
expectTypeOf<MinimalObject<UserFields>>().toBe<{id: string; preferences: {theme: string}}>();
type OptionalOnly<T extends object> = PickDeep<T, OptionalPaths<T>>;
expectTypeOf<OptionalOnly<UserFields>>().toBe<{avatarUrl?: string; role?: string; preferences: {alerts?: boolean}}>();

// `OmitDeep` replaces a removed tuple element with `unknown`.
type Tuple = [string, number?];
expectTypeOf<OmitDeep<Tuple, OptionalPaths<Tuple>>>().toBe<[string, unknown]>();
type NumericKeys = {0?: string; 1: number};
expectTypeOf<OmitDeep<NumericKeys, OptionalPaths<NumericKeys>>>().toBe<{1: number}>();
type ArrayOfObjects = {items: Array<{name: string; note?: string}>};
expectTypeOf<OmitDeep<ArrayOfObjects, OptionalPaths<ArrayOfObjects>>>().toBe<{items: Array<{name: string}>}>();
