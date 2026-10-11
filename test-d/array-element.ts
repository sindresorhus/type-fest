import {expectTypeOf} from 'nz';
import type {ArrayElement} from '../index.d.ts';

// Basic array
expectTypeOf<ArrayElement<string[]>>().toBe<string>();
expectTypeOf<ArrayElement<number[]>>().toBe<number>();

// Tuple
expectTypeOf<ArrayElement<[1, 2, 3]>>().toBe<1 | 2 | 3>();
expectTypeOf<ArrayElement<['a', 'b', 'c']>>().toBe<'a' | 'b' | 'c'>();

// Const tuple
expectTypeOf<ArrayElement<readonly ['foo', 'bar', 'baz']>>().toBe<'foo' | 'bar' | 'baz'>();
expectTypeOf<ArrayElement<readonly [1, 2, 3]>>().toBe<1 | 2 | 3>();

// Mixed types
expectTypeOf<ArrayElement<[string, number]>>().toBe<string | number>();
expectTypeOf<ArrayElement<[string, number]>>().toBe<string | number>();

// Readonly array
expectTypeOf<ArrayElement<readonly string[]>>().toBe<string>();
expectTypeOf<ArrayElement<readonly [1, 2, 3]>>().toBe<1 | 2 | 3>();

// Empty array
expectTypeOf<ArrayElement<[]>>().toBe<never>();
expectTypeOf<ArrayElement<readonly []>>().toBe<never>();

// Union of arrays
expectTypeOf<ArrayElement<[1, 2] | [3, 4]>>().toBe<1 | 2 | 3 | 4>();

// Function use case
declare function getRandomElement<T extends readonly unknown[]>(array: T): ArrayElement<T>;

expectTypeOf(getRandomElement([1, 2, 3])).toBe<number>();
expectTypeOf(getRandomElement(['foo', 'bar', 'baz'] as const)).toBe<'foo' | 'bar' | 'baz'>();
expectTypeOf(getRandomElement(['foo', 'bar', 'baz'])).toBe<string>();

// Edge cases
expectTypeOf<ArrayElement<any>>().toBe<any>();
expectTypeOf<ArrayElement<never>>().toBe<never>();
expectTypeOf<ArrayElement<unknown[]>>().toBe<unknown>();

// Non-arrays return never
expectTypeOf<ArrayElement<string>>().toBe<never>();
expectTypeOf<ArrayElement<{a: string}>>().toBe<never>();

// Optional and rest elements
expectTypeOf(1 as ArrayElement<[1, 2, 3?]>).toBe<1 | 2 | 3 | undefined>();
expectTypeOf(1 as ArrayElement<[string, ...number[]]>).toBe<string | number>();
expectTypeOf(1 as ArrayElement<[1, 2, ...string[]]>).toBe<1 | 2 | string>();
expectTypeOf(1 as ArrayElement<[1, 2?, ...string[]]>).toBe<1 | 2 | undefined | string>();
