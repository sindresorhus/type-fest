import {expectType} from 'tsd';
import type {UnionToEnum} from '../index.d.ts';
import type {CaseOptions} from '../source/internal/cases.d.ts';
import type {UnionToEnumOptions} from '../source/union-to-enum.d.ts';

// Union input
expectType<UnionToEnum<'b' | 'a' | 'd' | 'c'>>({b: 'b', a: 'a', d: 'd', c: 'c'} as const);
expectType<UnionToEnum<3 | 2 | 4 | 1>>({1: 1, 2: 2, 3: 3, 4: 4} as const);

// Tuple input
expectType<UnionToEnum<['One', 'Two']>>({One: 'One', Two: 'Two'} as const);
expectType<UnionToEnum<['X', 'Y', 'Z'], true>>({X: 1, Y: 2, Z: 3} as const);

// Single element tuple
expectType<UnionToEnum<['Only']>>({Only: 'Only'} as const);
expectType<UnionToEnum<'Only', true>>({Only: 1} as const);

// Tuple with numeric keys
expectType<UnionToEnum<[1, 2, 3]>>({1: 1, 2: 2, 3: 3} as const);
expectType<UnionToEnum<[1, 2, 3], true, {startIndex: 10}>>({1: 10, 2: 11, 3: 12} as const);

// Mixed keys
expectType<UnionToEnum<['a', 1, 'b']>>({a: 'a', 1: 1, b: 'b'} as const);
expectType<UnionToEnum<['a', 1, 'b'], true, {startIndex: 0}>>({a: 0, 1: 1, b: 2} as const);

// Literal const arrays
const buttons = ['Play', 'Pause', 'Stop'] as const;

expectType<UnionToEnum<typeof buttons>>({Play: 'Play', Pause: 'Pause', Stop: 'Stop'} as const);
expectType<UnionToEnum<typeof buttons, true, {startIndex: 0}>>({Play: 0, Pause: 1, Stop: 2} as const);

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectType<UnionToEnum<typeof sym1 | typeof sym2>>({[sym1]: sym1, [sym2]: sym2} as const);
expectType<UnionToEnum<[typeof sym1, typeof sym2]>>({[sym1]: sym1, [sym2]: sym2} as const);

// Unordered union with numeric flag
expectType<UnionToEnum<'left' | 'right' | 'up' | 'down', true>>({left: 1, right: 2, up: 3, down: 4} as const);

// Large union
type BigUnion = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
expectType<UnionToEnum<BigUnion>>({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'} as const);

// Non-literal input fallback
expectType<UnionToEnum<string>>({} as Readonly<Record<string, string>>);
expectType<UnionToEnum<number>>({} as Readonly<Record<number, number>>);
expectType<UnionToEnum<symbol>>({} as Readonly<Record<symbol, symbol>>);

expectType<UnionToEnum<string[]>>({} as const);
expectType<UnionToEnum<number[]>>({} as const);
expectType<UnionToEnum<symbol[]>>({} as const);

// `never` / `any`
expectType<UnionToEnum<never>>({} as const);
expectType<UnionToEnum<any>>({} as const);

// CamelCase
const level = ['DEBUG', 'INFO', 'ERROR', 'WARNING'] as const;
expectType<UnionToEnum<typeof buttons, false, {propertyCase: 'Camel'}>>({
	play: 'Play',
	pause: 'Pause',
	stop: 'Stop',
} as const);
expectType<UnionToEnum<typeof level, false, {propertyCase: 'Camel'}>>({
	debug: 'DEBUG',
	info: 'INFO',
	error: 'ERROR',
	warning: 'WARNING',
} as const);
expectType<UnionToEnum<typeof level, true, {propertyCase: 'Pascal'}>>({
	Debug: 1,
	Info: 2,
	Error: 3,
	Warning: 4,
} as const);

// Dynamic Enum
type verb = ['write', 'read', 'delete'];
type resrc = ['file', 'folder', 'link'];

declare function createEnum<
	const T extends readonly string[],
	const U extends readonly string[],
	Case extends Required<UnionToEnumOptions>['propertyCase'],
	Options extends CaseOptions = {},
>(): UnionToEnum<`${T[number]} ${U[number]}`, false, {propertyCase: Case} & Options>;

type CamelTemplate = ReturnType<typeof createEnum<verb, resrc, 'Camel'>>;
type PascalTemplate = ReturnType<typeof createEnum<verb, resrc, 'Pascal'>>;
type KebabTemplate = ReturnType<typeof createEnum<verb, resrc, 'Kebab'>>;
type SnakeTemplate = ReturnType<typeof createEnum<verb, resrc, 'Snake'>>;
type DelimiterTemplate = ReturnType<typeof createEnum<verb, resrc, 'Delimiter', {delimiter: '/'}>>;

expectType<CamelTemplate>({
	writeFile: 'write file',
	writeFolder: 'write folder',
	writeLink: 'write link',
	readFile: 'read file',
	readFolder: 'read folder',
	readLink: 'read link',
	deleteFile: 'delete file',
	deleteFolder: 'delete folder',
	deleteLink: 'delete link',
} as const);
expectType<PascalTemplate>({
	WriteFile: 'write file',
	WriteLink: 'write link',
	WriteFolder: 'write folder',
	ReadLink: 'read link',
	ReadFile: 'read file',
	ReadFolder: 'read folder',
	DeleteLink: 'delete link',
	DeleteFile: 'delete file',
	DeleteFolder: 'delete folder',
} as const);
expectType<KebabTemplate>({
	'write-link': 'write link',
	'write-file': 'write file',
	'write-folder': 'write folder',
	'read-link': 'read link',
	'read-file': 'read file',
	'read-folder': 'read folder',
	'delete-link': 'delete link',
	'delete-file': 'delete file',
	'delete-folder': 'delete folder',
} as const);
expectType<SnakeTemplate>({
	write_file: 'write file',
	write_link: 'write link',
	write_folder: 'write folder',
	read_link: 'read link',
	read_file: 'read file',
	read_folder: 'read folder',
	delete_link: 'delete link',
	delete_file: 'delete file',
	delete_folder: 'delete folder',
} as const);
expectType<DelimiterTemplate>({
	'write/link': 'write link',
	'write/file': 'write file',
	'write/folder': 'write folder',
	'read/link': 'read link',
	'read/file': 'read file',
	'read/folder': 'read folder',
	'delete/link': 'delete link',
	'delete/file': 'delete file',
	'delete/folder': 'delete folder',
} as const);
