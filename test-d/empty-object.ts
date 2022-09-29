import {expectAssignable, expectError, expectType} from 'tsd';
import type {EmptyObject, IsEmptyObject} from '../index';

declare let foo: EmptyObject;

expectAssignable<{}>(foo);
expectAssignable<{}>(foo = {});

expectError(foo = []);
expectError(foo = {x: 1});
expectError(foo = 42);
expectError(foo = null);
expectError(foo.bar = 42);
expectError(foo.bar = {});

expectType<IsEmptyObject<{}>>(true);
expectType<IsEmptyObject<typeof foo>>(true);

expectType<IsEmptyObject<[]>>(false);
expectType<IsEmptyObject<null>>(false);
expectType<IsEmptyObject<() => void>>(false);

type Union = EmptyObject | {id: number};

const bar: Union = {};
expectError(bar.id);

const baz: Union = {id: 42};
expectType<{id: number}>(baz);
