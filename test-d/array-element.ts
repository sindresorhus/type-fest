import {expectType} from 'tsd';
import type {ArrayElement} from '../index.d.ts';

// Basic array
expectType<string>('' as ArrayElement<string[]>);
expectType<number>(1 as ArrayElement<number[]>);

// Tuple
expectType<1 | 2 | 3>(1 as ArrayElement<[1, 2, 3]>);
expectType<'a' | 'b' | 'c'>('a' as ArrayElement<['a', 'b', 'c']>);

// Const tuple
expectType<'foo' | 'bar' | 'baz'>('foo' as ArrayElement<readonly ['foo', 'bar', 'baz']>);
expectType<1 | 2 | 3>(1 as ArrayElement<readonly [1, 2, 3]>);

// Mixed types
expectType<string | number>('string' as ArrayElement<[string, number]>);
expectType<string | number>(123 as ArrayElement<[string, number]>);

// Readonly array
expectType<string>('' as ArrayElement<readonly string[]>);
expectType<1 | 2 | 3>(1 as ArrayElement<readonly [1, 2, 3]>);

// Empty array
expectType<never>(undefined as any as ArrayElement<[]>);
expectType<never>(undefined as any as ArrayElement<readonly []>);

// Union of arrays
expectType<1 | 2 | 3 | 4>(1 as ArrayElement<[1, 2] | [3, 4]>);

// Function use case
declare function getRandomElement<T extends readonly unknown[]>(array: T): ArrayElement<T>;

expectType<number>(getRandomElement([1, 2, 3]));
expectType<'foo' | 'bar' | 'baz'>(getRandomElement(['foo', 'bar', 'baz'] as const));
expectType<string>(getRandomElement(['foo', 'bar', 'baz']));

// Edge cases
expectType<any>('' as ArrayElement<any>);
expectType<never>('' as ArrayElement<never>);
expectType<unknown>('' as ArrayElement<unknown[]>);

// Non-arrays return never
expectType<never>('' as ArrayElement<string>);
expectType<never>('' as ArrayElement<{a: string}>);
