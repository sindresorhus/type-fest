import {expectTypeOf} from 'nz';
import type {Arrayable} from '../index.d.ts';

declare const unknown: unknown;

expectTypeOf(unknown as string | string[]).toBe<Arrayable<string>>();
expectTypeOf(unknown as (string | {foo: number}) | Array<string | {foo: number}>).toBe<Arrayable<string | {foo: number}>>();
expectTypeOf(unknown as /* never | */ never[]).toBe<Arrayable<never>>();
expectTypeOf(unknown as string[] | string[][]).toBe<Arrayable<string[]>>();

// Test for issue https://github.com/sindresorhus/type-fest/issues/952
type Item = number;
function castArray1(value: Arrayable<Item>): Item[] {
	return Array.isArray(value) ? value : [value];
}

expectTypeOf(unknown as ReturnType<typeof castArray1>).toBe<Item[]>();

function castArray2<T>(value: Arrayable<T>): T[] {
	return Array.isArray(value) ? value : [value];
}

expectTypeOf(castArray2(1)).toBe<number[]>();
expectTypeOf(castArray2([1, 2, 3])).toBe<number[]>();
