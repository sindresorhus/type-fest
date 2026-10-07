import {expectType} from 'tsd';
import type {Paths} from '../source/paths.d.ts';
import type {SetNonNullableDeep} from '../source/set-non-nullable-deep.d.ts';

expectType<{a: number}>({} as SetNonNullableDeep<{a: number | null}, 'a'>);
expectType<{a: number}>({} as SetNonNullableDeep<{a: number | undefined}, 'a'>);
expectType<{a: number}>({} as SetNonNullableDeep<{a: number | null | undefined}, 'a'>);
expectType<{a?: number}>({} as SetNonNullableDeep<{a?: number | null}, 'a'>);
expectType<{a?: number}>({} as SetNonNullableDeep<{a?: number | undefined}, 'a'>);
expectType<{a?: number}>({} as SetNonNullableDeep<{a?: number | null | undefined}, 'a'>);

expectType<{a: number; b: {c: string}}>({} as SetNonNullableDeep<{a: number; b: {c: string | null}}, 'b.c'>);
expectType<{a: number; b: {c: string}}>({} as SetNonNullableDeep<{a: number; b: {c: string | undefined}}, 'b.c'>);
expectType<{a: number; b: {c: string}}>({} as SetNonNullableDeep<{a: number; b: {c: string | null | undefined}}, 'b.c'>);
expectType<{a: number; b: {c?: string}}>({} as SetNonNullableDeep<{a: number; b: {c?: string | null}}, 'b.c'>);
expectType<{a: number; b: {c?: string}}>({} as SetNonNullableDeep<{a: number; b: {c?: string | undefined}}, 'b.c'>);
expectType<{a: number; b: {c?: string}}>({} as SetNonNullableDeep<{a: number; b: {c?: string | null | undefined}}, 'b.c'>);

// Becomes `never` when the value is only `null` or `undefined`
expectType<{a: never}>({} as SetNonNullableDeep<{a: null | undefined}, 'a'>);
expectType<{a?: never}>({} as SetNonNullableDeep<{a?: null | undefined}, 'a'>);

// Ignores keys that are already non-nullable
expectType<{a: number}>({} as SetNonNullableDeep<{a: number}, 'a'>);
expectType<{readonly a?: number}>({} as SetNonNullableDeep<{readonly a?: number}, 'a'>);
expectType<{a?: number; b: {c: string}}>({} as SetNonNullableDeep<{a?: number; b: {c: string}}, 'b.c'>);
expectType<{a: number; readonly b?: {c?: string}}>({} as SetNonNullableDeep<{a: number; readonly b?: {c?: string}}, 'b.c'>);

// Removes nullables only from the specified keys, nullables in other paths are preserved
expectType<{a: number; b: {c: string | null | undefined} | null | undefined}>(
	{} as SetNonNullableDeep<{a: number | null | undefined; b: {c: string | null | undefined} | null | undefined}, 'a'>,
);
expectType<{a: number | null | undefined; b: {c: string | null | undefined}}>(
	{} as SetNonNullableDeep<{a: number | null | undefined; b: {c: string | null | undefined} | null | undefined}, 'b'>,
);
expectType<{a: number | null | undefined; b: {c: string} | null | undefined}>(
	{} as SetNonNullableDeep<{a: number | null | undefined; b: {c: string | null | undefined} | null | undefined}, 'b.c'>,
);
expectType<{a: {b: string}}>({} as SetNonNullableDeep<{a: {b: string | null} | null | undefined}, 'a' | 'a.b'>);
expectType<{a: {b: {c: string}} | null | undefined}>({} as SetNonNullableDeep<{a: {b: {c: string | undefined} | null} | null | undefined}, 'a.b' | 'a.b.c'>);
expectType<{a: {b: {c: string} | null}}>({} as SetNonNullableDeep<{a: {b: {c: string | undefined} | null} | null | undefined}, 'a' | 'a.b.c'>);
expectType<{a: {b?: {c: {d?: {e: number | string}; f: {g: boolean}} | undefined} | null; h: number | null}}>(
	{} as SetNonNullableDeep<
		{a: {b?: {c: {d?: {e: number | string} | null; f: {g: boolean | null}} | undefined} | null; h: number | null} | undefined},
	'a' | 'a.b.c.d' | 'a.b.c.f.g'
	>,
);

// Unions
expectType<{a: string} | {a?: number} | {a: boolean}>({} as SetNonNullableDeep<{a: string | null} | {a?: number | undefined} | {a: boolean | null | undefined}, 'a'>);
expectType<{a: string; b: number}>({} as SetNonNullableDeep<{a: string | null; b: number | undefined}, 'a' | 'b'>);
expectType<{a: string; b: {c: {d: {e: number}} | null} | undefined}>(
	{} as SetNonNullableDeep<{a: string | null; b: {c: {d: {e: number | undefined}} | null} | undefined}, 'a' | 'b.c.d.e'>,
);
expectType<{a: {b: string | null}} | {a?: number; b: {c?: string}}>(
	{} as SetNonNullableDeep<{a: {b: string | null} | undefined} | {a?: number | undefined; b: {c?: string}}, 'a' | 'b.c'>,
);
expectType<{a: string; b: {c?: {d: string} | undefined; f?: number}} | {a: {b: number}; c: never; d?: undefined}>(
	{} as SetNonNullableDeep<
	{a: string; b: {c?: {d: string | null} | undefined; f?: number} | null} | {a: {b: number | null}; c: null; d?: undefined},
	'b' | 'b.c.d' | 'a.b' | 'c'
	>,
);
expectType<{a: 1; b: {c: 2}; d?: {e?: {f?: 2}; g?: 3}}>(
	{} as SetNonNullableDeep<{a: 1 | null; b: {c: 2 | null}; d?: {e?: {f?: 2 | null}; g?: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>,
);
expectType<{a: {b: string} | {c: string} | {b: {c: string | null}}}>(
	{} as SetNonNullableDeep<{a: {b: string | null} | {c: string} | {b: {c: string | null} | undefined}}, 'a.b'>,
);

// Calls `NonNullableDeep` when `KeyPaths` is `any`
expectType<{a: number; readonly b?: {c: string}}>(
	{} as SetNonNullableDeep<{a: number | null; readonly b?: {c: string | undefined} | null}, any>,
);
expectType<[[{a: string}], Map<{a: string}, string>]>(
	{} as SetNonNullableDeep<[[{a: string | null}], Map<{a: string | null}, string | null>], any>,
);

// Preserves non-nullable values when they are in a union with objects
expectType<{a?: number | {b: string}}>({} as SetNonNullableDeep<{a?: number | {b: string} | null | undefined}, 'a'>);
expectType<{a: {b: Array<{c?: number | null}> | number}}>({} as SetNonNullableDeep<{a: {b: Array<{c?: number | null}> | number | null}}, 'a.b'>);
expectType<{a: number | {b: string | number}}>({} as SetNonNullableDeep<{a: number | {b: string | number | null} | null | undefined}, 'a' | 'a.b'>);
expectType<{a: number; b: {c: number | null} | {d: string}}>({} as SetNonNullableDeep<{a: number; b: {c: number | null} | {d: string | undefined} | null}, 'b' | 'b.d'>);

// Preserves `readonly` modifier
expectType<{a: string; b: {readonly c: number}}>({} as SetNonNullableDeep<{a: string; b: {readonly c: number | null}}, 'b.c'>);
expectType<{readonly a: string; readonly b: {c: number | null}}>({} as SetNonNullableDeep<{readonly a: string | null; readonly b: {c: number | null} | null}, 'a' | 'b'>);
expectType<{readonly a: string; readonly b: {readonly c: number}}>({} as SetNonNullableDeep<{readonly a: string | null; readonly b: {readonly c: number | null} | null}, 'a' | 'b' | 'b.c'>);

// Number keys
expectType<{0: 1; 1: {2?: string}}>({} as SetNonNullableDeep<{0: 1; 1: {2?: string | null}}, '1.2'>);
expectType<{0: 1; 1?: {2: string | null}}>({} as SetNonNullableDeep<{0: 1 | null; 1?: {2: string | null} | undefined}, 0 | 1>);

// Number keys containing dots
// NOTE: Passing "1.2" instead of 1.2 will treat it as a path instead of a key
expectType<{1.2?: string; 1?: {2?: string | null} | null}>({} as SetNonNullableDeep<{1.2?: string | null; 1?: {2?: string | null} | null}, 1.2>);
expectType<{1.2?: string | null; 1?: {2?: string} | null}>({} as SetNonNullableDeep<{1.2?: string | null; 1?: {2?: string | null} | null}, '1.2'>);
expectType<{1.2?: string; 1?: {2?: string} | undefined}>({} as SetNonNullableDeep<{1.2?: string | undefined; 1?: {2?: string | undefined} | undefined}, 1.2 | '1.2'>);

// Index signatures
expectType<{[x: string]: any; a: number; b: {c: number}}>({} as SetNonNullableDeep<{[x: string]: any; a: number | null; b: {c: number | null}}, 'a' | 'b.c'>);

// Works with `KeyPaths` containing template literals
expectType<{a: number | null; b: {c: number} | {d: number} | null | undefined}>(
	{} as SetNonNullableDeep<{a: number | null; b: {c: number | null} | {d: number | undefined} | null | undefined}, `b.${'c' | 'd'}`>,
);
expectType<{a: number; b: null | {readonly c: {1: number[]} | undefined} | {d: {1: number[]} | null}}>({} as SetNonNullableDeep<
	{a: number | undefined; b: null | {readonly c: {1: number[] | undefined} | undefined} | {d: {1: number[] | undefined} | null}}, 'a' | `b.${'c' | 'd'}.1`
>);

// Non recursive types
expectType<{a: Set<number | null> | {b: never}}>({} as SetNonNullableDeep<{a: Set<number | null> | {b: null}}, 'a.b'>);
expectType<{a: {b: Map<string, string> | {c: string}}}>({} as SetNonNullableDeep<{a: {b: Map<string, string> | {c: string} | null}}, 'a.b'>);

// === Arrays ===
expectType<[string, number | null, boolean]>({} as SetNonNullableDeep<[string | null, number | null, boolean | undefined], '0' | '2'>);
expectType<{a?: [string, number, (boolean | null)?] | null}>({} as SetNonNullableDeep<{a?: [string | undefined, number | undefined, (boolean | null)?] | null}, 'a.0' | 'a.1'>);
expectType<{a?: [string | null, number?, boolean?] | null}>({} as SetNonNullableDeep<{a?: [string | null, (number | undefined)?, (boolean | null)?] | null}, 'a.1' | 'a.2'>);
expectType<{a: readonly [string, number, (boolean | null)?]}>({} as SetNonNullableDeep<{a: readonly [string, number | undefined, (boolean | null)?]}, 'a.1'>);
expectType<{readonly a: [string, number | null | undefined, boolean, ...Array<number | null>]}>(
	{} as SetNonNullableDeep<{readonly a: [string | null, number | null | undefined, boolean | undefined, ...Array<number | null>]}, 'a.0' | 'a.2'>,
);
expectType<{readonly a?: [string, number, boolean, ...Array<string | null>]}>(
	{} as SetNonNullableDeep<{readonly a?: [string, number | null, boolean | undefined, ...Array<string | null>] | undefined}, 'a' | 'a.1' | 'a.2'>,
);

// Readonly arrays
expectType<{a?: {b?: readonly [(string | number)?]} | null}>({} as SetNonNullableDeep<{a?: {b?: readonly [(string | number | null)?]} | null}, 'a.b.0'>);
expectType<{a: readonly [string, number, boolean, ...Array<string | undefined>] | undefined}>(
	{} as SetNonNullableDeep<{a: readonly [string | null, number | undefined, boolean | null, ...Array<string | undefined>] | undefined}, 'a.0' | 'a.1' | 'a.2'>,
);

// Ignores `Keys` that are already non-nullable
expectType<{a: [string, (number | null)?, boolean?]}>({} as SetNonNullableDeep<{a: [string, (number | null)?, boolean?]}, 'a.0'>);
expectType<{a: [string, number?, boolean?]}>({} as SetNonNullableDeep<{a: [string, (number | null)?, boolean?]}, 'a.0' | 'a.1'>);

// A key past the elements a tuple declares lands in its rest element, which is the type of every index from there on, so it does reach it and the rest element is made non-nullable.
expectType<{a?: readonly [string | null, (number | undefined)?, (boolean | null)?, ...number[]] | undefined}>(
	{} as SetNonNullableDeep<{a?: readonly [string | null, (number | undefined)?, (boolean | null)?, ...Array<number | null | undefined>] | undefined}, 'a.10'>,
);

// A key that is one of the elements the tuple declares changes only that element, and an optional element keeps the `undefined` its `?` contributes.
expectType<{a?: readonly [string, (number | undefined)?, (boolean | null)?, ...Array<number | null | undefined>] | undefined}>(
	{} as SetNonNullableDeep<{a?: readonly [string | null, (number | undefined)?, (boolean | null)?, ...Array<number | null | undefined>] | undefined}, 'a.0'>,
);

// Unions of arrays
expectType<{a: [string] | [string, number?, (boolean | null)?, ...Array<number | null>] | readonly [string, number, (boolean | undefined)?]}>(
	{} as SetNonNullableDeep<
		{a: [string | undefined] | [string | null, number?, (boolean | null)?, ...Array<number | null>] | readonly [string | null | undefined, number | null, (boolean | undefined)?]},
	'a.0' | 'a.1'
	>,
);

// Labelled tuples
expectType<{a?: [b: string, c: number] | undefined}>({} as SetNonNullableDeep<{a?: [b: string | null, c: number | undefined] | undefined}, 'a.0' | 'a.1'>);

// Non-tuple arrays
expectType<{a: string[]}>({} as SetNonNullableDeep<{a: Array<string | null>}, `a.${number}`>);
expectType<{readonly a: ReadonlyArray<string | number>}>({} as SetNonNullableDeep<{readonly a: ReadonlyArray<string | number | null> | undefined}, 'a' | `a.${number}`>);

// Nested arrays
expectType<{a?: [([string?, (number | null)?] | null)?]}>({} as SetNonNullableDeep<{a?: [([(string | undefined)?, (number | null)?] | null)?] | undefined}, 'a' | 'a.0.0'>);
expectType<{a?: [[(string | undefined)?, number?]?] | undefined}>({} as SetNonNullableDeep<{a?: [([(string | undefined)?, (number | null)?] | null)?] | undefined}, 'a.0.1' | 'a.0'>);
expectType<{a?: [[string | null, number]?] | null}>({} as SetNonNullableDeep<{a?: [([string | null, number | undefined] | null)?] | null}, 'a.0' | 'a.0.1'>);
expectType<{a?: Array<[string | null, number?]> | null}>({} as SetNonNullableDeep<{a?: Array<[string | null, (number | undefined)?]> | null}, `a.${number}.1`>);

// Removes `null` & `undefined` from keys inside arrays
expectType<{a?: Array<{b: number}> | undefined}>({} as SetNonNullableDeep<{a?: Array<{b: number | null}> | undefined}, `a.${number}.b`>);
expectType<{readonly a?: [{readonly b: number}]}>({} as SetNonNullableDeep<{readonly a?: [{readonly b: number | undefined}] | null}, 'a' | 'a.0' | 'a.0.b'>);
expectType<{readonly a: [{readonly b: number}, {c?: string | null}?]}>(
	{} as SetNonNullableDeep<{readonly a: [{readonly b: number | null | undefined}, ({c?: string | null} | undefined)?]}, 'a.0.b' | 'a.1'>,
);
expectType<{a?: Array<{b: number; c?: string | null}> | null}>({} as SetNonNullableDeep<{a?: Array<{b: number | undefined; c?: string | null}> | null}, `a.${number}.b`>);
expectType<{a: [{b?: number | null; readonly c: string}]}>({} as SetNonNullableDeep<{a: [{b?: number | null; readonly c: string | undefined}]}, 'a.0.c'>);

// Known limitation: an index path into a tuple with a leading rest element does nothing, because the element after the rest element is keyed by a number the walk does not reach. See the docs.
declare const leadingRestTuple: SetNonNullableDeep<{a: [...string[], number | null]}, 'a.1'>;
expectType<{a: [...string[], number | null]}>(leadingRestTuple);

// Naming one path leaves the other properties of the same object alone, and a property that was optional stays optional.
declare const oneOfTwoPaths: SetNonNullableDeep<{a: {b: string | null; c?: number | null}}, 'a.b'>;
expectType<{a: {b: string; c?: number | null}}>(oneOfTwoPaths);

declare const theOtherPath: SetNonNullableDeep<{a: {b: string | null; c?: number | null}}, 'a.c'>;
expectType<{a: {b: string | null; c?: number}}>(theOtherPath);

// Naming every path applies the transform to all of them.
declare const everyPath: SetNonNullableDeep<{a: {b: string | null}}, Paths<{a: {b: string | null}}>>;
expectType<{a: {b: string}}>(everyPath);

// Naming no path applies it to none, which is what a `Set*` type means. `any` is the way to name every path without spelling them out.
declare const noPath: SetNonNullableDeep<{a: {b: string | null}}, never>;
expectType<{a: {b: string | null}}>(noPath);

declare const anyPath: SetNonNullableDeep<{a: {b: string | null}}, any>;
expectType<{a: {b: string}}>(anyPath);
