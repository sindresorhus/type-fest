import {expectTypeOf} from 'nz';
import type {UnknownMap} from '../index.d.ts';

declare const foo: ReadonlyMap<string, number>;
declare const bar: {
	readonly map: ReadonlyMap<number, string>;
};

expectTypeOf(foo).toBeAssignableTo<UnknownMap>();
expectTypeOf(bar.map).toBeAssignableTo<UnknownMap>();
expectTypeOf(new Map()).toBeAssignableTo<UnknownMap>();
expectTypeOf(new Map([['foo', 1]])).toBeAssignableTo<UnknownMap>();

expectTypeOf<null>().not.toBeAssignableTo<UnknownMap>();
expectTypeOf<undefined>().not.toBeAssignableTo<UnknownMap>();
expectTypeOf<{}>().not.toBeAssignableTo<UnknownMap>();
expectTypeOf<[]>().not.toBeAssignableTo<UnknownMap>();
expectTypeOf<{0: 1}>().not.toBeAssignableTo<UnknownMap>();
expectTypeOf<1>().not.toBeAssignableTo<UnknownMap>();
