import {expectTypeOf} from 'nz';
import type {EmptyObject, IsEmptyObject} from '../index.d.ts';

declare let foo: EmptyObject;

expectTypeOf(foo).toBeAssignableTo<{}>();
expectTypeOf(foo = {}).toBeAssignableTo<{}>();

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

expectTypeOf<IsEmptyObject<{}>>().toBe<true>();
expectTypeOf<IsEmptyObject<typeof foo>>().toBe<true>();

expectTypeOf<IsEmptyObject<[]>>().toBe<false>();
expectTypeOf<IsEmptyObject<null>>().toBe<false>();
expectTypeOf<IsEmptyObject<() => void>>().toBe<false>();

type Union = EmptyObject | {id: number};

const bar: Union = {};
// @ts-expect-error
const _a: unknown = bar.id;

const baz: Union = {id: 42};
expectTypeOf(baz).toBe<{id: number}>();

// A type with an index signature can hold any property, so it is not strictly `{}`.
expectTypeOf<IsEmptyObject<{[key: string]: number}>>().toBe<false>();
expectTypeOf<IsEmptyObject<{[key: number]: number}>>().toBe<false>();
expectTypeOf<IsEmptyObject<Record<string, unknown>>>().toBe<false>();

// A type with an index signature of any key type can hold a property, so it is not strictly `{}`.
expectTypeOf<IsEmptyObject<{[key: symbol]: number}>>().toBe<false>();
expectTypeOf<IsEmptyObject<{[key: `data-${string}`]: number}>>().toBe<false>();
expectTypeOf<IsEmptyObject<{[key: `${bigint}`]: number}>>().toBe<false>();
