import {expectTypeOf} from 'nz';
import type {CamelCasedProperties, UnionToEnum} from '../index.d.ts';

// Union input
expectTypeOf({Only: 1} as const).toBe<UnionToEnum<'Only', {numeric: true}>>();
expectTypeOf({b: 'b', a: 'a', d: 'd', c: 'c'} as const).toBe<UnionToEnum<'b' | 'a' | 'd' | 'c'>>();
expectTypeOf({1: 1, 2: 2, 3: 3, 4: 4} as const).toBe<UnionToEnum<3 | 2 | 4 | 1>>();

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectTypeOf({[sym1]: sym1, [sym2]: sym2} as const).toBe<UnionToEnum<typeof sym1 | typeof sym2>>();

// Unordered union with numeric flag
expectTypeOf<UnionToEnum<'left' | 'right' | 'up' | 'down', {numeric: true}>>().toBeAssignableTo<{left: 1 | 2 | 3 | 4; right: 1 | 2 | 3 | 4; up: 1 | 2 | 3 | 4; down: 1 | 2 | 3 | 4}>();

// Large union
type BigUnion = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
expectTypeOf({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'} as const).toBe<UnionToEnum<BigUnion>>();

// Non-literal input fallback
expectTypeOf({}).toBe<UnionToEnum<string>>();
expectTypeOf({}).toBe<UnionToEnum<number>>();
expectTypeOf({}).toBe<UnionToEnum<symbol>>();
expectTypeOf({}).toBe<UnionToEnum<number | string>>();
expectTypeOf({bar: 'bar'} as const).toBe<UnionToEnum<`foo${string}` | 'bar'>>();

// `never` / `any`
expectTypeOf({}).toBe<UnionToEnum<never>>();
expectTypeOf({}).toBe<UnionToEnum<any>>();

// Literal const unions
declare const level: 'DEBUG' | 'INFO' | 'ERROR' | 'WARNING';

expectTypeOf({
	DEBUG: 'DEBUG',
	INFO: 'INFO',
	ERROR: 'ERROR',
	WARNING: 'WARNING',
} as const).toBe<UnionToEnum<typeof level>>();
expectTypeOf<UnionToEnum<typeof level, {numeric: true}>>().toBeAssignableTo<{
	DEBUG: 1 | 2 | 3 | 4;
	INFO: 1 | 2 | 3 | 4;
	ERROR: 1 | 2 | 3 | 4;
	WARNING: 1 | 2 | 3 | 4;
}>();

// Dynamic Enum
declare const verb: ['write', 'read', 'delete'];
declare const resource: ['file', 'folder', 'link'];

declare function createEnum<
	const T extends readonly string[],
	const U extends readonly string[],
>(x: T, y: U): CamelCasedProperties<UnionToEnum<`${T[number]}_${U[number]}`>>;

const Template = createEnum(verb, resource);

expectTypeOf({
	writeFile: 'write_file',
	writeFolder: 'write_folder',
	writeLink: 'write_link',
	readFile: 'read_file',
	readFolder: 'read_folder',
	readLink: 'read_link',
	deleteFile: 'delete_file',
	deleteFolder: 'delete_folder',
	deleteLink: 'delete_link',
} as const).toBe<typeof Template>();

// Edge cases for startIndex
expectTypeOf({x: -1} as const).toBe<UnionToEnum<'x', {numeric: true; startIndex: -1}>>();
expectTypeOf({x: -100, y: -99} as const).toBe<UnionToEnum<'x' | 'y', {numeric: true; startIndex: -100}>>();
expectTypeOf({test: 100} as const).toBe<UnionToEnum<'test', {numeric: true; startIndex: 100}>>();

// Numeric edge cases
expectTypeOf({0: 0, [-1]: -1, 42: 42} as const).toBe<UnionToEnum<0 | -1 | 42>>();
