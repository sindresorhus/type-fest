import {expectType} from 'tsd';
import type {TupleToObject} from '../source/tuple-to-object.d.ts';

// Tuples
expectType<TupleToObject<[]>>({} as {});
expectType<TupleToObject<[number]>>({} as {0: number});
expectType<TupleToObject<[number, string]>>({} as {0: number; 1: string});
expectType<TupleToObject<[number | string, {foo: string}]>>({} as {0: number | string; 1: {foo: string}});
expectType<TupleToObject<[number, string?]>>({} as {0: number; 1?: string});
expectType<TupleToObject<[number?, string?, boolean?]>>({} as {0?: number; 1?: string; 2?: boolean});

// Readonly tuples
expectType<TupleToObject<readonly []>>({} as {});
expectType<TupleToObject<readonly [number, string]>>({} as {readonly 0: number; readonly 1: string});
expectType<TupleToObject<readonly [number, string?, boolean?]>>({} as {readonly 0: number; readonly 1?: string; readonly 2?: boolean});

// Non-tuples
expectType<TupleToObject<number[]>>({} as Record<number, number>);
expectType<TupleToObject<[...boolean[]]>>({} as Record<number, boolean>);
expectType<TupleToObject<[number, string, ...boolean[]]>>({} as {[x: number]: number | string | boolean; 0: number; 1: string});
expectType<TupleToObject<[number, string?, ...boolean[]]>>({} as {[x: number]: number | string | boolean | undefined; 0: number; 1?: string});
expectType<TupleToObject<[...number[], string, bigint]>>({} as Record<number, number | string | bigint>);
expectType<TupleToObject<never[]>>({} as Record<number, never>);
expectType<TupleToObject<any[]>>({} as Record<number, any>);

// Readonly non-tuples
expectType<TupleToObject<readonly number[]>>({} as Readonly<Record<number, number>>);
expectType<TupleToObject<readonly [number, string?, ...boolean[]]>>({} as {readonly [x: number]: number | string | boolean | undefined; readonly 0: number; readonly 1?: string});
expectType<TupleToObject<readonly [...number[], string, bigint]>>({} as Readonly<Record<number, number | string | bigint>>);

// Unions
expectType<TupleToObject<[number] | [number, string, boolean]>>(
	{} as {0: number} | {0: number; 1: string; 2: boolean},
);
expectType<TupleToObject<[number?, string?] | [] | [number, string, ...number[]]>>(
	{} as {0?: number; 1?: string} | {} | {[x: number]: number | string; 0: number; 1: string},
);
expectType<TupleToObject<Array<number | undefined> | string[]>>(
	{} as Record<number, number | undefined> | Record<number, string>,
);
expectType<TupleToObject<[number, string] | readonly string[]>>(
	{} as {0: number; 1: string} | Readonly<Record<number, string>>,
);
expectType<TupleToObject<readonly [string] | readonly [number?] | number[]>>(
	{} as {readonly 0: string} | {readonly 0?: number} | Record<number, number>,
);
expectType<TupleToObject<[...number[], string] | [number?, string?, ...number[]]>>(
	{} as Record<number, string | number> | {[x: number]: string | number | undefined; 0?: number; 1?: string},
);

// Labeled tuples
expectType<TupleToObject<[x: string, y: number]>>({} as {0: string; 1: number});
expectType<TupleToObject<[first: string, ...rest: number[]]>>({} as {[x: number]: string | number; 0: string});
expectType<TupleToObject<[...rest: number[], last: string]>>({} as Record<number, string | number>);
expectType<TupleToObject<readonly [name: string, age?: number]>>({} as {readonly 0: string; readonly 1?: number});

// Boundary types
expectType<TupleToObject<any>>({} as any);
expectType<TupleToObject<never>>({} as never);

// @ts-expect-error only works with arrays
type T = TupleToObject<{}>;
