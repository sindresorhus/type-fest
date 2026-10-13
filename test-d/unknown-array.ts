import {expectTypeOf} from 'nz';
import type {UnknownArray} from '../index.d.ts';

declare const foo: readonly [];
declare const bar: {
	readonly array: unknown[];
};

expectTypeOf(foo).toBeAssignableTo<UnknownArray>();
expectTypeOf(bar.array).toBeAssignableTo<UnknownArray>();
[] satisfies UnknownArray;
['foo'] satisfies UnknownArray;

expectTypeOf<null>().not.toBeAssignableTo<UnknownArray>();
expectTypeOf<undefined>().not.toBeAssignableTo<UnknownArray>();
expectTypeOf<{}>().not.toBeAssignableTo<UnknownArray>();
expectTypeOf<{0: 1}>().not.toBeAssignableTo<UnknownArray>();
expectTypeOf<{length: number}>().not.toBeAssignableTo<UnknownArray>();
expectTypeOf<1>().not.toBeAssignableTo<UnknownArray>();
expectTypeOf(Date).not.toBeAssignableTo<UnknownArray>();

type IsArray<T> = T extends UnknownArray ? true : false;

declare const string: IsArray<string>;
expectTypeOf(string).toBe<false>();
declare const array: IsArray<[]>;
expectTypeOf(array).toBe<true>();
declare const tuple: IsArray<['foo']>;
expectTypeOf(tuple).toBe<true>();
declare const readonlyArray: IsArray<readonly number[]>;
expectTypeOf(readonlyArray).toBe<true>();
declare const leadingSpread: IsArray<readonly [number, ...string[]]>;
expectTypeOf(leadingSpread).toBe<true>();
declare const trailingSpread: IsArray<readonly [...string[], number]>;
expectTypeOf(trailingSpread).toBe<true>();
