import {expectTypeOf} from 'nz';
import type {UnknownSet} from '../index.d.ts';

declare const foo: ReadonlySet<string>;
declare const bar: {
	readonly set: ReadonlySet<number>;
};

expectTypeOf(foo).toBeAssignableTo<UnknownSet>();
expectTypeOf(bar.set).toBeAssignableTo<UnknownSet>();
expectTypeOf(new Set()).toBeAssignableTo<UnknownSet>();
expectTypeOf(new Set('foo')).toBeAssignableTo<UnknownSet>();

expectTypeOf<null>().not.toBeAssignableTo<UnknownSet>();
expectTypeOf<undefined>().not.toBeAssignableTo<UnknownSet>();
expectTypeOf<{}>().not.toBeAssignableTo<UnknownSet>();
expectTypeOf<[]>().not.toBeAssignableTo<UnknownSet>();
expectTypeOf<{0: 1}>().not.toBeAssignableTo<UnknownSet>();
expectTypeOf<1>().not.toBeAssignableTo<UnknownSet>();
expectTypeOf(Date).not.toBeAssignableTo<UnknownSet>();
