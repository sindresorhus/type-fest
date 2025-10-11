import {expectType} from 'tsd';
import type {ArrayReverse} from '../source/array-reverse.d.ts';

// Empty & single-element tuples
expectType<[]>({} as ArrayReverse<[]>);
expectType<readonly []>({} as ArrayReverse<readonly []>);
expectType<[string]>({} as ArrayReverse<[string]>);
expectType<readonly [number]>({} as ArrayReverse<readonly [number]>);
expectType<[any]>({} as ArrayReverse<[any]>);
expectType<[never]>({} as ArrayReverse<[never]>);

// Only required elements
expectType<[3, 2, 1]>({} as ArrayReverse<[1, 2, 3]>);
expectType<readonly [string, number, boolean, bigint]>({} as ArrayReverse<readonly [bigint, boolean, number, string]>);
expectType<['a' | 1, 2, 'c' | 3]>({} as ArrayReverse<['c' | 3, 2, 'a' | 1]>);

// Required and rest element
expectType<readonly [...string[], 3, 2, 1]>({} as ArrayReverse<readonly [1, 2, 3, ...string[]]>); // Rest element at the end
expectType<['z', 'y', 'x', ...boolean[], 3, 2, 1]>({} as ArrayReverse<[1, 2, 3, ...boolean[], 'x', 'y', 'z']>); // Rest element in the middle
expectType<readonly [string, ...bigint[]]>({} as ArrayReverse<readonly [...bigint[], string]>); // Rest element at the start

// Required and optional elements
expectType<[3, 2, 1] | [2, 1]>({} as ArrayReverse<[1, 2, 3?]>);
expectType<readonly [3, 2, 1] | readonly [2, 1] | readonly [1]>({} as ArrayReverse<readonly [1, 2?, 3?]>);
expectType<[number, boolean, bigint, number, string] | [boolean, bigint, number, string] | [bigint, number, string] | [number, string]>(
	{} as ArrayReverse<[string, number, bigint?, boolean?, number?]>,
);

// Only optional elements
expectType<['a'] | []>({} as ArrayReverse<['a'?]>);
expectType<readonly [{data: string[]}] | readonly []>({} as ArrayReverse<readonly [{data: string[]}?]>);
expectType<[bigint, boolean, string] | [boolean, string] | [string] | []>({} as ArrayReverse<[string?, boolean?, bigint?]>);

// Required, optional, and rest element
expectType<[...string[], 3, 2, 1] | [2, 1]>({} as ArrayReverse<[1, 2, 3?, ...string[]]>);
expectType<readonly [...string[], string, number] | readonly [number]>({} as ArrayReverse<readonly [number, string?, ...string[]]>);

// Optional and rest element
expectType<readonly [...string[], 1] | readonly []>({} as ArrayReverse<readonly [1?, ...string[]]>);
expectType<[...number[], 3, 2, 1] | [2, 1] | [1] | []>({} as ArrayReverse<[1?, 2?, 3?, ...number[]]>);

// Nested tuples
expectType<[6, 5, [3, 4], [1, 2]]>({} as ArrayReverse<[[1, 2], [3, 4], 5, 6]>);
expectType<[Array<{y: string}>, Array<{x: string}>]>({} as ArrayReverse<[Array<{x: string}>, Array<{y: string}>]>);
expectType<[3, [1, 2]] | [[1, 2]] | []>({} as ArrayReverse<[[1, 2]?, 3?]>);

// Unions
expectType<[3, 2, 1] | readonly ['b', 'a']>({} as ArrayReverse<[1, 2, 3] | readonly ['a', 'b']>);
expectType<readonly [number, string] | number[]>({} as ArrayReverse<readonly [string, number] | number[]>);
expectType<readonly [3, 2, 1] | readonly [2, 1] | readonly [1] | ['b', 'a'] | ['a'] | [] | [number, string]>(
	{} as ArrayReverse<readonly [1, 2?, 3?] | ['a'?, 'b'?] | [string, number]>,
);

// Labelled tuples
expectType<[number, number]>({} as ArrayReverse<[x: number, y: number]>);
expectType<readonly [number, string] | readonly [string]>({} as ArrayReverse<readonly [x: string, y?: number]>);
expectType<[...number[], string]>({} as ArrayReverse<[x: string, ...rest: number[]]>);

// Non-tuple arrays
expectType<string[]>({} as ArrayReverse<string[]>);
expectType<readonly number[]>({} as ArrayReverse<readonly number[]>);
expectType<ReadonlyArray<number | bigint>>({} as ArrayReverse<ReadonlyArray<number | bigint>>);
expectType<any[]>({} as ArrayReverse<any[]>);
expectType<never[]>({} as ArrayReverse<never[]>);

// Boundary cases
expectType<never>({} as ArrayReverse<never>);
expectType<any>({} as ArrayReverse<any>);
