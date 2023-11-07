import {expectType} from 'tsd';
import type {Paths} from '../index';

declare const normal: Paths<{foo: string}>;
expectType<'foo'>(normal);

type DeepObject = {
	a: {
		b: {
			c: {
				d: string;
			};
		};
		b2: number[];
		b3: boolean;
	};
};
declare const deepObject: Paths<DeepObject>;
expectType<'a' | 'a.b' | 'a.b2' | 'a.b3' | 'a.b.c' | 'a.b.c.d' | `a.b2.${number}`>(deepObject);

declare const emptyObject: Paths<{}>;
expectType<never>(emptyObject);

declare const emptyArray: Paths<[]>;
expectType<never>(emptyArray);

declare const symbol: Paths<{[Symbol.iterator]: string}>;
expectType<never>(symbol);

declare const never: Paths<never>;
expectType<never>(never);

declare const date: Paths<{foo: Date}>;
expectType<'foo'>(date);

declare const mixed: Paths<{foo: boolean} | {bar: string}>;
expectType<'foo' | 'bar'>(mixed);

declare const array: Paths<Array<{foo: string}>>;
expectType<number | `${number}` | `${number}.foo`>(array);

declare const tuple: Paths<[{foo: string}]>;
expectType<'0' | '0.foo'>(tuple);

declare const deeplist: Paths<{foo: Array<{bar: boolean[]}>}>;
expectType<'foo' | `foo.${number}` | `foo.${number}.bar` | `foo.${number}.bar.${number}`>(deeplist);

declare const readonly: Paths<{foo: Readonly<{bar: string}>}>;
expectType<'foo' | 'foo.bar'>(readonly);

declare const readonlyArray: Paths<{foo: readonly string[]}>;
expectType<'foo' | `foo.${number}`>(readonlyArray);

declare const optional: Paths<{foo?: {bar?: number}}>;
expectType<'foo' | 'foo.bar'>(optional);

declare const record: Paths<Record<'a', any>>;
expectType<'a'>(record);

declare const record2: Paths<Record<1, unknown>>;
expectType<1 | '1'>(record2);

// Test for unknown length array
declare const trailingSpreadTuple: Paths<[{a: string}, ...Array<{b: number}>]>;
expectType<number | `${number}` | '0.a' | `${number}.b`>(trailingSpreadTuple);

declare const trailingSpreadTuple1: Paths<[{a: string}, {b: number}, ...Array<{c: number}>]>;
expectType<number | `${number}` | '0.a' | `${number}.b`>(trailingSpreadTuple);
expectType<number | `${number}` | '0.a' | '1.b' | `${number}.c`>(trailingSpreadTuple1);

declare const leadingSpreadTuple: Paths<[...Array<{a: string}>, {b: number}]>;
expectType<number | `${number}` | `${number}.b` | `${number}.a`>(leadingSpreadTuple);

declare const leadingSpreadTuple1: Paths<[...Array<{a: string}>, {b: number}, {c: number}]>;
expectType<number | `${number}` | `${number}.b` | `${number}.c` | `${number}.a`>(leadingSpreadTuple1);
