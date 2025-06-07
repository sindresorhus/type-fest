import {expectType} from 'tsd';
import type {LiteralList} from '../source/literal-list.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

type U1 = 'a' | 'b' | 'c' | 'd';
type U2 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// ? Should we add this type
type IsLiteralList<T extends UnknownArray, U> =
	T extends LiteralList<T, U>
		? true
		: false;

// Base
expectType<IsLiteralList<[], U1>>(false);
expectType<IsLiteralList<U1[], U1>>(false);
expectType<IsLiteralList<[U1, U1, U1, U1], U1>>(true); // Should match
expectType<IsLiteralList<[U1, U1, U1], U1>>(false);
expectType<IsLiteralList<[U1, U1, U1, U1, U1], U1>>(false);
expectType<IsLiteralList<[...['a', 'b', 'd', 'c']], U1>>(true);
expectType<IsLiteralList<unknown[], U1>>(false);
expectType<IsLiteralList<[unknown, unknown, unknown, unknown], U1>>(false);
expectType<LiteralList<any, U1>>({} as any); // `any` can't match
expectType<LiteralList<never, U1>>({} as never); // `never` can't match

// Orders
expectType<IsLiteralList<['a', 'b', 'c', 'd'], U1>>(true);
expectType<IsLiteralList<['a', 'b', 'd', 'c'], U1>>(true);
expectType<IsLiteralList<['a', 'c', 'b', 'd'], U1>>(true);
expectType<IsLiteralList<['a', 'c', 'd', 'b'], U1>>(true);
expectType<IsLiteralList<['a', 'd', 'b', 'c'], U1>>(true);
expectType<IsLiteralList<['a', 'd', 'c', 'b'], U1>>(true);
expectType<IsLiteralList<['b', 'a', 'c', 'd'], U1>>(true);
expectType<IsLiteralList<['b', 'a', 'd', 'c'], U1>>(true);
expectType<IsLiteralList<['b', 'c', 'a', 'd'], U1>>(true);
expectType<IsLiteralList<['b', 'c', 'd', 'a'], U1>>(true);
expectType<IsLiteralList<['b', 'd', 'a', 'c'], U1>>(true);
expectType<IsLiteralList<['b', 'd', 'c', 'a'], U1>>(true);
expectType<IsLiteralList<['c', 'a', 'b', 'd'], U1>>(true);
expectType<IsLiteralList<['c', 'a', 'd', 'b'], U1>>(true);
expectType<IsLiteralList<['c', 'b', 'a', 'd'], U1>>(true);
expectType<IsLiteralList<['c', 'b', 'd', 'a'], U1>>(true);
expectType<IsLiteralList<['c', 'd', 'a', 'b'], U1>>(true);
expectType<IsLiteralList<['c', 'd', 'b', 'a'], U1>>(true);
expectType<IsLiteralList<['d', 'a', 'b', 'c'], U1>>(true);
expectType<IsLiteralList<['d', 'a', 'c', 'b'], U1>>(true);
expectType<IsLiteralList<['d', 'b', 'a', 'c'], U1>>(true);
expectType<IsLiteralList<['d', 'b', 'c', 'a'], U1>>(true);
expectType<IsLiteralList<['d', 'c', 'a', 'b'], U1>>(true);
expectType<IsLiteralList<['d', 'c', 'b', 'a'], U1>>(true);

// Unions
expectType<IsLiteralList<['a', 'b', 'c', 'd'] | ['a', 'b', 'd', 'c'], U1>>(true);
expectType<IsLiteralList<['a', 'c', 'b', 'd'] | ['e'], U1>>({} as boolean);
expectType<IsLiteralList<['a'] | ['e'], U1>>(false);

// Long Unions
expectType<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 9], U2>>(true); // Match
expectType<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8], U2>>(false); // Shorter
expectType<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 0], U2>>(false); // Extra
expectType<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 8], U2>>(false); // Missing
expectType<IsLiteralList<[1, 2, 3, 4, 5, 6, 7, 8, 9, 0], U2>>(false); // Longer

// Errors
expectType<IsLiteralList<['a', 'b', 'c'], U1>>(false);
expectType<IsLiteralList<['b', 'c', 'd'], U1>>(false);
expectType<IsLiteralList<['c', 'a', 'd', 'b', 'f'], U1>>(false);
expectType<IsLiteralList<['c', 'd', 'e', 'b', 'a'], U1>>(false);
expectType<IsLiteralList<['a', 'd', 'b', 'b'], U1>>(false);
expectType<IsLiteralList<['a', 'a', 'c', 'b'], U1>>(false);
expectType<IsLiteralList<['b', 'a', 'c', 'm'], U1>>(false);
expectType<IsLiteralList<['b', 'c', 'e', 'd'], U1>>(false);
