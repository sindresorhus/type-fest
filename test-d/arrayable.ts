import {expectType} from 'tsd';
import type {Arrayable} from '../index.d.ts';

declare const unknown: unknown;

expectType<Arrayable<string>>(unknown as string | string[]);
expectType<Arrayable<string | {foo: number}>>(unknown as (string | {foo: number}) | Array<string | {foo: number}>);
expectType<Arrayable<never>>(unknown as /* never | */ never[]);
expectType<Arrayable<string[]>>(unknown as string[] | string[][]);

// Test for issue https://github.com/sindresorhus/type-fest/issues/952
type Item = number;
function castArray1(value: Arrayable<Item>): Item[] {
	return Array.isArray(value) ? value : [value];
}

expectType<Item[]>(unknown as ReturnType<typeof castArray1>);

function castArray2<T>(value: Arrayable<T>): T[] {
	return Array.isArray(value) ? value : [value];
}

expectType<number[]>(castArray2(1));
expectType<number[]>(castArray2([1, 2, 3]));
