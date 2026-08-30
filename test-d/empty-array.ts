import {expectTypeOf} from 'nz';
import type {EmptyArray} from '../index.d.ts';

expectTypeOf<EmptyArray>().toBe<readonly []>();

declare let foo: EmptyArray;

expectTypeOf(foo = []).toBeAssignableTo<EmptyArray>();

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

// A readonly array cannot be used where a mutable one is expected.
expectTypeOf<EmptyArray>().not.toBeAssignableTo<[]>();

type Union = EmptyArray | [id: number];

const bar: Union = [];
// @ts-expect-error
const _a: number = bar[0];

const baz: Union = [42];
expectTypeOf(baz).toBe<[id: number]>();
