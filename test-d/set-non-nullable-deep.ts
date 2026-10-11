import {expectTypeOf} from 'nz';
import type {Paths} from '../source/paths.d.ts';
import type {SetNonNullableDeep} from '../source/set-non-nullable-deep.d.ts';

expectTypeOf<SetNonNullableDeep<{a: number | null}, 'a'>>().toBe<{a: number}>();
expectTypeOf<SetNonNullableDeep<{a: number | undefined}, 'a'>>().toBe<{a: number}>();
expectTypeOf<SetNonNullableDeep<{a: number | null | undefined}, 'a'>>().toBe<{a: number}>();
expectTypeOf<SetNonNullableDeep<{a?: number | null}, 'a'>>().toBe<{a?: number}>();
expectTypeOf<SetNonNullableDeep<{a?: number | undefined}, 'a'>>().toBe<{a?: number}>();
expectTypeOf<SetNonNullableDeep<{a?: number | null | undefined}, 'a'>>().toBe<{a?: number}>();

expectTypeOf<SetNonNullableDeep<{a: number; b: {c: string | null}}, 'b.c'>>().toBe<{a: number; b: {c: string}}>();
expectTypeOf<SetNonNullableDeep<{a: number; b: {c: string | undefined}}, 'b.c'>>().toBe<{a: number; b: {c: string}}>();
expectTypeOf<SetNonNullableDeep<{a: number; b: {c: string | null | undefined}}, 'b.c'>>().toBe<{a: number; b: {c: string}}>();
expectTypeOf<SetNonNullableDeep<{a: number; b: {c?: string | null}}, 'b.c'>>().toBe<{a: number; b: {c?: string}}>();
expectTypeOf<SetNonNullableDeep<{a: number; b: {c?: string | undefined}}, 'b.c'>>().toBe<{a: number; b: {c?: string}}>();
expectTypeOf<SetNonNullableDeep<{a: number; b: {c?: string | null | undefined}}, 'b.c'>>().toBe<{a: number; b: {c?: string}}>();

// Becomes `never` when the value is only `null` or `undefined`
expectTypeOf<SetNonNullableDeep<{a: null | undefined}, 'a'>>().toBe<{a: never}>();
expectTypeOf<SetNonNullableDeep<{a?: null | undefined}, 'a'>>().toBe<{a?: never}>();

// Ignores keys that are already non-nullable
expectTypeOf<SetNonNullableDeep<{a: number}, 'a'>>().toBe<{a: number}>();
expectTypeOf<SetNonNullableDeep<{readonly a?: number}, 'a'>>().toBe<{readonly a?: number}>();
expectTypeOf<SetNonNullableDeep<{a?: number; b: {c: string}}, 'b.c'>>().toBe<{a?: number; b: {c: string}}>();
expectTypeOf<SetNonNullableDeep<{a: number; readonly b?: {c?: string}}, 'b.c'>>().toBe<{a: number; readonly b?: {c?: string}}>();

// Removes nullables only from the specified keys, nullables in other paths are preserved
expectTypeOf<SetNonNullableDeep<{a: number | null | undefined; b: {c: string | null | undefined} | null | undefined}, 'a'>>().toBe<{a: number; b: {c: string | null | undefined} | null | undefined}>();
expectTypeOf<SetNonNullableDeep<{a: number | null | undefined; b: {c: string | null | undefined} | null | undefined}, 'b'>>().toBe<{a: number | null | undefined; b: {c: string | null | undefined}}>();
expectTypeOf<SetNonNullableDeep<{a: number | null | undefined; b: {c: string | null | undefined} | null | undefined}, 'b.c'>>().toBe<{a: number | null | undefined; b: {c: string} | null | undefined}>();
expectTypeOf<SetNonNullableDeep<{a: {b: string | null} | null | undefined}, 'a' | 'a.b'>>().toBe<{a: {b: string}}>();
expectTypeOf<SetNonNullableDeep<{a: {b: {c: string | undefined} | null} | null | undefined}, 'a.b' | 'a.b.c'>>().toBe<{a: {b: {c: string}} | null | undefined}>();
expectTypeOf<SetNonNullableDeep<{a: {b: {c: string | undefined} | null} | null | undefined}, 'a' | 'a.b.c'>>().toBe<{a: {b: {c: string} | null}}>();
expectTypeOf<SetNonNullableDeep<
	{a: {b?: {c: {d?: {e: number | string} | null; f: {g: boolean | null}} | undefined} | null; h: number | null} | undefined},
	'a' | 'a.b.c.d' | 'a.b.c.f.g'
>>().toBe<{a: {b?: {c: {d?: {e: number | string}; f: {g: boolean}} | undefined} | null; h: number | null}}>();

// Unions
expectTypeOf<SetNonNullableDeep<{a: string | null} | {a?: number | undefined} | {a: boolean | null | undefined}, 'a'>>().toBe<{a: string} | {a?: number} | {a: boolean}>();
expectTypeOf<SetNonNullableDeep<{a: string | null; b: number | undefined}, 'a' | 'b'>>().toBe<{a: string; b: number}>();
expectTypeOf<SetNonNullableDeep<{a: string | null; b: {c: {d: {e: number | undefined}} | null} | undefined}, 'a' | 'b.c.d.e'>>().toBe<{a: string; b: {c: {d: {e: number}} | null} | undefined}>();
expectTypeOf<SetNonNullableDeep<{a: {b: string | null} | undefined} | {a?: number | undefined; b: {c?: string}}, 'a' | 'b.c'>>().toBe<{a: {b: string | null}} | {a?: number; b: {c?: string}}>();
expectTypeOf<SetNonNullableDeep<
	{a: string; b: {c?: {d: string | null} | undefined; f?: number} | null} | {a: {b: number | null}; c: null; d?: undefined},
	'b' | 'b.c.d' | 'a.b' | 'c'
>>().toBe<{a: string; b: {c?: {d: string} | undefined; f?: number}} | {a: {b: number}; c: never; d?: undefined}>();
expectTypeOf<SetNonNullableDeep<{a: 1 | null; b: {c: 2 | null}; d?: {e?: {f?: 2 | null}; g?: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>>().toBe<{a: 1; b: {c: 2}; d?: {e?: {f?: 2}; g?: 3}}>();
expectTypeOf<SetNonNullableDeep<{a: {b: string | null} | {c: string} | {b: {c: string | null} | undefined}}, 'a.b'>>().toBe<{a: {b: string} | {c: string} | {b: {c: string | null}}}>();

// Calls `NonNullableDeep` when `KeyPaths` is `any`
expectTypeOf<SetNonNullableDeep<{a: number | null; readonly b?: {c: string | undefined} | null}, any>>().toBe<{a: number; readonly b?: {c: string}}>();
expectTypeOf<SetNonNullableDeep<[[{a: string | null}], Map<{a: string | null}, string | null>], any>>().toBe<[[{a: string}], Map<{a: string}, string>]>();

// Preserves non-nullable values when they are in a union with objects
expectTypeOf<SetNonNullableDeep<{a?: number | {b: string} | null | undefined}, 'a'>>().toBe<{a?: number | {b: string}}>();
expectTypeOf<SetNonNullableDeep<{a: {b: Array<{c?: number | null}> | number | null}}, 'a.b'>>().toBe<{a: {b: Array<{c?: number | null}> | number}}>();
expectTypeOf<SetNonNullableDeep<{a: number | {b: string | number | null} | null | undefined}, 'a' | 'a.b'>>().toBe<{a: number | {b: string | number}}>();
expectTypeOf<SetNonNullableDeep<{a: number; b: {c: number | null} | {d: string | undefined} | null}, 'b' | 'b.d'>>().toBe<{a: number; b: {c: number | null} | {d: string}}>();

// Preserves `readonly` modifier
expectTypeOf<SetNonNullableDeep<{a: string; b: {readonly c: number | null}}, 'b.c'>>().toBe<{a: string; b: {readonly c: number}}>();
expectTypeOf<SetNonNullableDeep<{readonly a: string | null; readonly b: {c: number | null} | null}, 'a' | 'b'>>().toBe<{readonly a: string; readonly b: {c: number | null}}>();
expectTypeOf<SetNonNullableDeep<{readonly a: string | null; readonly b: {readonly c: number | null} | null}, 'a' | 'b' | 'b.c'>>().toBe<{readonly a: string; readonly b: {readonly c: number}}>();

// Number keys
expectTypeOf<SetNonNullableDeep<{0: 1; 1: {2?: string | null}}, '1.2'>>().toBe<{0: 1; 1: {2?: string}}>();
expectTypeOf<SetNonNullableDeep<{0: 1 | null; 1?: {2: string | null} | undefined}, 0 | 1>>().toBe<{0: 1; 1?: {2: string | null}}>();

// Number keys containing dots
// NOTE: Passing "1.2" instead of 1.2 will treat it as a path instead of a key
expectTypeOf<SetNonNullableDeep<{1.2?: string | null; 1?: {2?: string | null} | null}, 1.2>>().toBe<{1.2?: string; 1?: {2?: string | null} | null}>();
expectTypeOf<SetNonNullableDeep<{1.2?: string | null; 1?: {2?: string | null} | null}, '1.2'>>().toBe<{1.2?: string | null; 1?: {2?: string} | null}>();
expectTypeOf<SetNonNullableDeep<{1.2?: string | undefined; 1?: {2?: string | undefined} | undefined}, 1.2 | '1.2'>>().toBe<{1.2?: string; 1?: {2?: string} | undefined}>();

// Index signatures
expectTypeOf<SetNonNullableDeep<{[x: string]: any; a: number | null; b: {c: number | null}}, 'a' | 'b.c'>>().toBe<{[x: string]: any; a: number; b: {c: number}}>();

// Works with `KeyPaths` containing template literals
expectTypeOf<SetNonNullableDeep<{a: number | null; b: {c: number | null} | {d: number | undefined} | null | undefined}, `b.${'c' | 'd'}`>>().toBe<{a: number | null; b: {c: number} | {d: number} | null | undefined}>();
expectTypeOf<SetNonNullableDeep<
	{a: number | undefined; b: null | {readonly c: {1: number[] | undefined} | undefined} | {d: {1: number[] | undefined} | null}}, 'a' | `b.${'c' | 'd'}.1`
>>().toBe<{a: number; b: null | {readonly c: {1: number[]} | undefined} | {d: {1: number[]} | null}}>();

// Non recursive types
expectTypeOf<SetNonNullableDeep<{a: Set<number | null> | {b: null}}, 'a.b'>>().toBe<{a: Set<number | null> | {b: never}}>();
expectTypeOf<SetNonNullableDeep<{a: {b: Map<string, string> | {c: string} | null}}, 'a.b'>>().toBe<{a: {b: Map<string, string> | {c: string}}}>();

// === Arrays ===
expectTypeOf<SetNonNullableDeep<[string | null, number | null, boolean | undefined], '0' | '2'>>().toBe<[string, number | null, boolean]>();
expectTypeOf<SetNonNullableDeep<{a?: [string | undefined, number | undefined, (boolean | null)?] | null}, 'a.0' | 'a.1'>>().toBe<{a?: [string, number, (boolean | null)?] | null}>();
expectTypeOf<SetNonNullableDeep<{a?: [string | null, (number | undefined)?, (boolean | null)?] | null}, 'a.1' | 'a.2'>>().toBe<{a?: [string | null, number?, boolean?] | null}>();
expectTypeOf<SetNonNullableDeep<{a: readonly [string, number | undefined, (boolean | null)?]}, 'a.1'>>().toBe<{a: readonly [string, number, (boolean | null)?]}>();
expectTypeOf<SetNonNullableDeep<{readonly a: [string | null, number | null | undefined, boolean | undefined, ...Array<number | null>]}, 'a.0' | 'a.2'>>().toBe<{readonly a: [string, number | null | undefined, boolean, ...Array<number | null>]}>();
expectTypeOf<SetNonNullableDeep<{readonly a?: [string, number | null, boolean | undefined, ...Array<string | null>] | undefined}, 'a' | 'a.1' | 'a.2'>>().toBe<{readonly a?: [string, number, boolean, ...Array<string | null>]}>();

// Readonly arrays
expectTypeOf<SetNonNullableDeep<{a?: {b?: readonly [(string | number | null)?]} | null}, 'a.b.0'>>().toBe<{a?: {b?: readonly [(string | number)?]} | null}>();
expectTypeOf<SetNonNullableDeep<{a: readonly [string | null, number | undefined, boolean | null, ...Array<string | undefined>] | undefined}, 'a.0' | 'a.1' | 'a.2'>>().toBe<{a: readonly [string, number, boolean, ...Array<string | undefined>] | undefined}>();

// Ignores `Keys` that are already non-nullable
expectTypeOf<SetNonNullableDeep<{a: [string, (number | null)?, boolean?]}, 'a.0'>>().toBe<{a: [string, (number | null)?, boolean?]}>();
expectTypeOf<SetNonNullableDeep<{a: [string, (number | null)?, boolean?]}, 'a.0' | 'a.1'>>().toBe<{a: [string, number?, boolean?]}>();

// A key past the elements a tuple declares lands in its rest element, which is the type of every index from there on, so it does reach it and the rest element is made non-nullable.
expectTypeOf<SetNonNullableDeep<{a?: readonly [string | null, (number | undefined)?, (boolean | null)?, ...Array<number | null | undefined>] | undefined}, 'a.10'>>().toBe<{a?: readonly [string | null, (number | undefined)?, (boolean | null)?, ...number[]] | undefined}>();

// A key that is one of the elements the tuple declares changes only that element, and an optional element keeps the `undefined` its `?` contributes.
expectTypeOf<SetNonNullableDeep<{a?: readonly [string | null, (number | undefined)?, (boolean | null)?, ...Array<number | null | undefined>] | undefined}, 'a.0'>>().toBe<{a?: readonly [string, (number | undefined)?, (boolean | null)?, ...Array<number | null | undefined>] | undefined}>();

// Unions of arrays
expectTypeOf<SetNonNullableDeep<
	{a: [string | undefined] | [string | null, number?, (boolean | null)?, ...Array<number | null>] | readonly [string | null | undefined, number | null, (boolean | undefined)?]},
	'a.0' | 'a.1'
>>().toBe<{a: [string] | [string, number?, (boolean | null)?, ...Array<number | null>] | readonly [string, number, (boolean | undefined)?]}>();

// Labelled tuples
expectTypeOf<SetNonNullableDeep<{a?: [b: string | null, c: number | undefined] | undefined}, 'a.0' | 'a.1'>>().toBe<{a?: [b: string, c: number] | undefined}>();

// Non-tuple arrays
expectTypeOf<SetNonNullableDeep<{a: Array<string | null>}, `a.${number}`>>().toBe<{a: string[]}>();
expectTypeOf<SetNonNullableDeep<{readonly a: ReadonlyArray<string | number | null> | undefined}, 'a' | `a.${number}`>>().toBe<{readonly a: ReadonlyArray<string | number>}>();

// Nested arrays
expectTypeOf<SetNonNullableDeep<{a?: [([(string | undefined)?, (number | null)?] | null)?] | undefined}, 'a' | 'a.0.0'>>().toBe<{a?: [([string?, (number | null)?] | null)?]}>();
expectTypeOf<SetNonNullableDeep<{a?: [([(string | undefined)?, (number | null)?] | null)?] | undefined}, 'a.0.1' | 'a.0'>>().toBe<{a?: [[(string | undefined)?, number?]?] | undefined}>();
expectTypeOf<SetNonNullableDeep<{a?: [([string | null, number | undefined] | null)?] | null}, 'a.0' | 'a.0.1'>>().toBe<{a?: [[string | null, number]?] | null}>();
expectTypeOf<SetNonNullableDeep<{a?: Array<[string | null, (number | undefined)?]> | null}, `a.${number}.1`>>().toBe<{a?: Array<[string | null, number?]> | null}>();

// Removes `null` & `undefined` from keys inside arrays
expectTypeOf<SetNonNullableDeep<{a?: Array<{b: number | null}> | undefined}, `a.${number}.b`>>().toBe<{a?: Array<{b: number}> | undefined}>();
expectTypeOf<SetNonNullableDeep<{readonly a?: [{readonly b: number | undefined}] | null}, 'a' | 'a.0' | 'a.0.b'>>().toBe<{readonly a?: [{readonly b: number}]}>();
expectTypeOf<SetNonNullableDeep<{readonly a: [{readonly b: number | null | undefined}, ({c?: string | null} | undefined)?]}, 'a.0.b' | 'a.1'>>().toBe<{readonly a: [{readonly b: number}, {c?: string | null}?]}>();
expectTypeOf<SetNonNullableDeep<{a?: Array<{b: number | undefined; c?: string | null}> | null}, `a.${number}.b`>>().toBe<{a?: Array<{b: number; c?: string | null}> | null}>();
expectTypeOf<SetNonNullableDeep<{a: [{b?: number | null; readonly c: string | undefined}]}, 'a.0.c'>>().toBe<{a: [{b?: number | null; readonly c: string}]}>();

// Known limitation: an index path into a tuple with a leading rest element does nothing, because the element after the rest element is keyed by a number the walk does not reach. See the docs.
declare const leadingRestTuple: SetNonNullableDeep<{a: [...string[], number | null]}, 'a.1'>;
expectTypeOf(leadingRestTuple).toBe<{a: [...string[], number | null]}>();

// Naming one path leaves the other properties of the same object alone, and a property that was optional stays optional.
declare const oneOfTwoPaths: SetNonNullableDeep<{a: {b: string | null; c?: number | null}}, 'a.b'>;
expectTypeOf(oneOfTwoPaths).toBe<{a: {b: string; c?: number | null}}>();

declare const theOtherPath: SetNonNullableDeep<{a: {b: string | null; c?: number | null}}, 'a.c'>;
expectTypeOf(theOtherPath).toBe<{a: {b: string | null; c?: number}}>();

// Naming every path applies the transform to all of them.
declare const everyPath: SetNonNullableDeep<{a: {b: string | null}}, Paths<{a: {b: string | null}}>>;
expectTypeOf(everyPath).toBe<{a: {b: string}}>();

// Naming no path applies it to none, which is what a `Set*` type means. `any` is the way to name every path without spelling them out.
declare const noPath: SetNonNullableDeep<{a: {b: string | null}}, never>;
expectTypeOf(noPath).toBe<{a: {b: string | null}}>();

declare const anyPath: SetNonNullableDeep<{a: {b: string | null}}, any>;
expectTypeOf(anyPath).toBe<{a: {b: string}}>();
