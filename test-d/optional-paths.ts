import {expectType} from 'tsd';
import type {OptionalPaths} from '../source/optional-paths.d.ts';
import type {MapsSetsOrArrays, NonRecursiveType} from '../source/internal/type.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

expectType<never>({} as OptionalPaths<{}>);
expectType<'a'>({} as OptionalPaths<{a?: 1}>);
expectType<never>({} as OptionalPaths<{a: 1}>);

expectType<'a.b' | 'd'>({} as OptionalPaths<{a: {b?: string; c: number}; d?: boolean}>);
expectType<'a' | 'a.b' | 'd'>({} as OptionalPaths<{a?: {b?: string; c: number}; d?: boolean}>);
expectType<'a' | 'b'>({} as OptionalPaths<{a?: string; b?: number; c: boolean}>);
expectType<'a' | 'a.b.c' | 'a.b.d' | 'a.b.d.f'>({} as OptionalPaths<{a?: {b: {c?: string; d?: {e: number; f?: boolean}}}}>);
expectType<'a.b.c.d'>({} as OptionalPaths<{a: {b: {c: {d?: 1}}}}>);

expectType<'a' | `a.b.${number}.c`>({} as OptionalPaths<{a?: {b: Array<{c?: string}>}}>);
expectType<'a' | 'a.b.0.c' | 'a.b.1.d.e'>({} as OptionalPaths<{a?: {b: [{c?: string}, {d: {e?: number}}]}}>);

// Readonly modifiers
expectType<'a'>({} as OptionalPaths<{readonly a?: string; readonly b: number}>);
expectType<'a.b'>({} as OptionalPaths<{readonly a: {readonly b?: string; c: number}}>);

// Arrays
expectType<never>({} as OptionalPaths<[]>);

expectType<0 | '0' | 1 | '1' | 2 | '2'>({} as OptionalPaths<[string?, number?, boolean?]>);
expectType<1 | '1' | 2 | '2'>({} as OptionalPaths<[string, number?, boolean?]>);
expectType<never>({} as OptionalPaths<[string, number, boolean]>);
expectType<0 | '0' | 1 | '1' | 2 | '2'>({} as OptionalPaths<[string?, number?, boolean?, ...string[]]>);
expectType<1 | '1' | 2 | '2'>({} as OptionalPaths<[string, number?, boolean?, ...string[]]>);
expectType<never>({} as OptionalPaths<[string, number, boolean, ...string[]]>);
expectType<never>({} as OptionalPaths<[...string[], string, number]>);
expectType<never>({} as OptionalPaths<[boolean, ...string[], string, number]>);

expectType<'0.a' | 1 | '1' | '1.b.c' | 2 | '2' | '2.1'>(
	{} as OptionalPaths<[{a?: string}, {b: {c?: number}}?, [string, boolean?]?]>,
);
expectType<'0.a.b' | `${number}.c` | `${number}.c.0` | `${number}.d.e`>(
	{} as OptionalPaths<[{a: {b?: string}}, ...Array<{c?: [string?]; d: {e?: number}}>]>,
);
expectType<`${number}.a` | `${number}.b.c` | `${number}.d.e`>(
	{} as OptionalPaths<[...Array<{a?: string; b: {c?: string}}>, {d: {e?: string}}]>,
);
expectType<'0.0.a' | `${number}.0` | `${number}.b.c`>(
	{} as OptionalPaths<[[{a?: number}], ...Array<[number?]>, {b: {c?: string}}]>,
);
expectType<`${number}.0.a` | `${number}.${number}.0`>(
	{} as OptionalPaths<[string, ...Array<[{a?: string}, ...Array<[string?, ...string[]]>]>]>,
);

expectType<never>({} as OptionalPaths<string[]>);
expectType<never>({} as OptionalPaths<Array<string | undefined>>);

// Readonly arrays
expectType<never>({} as OptionalPaths<readonly []>);
expectType<0 | '0' | 1 | '1' | 2 | '2'>({} as OptionalPaths<readonly [string?, number?, boolean?]>);
expectType<never>({} as OptionalPaths<readonly [...string[], string, number]>);
expectType<'0.0.a' | `${number}.0` | `${number}.b.c`>(
	{} as OptionalPaths<readonly [[{a?: number}], ...Array<[number?]>, {b: {c?: string}}]>,
);
expectType<never>({} as OptionalPaths<readonly string[]>);

// Numeric keys
expectType<0 | '0' | 2 | '2'>({} as OptionalPaths<{0?: string; 1: number; 2?: boolean}>);
expectType<0 | '0' | 2 | '2'>({} as OptionalPaths<{'0'?: string; '1': number; '2'?: boolean}>);
expectType<'1.2'>({} as OptionalPaths<{1: {2?: string}}>);
expectType<0 | '0' | '0.1'>({} as OptionalPaths<[{1?: string}?]>);

// `any` / `never` / `{}` property values
expectType<'a.b' | 'a.c' | 'd'>({} as OptionalPaths<{a: {b?: any; c?: never}; d?: {}}>);
expectType<'1.a' | '2.b' | '3.0' | `${number}.c`>(
	{} as OptionalPaths<[any, {a?: never}, {b?: any}, [unknown?], ...Array<{c?: {}}>]>,
);

// Union values
expectType<'a.b' | 'a.b.c'>({} as OptionalPaths<{a: {b?: {c?: string} | number}}>);
expectType<'a' | 'a.b.c' | 'a.b.d' | 'a.b.e.f'>(
	{} as OptionalPaths<{a?: {b: {c?: string} | {d?: number} | {e: {f?: boolean}}}}>,
);
expectType<'0.a' | '0.b.c.0.d' | '0.b.c.0.0.e'>(
	{} as OptionalPaths<[{a?: string} | {b: {c: [{d?: string} | [{e?: number}]]}}]>,
);

// Unions
expectType<'a.b' | 'c' | 'x'>({} as OptionalPaths<{a: {b?: 1}; c?: 2} | {x?: {y: 2}; z: 3}>);
expectType<'y' | 1 | '1'>({} as OptionalPaths<{x: string; y?: number} | [string, number?]>);
expectType<`${number}.a` | `${number}.b.c` | `${number}.d.e` | 'f' | 'f.g.0.h' | 'f.g.1.i.j' | 'k.l' | 'k.m' | 'n'>(
	{} as OptionalPaths<
		| [...Array<{a?: string; b: {c?: string}}>, {d: {e?: string}}]
		| {f?: {g: [{h?: string}, {i: {j?: number}}]}}
		| {k: {l?: any; m?: never}; n?: {}}
	>);

// Index signatures
expectType<never>({} as OptionalPaths<{[key: string]: number}>);
expectType<'a'>({} as OptionalPaths<{[key: string]: string; a?: 'a'; b: 'b'}>);
expectType<`a.${string}.b`>({} as OptionalPaths<{a: {[key: string]: {b?: string}}}>);
expectType<'a' | 'a.b' | 'd' | 'e.f'>(
	{} as OptionalPaths<{[key: string]: any; a?: {b?: string; c: number}; d?: boolean; e: {f?: string}}>,
);

// Nested index signatures
expectType<`${string}.a.b` | `${string}.d`>(
	{} as OptionalPaths<{[key: string]: {[key: string]: object; a: {b?: string}; d?: {e: number}}}>,
);
expectType<`${string}.${number}.a` | `${string}.${number}.a.b.c`>(
	{} as OptionalPaths<{[key: string]: {[key: number]: {a?: {b: {c?: string}}}}}>,
);

// Non recursives
expectType<never>({} as OptionalPaths<Date>);
expectType<never>({} as OptionalPaths<() => string>);
expectType<never>({} as OptionalPaths<Set<string>>);
expectType<'a' | 'a.b.c'>({} as OptionalPaths<{a?: {b: Function | {c?: Date}}}>);
expectType<never>({} as OptionalPaths<{a: Exclude<NonRecursiveType, Function>; b: Exclude<MapsSetsOrArrays, UnknownArray>}>);
expectType<'a' | 'b'>({} as OptionalPaths<{a?: Date; b?: Set<string>}>);

// Functions with properties
expectType<'a' | 'b.c'>({} as OptionalPaths<{(): string; a?: string; b: {c?: number}}>);
expectType<'a' | 'a.b.c' | 'd.e'>({} as OptionalPaths<{(): string; a?: {b: {c?: string}}; d: {e?: string}}>);

// Recursive types
type Recursive1 = {foo?: Recursive1};
expectType<'foo' | 'foo.foo' | 'foo.foo.foo' | 'foo.foo.foo.foo' | 'foo.foo.foo.foo.foo' | 'foo.foo.foo.foo.foo.foo'>(
	{} as OptionalPaths<Recursive1>,
);
expectType<'foo'>({} as OptionalPaths<Recursive1, {maxRecursionDepth: 0}>);
expectType<'foo' | 'foo.foo'>({} as OptionalPaths<Recursive1, {maxRecursionDepth: 1}>);

type Recursive2 = {foo: {bar?: Recursive2}; baz: [Recursive2?]};
expectType<
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
>({} as OptionalPaths<Recursive2>);
expectType<'foo.bar' | 'foo.bar.foo.bar' | 'baz.0' | 'baz.0.baz.0' | 'foo.bar.baz.0' | 'baz.0.foo.bar'>(
	{} as OptionalPaths<Recursive2, {maxRecursionDepth: 3}>,
);

// Mutually circular recursive types
type Recursive3 = {foo?: Recursive4};
type Recursive4 = {bar?: Recursive3};
expectType<'foo' | 'foo.bar' | 'foo.bar.foo' | 'foo.bar.foo.bar' | 'foo.bar.foo.bar.foo' | 'foo.bar.foo.bar.foo.bar'>(
	{} as OptionalPaths<Recursive3>,
);
expectType<'foo' | 'foo.bar' | 'foo.bar.foo'>({} as OptionalPaths<Recursive3, {maxRecursionDepth: 2}>);
expectType<'bar' | 'bar.foo' | 'bar.foo.bar' | 'bar.foo.bar.foo' | 'bar.foo.bar.foo.bar' | 'bar.foo.bar.foo.bar.foo'>(
	{} as OptionalPaths<Recursive4>,
);
expectType<'bar' | 'bar.foo'>({} as OptionalPaths<Recursive4, {maxRecursionDepth: 1}>);

// Boundary cases
expectType<never>({} as OptionalPaths<any>);
expectType<never>({} as OptionalPaths<never>);

// Generic types
type OptionalPathsConstraint<T extends object, _U extends OptionalPaths<T>> = never;

type Generic1<T> = {bar: {baz?: T}};
type Test1<T> = OptionalPathsConstraint<Generic1<T>, 'bar.baz'>;
// @ts-expect-error
type Test2<T> = OptionalPathsConstraint<Generic1<T>, 'bar'>; // 'bar' is not optional

type Generic2<T, U> = {bar?: {baz: {qux?: T}; fizz: {buzz?: U} | U | T}};
type Test3<T extends object, U extends object> = OptionalPathsConstraint<
	Generic2<T, U>,
	'bar' | 'bar.baz.qux' | 'bar.fizz.buzz'
>;
// @ts-expect-error
type Test4<T extends object, U extends object> = OptionalPathsConstraint<Generic2<T, U>, 'bar.baz'>; // 'bar.baz' is not optional
// @ts-expect-error
type Test5<T extends object, U extends object> = OptionalPathsConstraint<Generic2<T, U>, 'bar.fizz'>; // 'bar.fizz' is not optional
