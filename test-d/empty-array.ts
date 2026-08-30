import {expectAssignable, expectType} from 'tsd';
import type {EmptyArray, IsEmptyArray} from '../index.d.ts';

declare let foo: EmptyArray;

expectAssignable<readonly []>(foo);
expectAssignable<readonly []>(foo = []);

// @ts-expect-error
foo = [1, 2, 3];
// @ts-expect-error
foo = {};
// @ts-expect-error
foo = 42;
// @ts-expect-error
foo = null;
// @ts-expect-error
foo[0] = 1;

expectType<IsEmptyArray<[]>>(true);
expectType<IsEmptyArray<typeof foo>>(true);

expectType<IsEmptyArray<[1, 2, 3]>>(false);
expectType<IsEmptyArray<string[]>>(false);
expectType<IsEmptyArray<null>>(false);
expectType<IsEmptyArray<() => void>>(false);

type Union = EmptyArray | [id: number];

const bar: Union = [];
// @ts-expect-error
const _a: number = bar[0];

const baz: Union = [42];
expectType<[id: number]>(baz);
