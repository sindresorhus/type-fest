import {expectAssignable, expectType} from 'tsd';
import type {EmptyObject, IsEmptyObject} from '../index.d.ts';

declare let foo: EmptyObject;

expectAssignable<{}>(foo);
expectAssignable<{}>(foo = {});

// @ts-expect-error
foo = [];
// @ts-expect-error
foo = {x: 1};
// @ts-expect-error
foo = 42;
// @ts-expect-error
foo = null;
// @ts-expect-error
foo.bar = 42;
// @ts-expect-error
foo.bar = {};

expectType<IsEmptyObject<{}>>(true);
expectType<IsEmptyObject<typeof foo>>(true);

expectType<IsEmptyObject<[]>>(false);
expectType<IsEmptyObject<null>>(false);
expectType<IsEmptyObject<() => void>>(false);

type Union = EmptyObject | {id: number};

const bar: Union = {};
// @ts-expect-error
const _a: unknown = bar.id;

const baz: Union = {id: 42};
expectType<{id: number}>(baz);
