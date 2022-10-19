import {expectTypeOf} from 'expect-type';
import type {EmptyObject, IsEmptyObject} from '../index';

declare let foo: EmptyObject;

expectTypeOf(foo).toMatchTypeOf<{}>();
expectTypeOf(foo = {}).toMatchTypeOf<{}>();

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

expectTypeOf<true>().toEqualTypeOf<IsEmptyObject<{}>>();
expectTypeOf<true>().toEqualTypeOf<IsEmptyObject<typeof foo>>();

expectTypeOf<false>().toEqualTypeOf<IsEmptyObject<[]>>();
expectTypeOf<false>().toEqualTypeOf<IsEmptyObject<null>>();
expectTypeOf<false>().toEqualTypeOf<IsEmptyObject<() => void>>();

type Union = EmptyObject | {id: number};

const bar: Union = {};
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
bar.id;

const baz: Union = {id: 42};
expectTypeOf(baz).toEqualTypeOf<{id: number}>();
