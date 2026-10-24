import {expectTypeOf} from 'nz';
import type {Opaque, Tagged} from '../source/tagged.d.ts';
import type {DigitCharacter, LiteralUnion, Paths, SetRequiredDeep} from '../index.d.ts';

// Set nested key to required
declare const variation1: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b.c'>;
expectTypeOf(variation1).toBe<{a?: number; b?: {c: string}}>();

// Set key to required but not nested keys if not specified
declare const variation2: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b'>;
expectTypeOf(variation2).toBe<{a?: number; b: {c?: string}}>();

// Set root key to required
declare const variation3: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'a'>;
expectTypeOf(variation3).toBe<{a: number; b?: {c?: string}}>();

// Keeps required key as required
declare const variation4: SetRequiredDeep<{a: number; b?: {c?: string}}, 'a'>;
expectTypeOf(variation4).toBe<{a: number; b?: {c?: string}}>();

// Set key to required in a union.
declare const variation5: SetRequiredDeep<{a?: '1'; b?: {c?: boolean}} | {a?: '2'; b?: {c?: boolean}}, 'a'>;
expectTypeOf(variation5).toBe<{a: '1'; b?: {c?: boolean}} | {a: '2'; b?: {c?: boolean}}>();

// Set key with array type to required
declare const variation6: SetRequiredDeep<{a?: Array<{b?: number}>}, 'a'>;
expectTypeOf(variation6).toBe<{a: Array<{b?: number}>}>();

// Can set both root and nested keys to required
declare const variation7: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b' | 'b.c'>;
expectTypeOf(variation7).toBe<{a?: number; b: {c: string}}>();

// Preserves required root keys
declare const variation8: SetRequiredDeep<{a: 1; b: {c?: 1}}, 'b.c'>;
expectTypeOf(variation8).toBe<{a: 1; b: {c: 1}}>();

// Preserves union in root keys
declare const variation9: SetRequiredDeep<{a: 1; b: number | {c?: 1}}, 'b.c'>;
expectTypeOf(variation9).toBe<{a: 1; b: number | {c: 1}}>();

// Preserves readonly
declare const variation10: SetRequiredDeep<{a: 1; readonly b: {c?: 1}}, 'b.c'>;
expectTypeOf(variation10).toBe<{a: 1; readonly b: {c: 1}}>();

declare const variation11: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b'>;
expectTypeOf(variation11).toBe<{readonly a: 1; readonly b: {readonly c?: 1}}>();

declare const variation12: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b' | 'b.c'>;
expectTypeOf(variation12).toBe<{readonly a: 1; readonly b: {readonly c: 1}}>();

// Works with number keys
declare const variation13: SetRequiredDeep<{0: 1; 1: {2?: string}}, '1.2'>;
expectTypeOf(variation13).toBe<{0: 1; 1: {2: string}}>();

declare const variation14: SetRequiredDeep<{0?: 1; 1?: {2?: string}}, 0 | 1>;
expectTypeOf(variation14).toBe<{0: 1; 1: {2?: string}}>();

// Multiple keys
declare const variation15: SetRequiredDeep<{a?: 1; b?: {c?: 2}; d?: {e?: {f?: 2}; g?: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>;
expectTypeOf(variation15).toBe<{a: 1; b: {c: 2}; d?: {e?: {f: 2}; g: 3}}>();

// Index signatures
declare const variation16: SetRequiredDeep<{[x: string]: any; a?: number; b?: {c?: number}}, 'a' | 'b.c'>;
expectTypeOf(variation16).toBe<{[x: string]: any; a: number; b?: {c: number}}>();

// Preserves union in nested keys
declare const variation17: SetRequiredDeep<{a: 1; b?: number | {c?: 1}}, 'b'>;
expectTypeOf(variation17).toBe<{a: 1; b: number | {c?: 1}}>();

declare const variation18: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: string}}, 'b' | 'b.d'>;
expectTypeOf(variation18).toBe<{a?: number; b: {c?: number} | {d: string}}>();

// Works with number keys containing dots
// NOTE: Passing "1.2" instead of 1.2 will treat it as a path instead of a key
declare const variation19: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2>;
expectTypeOf(variation19).toBe<{1.2: string; 1?: {2?: string}}>();

declare const variation20: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, '1.2'>;
expectTypeOf(variation20).toBe<{1.2?: string; 1?: {2: string}}>();

declare const variation21: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2 | '1.2'>;
expectTypeOf(variation21).toBe<{1.2: string; 1?: {2: string}}>();

// Works with unions
declare const variation22: SetRequiredDeep<{a?: {readonly b?: number}} | {readonly b?: {c?: number[]}}, 'a.b' | 'b' | 'b.c'>;
expectTypeOf(variation22).toBe<{a?: {readonly b: number}} | {readonly b: {c: number[]}}>();

// Works with `KeyPaths` containing template literals
declare const variation23: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: number}}, `b.${'c' | 'd'}`>;
expectTypeOf(variation23).toBe<{a?: number; b?: {c: number} | {d: number}}>();

declare const variation24: SetRequiredDeep<
	{a?: number; b?: {readonly c?: {1?: number}} | {d?: {1?: number}}}, 'a' | `b.${'c' | 'd'}.1`
>;
expectTypeOf(variation24).toBe<{a: number; b?: {readonly c?: {1: number}} | {d?: {1: number}}}>();

// Calls `RequiredDeep` when `KeyPaths` is `any`
declare const variation25: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, any>;
expectTypeOf(variation25).toBe<{a: number; readonly b: {c: string}}>();

// Does nothing when `KeyPaths` is `never`
declare const variation26: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, never>;
expectTypeOf(variation26).toBe<{a?: number; readonly b?: {c?: string}}>();

// =================
// Works with arrays
// =================

// All optional elements
expectTypeOf<SetRequiredDeep<{a?: [string?, number?, boolean?]}, 'a.0' | 'a.1'>>().toBe<{a?: [string, number, boolean?]}>();

// Mix of optional and required elements
expectTypeOf<SetRequiredDeep<{a: readonly [string, number?, boolean?]}, 'a.1' | 'a.2'>>().toBe<{a: readonly [string, number, boolean]}>();

// Mix of optional and rest elements
expectTypeOf<SetRequiredDeep<{readonly a: [string?, number?, boolean?, ...number[]]}, 'a.0' | 'a.1'>>().toBe<{readonly a: [string, number, boolean?, ...number[]]}>();

// Mix of optional, required, and rest elements
expectTypeOf<SetRequiredDeep<{readonly a?: [string, number?, boolean?, ...string[]]}, 'a.1' | 'a.2'>>().toBe<{readonly a?: [string, number, boolean, ...string[]]}>();

// Works with readonly arrays
expectTypeOf<SetRequiredDeep<{a?: {b?: readonly [(string | number)?]}}, 'a.b.0'>>().toBe<{a?: {b?: readonly [(string | number)]}}>();
expectTypeOf<SetRequiredDeep<{a?: readonly [string, number?, boolean?, ...string[]]}, 'a' | 'a.1' | 'a.2'>>().toBe<{a: readonly [string, number, boolean, ...string[]]}>();

// Ignores `Keys` that are already required
expectTypeOf<SetRequiredDeep<{a: [string, number?, boolean?]}, 'a.0'>>().toBe<{a: [string, number?, boolean?]}>();

// Ignores `Keys` that are not known
// This case is only possible when the array contains a rest element,
// because otherwise the constaint on `KeyPaths` would disallow out of bound keys.
expectTypeOf<SetRequiredDeep<{a?: readonly [string?, number?, boolean?, ...number[]]}, 'a.10'>>().toBe<{a?: readonly [string?, number?, boolean?, ...number[]]}>();

// Marks all keys as required, if `Keys` is `number`.
// This case is only possible when the array contains a rest element,
// because otherwise the constaint on `KeyPaths` would be stricter.
expectTypeOf<SetRequiredDeep<{a?: readonly [string?, number?, boolean?, ...number[]]}, `a.${number}`>>().toBe<{a?: readonly [string, number, boolean, ...number[]]}>();

// Preserves `| undefined`, similar to how built-in `Required` works.
expectTypeOf<SetRequiredDeep<{a: [string | undefined, (number | undefined)?, boolean?]}, 'a.0' | 'a.1' | 'a.2'>>().toBe<{a: [string | undefined, number | undefined, boolean]}>();
expectTypeOf<SetRequiredDeep<{a: readonly [(string | undefined)?, (number | undefined)?, boolean?]}, 'a.0'>>().toBe<{a: readonly [string | undefined, (number | undefined)?, boolean?]}>();

// Optional elements cannot appear after required ones, `Keys` leading to such situations are ignored.
expectTypeOf<SetRequiredDeep<{a: [string?, number?, boolean?]}, 'a.1' | 'a.2'>>().toBe<{a: [string?, number?, boolean?]}>(); // `a.1` and `a.2` can't be required when `a.0` is optional
// `a.3` can't be required when `a.2` is optional
expectTypeOf<SetRequiredDeep<{a: [string?, number?, boolean?, string?, string?]}, 'a.0' | 'a.1' | 'a.3'>>().toBe<{a: [string, number, boolean?, string?, string?]}>();
// `a.2` can't be required when `a.1` is optional
expectTypeOf<SetRequiredDeep<{a?: readonly [string | undefined, number?, boolean?, ...string[]]}, 'a' | 'a.2'>>().toBe<{a: readonly [string | undefined, number?, boolean?, ...string[]]}>();

// Works with unions of arrays
expectTypeOf<SetRequiredDeep<{a: [string?] | [string, number?, boolean?, ...number[]] | readonly [string, number?, boolean?]}, 'a.0' | 'a.1'>>().toBe<{a: [string] | [string, number, boolean?, ...number[]] | readonly [string, number, boolean?]}>();

// Works with labelled tuples
expectTypeOf<SetRequiredDeep<{a?: [b?: string, c?: number]}, 'a.0' | 'a.1'>>().toBe<{a?: [b: string, c: number]}>();

// Non tuple arrays are left unchanged
expectTypeOf<SetRequiredDeep<{a: string[]}, `a.${number}`>>().toBe<{a: string[]}>();
expectTypeOf<SetRequiredDeep<{readonly a?: ReadonlyArray<string | number>}, 'a' | `a.${number}`>>().toBe<{readonly a: ReadonlyArray<string | number>}>();

// Works with nested arrays
expectTypeOf<SetRequiredDeep<{a?: [[string?, number?]?]}, 'a.0.0'>>().toBe<{a?: [[string, number?]?]}>();
expectTypeOf<SetRequiredDeep<{a?: [[string?, number?]?]}, 'a.0' | 'a.0.0' | 'a.0.1'>>().toBe<{a?: [[string, number]]}>();
expectTypeOf<SetRequiredDeep<{a?: Array<[string?, number?]>}, `a.${number}.0`>>().toBe<{a?: Array<[string, number?]>}>();

// Set key inside array to required
expectTypeOf<SetRequiredDeep<{a?: Array<{b?: number}>}, `a.${number}.b`>>().toBe<{a?: Array<{b: number}>}>();
expectTypeOf<SetRequiredDeep<{readonly a?: [{readonly b?: number}]}, 'a.0.b'>>().toBe<{readonly a?: [{readonly b: number}]}>();
expectTypeOf<SetRequiredDeep<{readonly a?: [{readonly b?: number}, {c?: string}?]}, 'a' | 'a.0.b' | 'a.1'>>().toBe<{readonly a: [{readonly b: number}, {c?: string}]}>();

// Set only specified keys inside array to required
expectTypeOf<SetRequiredDeep<{a?: Array<{b?: number; c?: string}>}, `a.${number}.b`>>().toBe<{a?: Array<{b: number; c?: string}>}>();
expectTypeOf<SetRequiredDeep<{a: [{b?: number; readonly c?: string}]}, 'a.0.c'>>().toBe<{a: [{b?: number; readonly c: string}]}>();

// All terminal keys of a tuple are applied together, so union member order cannot leave a later element optional.
declare const allOptionalIndices: SetRequiredDeep<readonly [string?, number?, boolean?], '2' | '1' | '0'>;
expectTypeOf(allOptionalIndices).toBe<readonly [string, number, boolean]>();

// Each object-union member keeps its own paths, and selected siblings are required together at each level.
declare const disjointPaths: SetRequiredDeep<{left?: {first?: string; second?: number}} | {right?: [string?, number?]}, 'left.first' | 'left.second' | 'right.0' | 'right.1'>;
expectTypeOf(disjointPaths).toBe<{left?: {first: string; second: number}} | {right?: [string, number]}>();

// A path deeper than `Paths` lists by default is accepted, and a missing path is ignored.
type DeepOptional = {a?: {b?: {c?: {d?: {e?: {f?: {g?: {h?: 1}}}}}}}};
expectTypeOf<SetRequiredDeep<DeepOptional, 'a.b.c.d.e.f.g.h'>>().toBe<{a?: {b?: {c?: {d?: {e?: {f?: {g?: {h: 1}}}}}}}}>();
expectTypeOf<SetRequiredDeep<{a?: number; b?: {c?: number}}, 'b.c' | 'missing' | 'b.missing'>>().toBe<{a?: number; b?: {c: number}}>();
expectTypeOf<SetRequiredDeep<{a?: number}, 'missing'>>().toBe<{a?: number}>();

// A non-literal path segment matches every key at its level, like a path through an index signature.
expectTypeOf<SetRequiredDeep<{a?: number; b?: {c?: number}}, string>>().toBe<{a: number; b: {c?: number}}>();
expectTypeOf<SetRequiredDeep<{a?: number; b?: {c?: number}}, `b.${string}`>>().toBe<{a?: number; b?: {c: number}}>();

// `Paths<T>` is a valid path for a generic `T`, even though autocomplete only lists paths up to `a.b.c`.
type SetRequiredDeepAllPaths<T> = SetRequiredDeep<T, Paths<T>>;
expectTypeOf<SetRequiredDeepAllPaths<{a?: {b?: 1}}>>().toBe<{a: {b: 1}}>();

// A number path reads the same index as its string form, also for a generic `Index`. A number that is not a path is ignored, like a string that is not a path. A wide `number` matches every index, like `${number}`.
type SetRequiredDeepIndex<T, Index extends number> = SetRequiredDeep<T, Index>;
expectTypeOf<SetRequiredDeepIndex<[1, 2?], 1>>().toBe<[1, 2]>();
expectTypeOf<SetRequiredDeep<{a?: 1}, 5>>().toBe<{a?: 1}>();
expectTypeOf<SetRequiredDeep<[1?, 2?], -1 | 1.5>>().toBe<[1?, 2?]>();
expectTypeOf<SetRequiredDeepIndex<[1?, 2?], number>>().toBe<[1, 2]>();

// Autocomplete only lists paths up to `a.b.c`, so a type with very many deeper paths does not make the union of paths too complex to represent.
type Level<Value> = Record<DigitCharacter, Value>;
type ManyPaths = Level<Level<Level<Level<Level<Partial<Level<1>>>>>>>;
expectTypeOf<SetRequiredDeep<ManyPaths, '0.0.0.0.0.0'>['0']['0']['0']['0']['0']['0']>().toBe<1>();

// A numeric terminal path also names a property declared with its string spelling.
expectTypeOf<SetRequiredDeep<{'0'?: string}, 0>>().toBe<{'0': string}>();

// Key aliases preserve modifiers and transform only the selected property.
expectTypeOf<SetRequiredDeep<{readonly '0'?: string; other?: number}, 0>>().toBe<{readonly '0': string; other?: number}>();
expectTypeOf<SetRequiredDeep<{'-2'?: string; '1.5'?: string}, -2 | 1.5>>().toBe<{'-2': string; '1.5': string}>();
expectTypeOf<SetRequiredDeep<{'0'?: string; '00'?: string}, 0>>().toBe<{'0': string; '00'?: string}>();
expectTypeOf<SetRequiredDeep<{'0'?: string}, 9>>().toBe<{'0'?: string}>();
expectTypeOf<SetRequiredDeep<{'0'?: string} | {other: number}, 0>>().toBe<{'0': string} | {other: number}>();
expectTypeOf<SetRequiredDeep<{'0'?: any; '1'?: unknown; '2'?: never}, 0 | 1 | 2>>().toBe<{'0': any; '1': unknown; '2': never}>();
expectTypeOf<SetRequiredDeep<{'0'?: string; nested: {'1'?: string}}, 0 | 'nested.1'>>().toBe<{'0': string; nested: {'1': string}}>();

// Broad numeric paths use the same template matching as `${number}`, including numeric-looking string keys.
expectTypeOf<SetRequiredDeep<{'0'?: string; '01'?: number; other?: boolean}, number>>().toBe<{'0': string; '01': number; other?: boolean}>();

// Branded paths identify the same nested property as their underlying strings.
expectTypeOf<SetRequiredDeep<{user: {name?: string}}, Tagged<'user.name', 'Path'>>>().toBe<{user: {name: string}}>();

// Normalize the path only, preserving brands on property values and all unrelated modifiers.
type OptionalBrandedUser = {readonly user?: {readonly name?: Tagged<string, 'Name'>; age?: number}; other?: boolean};
expectTypeOf<SetRequiredDeep<OptionalBrandedUser, Tagged<'user.name', 'Path'>>>()
	.toBe<{readonly user?: {readonly name: Tagged<string, 'Name'>; age?: number}; other?: boolean}>();
expectTypeOf<SetRequiredDeep<{a?: string}, Opaque<'a', 'Path'>>>().toBe<{a: string}>();
expectTypeOf<SetRequiredDeep<{a?: {b?: number}}, Tagged<Tagged<'a.b', 'Inner'>, 'Outer'>>>().toBe<{a?: {b: number}}>();
expectTypeOf<SetRequiredDeep<{a?: {b?: number}}, 'a.b' & {readonly pathBrand: unique symbol}>>().toBe<{a?: {b: number}}>();

// A union of paths applies every selection together, including all tuple terminal keys.
type OptionalPathUnion = {a?: string; b?: {c?: number; d?: boolean}};
expectTypeOf<SetRequiredDeep<OptionalPathUnion, Tagged<'a' | 'b.c', 'Path'>>>().toBe<{a: string; b?: {c: number; d?: boolean}}>();
expectTypeOf<SetRequiredDeep<OptionalPathUnion, Tagged<'a', 'Path'> | 'b.c'>>().toBe<{a: string; b?: {c: number; d?: boolean}}>();
expectTypeOf<SetRequiredDeep<{a?: {b?: string}}, Tagged<'a' | 'a.b', 'Path'>>>().toBe<{a: {b: string}}>();
expectTypeOf<SetRequiredDeep<{a?: string} | {a?: number}, Tagged<'a', 'Path'>>>().toBe<{a: string} | {a: number}>();
expectTypeOf<SetRequiredDeep<readonly [string?, number?], Tagged<0 | 1, 'Index'>>>().toBe<readonly [string, number]>();
expectTypeOf<SetRequiredDeep<[string?, number?], Tagged<1, 'Index'>>>().toBe<[string?, number?]>();
expectTypeOf<SetRequiredDeep<{items: Array<{name?: string}>}, Tagged<`items.${number}.name`, 'Path'>>>()
	.toBe<{items: Array<{name: string}>}>();

// Numeric paths retain the distinction between a decimal property and a dotted string path.
expectTypeOf<SetRequiredDeep<{'0'?: string}, Tagged<0, 'Index'>>>().toBe<{'0': string}>();
type OptionalDecimalKeys = {1.2?: string; 1?: {2?: number}};
expectTypeOf<SetRequiredDeep<OptionalDecimalKeys, Tagged<1.2, 'Index'>>>().toBe<{1.2: string; 1?: {2?: number}}>();
expectTypeOf<SetRequiredDeep<OptionalDecimalKeys, Tagged<'1.2', 'Path'>>>().toBe<{1.2?: string; 1?: {2: number}}>();

// Broad path segments and missing paths keep the same meaning after unwrapping.
expectTypeOf<SetRequiredDeep<{a?: string; b?: {c?: number}}, Tagged<string, 'Path'>>>().toBe<{a: string; b: {c?: number}}>();
expectTypeOf<SetRequiredDeep<{a?: {b?: string; c?: number}}, Tagged<`a.${string}`, 'Path'>>>().toBe<{a?: {b: string; c: number}}>();
expectTypeOf<SetRequiredDeep<{a?: string}, Tagged<'missing', 'Path'>>>().toBe<{a?: string}>();

expectTypeOf<SetRequiredDeep<{a?: any; b?: never; c?: unknown}, Tagged<'a' | 'b' | 'c', 'Path'>>>().toBe<{a: any; b: never; c: unknown}>();
expectTypeOf<SetRequiredDeep<any, Tagged<'a.b', 'Path'>>>().toBe<any>();
expectTypeOf<SetRequiredDeep<never, Tagged<'a.b', 'Path'>>>().toBe<never>();
expectTypeOf<SetRequiredDeep<unknown, never>>().toBe<unknown>();
// @ts-expect-error A path must be a string or number, even when its source is unknown.
type UnknownBrandedPath = SetRequiredDeep<{a?: string}, unknown>;

// A wide autocomplete alternative must not erase the known nested selection.
expectTypeOf<SetRequiredDeep<{a: {b?: string; c?: number}; d?: string}, LiteralUnion<'a.b', string>>>().toBe<{a: {b: string; c?: number}; d: string}>();

// Requiring a declared descendant leaves unrelated dynamic rows optional.
type IndexedOptionalRows = {[key: string]: {id?: number}; known: {id?: number}};
const requiredKnownRow: SetRequiredDeep<IndexedOptionalRows, 'known.id'> = {known: {id: 1}, dynamic: {}};
expectTypeOf(requiredKnownRow.known.id).toBe<number>();
expectTypeOf<SetRequiredDeep<IndexedOptionalRows, 'known.id'>[string]>().toBe<{id?: number}>();

// Declared numeric and pattern keys narrow independently of their covering signature.
type NumericOptionalRows = {[key: number]: {id?: number}; 0: {id?: number}};
const requiredNumericRow: SetRequiredDeep<NumericOptionalRows, '0.id'> = {0: {id: 1}, 1: {}};
expectTypeOf(requiredNumericRow[0].id).toBe<number>();
expectTypeOf<SetRequiredDeep<NumericOptionalRows, '0.id'>[number]>().toBe<{id?: number}>();
type PatternOptionalRows = {[key: `item${string}`]: {id?: number}; readonly itemKnown: {readonly id?: number}};
const requiredPatternRow: SetRequiredDeep<PatternOptionalRows, 'itemKnown.id'> = {itemKnown: {id: 1}, itemOther: {}};
expectTypeOf(requiredPatternRow.itemKnown.id).toBe<number>();
// @ts-expect-error A selected descendant keeps its original readonly modifier.
requiredPatternRow.itemKnown.id = 1;
// @ts-expect-error A declared selected descendant must be present, while a dynamic row may omit it.
const missingRequiredKnown: SetRequiredDeep<IndexedOptionalRows, 'known.id'> = {known: {}, dynamic: {}};

function requireDeclaredRow<Value>(id: Value): SetRequiredDeep<{[key: string]: {id?: Value}; known: {id?: Value}}, 'known.id'> {
	return {known: {id}, dynamic: {}};
}

expectTypeOf(requireDeclaredRow('selected').known.id).toBe<string>();
expectTypeOf<SetRequiredDeep<Record<string, {id?: number}>, 'dynamic.id'>[string]>().toBe<{id: number}>();

// Enum declarations use the same printed property name as a string path.
enum DeclaredRowKey {
	Known = 'known',
}
const enumDeclaredRow: SetRequiredDeep<{[key: string]: {id?: number}; [DeclaredRowKey.Known]: {id?: number}}, 'known.id'> = {known: {id: 1}, dynamic: {}};
expectTypeOf(enumDeclaredRow.known.id).toBe<number>();

// A terminal path matches an enum key by its printed name, and an enum path matches a declared key.
enum TerminalEnumKey {
	Known = 'known',
}
expectTypeOf<SetRequiredDeep<{[TerminalEnumKey.Known]?: number; other?: number}, 'known'>>().toBe<{[TerminalEnumKey.Known]: number; other?: number}>();
expectTypeOf<SetRequiredDeep<{known?: number; other?: number}, TerminalEnumKey.Known>>().toBe<{known: number; other?: number}>();

// A noncanonical numeric segment, such as `01`, does not name an array index or a number key, but it is still a string key.
expectTypeOf<SetRequiredDeep<{a: Array<{id?: number}>}, 'a.01.id'>>().toBe<{a: Array<{id?: number}>}>();
expectTypeOf<SetRequiredDeep<{a: [{id?: number}, {id?: number}]}, 'a.01.id'>>().toBe<{a: [{id?: number}, {id?: number}]}>();
expectTypeOf<SetRequiredDeep<{[key: number]: {id?: number}}, '01.id'>>().toBe<{[key: number]: {id?: number}}>();
expectTypeOf<SetRequiredDeep<{1: {id?: number}}, '01.id'>>().toBe<{1: {id?: number}}>();
expectTypeOf<SetRequiredDeep<{'01': {id?: number}}, '01.id'>>().toBe<{'01': {id: number}}>();
expectTypeOf<SetRequiredDeep<{[key: string]: {id?: number}}, '01.id'>[string]>().toBe<{id: number}>();
expectTypeOf<SetRequiredDeep<{a: Array<{id?: number}>}, 'a.1.id'>>().toBe<{a: Array<{id: number}>}>();
enum SegmentNumericEnumKey {
	Zero,
	One,
}
expectTypeOf<SetRequiredDeep<{[SegmentNumericEnumKey.One]: {id?: number}}, '1.id'>>().toBe<{[SegmentNumericEnumKey.One]: {id: number}}>();
expectTypeOf<SetRequiredDeep<{[SegmentNumericEnumKey.One]: {id?: number}}, '01.id'>>().toBe<{[SegmentNumericEnumKey.One]: {id?: number}}>();
