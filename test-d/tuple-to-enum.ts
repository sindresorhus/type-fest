import {expectTypeOf} from 'nz';
import type {TupleToEnum} from '../index.d.ts';

// Tuple input
expectTypeOf({One: 'One', Two: 'Two'} as const).toBe<TupleToEnum<['One', 'Two']>>();
expectTypeOf({X: 0, Y: 1, Z: 2} as const).toBe<TupleToEnum<['X', 'Y', 'Z'], {numeric: true}>>();
expectTypeOf<TupleToEnum<['A', 'B'] | ['C', 'D']>>().toBe<{readonly A: 'A'; readonly B: 'B'} | {readonly C: 'C'; readonly D: 'D'}>();
expectTypeOf<TupleToEnum<['A', 'B'] | ['C', 'D'], {numeric: true}>>().toBe<{readonly A: 0; readonly B: 1} | {readonly C: 0; readonly D: 1}>();

// Single element tuple
expectTypeOf({Only: 'Only'} as const).toBe<TupleToEnum<['Only']>>();
expectTypeOf({0: 0} as const).toBe<TupleToEnum<[0]>>();
expectTypeOf({0: 5} as const).toBe<TupleToEnum<[0], {numeric: true; startIndex: 5}>>();

// Tuple with numeric keys
expectTypeOf({1: 1, 2: 2, 3: 3} as const).toBe<TupleToEnum<[1, 2, 3]>>();
expectTypeOf({1: 10, 2: 11, 3: 12} as const).toBe<TupleToEnum<[1, 2, 3], {numeric: true; startIndex: 10}>>();

// Mixed keys
expectTypeOf({a: 'a', 1: 1, b: 'b'} as const).toBe<TupleToEnum<['a', 1, 'b']>>();
expectTypeOf({a: 0, 1: 1, b: 2} as const).toBe<TupleToEnum<['a', 1, 'b'], {numeric: true; startIndex: 0}>>();

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectTypeOf({[sym1]: sym1, [sym2]: sym2} as const).toBe<TupleToEnum<[typeof sym1, typeof sym2]>>();

// Large tuple
type BigTuple = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
expectTypeOf({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'} as const).toBe<TupleToEnum<BigTuple>>();

// Symbols with numeric indices
expectTypeOf({[sym1]: 0, [sym2]: 1} as const).toBe<TupleToEnum<[typeof sym1, typeof sym2], {numeric: true}>>();

// Readonly tuple input
expectTypeOf({a: 'a', b: 'b', c: 'c'} as const).toBe<TupleToEnum<readonly ['a', 'b', 'c']>>();

// Non-literal input fallback
expectTypeOf({}).toBe<TupleToEnum<string[]>>();
expectTypeOf({}).toBe<TupleToEnum<number[]>>();
expectTypeOf({}).toBe<TupleToEnum<symbol[]>>();
expectTypeOf({}).toBe<TupleToEnum<[string]>>();
expectTypeOf({foo: 'foo'} as const).toBe<TupleToEnum<[string, 'foo']>>();

// Empty array cases
expectTypeOf({}).toBe<TupleToEnum<[]>>();
expectTypeOf({}).toBe<TupleToEnum<readonly []>>();

// `never` / `any`
expectTypeOf({}).toBe<TupleToEnum<never>>();
expectTypeOf({}).toBe<TupleToEnum<any>>();

// Literal const arrays
const buttons = ['Play', 'Pause', 'Stop'] as const;

expectTypeOf({Play: 'Play', Pause: 'Pause', Stop: 'Stop'} as const).toBe<TupleToEnum<typeof buttons>>();
expectTypeOf({Play: 0, Pause: 1, Stop: 2} as const).toBe<TupleToEnum<typeof buttons, {numeric: true; startIndex: 0}>>();

const level = ['DEBUG', 'INFO', 'ERROR', 'WARNING'] as const;

expectTypeOf({
	DEBUG: 'DEBUG',
	INFO: 'INFO',
	ERROR: 'ERROR',
	WARNING: 'WARNING',
} as const).toBe<TupleToEnum<typeof level>>();
expectTypeOf({
	DEBUG: 0,
	INFO: 1,
	ERROR: 2,
	WARNING: 3,
} as const).toBe<TupleToEnum<typeof level, {numeric: true}>>();

// Edge cases for startIndex
expectTypeOf({x: -1} as const).toBe<TupleToEnum<['x'], {numeric: true; startIndex: -1}>>();
expectTypeOf({x: -100, y: -99} as const).toBe<TupleToEnum<['x', 'y'], {numeric: true; startIndex: -100}>>();
expectTypeOf({test: 100} as const).toBe<TupleToEnum<['test'], {numeric: true; startIndex: 100}>>();

// Numeric edge cases
expectTypeOf({0: 0, [-5]: 1, 999: 2} as const).toBe<TupleToEnum<[0, -5, 999], {numeric: true}>>();

// Union and duplicate elements
expectTypeOf<TupleToEnum<['a' | 'b', 'c']>>().toBe<{readonly a: 'a'; readonly b: 'b'; readonly c: 'c'}>();
expectTypeOf<TupleToEnum<['a', 'b', 'a']>>().toBe<{readonly a: 'a'; readonly b: 'b'}>();
expectTypeOf<TupleToEnum<['a', 'b', 'a'], {numeric: true}>>().toBe<{readonly a: 0 | 2; readonly b: 1}>();

// Default `startIndex` is `0`, like TypeScript enums
expectTypeOf<TupleToEnum<['a', 'b'], {numeric: true}>>().toBe<{readonly a: 0; readonly b: 1}>();
expectTypeOf<TupleToEnum<['a', 'b'], {numeric: true; startIndex: 1}>>().toBe<{readonly a: 1; readonly b: 2}>();

// `startIndex` without `numeric` has no effect
expectTypeOf<TupleToEnum<['a', 'b'], {startIndex: 5}>>().toBe<{readonly a: 'a'; readonly b: 'b'}>();

// Invalid input
// @ts-expect-error
type InvalidBoolean = TupleToEnum<[boolean]>;
// @ts-expect-error
type InvalidUnknown = TupleToEnum<unknown>;

// Non-literal elements are ignored, and the other elements keep their indexes
expectTypeOf<TupleToEnum<[`on${string}`, 'x']>>().toBe<{readonly x: 'x'}>();
expectTypeOf<TupleToEnum<[`on${string}`, 'x'], {numeric: true}>>().toBe<{readonly x: 1}>();
expectTypeOf<TupleToEnum<[string, 'foo'], {numeric: true}>>().toBe<{readonly foo: 1}>();

// Rest elements
expectTypeOf<TupleToEnum<['a', ...Array<'b'>]>>().toBe<{readonly a: 'a'; readonly b: 'b'}>();
expectTypeOf<TupleToEnum<['a', ...Array<'b'>], {numeric: true}>>().toBe<{readonly a: 0}>(); // Rest elements have no fixed index
expectTypeOf<TupleToEnum<readonly ['a', 'b'], {numeric: true}>>().toBe<{readonly a: 0; readonly b: 1}>();
