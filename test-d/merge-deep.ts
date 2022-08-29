import {expectType} from 'tsd';
import type {MergeDeep, MergeDeepOptions} from '../index';

// Helper
declare function mergeDeep<Destination, Source, Options extends MergeDeepOptions = {}>(
	destination: Destination,
	source: Source,
	options?: Options,
): MergeDeep<Destination, Source, Options>;

// Signatures
expectType<{}>(mergeDeep({}, {}));
expectType<never[]>(mergeDeep([], []));

expectType<never>(mergeDeep({}, []));
expectType<never>(mergeDeep([], {}));
expectType<never>(mergeDeep(null, {}));
expectType<never>(mergeDeep([], 'life'));

// Fixtures
type Foo = {
	life: number;
	a: {
		b: string;
		c: boolean;
	};
	items: string[];
};

interface Bar {
	name: string;
	a: {
		b: number;
	};
	items: number[];
}

const foo: Foo = {life: 42, items: ['life'], a: {b: 'b', c: true}};
const bar: Bar = {name: 'nyan', items: [4, 2], a: {b: 1}};

interface FooBarReplace {
	life: number;
	name: string;
	items: number[];
	a: {b: number};
}

interface FooBarUnion {
	life: number;
	name: string;
	items: string[] | number[];
	a: {b: string; c: boolean} | {b: number};
}

interface FooBarMergeOrUnion {
	life: number;
	name: string;
	items: Array<string | number>;
	a: {b: string | number; c: boolean};
}

interface FooBarMergeOrReplace {
	life: number;
	name: string;
	items: Array<string | number>;
	a: {b: number; c: boolean};
}

interface FooBarArrayReplace {
	life: number;
	a: {b: number; c: boolean};
	name: string;
	items: number[];
}

interface FooBarArraySpread {
	life: number;
	a: {b: number; c: boolean};
	name: string;
	items: Array<string | number>;
}

interface FooBarArrayUnion {
	life: number;
	a: {b: number; c: boolean};
	name: string;
	items: string[] | number[];
}

// Basic test
expectType<FooBarMergeOrReplace>(mergeDeep(foo, bar));

// Test `recordMergeMode`
expectType<FooBarUnion>(mergeDeep(foo, bar, {recordMergeMode: 'union'}));
expectType<FooBarReplace>(mergeDeep(foo, bar, {recordMergeMode: 'replace'}));
expectType<FooBarMergeOrUnion>(mergeDeep(foo, bar, {recordMergeMode: 'merge-or-union'}));
expectType<FooBarMergeOrReplace>(mergeDeep(foo, bar, {recordMergeMode: 'merge-or-replace'}));

// Test `arrayMergeMode`
expectType<FooBarArrayReplace>(mergeDeep(foo, bar, {arrayMergeMode: 'replace'}));
expectType<FooBarArraySpread>(mergeDeep(foo, bar, {arrayMergeMode: 'spread'}));
expectType<FooBarArrayUnion>(mergeDeep(foo, bar, {arrayMergeMode: 'union'}));

// Test arrays and tuples
const numberArray = [1, 2, 3];
const stringArray = ['a', 'b'];

const numberTuple = [1, 2, 3] as const;
const stringTuple = ['a', 'b'] as const;

// Array <= Array
expectType<string[]>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'replace'}));
expectType<string[] | number[]>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'union'}));
expectType<Array<string | number>>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'spread'}));
expectType<string[]>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'merge-or-replace'}));
expectType<string[] | number[]>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'merge-or-union'}));
expectType<Array<string | number>>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'merge-or-spread'}));

// Tuple <= Tuple
expectType<readonly ['a', 'b']>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'replace'}));
expectType<readonly [1, 2, 3] | readonly ['a', 'b']>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'union'}));
expectType<Array<1 | 2 | 3 | 'a' | 'b'>>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'spread'}));
expectType<['a', 'b', 3]>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'merge-or-replace'}));
expectType<[1 | 'a', 2 | 'b', 3]>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'merge-or-union'}));
expectType<['a', 'b', 3]>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'merge-or-spread'}));

// Array <= Tuple
expectType<readonly ['a', 'b']>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'replace'}));
expectType<number[] | readonly ['a', 'b']>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'union'}));
expectType<Array<number | 'a' | 'b'>>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'spread'}));
expectType<['a', 'b', ...number[]]>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'merge-or-replace'}));
expectType<[number | 'a', number | 'b', ...number[]]>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'merge-or-union'}));
expectType<['a', 'b', ...number[]]>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'merge-or-spread'}));

// Tuple <= Array
expectType<string[]>(mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'replace'}));
expectType<string[] | readonly [1, 2, 3]>(mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'union'}));
expectType<Array<string | 1 | 2 | 3>>(mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'spread'}));
expectType<[string, string, string, ...string[]]>(
	mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'merge-or-replace'}),
);
expectType<[string | 1, string | 2, string | 3, ...string[]]>(
	mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'merge-or-union'}),
);
expectType<[string, string, string, ...string[]]>(
	mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'merge-or-spread'}),
);

// Test merge with object items
expectType<Bar[]>(mergeDeep([foo], [bar], {arrayMergeMode: 'replace'}));
expectType<Foo[] | Bar[]>(mergeDeep([foo], [bar], {arrayMergeMode: 'union'}));
expectType<Array<Foo | Bar>>(mergeDeep([foo], [bar], {arrayMergeMode: 'spread'}));

// Test deep merge with object items
expectType<FooBarArrayReplace[]>(mergeDeep([foo], [bar], {arrayMergeMode: 'merge-or-replace'}));
expectType<FooBarArrayUnion[]>(mergeDeep([foo], [bar], {arrayMergeMode: 'merge-or-union'}));
expectType<FooBarArraySpread[]>(mergeDeep([foo], [bar], {arrayMergeMode: 'merge-or-spread'}));
expectType<FooBarArrayReplace[][]>(mergeDeep([[foo], [foo]], [[bar], [bar]], {arrayMergeMode: 'merge-or-replace'}));
expectType<FooBarArrayUnion[][]>(mergeDeep([[foo], [foo]], [[bar], [bar]], {arrayMergeMode: 'merge-or-union'}));
expectType<FooBarArraySpread[][]>(mergeDeep([[foo], [foo]], [[bar], [bar]], {arrayMergeMode: 'merge-or-spread'}));

// Test `stripUndefinedValues` option.
const fooUndefined = {a: undefined, b: {c: undefined, d: {e: undefined}}};
const barUndefined = {f: undefined, g: {h: undefined, i: 42, j: undefined}};
const bazUndefined = {f: undefined, g: {h: {i: 42, j: undefined}}};

expectType<{
	a: undefined;
	b: {c: undefined; d: {e: undefined}};
	f: undefined;
	g: {h: undefined; i: number; j: undefined};
}>(mergeDeep(fooUndefined, barUndefined));

expectType<{b: {d: {}}; g: {i: number}}>(mergeDeep(fooUndefined, barUndefined, {stripUndefinedValues: true}));
expectType<{b: {d: {}}; g: {i: number}}>(mergeDeep(barUndefined, fooUndefined, {stripUndefinedValues: true}));
expectType<{g: {h: {i: number}; i: number}}>(mergeDeep(barUndefined, bazUndefined, {stripUndefinedValues: true}));
