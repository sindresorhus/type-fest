import {expectNotAssignable, expectType} from 'tsd';
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
		regExp: /.*/g,
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
	},
};

expectNotAssignable<FooSchema>(foo);
expectNotAssignable<FooSchema>({key: 'value'});
expectNotAssignable<FooSchema>(new Date());
expectType<FooOption>(fooSchema.baz);

const barSchema = fooSchema.bar;
expectType<FooOption>(barSchema.function);
expectType<{key: FooOption}>(barSchema.object);
expectType<FooOption>(barSchema.string);
expectType<FooOption>(barSchema.number);
expectType<FooOption>(barSchema.boolean);
expectType<FooOption>(barSchema.symbol);
expectType<FooOption>(barSchema.map);
expectType<FooOption>(barSchema.set);
expectType<FooOption[]>(barSchema.array);
expectType<[FooOption]>(barSchema.tuple);
expectType<Array<{key: FooOption}>>(barSchema.objectArray);
expectType<FooOption>(barSchema.readonlyMap);
expectType<FooOption>(barSchema.readonlySet);
expectType<readonly FooOption[]>(barSchema.readonlyArray);
expectType<readonly [FooOption]>(barSchema.readonlyTuple);
expectType<FooOption>(barSchema.regExp);

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
	},
};

expectNotAssignable<ComplexSchema>(foo);
expectType<ComplexOption>(complexFoo.baz);

const complexBarSchema = complexFoo.bar;
expectType<ComplexOption>(complexBarSchema.function);
expectType<{key: ComplexOption}>(complexBarSchema.object);
expectType<ComplexOption>(complexBarSchema.string);
expectType<ComplexOption>(complexBarSchema.number);
expectType<ComplexOption>(complexBarSchema.boolean);
expectType<ComplexOption>(complexBarSchema.symbol);
expectType<ComplexOption>(complexBarSchema.map);
expectType<ComplexOption>(complexBarSchema.set);
expectType<ComplexOption[]>(complexBarSchema.array);
expectType<[ComplexOption]>(complexBarSchema.tuple);
expectType<Array<{key: ComplexOption}>>(complexBarSchema.objectArray);
expectType<ComplexOption>(complexBarSchema.readonlyMap);
expectType<ComplexOption>(complexBarSchema.readonlySet);
expectType<readonly ComplexOption[]>(complexBarSchema.readonlyArray);
expectType<readonly [ComplexOption]>(complexBarSchema.readonlyTuple);
expectType<ComplexOption>(complexBarSchema.regExp);

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
	},
};

expectNotAssignable<FooSchemaWithOptionsNoRecurse>(foo);
expectNotAssignable<FooSchemaWithOptionsNoRecurse>({key: 'value'});
expectNotAssignable<FooSchemaWithOptionsNoRecurse>(new Date());
expectType<FooOption>(fooSchemaWithOptionsNoRecurse.baz);

const barSchemaWithOptionsNoRecurse = fooSchemaWithOptionsNoRecurse.bar;
expectType<FooOption>(barSchemaWithOptionsNoRecurse.function);
expectType<{key: FooOption}>(barSchemaWithOptionsNoRecurse.object);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.string);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.number);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.boolean);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.symbol);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.map);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.set);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.array);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.tuple);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.objectArray);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.readonlyMap);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.readonlySet);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.readonlyArray);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.readonlyTuple);
expectType<FooOption>(barSchemaWithOptionsNoRecurse.regExp);

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
	},
};

expectNotAssignable<FooSchemaWithOptionsRecurse>(foo);
expectNotAssignable<FooSchemaWithOptionsRecurse>({key: 'value'});
expectNotAssignable<FooSchemaWithOptionsRecurse>(new Date());
expectType<FooOption>(fooSchema.baz);

const barSchemaWithOptionsRecurse = fooSchemaWithOptionsRecurse.bar;
expectType<FooOption>(barSchemaWithOptionsRecurse.function);
expectType<{key: FooOption}>(barSchemaWithOptionsRecurse.object);
expectType<FooOption>(barSchemaWithOptionsRecurse.string);
expectType<FooOption>(barSchemaWithOptionsRecurse.number);
expectType<FooOption>(barSchemaWithOptionsRecurse.boolean);
expectType<FooOption>(barSchemaWithOptionsRecurse.symbol);
expectType<FooOption>(barSchemaWithOptionsRecurse.map);
expectType<FooOption>(barSchemaWithOptionsRecurse.set);
expectType<FooOption[]>(barSchemaWithOptionsRecurse.array);
expectType<[FooOption]>(barSchemaWithOptionsRecurse.tuple);
expectType<Array<{key: FooOption}>>(barSchemaWithOptionsRecurse.objectArray);
expectType<FooOption>(barSchemaWithOptionsRecurse.readonlyMap);
expectType<FooOption>(barSchemaWithOptionsRecurse.readonlySet);
expectType<readonly FooOption[]>(barSchemaWithOptionsRecurse.readonlyArray);
expectType<readonly [FooOption]>(barSchemaWithOptionsRecurse.readonlyTuple);
expectType<FooOption>(barSchemaWithOptionsRecurse.regExp);

// Non recursives
expectType<number>({} as Schema<string, number>);
expectType<string>({} as Schema<boolean, string>);
expectType<'c'>({} as Schema<'a' | 'b', 'c'>);
expectType<string | null>({} as Schema<number, string | null>);
expectType<false>({} as Schema<null | undefined, false>);

expectType<{date: Date}>({} as Schema<Date, {date: Date}>);
expectType<string>({} as Schema<RegExp, string>);
expectType<Set<number>>({} as Schema<Map<string, string>, Set<number>>);
expectType<Record<string, number>>({} as Schema<ReadonlyMap<string, string>, Record<string, number>>);
expectType<Map<string, number>>({} as Schema<Set<string>, Map<string, number>>);
expectType<readonly number[]>({} as Schema<ReadonlySet<string>, readonly number[]>);
expectType<{fn: unknown}>({} as Schema<(a: number, b: number) => void, {fn: unknown}>);
expectType<(a: string, b: string) => void>({} as Schema<(a: number, b: number) => void, (a: string, b: string) => void>);
expectType<{a: string}>({} as Schema<Map<string, number> | Set<number> | Date, {a: string}>);

// Objects
expectType<{a: bigint}>({} as Schema<{a: number}, bigint>);
expectType<{a: {b: bigint}; c: bigint}>({} as Schema<{a: {b: number}; c: string}, bigint>);
expectType<{a: {b: bigint[]}; c: {d: {e: bigint} | {f: {g: bigint} | bigint}; h: {i: {j: {k: bigint}}}}}>(
	{} as Schema<{a: {b: string[]}; c: {d: {e: string} | {f: {g: number} | boolean}; h: {i: {j: {k: string}}}}}, bigint>,
);

// Preserves readonly and optional modifiers
expectType<{readonly a: number}>({} as Schema<{readonly a: string}, number>);
expectType<{a?: number}>({} as Schema<{a?: string}, number>);
expectType<{a?: {readonly b?: number}}>({} as Schema<{a?: {readonly b?: string}}, number>);
expectType<{0?: {readonly 1?: number}}>({} as Schema<{0?: {readonly 1?: string}}, number>);
expectType<{readonly a: boolean; b?: boolean; readonly c?: {readonly d?: {e?: boolean} | {readonly f: boolean}; g: {h: {readonly i: boolean}}}}>(
	{} as Schema<{readonly a: string; b?: string; readonly c?: {readonly d?: {e?: number} | {readonly f: number}; g: {h: {readonly i: bigint}}}}, boolean>,
);

// Caveat: Optional properties with explicit `undefined` don't behave differently from optional properties without explicit `undefined`.
// For example, `Schema<{a?: {b?: number} | undefined}, string>` gives `{a?: {b?: string}}` and not `{a?: {b?: string} | string}`
expectType<{a?: {b?: string}}>({} as Schema<{a?: {b?: number} | undefined}, string>);
expectType<{a: {b?: string} | string}>({} as Schema<{a: {b?: number} | undefined}, string>);

// Index signatures
expectType<Record<string, number>>({} as Schema<Record<string, string>, number>);
expectType<Record<string, {a: boolean; b: boolean}>>({} as Schema<Record<string, {a: string; b: number}>, boolean>);
expectType<Set<number> | Record<string, Set<number>>>({} as Schema<Map<string, string> | Record<string, string>, Set<number>>);
expectType<{[K: string]: number; a: number; b: number}>({} as Schema<{[K: string]: string; a: string; b: string}, number>);
expectType<{[K: number]: string; 0: string; 1: string}>({} as Schema<{[K: number]: boolean; 0: boolean; 1: boolean}, string>);

// Edge cases
expectType<{}>({} as Schema<{}, number>);
expectType<bigint>({} as Schema<never, bigint>);
expectType<{a: {b: {c: string}}}>({} as Schema<any, {a: {b: {c: string}}}>);

// Unions
expectType<{a: string} | {b: {c: string}}>({} as Schema<{a: number} | {b: {c: number}}, string>);
expectType<{a: {b: null} | {c: {d: null}}}>({} as Schema<{a: {b: string} | {c: {d: number}}}, null>);
expectType<{a: {b: null} | null}>({} as Schema<{a: {b: string} | string}, null>);
expectType<{a: {a: string}} | Array<{a: string}> | {a: string}>(
	{} as Schema<{a: string} | string[] | Set<string>, {a: string}>,
);
expectType<{readonly a?: string}>(
	{} as Schema<Map<string, string> | Set<string> | Date | RegExp | (() => number), {readonly a?: string}>,
);

// Arrays
expectType<[bigint, bigint]>({} as Schema<[string, number], bigint>);
expectType<[{a: bigint}, bigint]>({} as Schema<[{a: string}, number], bigint>);
expectType<[Set<string>, (Set<string>)?, Set<string>?]>({} as Schema<[string, number?, boolean?], Set<string>>);
expectType<[string, {a: string}?, string?]>({} as Schema<[string, {a: number}?, boolean?], string>);
expectType<[null | undefined, null | undefined, ...Array<null | undefined>]>({} as Schema<[string, number, ...string[]], null | undefined>);
expectType<[({a?: string})?, ({a?: string})?]>({} as Schema<[string?, string?], {a?: string}>);
expectType<[bigint, bigint?, ({a: {b: bigint}})?, ...bigint[]]>(
	{} as Schema<[string, number?, ({a: {b: string}})?, ...string[]], bigint>,
);
expectType<[bigint?, bigint?, ...Array<{a?: {b: bigint}}>]>({} as Schema<[string?, number?, ...Array<{a?: {b: string}}>], bigint>);
expectType<[...bigint[], bigint, bigint]>({} as Schema<[...string[], string, number], bigint>);
expectType<[bigint, ...bigint[], bigint, bigint]>({} as Schema<[string, ...string[], string, number], bigint>);
expectType<[bigint, [bigint, bigint], ...Array<[bigint, bigint?]>]>(
	{} as Schema<[string, [string, string], ...Array<[string, boolean?]>], bigint>,
);
expectType<[`${number}`, [`${number}`, Array<{a: `${number}`}>], ...Array<[`${number}`, ...(Array<{a: `${number}`}>)]>]>(
	{} as Schema<[number, [number, Array<{a: number}>], ...Array<[number, ...(Array<{a: number}>)]>], `${number}`>,
);
expectType<[x: number[], y: number[]]>({} as Schema<[x: bigint, y: bigint], number[]>);
expectType<[x: [x1: string, x2: string], y: [y1: string, y2: string]]>({} as Schema<[x: [x1: number, x2: number], y: [y1: number, y2: number]], string>);
// Caveat: Optional properties with explicit `undefined` don't behave differently from optional properties without explicit `undefined`.
// For example, `Schema<[({a: number} | undefined)?], bigint>` gives `[{a: bigint}?]` and not `[({a: bigint} | bigint)?]`
expectType<[{a: bigint}?]>({} as Schema<[({a: number} | undefined)?], bigint>);
expectType<[({a: bigint} | bigint)]>({} as Schema<[({a: number} | undefined)], bigint>);

// === recurseIntoArrays: false ===
expectType<string>({} as Schema<number[], string, {recurseIntoArrays: false}>);
expectType<number>({} as Schema<[string, string, string], number, {recurseIntoArrays: false}>);
expectType<{a: number; b: number} | number>({} as Schema<{a: string[]; b: string} | [string, string, string], number, {recurseIntoArrays: false}>);
expectType<{a: 'a'; b: 'a'}>({} as Schema<{a: number[]; b: [string, string]}, 'a', {recurseIntoArrays: false}>);
expectType<{a: {b: {c: {d: {e: string[]}}}}}>({} as Schema<{a: {b: {c: {d: string[]}}}}, {e: string[]}, {recurseIntoArrays: false}>);
