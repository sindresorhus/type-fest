import type { ReplaceDeep, Config } from '../source/replace-deep';
import { expectType } from 'tsd';

declare namespace Fn {
	export type {
		Box as box,
		Duplicate as duplicate,
		Identity as identity,
		ParseInt as parseInt,
		ToString as toString,
		Unbox as unbox,
	};

	interface Duplicate extends Config.ReplaceFn { output: duplicate<this["input"]> }
	type duplicate<T> = readonly [T, T];

	interface Identity extends Config.ReplaceFn { output: this['input'] }

	interface ToString extends Config.ReplaceFn { output: toString<this['input']> }
	type toString<type> = type extends number ? `${type}` : type;

	interface ParseInt extends Config.ReplaceFn { output: parseInt<this['input']> }
	type parseInt<type> = type extends `${infer x extends number}` ? x : type;

	interface Box extends Config.ReplaceFn { output: box<this['input']> }
	type box<type> = never | readonly [type];

	interface Unbox extends Config.ReplaceFn { output: unbox<this['input']> }
	type unbox<type>
		= type extends readonly [infer contents] ? contents
		: type extends readonly unknown[] ? type[number]
		: type;
}

const oneOf
	: <const xs extends readonly unknown[]>(...xs: xs) => xs[number]
	= (...xs) => xs[0] as never

const input_00 = { a: { b: { c: 1, d: 2, e: { f: oneOf(3, 4) }, g: 5 } } } as const
const expected_00 = { a: { b: { c: [1, 1], d: [2, 2], e: { f: [oneOf(3, 4), oneOf(3, 4)] }, g: [5, 5] } } } as const

const input_01 = { a: { b: { c: 1, d: 2, e: { f: oneOf(3, 4) }, g: 5 } } } as const
const expected_01 = { a: { b: { c: [1, 1], d: [2, 2], e: { f: [oneOf(3, 4), oneOf(3, 4)] }, g: [5, 5] } } } as const

expectType<
	ReplaceDeep<
		typeof input_01,
		{ needle: number, replaceWith: Fn.duplicate }
	>
>(expected_01)

const input_02 = { a: { b: { c: 1, d: 2, e: { d: oneOf(3, 4) }, f: 5 } } } as const
const expected_02 = { a: { b: { c: "1", d: "2", e: { d: oneOf("3", "4") }, f: "5" } } } as const

expectType<
	ReplaceDeep<
		typeof input_02,
		{ needle: number; replaceWith: Fn.toString }
	>
>(expected_02)

const input_03 = { a: { b: { c: '1', d: '2', e: { d: oneOf('3', '4') }, f: '5' } } } as const
const expected_03 = { a: { b: { c: 1, d: 2, e: { d: oneOf(3, 4) }, f: 5 } } } as const

expectType<
	ReplaceDeep<
		typeof input_03,
		{ needle: `${number}`; replaceWith: Fn.parseInt }
	>
>(expected_03)

const input_04 = { a: { b: { c: ['1'], d: ['2'], e: { d: [oneOf('3', '4', '5', '6')] }, f: '7' } } } as const
const expected_04 = { a: { b: { c: ['1'], d: ['2'], e: { d: [oneOf('3', '4', '5', '6')] }, f: '7' } } } as const

expectType<
	ReplaceDeep<
		typeof input_04,
		{ needle: readonly string[]; replaceWith: Fn.identity }
	>
>(expected_04)

const input_05 = { a: { b: { c: ['1'], d: ['2'], e: { d: [oneOf('3', '4', '5', '6')] }, f: '7' } } } as const
const expected_05 = input_05

expectType<
	ReplaceDeep<
		typeof input_05,
		{ needle: readonly string[], replaceWith: Fn.identity }
	>
>(expected_05)

const input_06 = { a: { b: { c: '1', d: '2', e: { d: oneOf('3', '4', '5', '6') }, f: '7' } } } as const
const expected_06 = { a: { b: { c: ['1'], d: ['2'], e: { d: [oneOf('3', '4', '5', '6')] }, f: ['7'] } } } as const

expectType<
	ReplaceDeep<
		typeof input_06,
		{ needle: string, replaceWith: Fn.box }
	>
>(expected_06)

const input_07 = { a: { b: { c: ['1'], d: ['2'], e: { d: [oneOf('3', '4', '5', '6')] }, f: '7' } } } as const
const expected_07 = { a: { b: { c: '1', d: '2', e: { d: oneOf('3', '4', '5', '6') }, f: '7' } } } as const

expectType<
	ReplaceDeep<
		typeof input_07,
		{ needle: readonly string[], replaceWith: Fn.unbox }
	>
>(expected_07)
