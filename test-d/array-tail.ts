import {expectTypeOf} from 'nz';
import type {ArrayTail} from '../index.d.ts';

declare const getArrayTail: <T extends readonly unknown[]>(array: T) => ArrayTail<T>;

expectTypeOf(getArrayTail([] as [])).toBe<[]>();
expectTypeOf(getArrayTail(['a'] as ['a'])).toBe<[]>();
expectTypeOf(getArrayTail(['a', 'b', 'c'] as ['a', 'b', 'c'])).toBe<['b', 'c']>();

expectTypeOf(getArrayTail([] as const)).toBe<readonly []>();
expectTypeOf(getArrayTail(['a'] as const)).toBe<readonly []>();
expectTypeOf(getArrayTail(['a', 'b', 'c'] as const)).toBe<readonly ['b', 'c']>();

// Optional elements
expectTypeOf(getArrayTail(['a', undefined, 'c'] as readonly ['a', undefined, 'c'?])).toBe<readonly [undefined, 'c'?]>();
expectTypeOf(getArrayTail(['hello'] as [string, undefined?, number?])).toBe<[undefined?, number?]>();
expectTypeOf(getArrayTail([1, undefined, 3] as readonly [1, undefined?, 3?])).toBe<readonly [undefined?, 3?]>();
expectTypeOf(getArrayTail(['test', false] as [string, boolean, number?, string?])).toBe<[boolean, number?, string?]>();

// All optional elements
expectTypeOf<ArrayTail<['a'?, 'b'?]>>().toBe<['b'?]>();
expectTypeOf<ArrayTail<readonly [string?, number?]>>().toBe<readonly [number?]>();

// Rest element
expectTypeOf<ArrayTail<readonly [string, number, boolean, ...string[]]>>().toBe<readonly [number, boolean, ...string[]]>(); // Required & Rest
expectTypeOf<ArrayTail<readonly [string?, number?, boolean?, ...string[]]>>().toBe<readonly [number?, boolean?, ...string[]]>(); // Optional & Rest
expectTypeOf<ArrayTail<readonly [string, number, boolean?, ...string[]]>>().toBe<readonly [number, boolean?, ...string[]]>(); // Required, Optional & Rest
// expectType<readonly [...string[], string, number]>({} as ArrayTail<readonly [...string[], string, number]>); // Rest & Required
expectTypeOf<ArrayTail<readonly [string, number, ...string[], boolean, bigint]>>().toBe<readonly [number, ...string[], boolean, bigint]>(); // Required, Rest & Required

// Labelled tuples
expectTypeOf<ArrayTail<[x: number, y: string]>>().toBe<[y: string]>();
expectTypeOf<ArrayTail<[foo: number, bar: string, ...rest: boolean[]]>>().toBe<[bar: string, ...rest: boolean[]]>();
expectTypeOf<ArrayTail<[...rest: boolean[], foo: number, bar: string]>>().toBe<[...rest: boolean[], foo: number, bar: string]>();

// Union of tuples
expectTypeOf<ArrayTail<[] | ['a', 'b']>>().toBe<[] | ['b']>();
expectTypeOf<ArrayTail<readonly ['x'?, 'y'?] | ['a', 'b', ...string[]] | readonly string[]>>().toBe<readonly ['y'?] | ['b', ...string[]] | readonly string[]>();
expectTypeOf<ArrayTail<[string, number] | readonly [number, boolean, string?]>>().toBe<[number] | readonly [boolean, string?]>();
expectTypeOf<ArrayTail<readonly [string, number] | readonly string[]>>().toBe<readonly [number] | readonly string[]>();

// Non tuple arrays
expectTypeOf<ArrayTail<string[]>>().toBe<string[]>();
expectTypeOf<ArrayTail<readonly string[]>>().toBe<readonly string[]>();
expectTypeOf<ArrayTail<never[]>>().toBe<never[]>();
expectTypeOf<ArrayTail<any[]>>().toBe<any[]>();

// Boundary cases
expectTypeOf<ArrayTail<never>>().toBe<never>();
expectTypeOf<ArrayTail<any>>().toBe<any>();
