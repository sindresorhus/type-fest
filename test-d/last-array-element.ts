import {expectTypeOf} from 'nz';
import type {LastArrayElement} from '../index.d.ts';

// Empty array
expectTypeOf<LastArrayElement<[]>>().toBe<undefined>();
expectTypeOf<LastArrayElement<readonly []>>().toBe<undefined>();

// Only required elements
expectTypeOf<LastArrayElement<[number, string, boolean]>>().toBe<boolean>();
expectTypeOf<LastArrayElement<readonly [number, string, boolean]>>().toBe<boolean>();

// Required and optional elements
expectTypeOf<LastArrayElement<[1, 2, 3?]>>().toBe<2 | 3>();
expectTypeOf<LastArrayElement<readonly [1, 2?, 3?]>>().toBe<1 | 2 | 3>();
expectTypeOf<LastArrayElement<[null, string, bigint?, boolean?, number?]>>().toBe<number | boolean | bigint | string>();

// Required and rest element
expectTypeOf<LastArrayElement<readonly [1, 2, 3, ...string[]]>>().toBe<3 | string>(); // Rest element at the end
expectTypeOf<LastArrayElement<[1, 2, 3, ...boolean[], 'x', 'y', 'z']>>().toBe<'z'>(); // Rest element in the middle
expectTypeOf<LastArrayElement<readonly [...bigint[], string]>>().toBe<string>(); // Rest element at the start

// Only optional elements
expectTypeOf<LastArrayElement<['a'?]>>().toBe<'a' | undefined>();
expectTypeOf<LastArrayElement<readonly [{data: string[]}?]>>().toBe<{data: string[]} | undefined>();
expectTypeOf<LastArrayElement<[string?, boolean?, bigint?]>>().toBe<string | boolean | bigint | undefined>();

// Explicit `undefined` in optional elements
expectTypeOf<LastArrayElement<[0, 1, (2 | undefined)?]>>().toBe<1 | 2 | undefined>();
expectTypeOf<LastArrayElement<readonly [0, 1, (2 | undefined)?, ...string[]]>>().toBe<1 | 2 | undefined | string>();

// Required, optional, and rest element
expectTypeOf<LastArrayElement<[1, 2, 3?, ...string[]]>>().toBe<2 | 3 | string>();
expectTypeOf<LastArrayElement<readonly [number, string?, ...bigint[]]>>().toBe<number | string | bigint>();

// Optional and rest element
expectTypeOf<LastArrayElement<readonly [1?, ...string[]]>>().toBe<1 | string | undefined>();
expectTypeOf<LastArrayElement<[1?, 2?, 3?, ...bigint[]]>>().toBe<1 | 2 | 3 | bigint | undefined>();

// Labelled tuples
expectTypeOf<LastArrayElement<[x: number, y: number]>>().toBe<number>();
expectTypeOf<LastArrayElement<readonly [x: string, y?: number]>>().toBe<string | number>();
expectTypeOf<LastArrayElement<[x: string, ...rest: number[]]>>().toBe<string | number>();

// Union elements
expectTypeOf<LastArrayElement<['a' | 'b', 'c', 'd' | 'e']>>().toBe<'d' | 'e'>();
expectTypeOf<LastArrayElement<[1 | 'a', 2 | 'b', 3 | 'c', ('d' | 'e')?]>>().toBe<3 | 'c' | 'd' | 'e'>();
expectTypeOf<LastArrayElement<[bigint, boolean, ...Array<string | number>]>>().toBe<boolean | string | number>();

// Unions
expectTypeOf<LastArrayElement<[1, 2, 3] | [4, 5, ...string[], 6]>>().toBe<3 | 6>();
expectTypeOf<LastArrayElement<readonly [string, number] | bigint[]>>().toBe<number | bigint | undefined>();
expectTypeOf<LastArrayElement<readonly [1, 2?, 3?] | ['a'?, 'b'?] | ['c', 'd', ...Array<'e'>] | [...Array<'f'>, 'g']>>().toBe<1 | 2 | 3 | 'a' | 'b' | undefined | 'd' | 'e' | 'g'>();

// Non-tuple arrays
expectTypeOf<LastArrayElement<string[]>>().toBe<string | undefined>();
expectTypeOf<LastArrayElement<readonly number[]>>().toBe<number | undefined>();
expectTypeOf<LastArrayElement<ReadonlyArray<number | bigint>>>().toBe<number | bigint | undefined>();
expectTypeOf<LastArrayElement<any[]>>().toBe<any | undefined>();
expectTypeOf({} as any as LastArrayElement<never[]>).toBe<undefined>();

// Boundary cases
expectTypeOf<LastArrayElement<any>>().toBe<any>();
expectTypeOf<LastArrayElement<never>>().toBe<never>();
