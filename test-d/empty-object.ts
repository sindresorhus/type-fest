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

// `object` can describe nonempty values, so it is not strictly the empty object type.
expectTypeOf<IsEmptyObject<object>>().toBe<false>();
expectTypeOf<IsEmptyObject<object | {id: number}>>().toBe<false>();

// Empty shapes remain empty, including the standard library's empty ThisType interface.
expectTypeOf<IsEmptyObject<Readonly<EmptyObject>>>().toBe<true>();
expectTypeOf<IsEmptyObject<Partial<EmptyObject>>>().toBe<true>();
expectTypeOf<IsEmptyObject<Record<never, unknown>>>().toBe<true>();
expectTypeOf<IsEmptyObject<ThisType<{id: number}>>>().toBe<true>();

// A declared key or index signature is still meaningful when optional or readonly.
expectTypeOf<IsEmptyObject<{readonly id: number}>>().toBe<false>();
expectTypeOf<IsEmptyObject<{readonly id?: never}>>().toBe<false>();
expectTypeOf<IsEmptyObject<{readonly [key: string]: never}>>().toBe<false>();
expectTypeOf<IsEmptyObject<Readonly<Record<number, unknown>>>>().toBe<false>();
expectTypeOf<IsEmptyObject<Object>>().toBe<false>();

// Classification remains per union member, and broad or sentinel types keep their boundaries.
expectTypeOf<IsEmptyObject<EmptyObject | {readonly id: number}>>().toBe<boolean>();
expectTypeOf<IsEmptyObject<{} | null>>().toBe<boolean>();
expectTypeOf<IsEmptyObject<object | undefined>>().toBe<false>();
expectTypeOf<IsEmptyObject<object | string | null>>().toBe<false>();
expectTypeOf<IsEmptyObject<any>>().toBe<false>();
expectTypeOf<IsEmptyObject<never>>().toBe<never>();
expectTypeOf<IsEmptyObject<unknown>>().toBe<false>();

function _booleanResult<Value>(result: IsEmptyObject<Value>): boolean {
	return result;
}

declare function classifyObject<Value>(value: Value): IsEmptyObject<Value>;
const broadObject: object = {id: 1};
expectTypeOf(classifyObject(broadObject)).toBe<false>();
expectTypeOf(classifyObject({})).toBe<true>();
expectTypeOf(classifyObject({id: 1})).toBe<false>();

// The private empty marker does not erase other declared properties.
expectTypeOf<IsEmptyObject<EmptyObject & {id: 1}>>().toBe<false>();
expectTypeOf<IsEmptyObject<EmptyObject & {readonly id?: number}>>().toBe<false>();

// Common ways of expressing a non-nullish object still permit nonempty values.
expectTypeOf<IsEmptyObject<object & {}>>().toBe<false>();
expectTypeOf<IsEmptyObject<NonNullable<object | null>>>().toBe<false>();
expectTypeOf<IsEmptyObject<unknown & object>>().toBe<false>();
