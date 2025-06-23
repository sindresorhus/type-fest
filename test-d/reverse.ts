import {expectType} from 'tsd';
import type {Reverse} from '../source/reverse.d.ts';

declare const never: never;
declare const string: string;
declare const number: number;
declare const symbol: symbol;
declare const boolean: boolean;

// Edge cases
expectType<Reverse<[]>>([]);
expectType<Reverse<any>>(any);
expectType<Reverse<never>>(never);

// Single element
expectType<Reverse<[1]>>([1] as const);
expectType<Reverse<['a']>>(['a'] as const);
expectType<Reverse<[undefined]>>([undefined] as const);
expectType<Reverse<[null]>>([null] as const);
expectType<Reverse<[boolean]>>([boolean] as const);
expectType<Reverse<[true]>>([true] as const);
expectType<Reverse<[false]>>([false] as const);
expectType<Reverse<[symbol]>>([symbol] as const);
expectType<Reverse<[0n]>>([0n] as const);

// Two and three elements
expectType<Reverse<[1, 2]>>([2, 1] as const);
expectType<Reverse<[1, 'a']>>(['a', 1] as const);
expectType<Reverse<[true, false]>>([false, true] as const);
expectType<Reverse<[1, 2, 3]>>([3, 2, 1] as const);
expectType<Reverse<['a', 'b', 'c']>>(['c', 'b', 'a'] as const);
expectType<Reverse<[1, boolean, 'x']>>(['x', boolean, 1] as const);
expectType<Reverse<[number, string, boolean]>>([boolean, string, number] as const);
expectType<Reverse<[1, 2, 3, 4]>>([4, 3, 2, 1] as const);
expectType<Reverse<[0, 1, 2, 3, 4]>>([4, 3, 2, 1, 0] as const);
expectType<Reverse<['x', 1, true]>>([true, 1, 'x'] as const);

// Optional/undefined
expectType<Reverse<[1?, 2?, 3?]>>([3, 2, 1] as const);
expectType<Reverse<[1?, 2?, 3?], {preserveOptionalModifier: true}>>({} as [3?, 2?, 1?]);
expectType<Reverse<[1, 2?, 3?], {preserveOptionalModifier: true}>>({} as [3 | undefined, 2 | undefined, 1]);
expectType<Reverse<[1 | undefined, 2 | undefined]>>({} as [2 | undefined, 1 | undefined]);
expectType<Reverse<[undefined, 1, 2]>>([2, 1, undefined] as const);
expectType<Reverse<[string, number?]>>([number, string] as const);
expectType<Reverse<[number?, string?]>>([string, number] as const);
expectType<Reverse<[...[]]>>([] as const);
expectType<Reverse<readonly [...['a']]>>({} as readonly ['a']);
expectType<Reverse<[1, ...[2, 3]]>>([3, 2, 1] as const);
expectType<Reverse<[1, ...[2], 3]>>([3, 2, 1] as const);
expectType<Reverse<[...['x', 'y'], 'z']>>(['z', 'y', 'x'] as const);

// Mixed types
expectType<Reverse<[1, 'a', true, null, undefined]>>([undefined, null, true, 'a', 1] as const);
expectType<Reverse<['start', ...[true, 99], 'end']>>(['end', 99, true, 'start'] as const);
expectType<Reverse<['x', 1 | 2 | 3]>>([number as 1 | 2 | 3, 'x'] as const);
expectType<Reverse<[...[], 1]>>([1] as const);
expectType<Reverse<[1, 2?, 3?]>>([3, 2, 1] as const);
expectType<Reverse<[boolean, ...[1, 2], string]>>([string, 2, 1, boolean] as const);
expectType<Reverse<['a', ...[number, string], 'b']>>(['b', string, number, 'a'] as const);
expectType<Reverse<[...['a'], ...['b'], 'c']>>(['c', 'b', 'a'] as const);
expectType<Reverse<[...never[], 2, 1]>>({} as [1, 2, ...never[]]);
expectType<Reverse<readonly [1, 2, 3]>>([3, 2, 1] as const);

// Large tuples, readonly modifiers
expectType<Reverse<readonly [1, 2, 3, 4, 5, 6]>>([6, 5, 4, 3, 2, 1] as const);
expectType<Reverse<readonly ['a', 'b', 'c', 'd']>>(['d', 'c', 'b', 'a'] as const);
expectType<Reverse<readonly [1, 2, 3, 4, 5, 6]>>([6, 5, 4, 3, 2, 1] as const);
expectType<Reverse<readonly ['a', 'b', 'c', 'd']>>(['d', 'c', 'b', 'a'] as const);
expectType<Reverse<readonly [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]>>([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0] as const);
expectType<Reverse<readonly ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']>>(['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] as const);
expectType<Reverse<readonly [readonly number[], boolean]>>([boolean, [number] as readonly number[]] as const);
expectType<Reverse<readonly [string[], ...[1, 2], 'z']>>(['z', 2, 1, [string] as string[]] as const);
expectType<Reverse<readonly ['a', 'b', 'c', 'd', 'e']>>(['e', 'd', 'c', 'b', 'a'] as const);
expectType<Reverse<readonly [boolean, boolean, boolean]>>([boolean, boolean, boolean] as const);
expectType<Reverse<readonly ['x', ...[], 'y']>>(['y', 'x'] as const);
expectType<Reverse<readonly [...['1', '2', '3']]>>(['3', '2', '1'] as const);

// Union
expectType<Reverse<[1, 2] | [3, 4]>>({} as [2, 1] | [4, 3]);
expectType<Reverse<[1, 'a'] | ['b', 2]>>({} as ['a', 1] | [2, 'b']);

// Rest element
expectType<Reverse<[true, ...boolean[]]>>({} as [...boolean[], true]);
expectType<Reverse<[1, 2, ...number[]]>>({} as [...number[], 2, 1]);
expectType<Reverse<['a', `on${string}`, 'c']>>(['c', `on${string}`, 'a'] as const);
expectType<Reverse<[1, 'x', ...boolean[]]>>({} as [...boolean[], 'x', 1]);

expectType<Reverse<[...boolean[], true]>>({} as [true, ...boolean[]]);
expectType<Reverse<[1, ...number[], 2]>>({} as [2, ...number[], 1]);
expectType<Reverse<[1, ...number[], 'end']>>({} as ['end', ...number[], 1]);

// In use
declare function reverse<const T extends unknown[]>(array: T): Reverse<T>;
expectType<['d', 'c', 'b', 'a']>(reverse(['a', 'b', 'c', 'd']));
