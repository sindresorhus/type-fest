import {expectType} from 'tsd';
import type {TupleToEnum} from '../index.d.ts';

// Tuple input
expectType<TupleToEnum<['One', 'Two']>>({One: 'One', Two: 'Two'} as const);
expectType<TupleToEnum<['X', 'Y', 'Z'], {numeric: true}>>({X: 1, Y: 2, Z: 3} as const);
expectType<TupleToEnum<['A', 'B'] | ['C', 'D']>>({} as Readonly<{A: 'A'; B: 'B'} | {C: 'C'; D: 'D'}>);
expectType<TupleToEnum<['A', 'B'] | ['C', 'D'], {numeric: true}>>({} as Readonly<{A: 1; B: 2} | {C: 1; D: 2}>);

// Single element tuple
expectType<TupleToEnum<['Only']>>({Only: 'Only'} as const);
expectType<TupleToEnum<[0]>>({0: 0} as const);
expectType<TupleToEnum<[0], {numeric: true; startIndex: 5}>>({0: 5} as const);

// Tuple with numeric keys
expectType<TupleToEnum<[1, 2, 3]>>({1: 1, 2: 2, 3: 3} as const);
expectType<TupleToEnum<[1, 2, 3], {numeric: true; startIndex: 10}>>({1: 10, 2: 11, 3: 12} as const);

// Mixed keys
expectType<TupleToEnum<['a', 1, 'b']>>({a: 'a', 1: 1, b: 'b'} as const);
expectType<TupleToEnum<['a', 1, 'b'], {numeric: true; startIndex: 0}>>({a: 0, 1: 1, b: 2} as const);

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectType<TupleToEnum<[typeof sym1, typeof sym2]>>({[sym1]: sym1, [sym2]: sym2} as const);

// Large union
type BigTuple = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
expectType<TupleToEnum<BigTuple>>({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'} as const);

// Symbols with numeric indices
expectType<TupleToEnum<[typeof sym1, typeof sym2], {numeric: true}>>({[sym1]: 1, [sym2]: 2} as const);

// Readonly tuple input
expectType<TupleToEnum<readonly ['a', 'b', 'c']>>({a: 'a', b: 'b', c: 'c'} as const);

// Non-literal input fallback
expectType<TupleToEnum<string[]>>({});
expectType<TupleToEnum<number[]>>({});
expectType<TupleToEnum<symbol[]>>({});
expectType<TupleToEnum<[string]>>({});
expectType<TupleToEnum<[string, 'foo']>>({foo: 'foo'} as const);

// Empty array cases
expectType<TupleToEnum<[]>>({});
expectType<TupleToEnum<readonly []>>({});

// `never` / `any`
expectType<TupleToEnum<never>>({});
expectType<TupleToEnum<any>>({});

// Literal const arrays
const buttons = ['Play', 'Pause', 'Stop'] as const;

expectType<TupleToEnum<typeof buttons>>({Play: 'Play', Pause: 'Pause', Stop: 'Stop'} as const);
expectType<TupleToEnum<typeof buttons, {numeric: true; startIndex: 0}>>({Play: 0, Pause: 1, Stop: 2} as const);

const level = ['DEBUG', 'INFO', 'ERROR', 'WARNING'] as const;

expectType<TupleToEnum<typeof level>>({
	DEBUG: 'DEBUG',
	INFO: 'INFO',
	ERROR: 'ERROR',
	WARNING: 'WARNING',
} as const);
expectType<TupleToEnum<typeof level, {numeric: true}>>({
	DEBUG: 1,
	INFO: 2,
	ERROR: 3,
	WARNING: 4,
} as const);

// Edge cases for startIndex
expectType<TupleToEnum<['x'], {numeric: true; startIndex: -1}>>({x: -1} as const);
expectType<TupleToEnum<['x', 'y'], {numeric: true; startIndex: -100}>>({x: -100, y: -99} as const);
expectType<TupleToEnum<['test'], {numeric: true; startIndex: 100}>>({test: 100} as const);

// Numeric edge cases
expectType<TupleToEnum<[0, -5, 999], {numeric: true}>>({0: 1, [-5]: 2, 999: 3} as const);
