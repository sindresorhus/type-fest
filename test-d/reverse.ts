import {expectType} from 'tsd';
import type {Reverse} from '../source/reverse.d.ts';

// Edge cases
expectType<Reverse<[]>>([]);
expectType<Reverse<any>>({} as any);
expectType<Reverse<never>>({} as never);
expectType<Reverse<[unknown]>>([{} as unknown] as const);

// Single element
expectType<Reverse<[1]>>([1] as const);
expectType<Reverse<['a']>>(['a'] as const);
expectType<Reverse<[undefined]>>([undefined] as const);
expectType<Reverse<[null]>>([null] as const);
expectType<Reverse<[boolean]>>({} as [boolean]);
expectType<Reverse<[true]>>([true] as const);
expectType<Reverse<[false]>>([false] as const);
expectType<Reverse<[symbol]>>({} as [symbol]);
expectType<Reverse<[0n]>>([0n] as const);

// Two and more elements
expectType<Reverse<[1, 2]>>([2, 1] as const);
expectType<Reverse<[1, 'a']>>(['a', 1] as const);
expectType<Reverse<[true, false]>>([false, true] as const);
expectType<Reverse<[1, 2, 3]>>([3, 2, 1] as const);
expectType<Reverse<['a', 'b', 'c']>>(['c', 'b', 'a'] as const);
expectType<Reverse<[1, boolean, 'x']>>({} as ['x', boolean, 1]);
expectType<Reverse<[number, string, boolean]>>({} as [boolean, string, number]);
expectType<Reverse<[1, 2, 3, 4]>>([4, 3, 2, 1] as const);
expectType<Reverse<[0, 1, 2, 3, 4]>>([4, 3, 2, 1, 0] as const);
expectType<Reverse<['x', 1, true]>>([true, 1, 'x'] as const);
expectType<Reverse<readonly [1, 2, 3, 4, 5, 6]>>([6, 5, 4, 3, 2, 1] as const);
expectType<Reverse<readonly ['a', 'b', 'c', 'd']>>(['d', 'c', 'b', 'a'] as const);
expectType<Reverse<readonly [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]>>([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0] as const);
expectType<Reverse<readonly ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']>>(['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] as const);
expectType<Reverse<readonly [readonly number[], boolean]>>({} as readonly [boolean, readonly number[]]);
expectType<Reverse<readonly ['a', 'b', 'c', 'd', 'e']>>(['e', 'd', 'c', 'b', 'a'] as const);
expectType<Reverse<readonly [boolean, number, boolean]>>({} as readonly [boolean, number, boolean]);

// Optional/undefined
expectType<Reverse<[1?, 2?, 3?]>>({} as [] | [1] | [2, 1] | [3, 2, 1]);
expectType<Reverse<[1, 2?, 3?]>>({} as [1] | [2, 1] | [3, 2, 1]);
expectType<Reverse<[1 | undefined, 2 | undefined]>>({} as [2 | undefined, 1 | undefined]);
expectType<Reverse<[undefined, 1, 2]>>([2, 1, undefined] as const);
expectType<Reverse<[string, number?]>>({} as [string] | [number, string]);
expectType<Reverse<[1, [2, 3]?]>>({} as [1] | [[2, 3], 1]);
expectType<Reverse<[1, [2]?, 3?]>>({} as [1] | [[2], 1] | [3, [2], 1]);

// Union
expectType<Reverse<[1, 2] | [3, 4]>>({} as [2, 1] | [4, 3]);
expectType<Reverse<[1, 'a'] | ['b', 2]>>({} as ['a', 1] | [2, 'b']);
expectType<Reverse<[1, 2, 3] | readonly ['a', 'b']>>({} as [3, 2, 1] | readonly ['b', 'a']);
expectType<Reverse<readonly [1, 2?, 3?] | ['a'?, 'b'?] | [string, number]>>(
	{} as Readonly<[1] | [2, 1] | [3, 2, 1]> | [number, string] | [] | ['a'] | ['b', 'a'],
);

// Rest element
expectType<Reverse<[...number[], true, 1]>>({} as [1, true, ...number[]]);
expectType<Reverse<[1, ...boolean[], 'x']>>({} as ['x', ...boolean[], 1]);
expectType<Reverse<[1, 2, ...string[]]>>({} as [...string[], 2, 1]);

// Mixed elements
expectType<Reverse<[1, 2, 3?, ...string[]]>>({} as [2, 1] | [...string[], 3, 2, 1]);
expectType<Reverse<[number?, boolean?, ...string[]]>>({} as [] | [number] | [...string[], boolean, number]);

// In use
declare function reverse<const T extends unknown[]>(array: T): Reverse<T>;
expectType<['d', 'c', 'b', 'a']>(reverse(['a', 'b', 'c', 'd']));
