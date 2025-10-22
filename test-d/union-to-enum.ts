import {expectType} from 'tsd';
import type {CamelCasedProperties, UnionToEnum} from '../index.d.ts';

// Union input
expectType<UnionToEnum<'b' | 'a' | 'd' | 'c'>>({b: 'b', a: 'a', d: 'd', c: 'c'} as const);
expectType<UnionToEnum<3 | 2 | 4 | 1>>({1: 1, 2: 2, 3: 3, 4: 4} as const);

// Tuple input
expectType<UnionToEnum<['One', 'Two']>>({One: 'One', Two: 'Two'} as const);
expectType<UnionToEnum<['X', 'Y', 'Z'], {numeric: true}>>({X: 1, Y: 2, Z: 3} as const);
expectType<UnionToEnum<['A', 'B'] | ['C', 'D']>>({} as Readonly<{A: 'A'; B: 'B'} | {C: 'C'; D: 'D'}>);
expectType<UnionToEnum<['A', 'B'] | ['C', 'D'], {numeric: true}>>({} as Readonly<{A: 1; B: 2} | {C: 1; D: 2}>);

// Single element tuple
expectType<UnionToEnum<['Only']>>({Only: 'Only'} as const);
expectType<UnionToEnum<'Only', {numeric: true}>>({Only: 1} as const);
expectType<UnionToEnum<[0]>>({0: 0} as const);
expectType<UnionToEnum<[0], {numeric: true; startIndex: 5}>>({0: 5} as const);

// Tuple with numeric keys
expectType<UnionToEnum<[1, 2, 3]>>({1: 1, 2: 2, 3: 3} as const);
expectType<UnionToEnum<[1, 2, 3], {numeric: true; startIndex: 10}>>({1: 10, 2: 11, 3: 12} as const);

// Mixed keys
expectType<UnionToEnum<['a', 1, 'b']>>({a: 'a', 1: 1, b: 'b'} as const);
expectType<UnionToEnum<['a', 1, 'b'], {numeric: true; startIndex: 0}>>({a: 0, 1: 1, b: 2} as const);

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectType<UnionToEnum<typeof sym1 | typeof sym2>>({[sym1]: sym1, [sym2]: sym2} as const);
expectType<UnionToEnum<[typeof sym1, typeof sym2]>>({[sym1]: sym1, [sym2]: sym2} as const);

// Unordered union with numeric flag
expectType<UnionToEnum<'left' | 'right' | 'up' | 'down', {numeric: true}>>({left: 1, right: 2, up: 3, down: 4} as const);

// Large union
type BigUnion = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
expectType<UnionToEnum<BigUnion>>({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'} as const);

// Symbols with numeric indices
expectType<UnionToEnum<[typeof sym1, typeof sym2], {numeric: true}>>({[sym1]: 1, [sym2]: 2} as const);

// Readonly tuple input
expectType<UnionToEnum<readonly ['a', 'b', 'c']>>({a: 'a', b: 'b', c: 'c'} as const);

// Non-literal input fallback
expectType<UnionToEnum<string>>({});
expectType<UnionToEnum<number>>({});
expectType<UnionToEnum<symbol>>({});
expectType<UnionToEnum<string[]>>({});
expectType<UnionToEnum<number[]>>({});
expectType<UnionToEnum<symbol[]>>({});
expectType<UnionToEnum<[string]>>({});
expectType<UnionToEnum<number | string>>({});
expectType<UnionToEnum<[string, 'foo']>>({foo: 'foo'} as const);
expectType<UnionToEnum<`foo${string}` | 'bar'>>({bar: 'bar'} as const);

// Empty array cases
expectType<UnionToEnum<[]>>({});
expectType<UnionToEnum<readonly []>>({});

// `never` / `any`
expectType<UnionToEnum<never>>({});
expectType<UnionToEnum<any>>({});

// Literal const arrays
const buttons = ['Play', 'Pause', 'Stop'] as const;

expectType<UnionToEnum<typeof buttons>>({Play: 'Play', Pause: 'Pause', Stop: 'Stop'} as const);
expectType<UnionToEnum<typeof buttons, {numeric: true; startIndex: 0}>>({Play: 0, Pause: 1, Stop: 2} as const);

const level = ['DEBUG', 'INFO', 'ERROR', 'WARNING'] as const;

expectType<UnionToEnum<typeof level>>({
	DEBUG: 'DEBUG',
	INFO: 'INFO',
	ERROR: 'ERROR',
	WARNING: 'WARNING',
} as const);
expectType<UnionToEnum<typeof level, {numeric: true}>>({
	DEBUG: 1,
	INFO: 2,
	ERROR: 3,
	WARNING: 4,
} as const);

// Dynamic Enum
const verb = ['write', 'read', 'delete'] as const;
const resource = ['file', 'folder', 'link'] as const;

declare function createEnum<
	const T extends readonly string[],
	const U extends readonly string[],
>(x: T, y: U): CamelCasedProperties<UnionToEnum<`${T[number]}_${U[number]}`>>;

const Template = createEnum(verb, resource);

expectType<typeof Template>({
	writeFile: 'write_file',
	writeFolder: 'write_folder',
	writeLink: 'write_link',
	readFile: 'read_file',
	readFolder: 'read_folder',
	readLink: 'read_link',
	deleteFile: 'delete_file',
	deleteFolder: 'delete_folder',
	deleteLink: 'delete_link',
} as const);

// Edge cases for startIndex
expectType<UnionToEnum<['x'], {numeric: true; startIndex: -1}>>({x: -1} as const);
expectType<UnionToEnum<['x', 'y'], {numeric: true; startIndex: -100}>>({x: -100, y: -99} as const);
expectType<UnionToEnum<['test'], {numeric: true; startIndex: 100}>>({test: 100} as const);

// Numeric edge cases
expectType<UnionToEnum<0 | -1 | 42>>({0: 0, [-1]: -1, 42: 42} as const);
expectType<UnionToEnum<[0, -5, 999], {numeric: true}>>({0: 1, [-5]: 2, 999: 3} as const);

// @ts-expect-error no mixed input
type T = UnionToEnum<'A' | ['B']>;
type V = UnionToEnum<['A'] | ['B']>;
