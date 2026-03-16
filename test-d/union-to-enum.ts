import {expectAssignable, expectType} from 'tsd';
import type {CamelCasedProperties, UnionToEnum} from '../index.d.ts';

// Union input
expectType<UnionToEnum<'Only', {numeric: true}>>({Only: 1} as const);
expectType<UnionToEnum<'b' | 'a' | 'd' | 'c'>>({b: 'b', a: 'a', d: 'd', c: 'c'} as const);
expectType<UnionToEnum<3 | 2 | 4 | 1>>({1: 1, 2: 2, 3: 3, 4: 4} as const);

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectType<UnionToEnum<typeof sym1 | typeof sym2>>({[sym1]: sym1, [sym2]: sym2} as const);

// Unordered union with numeric flag
expectType<UnionToEnum<'left' | 'right' | 'up' | 'down', {numeric: true}>>({left: 1, right: 2, up: 3, down: 4} as const);

// Large union
type BigUnion = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
expectType<UnionToEnum<BigUnion>>({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'} as const);

// Non-literal input fallback
expectType<UnionToEnum<string>>({});
expectType<UnionToEnum<number>>({});
expectType<UnionToEnum<symbol>>({});
expectType<UnionToEnum<number | string>>({});
expectType<UnionToEnum<`foo${string}` | 'bar'>>({bar: 'bar'} as const);

// `never` / `any`
expectType<UnionToEnum<never>>({});
expectType<UnionToEnum<any>>({});

// Literal const unions
declare const level: 'DEBUG' | 'INFO' | 'ERROR' | 'WARNING';

expectType<UnionToEnum<typeof level>>({
	DEBUG: 'DEBUG',
	INFO: 'INFO',
	ERROR: 'ERROR',
	WARNING: 'WARNING',
} as const);
expectAssignable<{
	DEBUG: 1 | 2 | 3 | 4;
	INFO: 1 | 2 | 3 | 4;
	ERROR: 1 | 2 | 3 | 4;
	WARNING: 1 | 2 | 3 | 4;
}>({} as UnionToEnum<typeof level, {numeric: true}>);

// Dynamic Enum
declare const verb: ['write', 'read', 'delete'];
declare const resource: ['file', 'folder', 'link'];

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
expectType<UnionToEnum<'x', {numeric: true; startIndex: -1}>>({x: -1} as const);
expectType<UnionToEnum<'x' | 'y', {numeric: true; startIndex: -100}>>({x: -100, y: -99} as const);
expectType<UnionToEnum<'test', {numeric: true; startIndex: 100}>>({test: 100} as const);

// Numeric edge cases
expectType<UnionToEnum<0 | -1 | 42>>({0: 0, [-1]: -1, 42: 42} as const);
