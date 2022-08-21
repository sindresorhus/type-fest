import {expectType} from 'tsd';
import type {MergeDeep, MergeDeepOptions} from '../index';

declare function mergeDeep<Destination, Source, Options extends MergeDeepOptions = {}>(
  destination: Destination,
  source: Source,
  options?: Options,
): MergeDeep<Destination, Source, Options>;

expectType<{}>(mergeDeep({}, {}));
expectType<[]>(mergeDeep([], []));

expectType<never>(mergeDeep({}, []));
expectType<never>(mergeDeep([], {}));
expectType<never>(mergeDeep(null, {}));
expectType<never>(mergeDeep([], 'life'));

type Foo = {
  life: number;
  a: {
    b: string;
    c: boolean;
  };
};

interface Bar {
  name: string;
  a: {
    b: number;
  };
}

const foo: Foo = {life: 42, a: {b: 'b', c: true}};
const bar: Bar = {name: 'nyan', a: {b: 1}};

type FooBarReplace = {
  life: number;
  a: {b: number};
  name: string;
};

type FooBarUnion = {
  life: number;
  a: {b: string; c: boolean} | {b: number};
  name: string;
};

type FooBarMergeOrUnion = {
  life: number;
  a: {b: string | number; c: boolean};
  name: string;
};

type FooBarMergeOrReplace = {
  life: number;
  a: {b: number; c: boolean};
  name: string;
};

expectType<FooBarMergeOrReplace>(mergeDeep(foo, bar));
expectType<FooBarUnion>(mergeDeep(foo, bar, {recordMergeMode: 'union'}));
expectType<FooBarReplace>(mergeDeep(foo, bar, {recordMergeMode: 'replace'}));
expectType<FooBarMergeOrUnion>(mergeDeep(foo, bar, {recordMergeMode: 'merge-or-union'}));
expectType<FooBarMergeOrReplace>(mergeDeep(foo, bar, {recordMergeMode: 'merge-or-replace'}));
