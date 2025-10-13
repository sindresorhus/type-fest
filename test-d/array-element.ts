import {expectType} from 'tsd';
import type {ArrayElement} from '../index.d.ts';

// Basic array
expectType<string>({} as ArrayElement<string[]>);
expectType<number>({} as ArrayElement<number[]>);

// Tuple
expectType<1 | 2 | 3>({} as ArrayElement<[1, 2, 3]>);
expectType<'a' | 'b' | 'c'>({} as ArrayElement<['a', 'b', 'c']>);

// Const tuple
expectType<'foo' | 'bar' | 'baz'>({} as ArrayElement<readonly ['foo', 'bar', 'baz']>);
expectType<1 | 2 | 3>({} as ArrayElement<readonly [1, 2, 3]>);

// Mixed types
expectType<string | number>({} as ArrayElement<[string, number]>);
expectType<string | number>({} as ArrayElement<[string, number]>);

// Readonly array
expectType<string>({} as ArrayElement<readonly string[]>);
expectType<1 | 2 | 3>({} as ArrayElement<readonly [1, 2, 3]>);

// Empty array
expectType<never>({} as ArrayElement<[]>);
expectType<never>({} as ArrayElement<readonly []>);

// Union of arrays
expectType<1 | 2 | 3 | 4>({} as ArrayElement<[1, 2] | [3, 4]>);

// Function use case
declare function getRandomElement<T extends readonly unknown[]>(array: T): ArrayElement<T>;

expectType<number>(getRandomElement([1, 2, 3]));
expectType<'foo' | 'bar' | 'baz'>(getRandomElement(['foo', 'bar', 'baz'] as const));
expectType<string>(getRandomElement(['foo', 'bar', 'baz']));

// Edge cases
expectType<any>({} as ArrayElement<any>);
expectType<never>({} as ArrayElement<never>);
expectType<unknown>({} as ArrayElement<unknown[]>);

// Non-arrays return never
expectType<never>({} as ArrayElement<string>);
expectType<never>({} as ArrayElement<{a: string}>);

// Optional and rest elements
expectType<1 | 2 | 3 | undefined>(1 as ArrayElement<[1, 2, 3?]>);
expectType<string | number>(1 as ArrayElement<[string, ...number[]]>);
expectType<1 | 2 | string>(1 as ArrayElement<[1, 2, ...string[]]>);
expectType<1 | 2 | undefined | string>(1 as ArrayElement<[1, 2?, ...string[]]>);
