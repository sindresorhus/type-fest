import {expectTypeOf} from 'nz';
import type {LiteralList, UnknownArray} from '../index.d.ts';

type U1 = 'a' | 'b' | 'c' | 'd';
type U2 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type U3 = ['a'] | ['b', 'c'] | ['a', 'b'];

enum Direction {
	Up = 'up',
	Down = 'down',
}

type IsLiteralList<T extends UnknownArray, U> =
	T extends LiteralList<T, U>
		? true
		: false;

// Base
expectTypeOf<IsLiteralList<[], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<U1[], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[U1, U1, U1], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[U1, U1, U1, U1, U1], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[...['a', 'b', 'd', 'c']], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<unknown[], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[unknown, unknown, unknown, unknown], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<readonly ['a', 'b', 'c', 'd'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['a', 'b', 'c', 'd'?], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<['a', 'b', 'c', ...Array<'d'>], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[true, false], boolean>>().toBe<true>();
expectTypeOf<IsLiteralList<[boolean], boolean>>().toBe<false>();
expectTypeOf<IsLiteralList<[], never>>().toBe<true>();
expectTypeOf<IsLiteralList<['a'], never>>().toBe<false>();
expectTypeOf<IsLiteralList<['a'], unknown>>().toBe<false>();
expectTypeOf<IsLiteralList<['a'], any>>().toBe<false>();
expectTypeOf<IsLiteralList<[{a: 1}, {b: 1}], {a: 1} | {b: 1}>>().toBe<true>();
expectTypeOf<IsLiteralList<[null, undefined, 1], 1 | null | undefined>>().toBe<true>();
expectTypeOf<IsLiteralList<[`on${string}`, 'off'], 'off' | `on${string}`>>().toBe<true>();
expectTypeOf<IsLiteralList<[Direction.Down, Direction.Up], Direction>>().toBe<true>();
expectTypeOf<IsLiteralList<[Direction.Up, Direction.Up], Direction>>().toBe<false>();
expectTypeOf<LiteralList<any, U1>>().toBe<any>(); // `any` can't match
expectTypeOf<LiteralList<never, U1>>().toBe<never>(); // `never` can't match

// Elements that are unions could hide duplicates
expectTypeOf<IsLiteralList<[U1, U1, U1, U1], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<['a', 'b', 'c' | 'd', 'c' | 'd'], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[boolean, 'a'], true | false | 'a'>>().toBe<false>();
expectTypeOf<LiteralList<[U1, U1, U1, U1], U1>>().toBe<'Each element must be a single member of the union'>();

// Error messages
expectTypeOf<LiteralList<['a', 'b', 'c'], 'a' | 'b'>>().toBe<'Type [a, b, c] is not the required length of: 2'>();
expectTypeOf<LiteralList<['a', 'a'], 'a' | 'b'>>().toBe<'Type [a, a] is missing members: [b]'>();
expectTypeOf<LiteralList<['a', 'c'], 'a' | 'b'>>().toBe<'Type [a, c] has extra members: [c]'>();
expectTypeOf<LiteralList<U1[], U1>>().toBeAssignableTo<string>();

// Function parameter
declare function literalList<const List extends UnknownArray>(list: List & LiteralList<List, U1>): List;

expectTypeOf(literalList(['b', 'd', 'a', 'c'])).toBe<readonly ['b', 'd', 'a', 'c']>();
expectTypeOf(literalList(['b', 'd', 'a', 'c'] as const)).toBe<readonly ['b', 'd', 'a', 'c']>();

// @ts-expect-error
literalList(['a', 'b', 'c']);
// @ts-expect-error
literalList(['a', 'b', 'c', 'c']);
// @ts-expect-error
literalList(['a', 'b', 'c', 'e']);
// @ts-expect-error
literalList(['a', 'b', 'c', 'd', 'd']);
// @ts-expect-error
literalList([] as U1[]);

// Orders
expectTypeOf<IsLiteralList<['a', 'b', 'c', 'd'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['a', 'b', 'd', 'c'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['a', 'c', 'b', 'd'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['a', 'c', 'd', 'b'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['a', 'd', 'b', 'c'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['a', 'd', 'c', 'b'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['b', 'a', 'c', 'd'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['b', 'a', 'd', 'c'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['b', 'c', 'a', 'd'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['b', 'c', 'd', 'a'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['b', 'd', 'a', 'c'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['b', 'd', 'c', 'a'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['c', 'a', 'b', 'd'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['c', 'a', 'd', 'b'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['c', 'b', 'a', 'd'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['c', 'b', 'd', 'a'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['c', 'd', 'a', 'b'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['c', 'd', 'b', 'a'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['d', 'a', 'b', 'c'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['d', 'a', 'c', 'b'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['d', 'b', 'a', 'c'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['d', 'b', 'c', 'a'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['d', 'c', 'a', 'b'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['d', 'c', 'b', 'a'], U1>>().toBe<true>();

// Unions
expectTypeOf<IsLiteralList<['a', 'b', 'c', 'd'] | ['a', 'b', 'd', 'c'], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<['a', 'c', 'b', 'd'] | ['e'], U1>>().toBe<boolean>();
expectTypeOf<IsLiteralList<['a'] | ['e'], U1>>().toBe<false>();
expectTypeOf<LiteralList<['a', 'b'] | ['b', 'b'], 'a' | 'b'>>().toBe<['a', 'b'] | 'Type [b, b] is missing members: [a]'>();

// Long Unions
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 9], U2>>().toBe<true>(); // Match
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8], U2>>().toBe<false>(); // Shorter
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 0], U2>>().toBe<false>(); // Extra
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 8], U2>>().toBe<false>(); // Missing
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 9, 0], U2>>().toBe<false>(); // Longer

// Error messages for primitive members
expectTypeOf<LiteralList<['a', 'b', 'c'], U1>>().toBe<'Type [a, b, c] is not the required length of: 4'>();
expectTypeOf<LiteralList<['b', 'c', 'd'], U1>>().toBe<'Type [b, c, d] is not the required length of: 4'>();
expectTypeOf<LiteralList<['c', 'a', 'd', 'b', 'f'], U1>>().toBe<'Type [c, a, d, b, f] is not the required length of: 4'>();
expectTypeOf<LiteralList<['c', 'd', 'e', 'b', 'a'], U1>>().toBe<'Type [c, d, e, b, a] is not the required length of: 4'>();
expectTypeOf<LiteralList<['a', 'd', 'b', 'b'], U1>>().toBe<'Type [a, d, b, b] is missing members: [c]'>();
expectTypeOf<LiteralList<['a', 'a', 'b', 'b'], U1>>().toBeAssignableTo<'Type [a, a, b, b] is missing members: [c, d]' | 'Type [a, a, b, b] is missing members: [d, c]'>();
expectTypeOf<LiteralList<['b', 'a', 'c', 'm'], U1>>().toBe<'Type [b, a, c, m] has extra members: [m]'>();
expectTypeOf<LiteralList<['b', 'c', 'e', 'm'], U1>>().toBeAssignableTo<'Type [b, c, e, m] has extra members: [e, m]' | 'Type [b, c, e, m] has extra members: [m, e]'>();

// Error messages for tuple members
expectTypeOf<LiteralList<[['a'], ['b', 'c']], U3>>().toBe<'Type [...] is not the required length of: 3'>();
expectTypeOf<LiteralList<[['b', 'c'], ['a', 'b']], U3>>().toBe<'Type [...] is not the required length of: 3'>();
expectTypeOf<LiteralList<[['a'], ['b', 'c'], ['a', 'b'], ['f']], U3>>().toBe<'Type [...] is not the required length of: 3'>();
expectTypeOf<LiteralList<[['a'], ['b', 'c'], ['a', 'b'], 'd'], U3>>().toBe<'Type [...] is not the required length of: 3'>();
expectTypeOf<LiteralList<[['b', 'c'], ['a'], ['a']], U3>>().toBeAssignableTo<'Type [...] is missing members: [a, b]'>();
expectTypeOf<LiteralList<[['a'], ['b', 'c'], ['b', 'c']], U3>>().toBeAssignableTo<'Type [...] is missing members: [a, b]'>();
expectTypeOf<LiteralList<[['a'], ['b', 'c'], ['f']], U3>>().toBe<'Type [...] has extra members: [f]'>();
expectTypeOf<LiteralList<[['b'], ['e'], ['a', 'b']], U3>>().toBeAssignableTo<'Type [...] has extra members: [[b], [e]]' | 'Type [...] has extra members: [[e], [b]]'>();
