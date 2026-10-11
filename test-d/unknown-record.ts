import {expectTypeOf} from 'nz';
import type {UnknownRecord} from '../index.d.ts';

declare let foo: UnknownRecord;

expectTypeOf(foo).toBeAssignableTo<UnknownRecord>();
expectTypeOf(foo = {}).toBeAssignableTo<UnknownRecord>();
expectTypeOf(foo = {bar: 'baz'}).toBeAssignableTo<UnknownRecord>();
expectTypeOf(foo = {bar: {baz: 'hello'}}).toBeAssignableTo<UnknownRecord>();

// @ts-expect-error
foo = [];
// @ts-expect-error
foo = 42;
// @ts-expect-error
foo = null;

expectTypeOf(foo['bar']).toBe<unknown>();
