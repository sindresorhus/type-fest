import {expectTypeOf} from 'nz';
import type {JsonValue, Schema, SchemaOptions} from '../index.d.ts';

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

// Recursive arrays should stay lazy while their leaf values are replaced.
type RecursiveData = string | RecursiveData[];
type RecursiveMask = boolean | RecursiveMask[];
expectTypeOf<Schema<RecursiveData, boolean>>().toBeAssignableTo<RecursiveMask>();
expectTypeOf<RecursiveMask>().toBeAssignableTo<Schema<RecursiveData, boolean>>();

type JsonMask = boolean | JsonMask[] | readonly JsonMask[] | {[key: string]: JsonMask};
expectTypeOf<Schema<JsonValue, boolean>>().toBeAssignableTo<JsonMask>();
expectTypeOf<JsonMask>().toBeAssignableTo<Schema<JsonValue, boolean>>();
expectTypeOf<Schema<RecursiveData, boolean, {recurseIntoArrays: false}>>().toBe<boolean>();
type ReadonlyRecursiveData = string | readonly ReadonlyRecursiveData[];
type ReadonlyRecursiveMask = boolean | readonly ReadonlyRecursiveMask[];
expectTypeOf<Schema<ReadonlyRecursiveData, boolean>>().toBeAssignableTo<ReadonlyRecursiveMask>();
expectTypeOf<ReadonlyRecursiveMask>().toBeAssignableTo<Schema<ReadonlyRecursiveData, boolean>>();
type RecursiveEntry = {readonly entries?: RecursiveData[]; value: RecursiveData | undefined};
expectTypeOf<Schema<RecursiveEntry, boolean>>().toBe<{readonly entries?: RecursiveMask[]; value: RecursiveMask}>();
expectTypeOf<Schema<readonly [first?: {value?: string}, ...rest: Array<{value?: number}>], boolean>>().toBe<readonly [first?: {value?: boolean}, ...rest: Array<{value?: boolean}>]>();
expectTypeOf<Schema<readonly [...Array<{value?: number}>, {readonly last: string}], boolean>>().toBe<readonly [...Array<{value?: boolean}>, {readonly last: boolean}]>();
expectTypeOf<Schema<any[], boolean>>().toBe<boolean[]>();
expectTypeOf<Schema<readonly unknown[], boolean>>().toBe<readonly boolean[]>();
expectTypeOf<Schema<never[], boolean>>().toBe<never[]>();
expectTypeOf<Schema<readonly [], boolean>>().toBe<readonly []>();

// Declared optional properties lose their access-time undefined, while index-signature values keep it.
type IndexedSettings = {
	[name: string]: {enabled: boolean} | undefined;
	readonly primary?: {enabled: boolean} | undefined;
};
expectTypeOf<Schema<IndexedSettings, boolean>>().toBe<{
	[name: string]: boolean | {enabled: boolean};
	readonly primary?: {enabled: boolean};
}>();
expectTypeOf<Schema<Record<string, {enabled: string} | undefined>, boolean>>()
	.toBe<Record<string, boolean | {enabled: boolean}>>();
expectTypeOf<Schema<{[key: number]: {value: string} | undefined; readonly 0?: {value: string} | undefined}, boolean>>()
	.toBe<{[key: number]: boolean | {value: boolean}; readonly 0?: {value: boolean}}>();

declare const settingsKey: unique symbol;
expectTypeOf<Schema<{[key: symbol]: {value: string} | undefined; [settingsKey]?: {value: string} | undefined}, boolean>>()
	.toBe<{[key: symbol]: boolean | {value: boolean}; [settingsKey]?: {value: boolean}}>();

// Required undefined is a leaf; optional undefined is excluded before recursing into the property.
expectTypeOf<Schema<{required: {child?: string} | undefined; optional?: {child?: string} | undefined}, boolean>>()
	.toBe<{required: boolean | {child?: boolean}; optional?: {child?: boolean}}>();
expectTypeOf<{optional: undefined}>().not.toBeAssignableTo<Schema<{optional?: {child: string} | undefined}, boolean>>();
expectTypeOf<Schema<readonly [required: {child?: string} | undefined, optional?: {child?: number} | undefined, ...rest: Array<{value: string} | undefined>], boolean>>()
	.toBe<readonly [required: boolean | {child?: boolean}, optional?: {child?: boolean}, ...rest: Array<boolean | {value: boolean}>]>();

// A generic options object still allows known object fields to be read through the result.
function _readKnownSchema<Options extends {recurseIntoArrays?: boolean}>(value: Schema<{readonly settings?: {enabled: string}}, boolean, Options>): {readonly settings?: {enabled: boolean}} {
	return value;
}

declare function makeSchema<Input>(input: Input): Schema<Input, boolean>;
expectTypeOf(makeSchema({settings: {enabled: 'yes'}})).toBe<{settings: {enabled: boolean}}>();
expectTypeOf<Schema<{required: any; optional?: unknown; impossible?: never}, boolean>>()
	.toBe<{required: boolean; optional?: boolean; impossible?: never}>();

type RecursiveSettings = {enabled: boolean; readonly children?: readonly RecursiveSettings[] | undefined};
const recursiveSettingsMask: Schema<RecursiveSettings, boolean> = {
	enabled: true,
	children: [{enabled: false, children: [{enabled: true}]}],
};
expectTypeOf(recursiveSettingsMask.children?.[0]?.enabled).toBe<boolean | undefined>();

// Named object types become sealed schemas while preserving their field and tuple modifiers.
declare class NamedSchemaInput {
	readonly coordinates: readonly [first: string, last?: {label: string}];
	metadata?: {enabled: boolean} | undefined;
}

declare const namedSchema: Schema<NamedSchemaInput, 'validate'>;
expectTypeOf(namedSchema).toBe<{readonly coordinates: readonly ['validate', {label: 'validate'}?]; metadata?: {enabled: 'validate'}}>();
expectTypeOf(namedSchema).toBeAssignableTo<Record<string, unknown>>();
// @ts-expect-error A valid replacement still cannot overwrite the readonly tuple field.
namedSchema.coordinates = ['validate'];
// @ts-expect-error A fixed tuple position stays readonly too.
namedSchema.coordinates[0] = 'validate';

function readSchemaRule<Value, Options extends SchemaOptions>(schema: Schema<{id: string; metadata?: {enabled: boolean}}, Value, Options>): Value {
	return schema.id;
}

function createSchemaRule<Value, Options extends SchemaOptions>(rule: Value): Schema<{id: string}, Value, Options> {
	return {id: rule};
}

declare function validationSchema<const Input, const Value>(input: Input, rule: Value): Schema<Input, Value>;
const inferredValidationSchema = validationSchema({settings: {enabled: true}, rows: [{label: 'first'}]}, 'validate');
expectTypeOf(inferredValidationSchema).toBe<{readonly settings: {readonly enabled: 'validate'}; readonly rows: readonly [{readonly label: 'validate'}]}>();

// Replacement objects stay intact at recursive leaves and beneath symbol or pattern keys.
type ValidationRule = {readonly kind: 'rule'};
type RecursiveForm = {name: string; children: RecursiveForm[]};
const recursiveObjectSchema: Schema<RecursiveForm, ValidationRule> = {
	name: {kind: 'rule'},
	children: [{name: {kind: 'rule'}, children: []}],
};
// @ts-expect-error Nested leaves require the replacement rule, not the input's string value.
recursiveObjectSchema.children.push({name: 'original', children: []});
declare const ruleKey: unique symbol;
declare const indexedRuleSchema: Schema<{readonly [ruleKey]?: {label: string}; [key: `rule-${string}`]: {enabled: boolean}}, ValidationRule>;
expectTypeOf(indexedRuleSchema[ruleKey]?.label).toBe<ValidationRule | undefined>();
expectTypeOf(indexedRuleSchema['rule-main']?.enabled).toBe<ValidationRule | undefined>();

// An uncertain recursion option must keep both complete array strategies.
const nonRecursiveArrayRule: Schema<string[], 'rule', {recurseIntoArrays: boolean}> = 'rule';
expectTypeOf<Schema<string[], 'rule', {recurseIntoArrays: boolean}>>().toBe<'rule' | Array<'rule'>>();
declare const recurseIntoArrays: boolean;
const uncertainArraySchema: Schema<{rows: string[]; ids: number[]}, 'rule', {recurseIntoArrays: boolean}> = recurseIntoArrays
	? {rows: ['rule'], ids: ['rule']}
	: {rows: 'rule', ids: 'rule'};

// Optional flags include the default strategy and every explicitly allowed choice.
const optionalArrayRule: Schema<string[], 'rule', {recurseIntoArrays?: boolean}> = 'rule';
const optionalDisabledDefault: Schema<string[], 'rule', {recurseIntoArrays?: false}> = ['rule'];

const optionalDisabledRule: Schema<string[], 'rule', {recurseIntoArrays?: false}> = 'rule';
type CorrelatedArrayRule = {rows: 'rule'; nested: {ids: 'rule'}} | {rows: Array<'rule'>; nested: {ids: Array<'rule'>}};
expectTypeOf<Schema<{rows: string[]; nested: {ids: number[]}}, 'rule', {recurseIntoArrays?: boolean}>>().toBe<CorrelatedArrayRule>();
// @ts-expect-error The same recursion strategy applies to arrays at every depth.
const mixedArrayRules: Schema<{rows: string[]; nested: {ids: number[]}}, 'rule', {recurseIntoArrays: boolean}> = {rows: 'rule', nested: {ids: ['rule']}};

function chooseArrayRule<Value>(rule: Value, recurse: boolean): Schema<string[], Value, {recurseIntoArrays: boolean}> {
	return recurse ? [rule] : rule;
}

function createOptionalFlagRule<Value, Flag extends boolean>(rule: Value): Schema<{readonly id: string}, Value, {recurseIntoArrays?: Flag}> {
	return {id: rule};
}

function readOptionalFlagRule<Value, Flag extends boolean>(schema: Schema<{readonly id: string}, Value, {recurseIntoArrays?: Flag}>): Value {
	return schema.id;
}

declare function validationSchemaWithOptions<const Input, const Value, const Options extends SchemaOptions>(input: Input, rule: Value, options: Options): Schema<Input, Value, Options>;
declare const optionalRecursionOptions: {recurseIntoArrays?: boolean};
const inferredOptionalSchema = validationSchemaWithOptions({rows: ['first'], nested: {ids: [1]}}, 'rule', optionalRecursionOptions);
expectTypeOf(inferredOptionalSchema).toBe<{readonly rows: readonly ['rule']; readonly nested: {readonly ids: readonly ['rule']}} | {readonly rows: 'rule'; readonly nested: {readonly ids: 'rule'}}>();
// @ts-expect-error Choosing either strategy preserves the input property's readonly modifier.
inferredOptionalSchema.rows = 'rule';
