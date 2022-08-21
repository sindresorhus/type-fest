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

// Array/Array
expectType<string[]>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'replace'}));
expectType<string[] | number[]>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'union'}));
expectType<Array<string | number>>(mergeDeep(numberArray, stringArray, {arrayMergeMode: 'spread'}));

// Tuple/Tuple
expectType<readonly ['a', 'b']>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'replace'}));
expectType<readonly [1, 2, 3] | readonly ['a', 'b']>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'union'}));
expectType<Array<1 | 2 | 3 | 'a' | 'b'>>(mergeDeep(numberTuple, stringTuple, {arrayMergeMode: 'spread'}));

// Array/Tuple
expectType<readonly ['a', 'b']>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'replace'}));
expectType<number[] | readonly ['a', 'b']>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'union'}));
expectType<Array<number | 'a' | 'b'>>(mergeDeep(numberArray, stringTuple, {arrayMergeMode: 'spread'}));

// Tuple/Array
expectType<string[]>(mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'replace'}));
expectType<string[] | readonly [1, 2, 3]>(mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'union'}));
expectType<Array<string | 1 | 2 | 3>>(mergeDeep(numberTuple, stringArray, {arrayMergeMode: 'spread'}));
