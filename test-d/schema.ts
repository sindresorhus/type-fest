import {expectTypeOf} from 'nz';
import type {Schema} from '../index.d.ts';

const foo = {
	baz: 'fred',
	bar: {
		function: (_: string): void => undefined,
		object: {key: 'value'},
		string: 'waldo',
		number: 1,
		boolean: false,
		symbol: Symbol('test'),
		map: new Map<string, string>(),
		set: new Set<string>(),
		array: ['foo'],
		tuple: ['foo'] as ['foo'],
		objectArray: [{key: 'value'}],
		readonlyMap: new Map<string, string>() as ReadonlyMap<string, string>,
		readonlySet: new Set<string>() as ReadonlySet<string>,
		readonlyArray: ['foo'] as readonly string[],
		readonlyTuple: ['foo'] as const,
		regExp: /.*/gv,
		unknown: undefined as unknown,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		any: undefined as any,
	},
};

type FooOption = 'A' | 'B';
type FooSchema = Schema<typeof foo, FooOption>;

const fooSchema: FooSchema = {
	baz: 'A',
	bar: {
		function: 'A',
		object: {key: 'A'},
		string: 'A',
		number: 'A',
		boolean: 'A',
		symbol: 'A',
		map: 'A',
		set: 'A',
		array: ['A', 'A', 'A'],
		tuple: ['A'],
		objectArray: [{key: 'A'}, {key: 'A'}, {key: 'A'}],
		readonlyMap: 'A',
		readonlySet: 'A',
		readonlyArray: ['A', 'A', 'A'] as const,
		readonlyTuple: ['A'] as const,
		regExp: 'A',
		unknown: 'A',
		any: 'A',
	},
};

expectTypeOf(foo).not.toBeAssignableTo<FooSchema>();
expectTypeOf<{key: 'value'}>().not.toBeAssignableTo<FooSchema>();
expectTypeOf(new Date()).not.toBeAssignableTo<FooSchema>();
expectTypeOf(fooSchema.baz).toBe<FooOption>();

const barSchema = fooSchema.bar;
expectTypeOf(barSchema.function).toBe<FooOption>();
expectTypeOf(barSchema.object).toBe<{key: FooOption}>();
expectTypeOf(barSchema.string).toBe<FooOption>();
expectTypeOf(barSchema.number).toBe<FooOption>();
expectTypeOf(barSchema.boolean).toBe<FooOption>();
expectTypeOf(barSchema.symbol).toBe<FooOption>();
expectTypeOf(barSchema.map).toBe<FooOption>();
expectTypeOf(barSchema.set).toBe<FooOption>();
expectTypeOf(barSchema.array).toBe<FooOption[]>();
expectTypeOf(barSchema.tuple).toBe<[FooOption]>();
expectTypeOf(barSchema.objectArray).toBe<Array<{key: FooOption}>>();
expectTypeOf(barSchema.readonlyMap).toBe<FooOption>();
expectTypeOf(barSchema.readonlySet).toBe<FooOption>();
expectTypeOf(barSchema.readonlyArray).toBe<readonly FooOption[]>();
expectTypeOf(barSchema.readonlyTuple).toBe<readonly [FooOption]>();
expectTypeOf(barSchema.regExp).toBe<FooOption>();
expectTypeOf(barSchema.unknown).toBe<FooOption>();
expectTypeOf(barSchema.any).toBe<FooOption>();

type ComplexOption = {
	type: 'readonly' | 'required' | 'optional';
	validation(value: unknown): boolean;
};
type ComplexSchema = Schema<typeof foo, ComplexOption>;

const createComplexOption = (type: ComplexOption['type']): ComplexOption => ({
	type,
	validation(value) {
		return value !== undefined;
	},
});

const complexFoo: ComplexSchema = {
	baz: createComplexOption('optional'),
	bar: {
		function: createComplexOption('required'),
		object: {key: createComplexOption('readonly')},
		string: createComplexOption('readonly'),
		number: createComplexOption('readonly'),
		boolean: createComplexOption('readonly'),
		symbol: createComplexOption('readonly'),
		map: createComplexOption('readonly'),
		set: createComplexOption('readonly'),
		array: [createComplexOption('readonly'), createComplexOption('readonly'), createComplexOption('readonly')],
		tuple: [createComplexOption('readonly')],
		objectArray: [{key: createComplexOption('readonly')}, {key: createComplexOption('readonly')}, {key: createComplexOption('readonly')}],
		readonlyMap: createComplexOption('readonly'),
		readonlySet: createComplexOption('readonly'),
		readonlyArray: [createComplexOption('readonly'), createComplexOption('readonly'), createComplexOption('readonly')] as const,
		readonlyTuple: [createComplexOption('readonly')] as const,
		regExp: createComplexOption('readonly'),
		unknown: createComplexOption('readonly'),
		any: createComplexOption('readonly'),
	},
};

expectTypeOf(foo).not.toBeAssignableTo<ComplexSchema>();
expectTypeOf(complexFoo.baz).toBe<ComplexOption>();

const complexBarSchema = complexFoo.bar;
expectTypeOf(complexBarSchema.function).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.object).toBe<{key: ComplexOption}>();
expectTypeOf(complexBarSchema.string).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.number).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.boolean).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.symbol).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.map).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.set).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.array).toBe<ComplexOption[]>();
expectTypeOf(complexBarSchema.tuple).toBe<[ComplexOption]>();
expectTypeOf(complexBarSchema.objectArray).toBe<Array<{key: ComplexOption}>>();
expectTypeOf(complexBarSchema.readonlyMap).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.readonlySet).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.readonlyArray).toBe<readonly ComplexOption[]>();
expectTypeOf(complexBarSchema.readonlyTuple).toBe<readonly [ComplexOption]>();
expectTypeOf(complexBarSchema.regExp).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.unknown).toBe<ComplexOption>();
expectTypeOf(complexBarSchema.any).toBe<ComplexOption>();

// With Options and `recurseIntoArrays` set to `false`
type FooSchemaWithOptionsNoRecurse = Schema<typeof foo, FooOption, {recurseIntoArrays: false}>;

const fooSchemaWithOptionsNoRecurse: FooSchemaWithOptionsNoRecurse = {
	baz: 'A',
	bar: {
		function: 'A',
		object: {key: 'A'},
		string: 'A',
		number: 'A',
		boolean: 'A',
		symbol: 'A',
		map: 'A',
		set: 'A',
		array: 'A',
		tuple: 'A',
		objectArray: 'A',
		readonlyMap: 'A',
		readonlySet: 'A',
		readonlyArray: 'A',
		readonlyTuple: 'A',
		regExp: 'A',
		unknown: 'A',
		any: 'A',
	},
};

expectTypeOf(foo).not.toBeAssignableTo<FooSchemaWithOptionsNoRecurse>();
expectTypeOf<{key: 'value'}>().not.toBeAssignableTo<FooSchemaWithOptionsNoRecurse>();
expectTypeOf(new Date()).not.toBeAssignableTo<FooSchemaWithOptionsNoRecurse>();
expectTypeOf(fooSchemaWithOptionsNoRecurse.baz).toBe<FooOption>();

const barSchemaWithOptionsNoRecurse = fooSchemaWithOptionsNoRecurse.bar;
expectTypeOf(barSchemaWithOptionsNoRecurse.function).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.object).toBe<{key: FooOption}>();
expectTypeOf(barSchemaWithOptionsNoRecurse.string).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.number).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.boolean).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.symbol).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.map).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.set).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.array).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.tuple).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.objectArray).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.readonlyMap).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.readonlySet).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.readonlyArray).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.readonlyTuple).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.regExp).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.unknown).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsNoRecurse.any).toBe<FooOption>();

// With Options and `recurseIntoArrays` set to `true`
type FooSchemaWithOptionsRecurse = Schema<typeof foo, FooOption, {recurseIntoArrays: true}>;

const fooSchemaWithOptionsRecurse: FooSchemaWithOptionsRecurse = {
	baz: 'A',
	bar: {
		function: 'A',
		object: {key: 'A'},
		string: 'A',
		number: 'A',
		boolean: 'A',
		symbol: 'A',
		map: 'A',
		set: 'A',
		array: ['A', 'A', 'A'],
		tuple: ['A'],
		objectArray: [{key: 'A'}, {key: 'A'}, {key: 'A'}],
		readonlyMap: 'A',
		readonlySet: 'A',
		readonlyArray: ['A', 'A', 'A'] as const,
		readonlyTuple: ['A'] as const,
		regExp: 'A',
		unknown: 'A',
		any: 'A',
	},
};

expectTypeOf(foo).not.toBeAssignableTo<FooSchemaWithOptionsRecurse>();
expectTypeOf<{key: 'value'}>().not.toBeAssignableTo<FooSchemaWithOptionsRecurse>();
expectTypeOf(new Date()).not.toBeAssignableTo<FooSchemaWithOptionsRecurse>();
expectTypeOf(fooSchema.baz).toBe<FooOption>();

const barSchemaWithOptionsRecurse = fooSchemaWithOptionsRecurse.bar;
expectTypeOf(barSchemaWithOptionsRecurse.function).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.object).toBe<{key: FooOption}>();
expectTypeOf(barSchemaWithOptionsRecurse.string).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.number).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.boolean).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.symbol).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.map).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.set).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.array).toBe<FooOption[]>();
expectTypeOf(barSchemaWithOptionsRecurse.tuple).toBe<[FooOption]>();
expectTypeOf(barSchemaWithOptionsRecurse.objectArray).toBe<Array<{key: FooOption}>>();
expectTypeOf(barSchemaWithOptionsRecurse.readonlyMap).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.readonlySet).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.readonlyArray).toBe<readonly FooOption[]>();
expectTypeOf(barSchemaWithOptionsRecurse.readonlyTuple).toBe<readonly [FooOption]>();
expectTypeOf(barSchemaWithOptionsRecurse.regExp).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.unknown).toBe<FooOption>();
expectTypeOf(barSchemaWithOptionsRecurse.any).toBe<FooOption>();

// Non recursives
expectTypeOf<Schema<string, number>>().toBe<number>();
expectTypeOf<Schema<boolean, string>>().toBe<string>();
expectTypeOf<Schema<'a' | 'b', 'c'>>().toBe<'c'>();
expectTypeOf<Schema<number, string | null>>().toBe<string | null>();
expectTypeOf<Schema<null | undefined, false>>().toBe<false>();

expectTypeOf<Schema<Date, {date: Date}>>().toBe<{date: Date}>();
expectTypeOf<Schema<RegExp, string>>().toBe<string>();
expectTypeOf<Schema<Map<string, string>, Set<number>>>().toBe<Set<number>>();
expectTypeOf<Schema<ReadonlyMap<string, string>, Record<string, number>>>().toBe<Record<string, number>>();
expectTypeOf<Schema<Set<string>, Map<string, number>>>().toBe<Map<string, number>>();
expectTypeOf<Schema<ReadonlySet<string>, readonly number[]>>().toBe<readonly number[]>();
expectTypeOf<Schema<(a: number, b: number) => void, {fn: unknown}>>().toBe<{fn: unknown}>();
expectTypeOf<Schema<(a: number, b: number) => void, (a: string, b: string) => void>>().toBe<(a: string, b: string) => void>();
expectTypeOf<Schema<Map<string, number> | Set<number> | Date, {a: string}>>().toBe<{a: string}>();

// Objects
expectTypeOf<Schema<{a: number}, bigint>>().toBe<{a: bigint}>();
expectTypeOf<Schema<{a: {b: number}; c: string}, bigint>>().toBe<{a: {b: bigint}; c: bigint}>();
expectTypeOf<Schema<{a: {b: string[]}; c: {d: {e: string} | {f: boolean | {g: number}}; h: {i: {j: {k: string}}}}}, bigint>>().toBe<{a: {b: bigint[]}; c: {d: {e: bigint} | {f: bigint | {g: bigint}}; h: {i: {j: {k: bigint}}}}}>();

// Preserves readonly and optional modifiers
expectTypeOf<Schema<{readonly a: string}, number>>().toBe<{readonly a: number}>();
expectTypeOf<Schema<{a?: string}, number>>().toBe<{a?: number}>();
expectTypeOf<Schema<{a?: {readonly b?: string}}, number>>().toBe<{a?: {readonly b?: number}}>();
expectTypeOf<Schema<{0?: {readonly 1?: string}}, number>>().toBe<{0?: {readonly 1?: number}}>();
expectTypeOf<Schema<{readonly a: string; b?: string; readonly c?: {readonly d?: {e?: number} | {readonly f: number}; g: {h: {readonly i: bigint}}}}, boolean>>().toBe<{readonly a: boolean; b?: boolean; readonly c?: {readonly d?: {e?: boolean} | {readonly f: boolean}; g: {h: {readonly i: boolean}}}}>();

// Caveat: Optional properties with explicit `undefined` don't behave differently from optional properties without explicit `undefined`.
// For example, `Schema<{a?: {b?: number} | undefined}, string>` gives `{a?: {b?: string}}` and not `{a?: {b?: string} | string}`
expectTypeOf<Schema<{a?: {b?: number} | undefined}, string>>().toBe<{a?: {b?: string}}>();
expectTypeOf<Schema<{a: {b?: number} | undefined}, string>>().toBe<{a: string | {b?: string}}>();

// Index signatures
expectTypeOf<Schema<Record<string, string>, number>>().toBe<Record<string, number>>();
expectTypeOf<Schema<Record<string, {a: string; b: number}>, boolean>>().toBe<Record<string, {a: boolean; b: boolean}>>();
expectTypeOf<Schema<Map<string, string> | Record<string, string>, Set<number>>>().toBe<Set<number> | Record<string, Set<number>>>();
expectTypeOf<Schema<{[K: string]: string; a: string; b: string}, number>>().toBe<{[K: string]: number; a: number; b: number}>();
expectTypeOf<Schema<{[K: number]: boolean; 0: boolean; 1: boolean}, string>>().toBe<{[K: number]: string; 0: string; 1: string}>();

// Edge cases
expectTypeOf<Schema<{}, number>>().toBe<{}>();
expectTypeOf<Schema<never, bigint>>().toBe<bigint>();
expectTypeOf<Schema<any, {a: {b: {c: string}}}>>().toBe<{a: {b: {c: string}}}>();

// Unions
expectTypeOf<Schema<{a: number} | {b: {c: number}}, string>>().toBe<{a: string} | {b: {c: string}}>();
expectTypeOf<Schema<{a: {b: string} | {c: {d: number}}}, null>>().toBe<{a: {b: null} | {c: {d: null}}}>();
expectTypeOf<Schema<{a: string | {b: string}}, null>>().toBe<{a: {b: null} | null}>();
expectTypeOf<Schema<string[] | Set<string> | {a: string}, {a: string}>>().toBe<Array<{a: string}> | {a: {a: string}} | {a: string}>();
expectTypeOf<Schema<Map<string, string> | Set<string> | Date | RegExp | (() => number), {readonly a?: string}>>().toBe<{readonly a?: string}>();

// Arrays
expectTypeOf<Schema<[string, number], bigint>>().toBe<[bigint, bigint]>();
expectTypeOf<Schema<[{a: string}, number], bigint>>().toBe<[{a: bigint}, bigint]>();
expectTypeOf<Schema<[string, number?, boolean?], Set<string>>>().toBe<[Set<string>, (Set<string>)?, Set<string>?]>();
expectTypeOf<Schema<[string, {a: number}?, boolean?], string>>().toBe<[string, {a: string}?, string?]>();
expectTypeOf<Schema<[string, number, ...string[]], null | undefined>>().toBe<[null | undefined, null | undefined, ...Array<null | undefined>]>();
expectTypeOf<Schema<[string?, string?], {a?: string}>>().toBe<[({a?: string})?, ({a?: string})?]>();
expectTypeOf<Schema<[string, number?, ({a: {b: string}})?, ...string[]], bigint>>().toBe<[bigint, bigint?, ({a: {b: bigint}})?, ...bigint[]]>();
expectTypeOf<Schema<[string?, number?, ...Array<{a?: {b: string}}>], bigint>>().toBe<[bigint?, bigint?, ...Array<{a?: {b: bigint}}>]>();
expectTypeOf<Schema<[...string[], string, number], bigint>>().toBe<[...bigint[], bigint, bigint]>();
expectTypeOf<Schema<[string, ...string[], string, number], bigint>>().toBe<[bigint, ...bigint[], bigint, bigint]>();
expectTypeOf<Schema<[string, [string, string], ...Array<[string, boolean?]>], bigint>>().toBe<[bigint, [bigint, bigint], ...Array<[bigint, bigint?]>]>();
expectTypeOf<Schema<[number, [number, Array<{a: number}>], ...Array<[number, ...(Array<{a: number}>)]>], `${number}`>>().toBe<[`${number}`, [`${number}`, Array<{a: `${number}`}>], ...Array<[`${number}`, ...(Array<{a: `${number}`}>)]>]>();
expectTypeOf<Schema<[x: bigint, y: bigint], number[]>>().toBe<[x: number[], y: number[]]>();
expectTypeOf<Schema<[x: [x1: number, x2: number], y: [y1: number, y2: number]], string>>().toBe<[x: [x1: string, x2: string], y: [y1: string, y2: string]]>();
// Caveat: Optional properties with explicit `undefined` don't behave differently from optional properties without explicit `undefined`.
// For example, `Schema<[({a: number} | undefined)?], bigint>` gives `[{a: bigint}?]` and not `[({a: bigint} | bigint)?]`
expectTypeOf<Schema<[({a: number} | undefined)?], bigint>>().toBe<[{a: bigint}?]>();
expectTypeOf<Schema<[({a: number} | undefined)], bigint>>().toBe<[(bigint | {a: bigint})]>();

// === recurseIntoArrays: false ===
expectTypeOf<Schema<number[], string, {recurseIntoArrays: false}>>().toBe<string>();
expectTypeOf<Schema<[string, string, string], number, {recurseIntoArrays: false}>>().toBe<number>();
expectTypeOf<Schema<[string, string, string] | {a: string[]; b: string}, number, {recurseIntoArrays: false}>>().toBe<number | {a: number; b: number}>();
expectTypeOf<Schema<{a: number[]; b: [string, string]}, 'a', {recurseIntoArrays: false}>>().toBe<{a: 'a'; b: 'a'}>();
expectTypeOf<Schema<{a: {b: {c: {d: string[]}}}}, {e: string[]}, {recurseIntoArrays: false}>>().toBe<{a: {b: {c: {d: {e: string[]}}}}}>();

// `any` and `unknown` are treated as leaf values
expectTypeOf<Schema<{a: unknown}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: any}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<unknown, number>>().toBe<number>();
expectTypeOf<Schema<any, number>>().toBe<number>();

// Binary and weak-collection built-ins are leaf values, not structures to recurse into.
expectTypeOf<Schema<{a: ArrayBuffer}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: SharedArrayBuffer}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: DataView}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: Uint8Array}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: Float64Array}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: WeakMap<object, number>}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: WeakSet<object>}, number>>().toBe<{a: number}>();
expectTypeOf<Schema<{a: {b: ArrayBuffer}}, number>>().toBe<{a: {b: number}}>();

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still walked.
expectTypeOf<Schema<{a: {name: string; message: string; code: number}}, number>>().toBe<{a: {name: number; message: number; code: number}}>();

// A leaf that cannot be walked is still a leaf, so `any` and `unknown` are replaced by the value type. A member of type `never` is the one exception: it is a bottom type with no shape to replace, and the source's `never` branch is about the whole input rather than each member.
declare const topTypesSchema: Schema<{a: any; b: unknown; c: null}, string>;
expectTypeOf(topTypesSchema).toBe<{a: string; b: string; c: string}>();

declare const anySchema: Schema<any, string>;
expectTypeOf(anySchema).toBe<string>();

declare const neverSchema: Schema<never, string>;
expectTypeOf(neverSchema).toBe<string>();

declare const neverMemberSchema: Schema<{a: never; b: string}, string>;
expectTypeOf(neverMemberSchema).toBe<{a: never; b: string}>();

// A member nested two levels down is reached, and so is one behind an array.
declare const nestedSchema: Schema<{a: {b: {c: number}; d: ReadonlyArray<{e: boolean}>}}, string>;
expectTypeOf(nestedSchema).toBe<{a: {b: {c: string}; d: ReadonlyArray<{e: string}>}}>();

// The modifiers of every member are kept, since only the value types are replaced.
declare const modifiersSchema: Schema<{readonly a?: {b: number}; c: ReadonlyArray<{d: string}>}, number>;
expectTypeOf(modifiersSchema).toBe<{readonly a?: {b: number}; c: ReadonlyArray<{d: number}>}>();

// A `PromiseLike` is a single value, like a `Promise`.
expectTypeOf<Schema<{a: PromiseLike<string>}, number>>().toBe<{a: number}>();
