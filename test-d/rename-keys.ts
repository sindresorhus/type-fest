import {expectTypeOf} from 'nz';
import type {RenameKeys} from '../source/rename-keys.d.ts';

// Basic batch rename.
expectTypeOf<RenameKeys<{id: string; firstName: string; createdAt: Date}, {firstName: 'first_name'; createdAt: 'created_at'}>>().toBe<{id: string; first_name: string; created_at: Date}>();

// Empty rename map is identity.
expectTypeOf<RenameKeys<{a: number; b: string}, {}>>().toBe<{a: number; b: string}>();

// Partial rename, unlisted keys are unchanged.
expectTypeOf<RenameKeys<{a: number; b: string; c: boolean}, {a: 'alpha'}>>().toBe<{alpha: number; b: string; c: boolean}>();

// `readonly` and optional modifiers are both applied to the new name.
expectTypeOf<RenameKeys<{readonly id: string; label?: string; count: number}, {id: 'identifier'; label: 'name'}>>().toBe<{readonly identifier: string; name?: string; count: number}>();

// Distributes over a union of rename maps.
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: 'x'} | {b: 'y'}>>().toBe<{x: 1; b: 2} | {a: 1; y: 2}>();

// Distributes over a union source type.
expectTypeOf<RenameKeys<{kind: 'click'; target: string} | {kind: 'submit'; target: HTMLFormElement}, {target: 'element'}>>().toBe<{kind: 'click'; element: string} | {kind: 'submit'; element: HTMLFormElement}>();

// Symbol target key.
declare const symbolKey: unique symbol;
type SymbolKey = typeof symbolKey;
expectTypeOf<RenameKeys<{tag: string; other: number}, {tag: SymbolKey}>>().toBe<{[symbolKey]: string; other: number}>();

// Number target keys.
expectTypeOf<RenameKeys<{first: number; second: string}, {first: 0; second: 1}>>().toBe<{0: number; 1: string}>();

// A literal target onto a string-indexed object is allowed. The index signature
// does not preclude adding a named property.
expectTypeOf<RenameKeys<{[x: string]: number; a: 1}, {a: 'b'}>>().toBe<{[x: string]: number; b: 1}>();

// Swapping two keys is allowed. Both keys rename away simultaneously, so no
// kept-key collision occurs.
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: 'b'; b: 'a'}>>().toBe<{b: 1; a: 2}>();

// Renaming a key to itself is a no-op.
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: 'a'}>>().toBe<{a: 1; b: 2}>();

// Typo'd source key is ignored, matching `Omit`'s result on missing keys.
expectTypeOf<RenameKeys<{a: 1; b: 2}, {nme: 'fullName'}>>().toBe<{a: 1; b: 2}>();

// Optional rename-map entries have the optional modifier ignored.
expectTypeOf<RenameKeys<{a: number; b: string}, {a?: 'alpha'}>>().toBe<{alpha: number; b: string}>();

// Collision with a kept property merges the values into a union.
expectTypeOf<RenameKeys<{a: number; b: string}, {a: 'b'}>>().toBe<{b: number | string}>();

// Cross-union collision merges per union member.
expectTypeOf<RenameKeys<{a: number} | {b: string}, {a: 'b'}>>().toBe<{b: number} | {b: string}>();

// Duplicate targets across the same rename map merge into a union.
expectTypeOf<RenameKeys<{a: 1; b: 2; c: 3}, {a: 'x'; b: 'x'}>>().toBe<{x: 1 | 2; c: 3}>();

// A non-literal target (like `string`) is ignored, leaving that key unchanged,
// the same way a missing source key is ignored.
expectTypeOf<RenameKeys<{a: number; b: string}, {a: string}>>().toBe<{a: number; b: string}>();

// Other entries in the same map still apply.
expectTypeOf<RenameKeys<{a: number; b: string}, {a: string; b: 'c'}>>().toBe<{a: number; c: string}>();

// More non-literal targets, all ignored.
expectTypeOf<RenameKeys<{a: number; b: string}, {a: Uppercase<string>; b: 'c'}>>().toBe<{a: number; c: string}>();
expectTypeOf<RenameKeys<{a: number; b: string}, {a: `foo${string}`; b: 'c'}>>().toBe<{a: number; c: string}>();
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: number; b: 'c'}>>().toBe<{a: 1; c: 2}>();
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: symbol; b: 'c'}>>().toBe<{a: 1; c: 2}>();

// A union target with a non-literal member is ignored as a whole.
expectTypeOf<RenameKeys<{a: 1}, {a: 'b' | string}>>().toBe<{a: 1}>();

// A map whose targets are all non-literal is the identity.
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: string; b: number}>>().toBe<{a: 1; b: 2}>();

// An ignored key's kept name can collide with another rename and merge values.
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: string; b: 'a'}>>().toBe<{a: 1 | 2}>();

// Union targets distribute, producing one output key per member.
expectTypeOf<RenameKeys<{a: string}, {a: 'b' | 'c'}>>().toBe<{b: string; c: string}>();

// Union target preserves modifiers across all expanded keys.
expectTypeOf<RenameKeys<{readonly a: string}, {a: 'b' | 'c'}>>().toBe<{readonly b: string; readonly c: string}>();

// Preserves optional modifier only when all contributors are optional.
expectTypeOf<RenameKeys<{a?: string}, {a: 'b' | 'c'}>>().toBe<{b?: string; c?: string}>();

// Union target combined with a kept-key collision. Both `b` and `c` are
// produced, and `b` merges the source's `a` and `b` values.
expectTypeOf<RenameKeys<{a: 1; b: 2}, {a: 'b' | 'c'}>>().toBe<{b: 1 | 2; c: 1}>();

// Union target combined with another source mapping to the same target.
expectTypeOf<RenameKeys<{a: string; d: number}, {a: 'b'; d: 'b' | 'c'}>>().toBe<{b: string | number; c: number}>();

// Three-member union of rename maps distributes correctly.
expectTypeOf<RenameKeys<{a: 1; b: 2; c: 3}, {a: 'x'} | {b: 'y'} | {c: 'z'}>>().toBe<{x: 1; b: 2; c: 3} | {a: 1; y: 2; c: 3} | {a: 1; b: 2; z: 3}>();

// `any` source returns `any`.
expectTypeOf<RenameKeys<any, {a: 'x'}>>().toBe<any>();

// `never` source returns `never`.
expectTypeOf<RenameKeys<never, {a: 'x'}>>().toBe<never>();

// @ts-expect-error -- A non-object source is rejected by the `object` constraint.
type Rejected = RenameKeys<string, {a: 'b'}>;

// Generic instantiation works inside other generics without erroring at the
// definition site.
type WrappedGeneric<T extends object, K extends keyof T & string> = RenameKeys<T, {[P in K]: `new_${P}`}>;
expectTypeOf<WrappedGeneric<{a: number; b: string; c: string}, 'a' | 'c'>>().toBe<{new_a: number; b: string; new_c: string}>();

// All contributors required.
expectTypeOf<RenameKeys<{p1: string; p2: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>>().toBe<{new_p: string | number | bigint}>();

// All contributors optional, optional modifier applies to the target.
expectTypeOf<RenameKeys<{p1?: string; p2?: number; p3?: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>>().toBe<{new_p?: string | number | bigint}>();

// Mixed-optionality merge. The target is required because at least one
// contributor is required. The value type follows `exactOptionalPropertyTypes`.
// With EOPT on (as in this test project), the value omits `undefined`.
expectTypeOf<RenameKeys<{p1: string; p2?: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>>().toBe<{new_p: string | number | bigint}>();

// Mixed-readonly merge. The target is readonly because at least one
// contributor is readonly.
expectTypeOf<RenameKeys<{p1: string; readonly p2: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>>().toBe<{readonly new_p: string | number | bigint}>();

// Union-valued sources merge into a flattened union.
expectTypeOf<RenameKeys<{a: 1 | 2; b: 3 | 4}, {a: 'x'; b: 'x'}>>().toBe<{x: 1 | 2 | 3 | 4}>();

// Overlapping members in the merged union collapse.
expectTypeOf<RenameKeys<{a: 1 | 2; b: 2 | 3}, {a: 'x'; b: 'x'}>>().toBe<{x: 1 | 2 | 3}>();

// Union-valued mixed-optionality merge. The target is required and the values flatten.
expectTypeOf<RenameKeys<{a?: 1 | 2; b: 3}, {a: 'x'; b: 'x'}>>().toBe<{x: 1 | 2 | 3}>();

// Optional source first, required source second. The target is required
// because a required contributor exists, regardless of source order.
expectTypeOf<RenameKeys<{a?: number; b: string}, {a: 'x'; b: 'x'}>>().toBe<{x: number | string}>();

// Required source first, optional source second.
expectTypeOf<RenameKeys<{a: string; b?: number}, {a: 'x'; b: 'x'}>>().toBe<{x: string | number}>();

// Three sources with the optional one in the middle.
expectTypeOf<RenameKeys<{a: number; b?: string; c: bigint}, {a: 'z'; b: 'z'; c: 'z'}>>().toBe<{z: number | string | bigint}>();

// Three sources with the optional one at the end.
expectTypeOf<RenameKeys<{a: number; b: string; c?: bigint}, {a: 'z'; b: 'z'; c: 'z'}>>().toBe<{z: number | string | bigint}>();

// Mixed readonly AND mixed optionality. Any readonly contributor results in
// readonly, any required contributor results in required.
expectTypeOf<RenameKeys<{readonly a?: string; b: number}, {a: 'x'; b: 'x'}>>().toBe<{readonly x: string | number}>();

// Any readonly contributor with all optional contributors.
expectTypeOf<RenameKeys<{readonly a?: string; b?: number}, {a: 'x'; b: 'x'}>>().toBe<{readonly x?: string | number}>();

// Union target with mixed optionality across members. The required target
// is required, the optional-only target is optional.
expectTypeOf<RenameKeys<{a?: number; b: string}, {a: 'x' | 'y'; b: 'x'}>>().toBe<{x: number | string; y?: number}>();

// Union target where one member collides with a kept required key.
expectTypeOf<RenameKeys<{a?: number; b: string; c: boolean}, {a: 'b' | 'c'}>>().toBe<{b: number | string; c: number | boolean}>();

// Sources span all four modifier categories simultaneously.
expectTypeOf<RenameKeys<
	{
		readonly a: 'a-val';
		b?: 'b-val';
		readonly c?: 'c-val';
		d: 'd-val';
	},
	{a: 'x'; b: 'x' | 'y'; c: 'y'; d: 'z'}
>>().toBe<{
	readonly x: 'a-val' | 'b-val';
	readonly y?: 'b-val' | 'c-val';
	z: 'd-val';
}>();

// Index signature is preserved when the only renamed source is optional. The
// index sig key must not affect the target's modifier routing.
expectTypeOf<RenameKeys<{[x: string]: number; a?: 1}, {a: 'b'}>>().toBe<{[x: string]: number; b?: 1}>();

// Three-way swap with the optional source in the middle.
expectTypeOf<RenameKeys<{a: 1; b?: 2; c: 3}, {a: 'b'; b: 'c'; c: 'a'}>>().toBe<{b: 1; c?: 2; a: 3}>();

// Swapping a required and an optional key. Each modifier travels with its key,
// so the new `a` is optional (it came from the optional `b`).
expectTypeOf<RenameKeys<{a: 1; b?: 2}, {a: 'b'; b: 'a'}>>().toBe<{b: 1; a?: 2}>();

// Symbol source key renamed through a symbol map key.
expectTypeOf<RenameKeys<{[symbolKey]: 1; b: 2}, {[symbolKey]: 'x'}>>().toBe<{x: 1; b: 2}>();

// Two sources merged into a symbol target.
expectTypeOf<RenameKeys<{a?: 1; b: 2}, {a: SymbolKey; b: SymbolKey}>>().toBe<{[symbolKey]: 1 | 2}>();

// Both string and number index signatures are carried across.
expectTypeOf<RenameKeys<{[x: string]: unknown; [x: number]: number; a?: 1}, {a: 'b'}>>().toBe<{[x: string]: unknown; [x: number]: number; b?: 1}>();

// A readonly index signature stays readonly.
expectTypeOf<RenameKeys<{readonly [x: string]: number; a?: 1}, {a: 'b'}>>().toBe<{readonly [x: string]: number; b?: 1}>();

// `any` and `unknown` values survive a merge.
expectTypeOf<RenameKeys<{a: any; b?: 1}, {a: 'x'; b: 'x'}>>().toBe<{x: any}>();
expectTypeOf<RenameKeys<{a: unknown; b?: 1}, {a: 'x'; b: 'x'}>>().toBe<{x: unknown}>();

// A self-referential source renames one key, the recursive reference is left alone.
type Tree = {value: number; next: Tree};
expectTypeOf<RenameKeys<Tree, {value: 'v'}>>().toBe<{v: number; next: Tree}>();

// An explicit `| undefined` in a required value is kept on rename.
expectTypeOf<RenameKeys<{a: number | undefined; b: 2}, {a: 'x'}>>().toBe<{x: number | undefined; b: 2}>();

// Numeric keys merged into one target.
expectTypeOf<RenameKeys<{0: number; 1?: string}, {0: 'a'; 1: 'a'}>>().toBe<{a: string | number}>();

// A `never` map renames nothing, so the result is the base type.
expectTypeOf<RenameKeys<{a: 1}, never>>().toBe<{a: 1}>();
expectTypeOf<RenameKeys<{a: 1; b: 2}, {}>>().toBe<{a: 1; b: 2}>();
expectTypeOf<RenameKeys<{a: 1; readonly b: 2}, never>>().toBe<{a: 1; readonly b: 2}>();

// A tuple and an array are objects too, so an empty rename map must leave them unchanged. Without this, the `as` clause below drops the tuple and the array gains a `readonly`.
declare const tupleUnchanged: RenameKeys<[1, 2], {}>;
expectTypeOf(tupleUnchanged).toBe<[1, 2]>();

declare const arrayUnchanged: RenameKeys<string[], {}>;
expectTypeOf(arrayUnchanged).toBe<string[]>();

declare const unionUnchanged: RenameKeys<[1, 2] | {a: 1}, {}>;
expectTypeOf(unionUnchanged).toBe<[1, 2] | {a: 1}>();

// A map that only renames keys to themselves renames nothing, so it must not rebuild the type either. Rebuilding is what drops the tuple-ness of a tuple and adds a `readonly` to an array.
declare const tupleSelfRenamed: RenameKeys<[1, 2], {a: 'a'}>;
expectTypeOf(tupleSelfRenamed).toBe<[1, 2]>();

declare const arraySelfRenamed: RenameKeys<string[], {a: 'a'}>;
expectTypeOf(arraySelfRenamed).toBe<string[]>();

declare const unionWithSelfRenamedTuple: RenameKeys<[1, 2] | {a: 1}, {a: 'a'}>;
expectTypeOf(unionWithSelfRenamedTuple).toBe<[1, 2] | {a: 1}>();

declare const objectSelfRenamedTwice: RenameKeys<{a: 1}, {a: 'a'; b: 'b'}>;
expectTypeOf(objectSelfRenamedTwice).toBe<{a: 1}>();

// Known limitation: a real rename of an array or tuple is unsupported and gives `never`. An ignored rename leaves the member unchanged, including in a union. See the docs.
declare const tupleRenamed: RenameKeys<[1, 2], {0: 'x'}>;
expectTypeOf(tupleRenamed).toBe<never>();

expectTypeOf<RenameKeys<string[], {length: 'size'}>>().toBe<never>();

declare const unionWithTuple: RenameKeys<[1, 2] | {a: 1}, {a: 'x'}>;
expectTypeOf(unionWithTuple).toBe<[1, 2] | {x: 1}>();

// At runtime a numeric key and its string form are the same key, so a rename written either way renames the property.
declare const numericKey: RenameKeys<{0: 1}, {'0': 'x'}>;
expectTypeOf(numericKey).toBe<{x: 1}>();

declare const numericKeyOtherWay: RenameKeys<{0: 1}, {0: 'x'}>;
expectTypeOf(numericKeyOtherWay).toBe<{x: 1}>();

expectTypeOf<RenameKeys<{'0': 1}, {0: 'x'}>>().toBe<{x: 1}>();

// A map whose key is not a literal still renames, because a target cannot be compared with a pattern: `Record<string, 'x'>` renames every key rather than renaming a key to itself.
declare const indexSignatureMap: RenameKeys<{a: 1; b: 2}, Record<string, 'x'>>;
expectTypeOf(indexSignatureMap).toBe<{x: 1 | 2}>();

// A real rename of a callable object drops the call signature, while a map that renames nothing keeps it. The rename is a mapped type over `keyof`, which cannot carry one. See the note in the docs.
type CallableWithProperty = {(a: string): number; p?: number};

declare const renamesCallSignature: RenameKeys<CallableWithProperty, {p: 'q'}>;
expectTypeOf(renamesCallSignature).toBe<{q?: number}>();

declare const keepsCallSignature: RenameKeys<CallableWithProperty, {}>;
expectTypeOf(keepsCallSignature).toBe<CallableWithProperty>();

// Missing source keys are ignored without rebuilding tuples, arrays, or callable objects.
expectTypeOf<RenameKeys<[1, 2], {missing: 'renamed'}>>().toBe<[1, 2]>();
expectTypeOf<RenameKeys<string[], {missing: 'renamed'}>>().toBe<string[]>();
expectTypeOf<RenameKeys<CallableWithProperty, {missing: 'renamed'}>>().toBe<CallableWithProperty>();

// Renaming a numeric tuple key to itself also leaves its structure unchanged.
expectTypeOf<RenameKeys<[1, 2], {'0': '0'}>>().toBe<[1, 2]>();

// Numeric and string spellings of the same target key are both identity renames.
expectTypeOf<RenameKeys<[1, 2], {0: 0}>>().toBe<[1, 2]>();
expectTypeOf<RenameKeys<readonly [1, 2], {'0': 0}>>().toBe<readonly [1, 2]>();

// A literal target changes a broad source key even though it is assignable to that key.
expectTypeOf<RenameKeys<Record<string, 1>, Record<string, 'x'>>>().toBe<{x: 1}>();
