import {expectType} from 'tsd';
import type {UnionToEnum} from '../index.d.ts';

// Union input
expectType<UnionToEnum<'b' | 'a' | 'd' | 'c'>>({b: 'b', a: 'a', d: 'd', c: 'c'});
expectType<UnionToEnum<3 | 2 | 4 | 1>>({1: 1, 2: 2, 3: 3, 4: 4});

// Tuple input
expectType<UnionToEnum<['One', 'Two']>>({One: 'One', Two: 'Two'});
expectType<UnionToEnum<['X', 'Y', 'Z'], true>>({X: 1, Y: 2, Z: 3});

// Single element tuple
expectType<UnionToEnum<['Only']>>({Only: 'Only'});
expectType<UnionToEnum<'Only', true>>({Only: 1});

// Tuple with numeric keys
expectType<UnionToEnum<[1, 2, 3]>>({1: 1, 2: 2, 3: 3});
expectType<UnionToEnum<[1, 2, 3], true, {startIndex: 10}>>({1: 10, 2: 11, 3: 12});

// Mixed keys
expectType<UnionToEnum<['a', 1, 'b']>>({a: 'a', 1: 1, b: 'b'});
expectType<UnionToEnum<['a', 1, 'b'], true, {startIndex: 0}>>({a: 0, 1: 1, b: 2});

// Literal const arrays
const buttons = ['Play', 'Pause', 'Stop'] as const;

expectType<UnionToEnum<typeof buttons>>({Play: 'Play', Pause: 'Pause', Stop: 'Stop'});
expectType<UnionToEnum<typeof buttons, true, {startIndex: 0}>>({Play: 0, Pause: 1, Stop: 2});

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectType<UnionToEnum<typeof sym1 | typeof sym2>>({[sym1]: sym1, [sym2]: sym2});
expectType<UnionToEnum<[typeof sym1, typeof sym2]>>({[sym1]: sym1, [sym2]: sym2});

// Unordered union with numeric flag
expectType<UnionToEnum<'left' | 'right' | 'up' | 'down', true>>({left: 1, right: 2, up: 3, down: 4});

// Large union
type BigUnion = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
expectType<UnionToEnum<BigUnion>>({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'});

// Non-literal input fallback
expectType<UnionToEnum<string>>({} as Record<string, string>);
expectType<UnionToEnum<number>>({} as Record<number, number>);
expectType<UnionToEnum<symbol>>({} as Record<symbol, symbol>);

expectType<UnionToEnum<string[]>>({});
expectType<UnionToEnum<number[]>>({});
expectType<UnionToEnum<symbol[]>>({});

// `never` / `any`
expectType<UnionToEnum<never>>({});
expectType<UnionToEnum<any>>({});

// CamelCase
const level = ['DEBUG', 'INFO', 'ERROR', 'WARNING'] as const;
expectType<UnionToEnum<typeof buttons, false, {camelCase: true}>>({
	play: 'Play',
	pause: 'Pause',
	stop: 'Stop',
});
expectType<UnionToEnum<typeof level, false, {camelCase: true}>>({
	debug: 'DEBUG',
	info: 'INFO',
	error: 'ERROR',
	warning: 'WARNING',
});
expectType<UnionToEnum<typeof level, true, {camelCase: true}>>({
	debug: 1,
	info: 2,
	error: 3,
	warning: 4,
});

// Dynamic Enum
const verb = ['write', 'read', 'delete'] as const;
const resrc = ['file', 'folder', 'link'] as const;

declare function createEnum<
	const T extends readonly string[],
	const U extends readonly string[],
>(x: T, y: U): UnionToEnum<`${T[number]}_${U[number]}`, false, {camelCase: true}>;

const Template = createEnum(verb, resrc);

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
});
