import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {EmptyArray, IsEmptyArray} from '../index';

declare let foo: EmptyArray;

expectAssignable<EmptyArray>([]);
expectNotAssignable<EmptyArray>([1]);
expectNotAssignable<EmptyArray>([undefined]);
expectNotAssignable<EmptyArray>({});

foo = [];
foo = [...[]]; // eslint-disable-line unicorn/no-useless-spread
foo = [...new Set([])];
foo.slice(1);
foo.splice(1);
const _length = foo.length;

// @ts-expect-error
foo.push(1);
// @ts-expect-error
foo.fill(1);
// @ts-expect-error
foo.unshift(1);
// @ts-expect-error
foo = [1];
// @ts-expect-error
foo = [...[1]]; // eslint-disable-line unicorn/no-useless-spread
// @ts-expect-error
foo = [...new Set([1])];
// @ts-expect-error
foo = null;
// @ts-expect-error
foo.bar = 42;
// @ts-expect-error
foo.bar = [];

expectType<IsEmptyArray<[]>>(true);
expectType<IsEmptyArray<[1]>>(false);
expectType<IsEmptyArray<typeof foo>>(true);
