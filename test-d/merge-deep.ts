import {expectType} from 'tsd';
import type {MergeDeep, MergeDeepOptions} from '../index';
// Import type {ConditionalSimplifyDeep} from '../source/conditional-simplify';

// --------------------------------------------------------------------------------------------------------------------

// Test helper.
declare function mergeDeep<
	Destination,
	Source,
	Options extends MergeDeepOptions = {},
>(destination: Destination, source: Source, options?: Options): MergeDeep<Destination, Source, Options>;

// --------------------------------------------------------------------------------------------------------------------

// Test valid signatures for objects.
expectType<{}>(mergeDeep({}, {}));
expectType<{}>(mergeDeep({} as const, {}));
expectType<{}>(mergeDeep({}, {} as const));
expectType<{}>(mergeDeep({} as const, {} as const));

// Test valid signatures for arrays/tuples.
expectType<never[]>(mergeDeep([], []));
expectType<never[]>(mergeDeep([] as const, []));
expectType<never[]>(mergeDeep([], [] as const));
expectType<never[]>(mergeDeep([] as const, [] as const));

// Test invalid signatures.
expectType<never>(mergeDeep({}, []));
expectType<never>(mergeDeep([], {}));
expectType<never>(mergeDeep(null, {}));
expectType<never>(mergeDeep([], 'life'));
expectType<never>(mergeDeep([], new Set()));
expectType<never>(mergeDeep(new Set(), new Set()));
expectType<never>(mergeDeep(undefined, undefined));
expectType<never>(mergeDeep({}, undefined));
expectType<never>(mergeDeep(undefined, {}));

// Should merge simple objects
expectType<{a: string; b: number}>(mergeDeep({a: 'life'}, {b: 42}));
expectType<{a: 'life'; b: number}>(mergeDeep({a: 'life'} as const, {b: 42}));
expectType<{a: string; b: 42}>(mergeDeep({a: 'life'}, {b: 42} as const));
expectType<{a: 'life'; b: 42}>(mergeDeep({a: 'life'} as const, {b: 42} as const));

// Should spread simple arrays/tuples (default mode)
expectType<Array<string | number>>(mergeDeep(['life'], [42]));
expectType<Array<'life' | number>>(mergeDeep(['life'] as const, [42]));
expectType<Array<string | 42>>(mergeDeep(['life'], [42] as const));
expectType<Array<'life' | 42>>(mergeDeep(['life'] as const, [42] as const));

expectType<Array<string | number>>(mergeDeep(['life'], [42], {arrayMergeMode: 'spread'}));
expectType<Array<'life' | number>>(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'spread'}));
expectType<Array<string | 42>>(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'spread'}));
expectType<Array<'life' | 42>>(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'spread'}));

// Should replace simple arrays/tuples
expectType<number[]>(mergeDeep(['life'], [42], {arrayMergeMode: 'replace'}));
expectType<number[]>(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'replace'}));
expectType<readonly [42]>(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'replace'}));
expectType<readonly [42]>(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'replace'}));

// Should union simple arrays/tuples
expectType<string[] | number[]>(mergeDeep(['life'], [42], {arrayMergeMode: 'union'}));
expectType<readonly ['life'] | number[]>(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'union'}));
expectType<string[] | readonly [42]>(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'union'}));
expectType<readonly ['life'] | readonly [42]>(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'union'}));

// Sould merge simple types
type Foo = {foo: string; fooBar: unknown; items: string[]};
type Bar = {bar: number; fooBar: boolean; items: number[]};

declare const fooBar: MergeDeep<Foo, Bar>;
expectType<{foo: string; bar: number; fooBar: boolean; items: Array<string | number>}>(fooBar);

declare const fooBarSpread: MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: Array<string | number>}>(fooBarSpread);

declare const fooBarReplace: MergeDeep<Foo, Bar, {arrayMergeMode: 'replace'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: number[]}>(fooBarReplace);

declare const fooBarUnion: MergeDeep<Foo, Bar, {arrayMergeMode: 'union'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: string[] | number[]}>(fooBarUnion);

// Sould merge simple types with index signatures
type FooWithIndexSignature = {[x: string]: unknown; foo: string; fooBar: string; items: string[]};
type BarWithIndexSignature = {[x: symbol]: unknown; bar: number; fooBar: number; items: number[]};

declare const fooBarWithIndexSignature: MergeDeep<FooWithIndexSignature, BarWithIndexSignature>;
expectType<{
	[x: string]: unknown;
	[x: symbol]: unknown;
	foo: string;
	fooBar: number;
	items: Array<string | number>;
	bar: number;
}>(fooBarWithIndexSignature);

// Sould merge simple types deep
type FooDeep = {foo: Foo; fooBar: Foo; items: {foo: Foo[]; fooBar: Foo}};
type BarDeep = {bar: Bar; fooBar: Bar; items: {bar: Bar[]; fooBar: Bar}};

declare const fooBarDeep: MergeDeep<FooDeep, BarDeep>;

expectType<{
	foo: {
		foo: string;
		fooBar: unknown;
		items: string[];
	};
	bar: {
		bar: number;
		fooBar: boolean;
		items: number[];
	};
	fooBar: {
		foo: string;
		bar: number;
		fooBar: boolean;
		items: Array<string | number>;
	};
	items: {
		foo: Foo[];
		bar: Bar[];
		fooBar: {
			foo: string;
			bar: number;
			fooBar: boolean;
			items: Array<string | number>;
		};
	};
}>(fooBarDeep);
