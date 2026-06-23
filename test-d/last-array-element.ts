import {expectType} from 'tsd';
import type {LastArrayElement} from '../index.d.ts';

// Empty array
expectType<undefined>(undefined as LastArrayElement<[]>);
expectType<undefined>(undefined as LastArrayElement<readonly []>);

// Only required elements
expectType<boolean>({} as LastArrayElement<[number, string, boolean]>);
expectType<boolean>({} as LastArrayElement<readonly [number, string, boolean]>);

// Required and optional elements
expectType<2 | 3>({} as LastArrayElement<[1, 2, 3?]>);
expectType<1 | 2 | 3>({} as LastArrayElement<readonly [1, 2?, 3?]>);
expectType<number | boolean | bigint | string>(
	{} as LastArrayElement<[null, string, bigint?, boolean?, number?]>,
);

// Required and rest element
expectType<3 | string>({} as LastArrayElement<readonly [1, 2, 3, ...string[]]>); // Rest element at the end
expectType<'z'>({} as LastArrayElement<[1, 2, 3, ...boolean[], 'x', 'y', 'z']>); // Rest element in the middle
expectType<string>({} as LastArrayElement<readonly [...bigint[], string]>); // Rest element at the start

// Only optional elements
expectType<'a' | undefined>({} as LastArrayElement<['a'?]>);
expectType<{data: string[]} | undefined>({} as LastArrayElement<readonly [{data: string[]}?]>);
expectType<string | boolean | bigint | undefined>({} as LastArrayElement<[string?, boolean?, bigint?]>);

// Explicit `undefined` in optional elements
expectType<1 | 2 | undefined>({} as LastArrayElement<[0, 1, (2 | undefined)?]>);
expectType<1 | 2 | undefined | string>({} as LastArrayElement<readonly [0, 1, (2 | undefined)?, ...string[]]>);

// Required, optional, and rest element
expectType<2 | 3 | string>({} as LastArrayElement<[1, 2, 3?, ...string[]]>);
expectType<number | string | bigint>({} as LastArrayElement<readonly [number, string?, ...bigint[]]>);

// Optional and rest element
expectType<1 | string | undefined>({} as LastArrayElement<readonly [1?, ...string[]]>);
expectType<1 | 2 | 3 | bigint | undefined>({} as LastArrayElement<[1?, 2?, 3?, ...bigint[]]>);

// Labelled tuples
expectType<number>({} as LastArrayElement<[x: number, y: number]>);
expectType<string | number>({} as LastArrayElement<readonly [x: string, y?: number]>);
expectType<string | number>({} as LastArrayElement<[x: string, ...rest: number[]]>);

// Union elements
expectType<'d' | 'e'>({} as LastArrayElement<['a' | 'b', 'c', 'd' | 'e']>);
expectType<3 | 'c' | 'd' | 'e'>({} as LastArrayElement<[1 | 'a', 2 | 'b', 3 | 'c', ('d' | 'e')?]>);
expectType<boolean | string | number>({} as LastArrayElement<[bigint, boolean, ...Array<string | number>]>);

// Unions
expectType<3 | 6>({} as LastArrayElement<[1, 2, 3] | [4, 5, ...string[], 6]>);
expectType<number | bigint | undefined>({} as LastArrayElement<readonly [string, number] | bigint[]>);
expectType<1 | 2 | 3 | 'a' | 'b' | undefined | 'd' | 'e' | 'g'>(
	{} as LastArrayElement<readonly [1, 2?, 3?] | ['a'?, 'b'?] | ['c', 'd', ...Array<'e'>] | [...Array<'f'>, 'g']>,
);

// Non-tuple arrays
expectType<string | undefined>({} as LastArrayElement<string[]>);
expectType<number | undefined>({} as LastArrayElement<readonly number[]>);
expectType<number | bigint | undefined>({} as LastArrayElement<ReadonlyArray<number | bigint>>);
expectType<any | undefined>({} as LastArrayElement<any[]>);
expectType<undefined>({} as any as LastArrayElement<never[]>);

// Boundary cases
expectType<any>({} as LastArrayElement<any>);
expectType<never>({} as LastArrayElement<never>);
