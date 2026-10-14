import {expectTypeOf} from 'nz';
import type {LiteralList} from '../source/literal-list.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

type U1 = 'a' | 'b' | 'c' | 'd';
type U2 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type U3 = ['a'] | ['b', 'c'] | ['a', 'b'];

type IsLiteralList<T extends UnknownArray, U> =
	T extends LiteralList<T, U>
		? true
		: false;

// Base
expectTypeOf<IsLiteralList<[], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<U1[], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[U1, U1, U1, U1], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<[U1, U1, U1], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[U1, U1, U1, U1, U1], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[...['a', 'b', 'd', 'c']], U1>>().toBe<true>();
expectTypeOf<IsLiteralList<unknown[], U1>>().toBe<false>();
expectTypeOf<IsLiteralList<[unknown, unknown, unknown, unknown], U1>>().toBe<false>();
expectTypeOf<LiteralList<any, U1>>().toBe<any>(); // `any` can't match
expectTypeOf<LiteralList<never, U1>>().toBe<never>(); // `never` can't match

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

// Long Unions
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 9], U2>>().toBe<true>(); // Match
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8], U2>>().toBe<false>(); // Shorter
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 0], U2>>().toBe<false>(); // Extra
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 8], U2>>().toBe<false>(); // Missing
expectTypeOf<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 9, 0], U2>>().toBe<false>(); // Longer

// Errors for `JoinableItem` (hover to see errors)
type I1 = LiteralList<['a', 'b', 'c'], U1>;
type I2 = LiteralList<['b', 'c', 'd'], U1>;
type I3 = LiteralList<['c', 'a', 'd', 'b', 'f'], U1>;
type I4 = LiteralList<['c', 'd', 'e', 'b', 'a'], U1>;
type I5 = LiteralList<['a', 'd', 'b', 'b'], U1>;
type I6 = LiteralList<['a', 'a', 'b', 'b'], U1>;
type I7 = LiteralList<['b', 'a', 'c', 'm'], U1>;
type I8 = LiteralList<['b', 'c', 'e', 'm'], U1>;

expectTypeOf<I1>().toBeAssignableTo<string>();
expectTypeOf<I2>().toBeAssignableTo<string>();
expectTypeOf<I3>().toBeAssignableTo<string>();
expectTypeOf<I4>().toBeAssignableTo<string>();
expectTypeOf<I5>().toBeAssignableTo<string>();
expectTypeOf<I6>().toBeAssignableTo<string>();
expectTypeOf<I7>().toBeAssignableTo<string>();
expectTypeOf<I8>().toBeAssignableTo<string>();

// Errors for `JoinableItem[]` (hover to see errors)
type A1 = LiteralList<[['a'], ['b', 'c']], U3>;
type A2 = LiteralList<[['b', 'c'], ['a', 'b']], U3>;
type A3 = LiteralList<[['a'], ['b', 'c'], ['a', 'b'], ['f']], U3>;
type A4 = LiteralList<[['a'], ['b', 'c'], ['a', 'b'], 'd'], U3>;
type A5 = LiteralList<[['b', 'c'], ['a'], ['a']], U3>;
type A6 = LiteralList<[['a'], ['b', 'c'], ['b', 'c']], U3>;
type A7 = LiteralList<[['a'], ['b', 'c'], ['f']], U3>;
type A8 = LiteralList<[['b'], ['e'], ['a', 'b']], U3>;

expectTypeOf<A1>().toBeAssignableTo<string>();
expectTypeOf<A2>().toBeAssignableTo<string>();
expectTypeOf<A3>().toBeAssignableTo<string>();
expectTypeOf<A4>().toBeAssignableTo<string>();
expectTypeOf<A5>().toBeAssignableTo<string>();
expectTypeOf<A6>().toBeAssignableTo<string>();
expectTypeOf<A7>().toBeAssignableTo<string>();
expectTypeOf<A8>().toBeAssignableTo<string>();
