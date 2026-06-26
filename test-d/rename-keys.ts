import {expectType} from 'tsd';
import type {RenameKeys} from '../source/rename-keys.d.ts';

// Basic batch rename.
expectType<{id: string; first_name: string; created_at: Date}>(
	{} as RenameKeys<{id: string; firstName: string; createdAt: Date}, {firstName: 'first_name'; createdAt: 'created_at'}>,
);

// Empty rename map is identity.
expectType<{a: number; b: string}>({} as RenameKeys<{a: number; b: string}, {}>);

// Partial rename, unlisted keys are unchanged.
expectType<{alpha: number; b: string; c: boolean}>(
	{} as RenameKeys<{a: number; b: string; c: boolean}, {a: 'alpha'}>,
);

// `readonly` and optional modifiers are both applied to the new name.
expectType<{readonly identifier: string; name?: string; count: number}>(
	{} as RenameKeys<{readonly id: string; label?: string; count: number}, {id: 'identifier'; label: 'name'}>,
);

// Distributes over a union of rename maps.
expectType<{x: 1; b: 2} | {a: 1; y: 2}>(
	{} as RenameKeys<{a: 1; b: 2}, {a: 'x'} | {b: 'y'}>,
);

// Distributes over a union source type.
expectType<{kind: 'click'; element: string} | {kind: 'submit'; element: HTMLFormElement}>(
	{} as RenameKeys<{kind: 'click'; target: string} | {kind: 'submit'; target: HTMLFormElement}, {target: 'element'}>,
);

// Symbol target key.
declare const symbolKey: unique symbol;
type SymbolKey = typeof symbolKey;
expectType<{[symbolKey]: string; other: number}>(
	{} as RenameKeys<{tag: string; other: number}, {tag: SymbolKey}>,
);

// Number target keys.
expectType<{0: number; 1: string}>(
	{} as RenameKeys<{first: number; second: string}, {first: 0; second: 1}>,
);

// A literal target onto a string-indexed object is allowed. The index signature
// does not preclude adding a named property.
expectType<{[x: string]: number; b: 1}>(
	{} as RenameKeys<{[x: string]: number; a: 1}, {a: 'b'}>,
);

// Swapping two keys is allowed. Both keys rename away simultaneously, so no
// kept-key collision occurs.
expectType<{b: 1; a: 2}>({} as RenameKeys<{a: 1; b: 2}, {a: 'b'; b: 'a'}>);

// Renaming a key to itself is a no-op.
expectType<{a: 1; b: 2}>({} as RenameKeys<{a: 1; b: 2}, {a: 'a'}>);

// Typo'd source key is ignored, matching `Omit`'s result on missing keys.
expectType<{a: 1; b: 2}>({} as RenameKeys<{a: 1; b: 2}, {nme: 'fullName'}>);

// Optional rename-map entries have the optional modifier ignored.
expectType<{alpha: number; b: string}>({} as RenameKeys<{a: number; b: string}, {a?: 'alpha'}>);

// Collision with a kept property merges the values into a union.
expectType<{b: number | string}>({} as RenameKeys<{a: number; b: string}, {a: 'b'}>);

// Cross-union collision merges per union member.
expectType<{b: number} | {b: string}>({} as RenameKeys<{a: number} | {b: string}, {a: 'b'}>);

// Duplicate targets across the same rename map merge into a union.
expectType<{x: 1 | 2; c: 3}>({} as RenameKeys<{a: 1; b: 2; c: 3}, {a: 'x'; b: 'x'}>);

// A non-literal target (like `string`) is ignored, leaving that key unchanged,
// the same way a missing source key is ignored.
expectType<{a: number; b: string}>({} as RenameKeys<{a: number; b: string}, {a: string}>);

// Other entries in the same map still apply.
expectType<{a: number; c: string}>({} as RenameKeys<{a: number; b: string}, {a: string; b: 'c'}>);

// More non-literal targets, all ignored.
expectType<{a: number; c: string}>({} as RenameKeys<{a: number; b: string}, {a: Uppercase<string>; b: 'c'}>);
expectType<{a: number; c: string}>({} as RenameKeys<{a: number; b: string}, {a: `foo${string}`; b: 'c'}>);
expectType<{a: 1; c: 2}>({} as RenameKeys<{a: 1; b: 2}, {a: number; b: 'c'}>);
expectType<{a: 1; c: 2}>({} as RenameKeys<{a: 1; b: 2}, {a: symbol; b: 'c'}>);

// A union target with a non-literal member is ignored as a whole.
expectType<{a: 1}>({} as RenameKeys<{a: 1}, {a: 'b' | string}>);

// A map whose targets are all non-literal is the identity.
expectType<{a: 1; b: 2}>({} as RenameKeys<{a: 1; b: 2}, {a: string; b: number}>);

// An ignored key's kept name can collide with another rename and merge values.
expectType<{a: 1 | 2}>({} as RenameKeys<{a: 1; b: 2}, {a: string; b: 'a'}>);

// Union targets distribute, producing one output key per member.
expectType<{b: string; c: string}>({} as RenameKeys<{a: string}, {a: 'b' | 'c'}>);

// Union target preserves modifiers across all expanded keys.
expectType<{readonly b: string; readonly c: string}>(
	{} as RenameKeys<{readonly a: string}, {a: 'b' | 'c'}>,
);

// Preserves optional modifier only when all contributors are optional.
expectType<{b?: string; c?: string}>({} as RenameKeys<{a?: string}, {a: 'b' | 'c'}>);

// Union target combined with a kept-key collision. Both `b` and `c` are
// produced, and `b` merges the source's `a` and `b` values.
expectType<{b: 1 | 2; c: 1}>({} as RenameKeys<{a: 1; b: 2}, {a: 'b' | 'c'}>);

// Union target combined with another source mapping to the same target.
expectType<{b: string | number; c: number}>(
	{} as RenameKeys<{a: string; d: number}, {a: 'b'; d: 'b' | 'c'}>,
);

// Three-member union of rename maps distributes correctly.
expectType<{x: 1; b: 2; c: 3} | {a: 1; y: 2; c: 3} | {a: 1; b: 2; z: 3}>(
	{} as RenameKeys<{a: 1; b: 2; c: 3}, {a: 'x'} | {b: 'y'} | {c: 'z'}>,
);

// `any` source returns `never`. The target key cannot be proven absent from
// an `any` shape.
expectType<never>({} as RenameKeys<any, {a: 'x'}>);

// Generic instantiation. The constraint is structural-only, so the type can
// be used inside other generics without erroring at the definition site.
type WrappedGeneric<T, K extends keyof T & string> = RenameKeys<T, {[P in K]: `new_${P}`}>;
expectType<{new_a: number; b: string; new_c: string}>({} as WrappedGeneric<{a: number; b: string; c: string}, 'a' | 'c'>);

// All contributors required.
expectType<{new_p: string | number | bigint}>(
	{} as RenameKeys<{p1: string; p2: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);

// All contributors optional, optional modifier applies to the target.
expectType<{new_p?: string | number | bigint}>(
	{} as RenameKeys<{p1?: string; p2?: number; p3?: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);

// Mixed-optionality merge. The target is required because at least one
// contributor is required. The value type follows `exactOptionalPropertyTypes`.
// With EOPT on (as in this test project), the value omits `undefined`.
expectType<{new_p: string | number | bigint}>(
	{} as RenameKeys<{p1: string; p2?: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);

// Mixed-readonly merge. The target is readonly because at least one
// contributor is readonly.
expectType<{readonly new_p: string | number | bigint}>(
	{} as RenameKeys<{p1: string; readonly p2: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);

// Optional source first, required source second. The target is required
// because a required contributor exists, regardless of source order.
expectType<{x: number | string}>(
	{} as RenameKeys<{a?: number; b: string}, {a: 'x'; b: 'x'}>,
);

// Required source first, optional source second.
expectType<{x: string | number}>(
	{} as RenameKeys<{a: string; b?: number}, {a: 'x'; b: 'x'}>,
);

// Three sources with the optional one in the middle.
expectType<{z: number | string | bigint}>(
	{} as RenameKeys<{a: number; b?: string; c: bigint}, {a: 'z'; b: 'z'; c: 'z'}>,
);

// Three sources with the optional one at the end.
expectType<{z: number | string | bigint}>(
	{} as RenameKeys<{a: number; b: string; c?: bigint}, {a: 'z'; b: 'z'; c: 'z'}>,
);

// Mixed readonly AND mixed optionality. Any readonly contributor results in
// readonly, any required contributor results in required.
expectType<{readonly x: string | number}>(
	{} as RenameKeys<{readonly a?: string; b: number}, {a: 'x'; b: 'x'}>,
);

// Any readonly contributor with all optional contributors.
expectType<{readonly x?: string | number}>(
	{} as RenameKeys<{readonly a?: string; b?: number}, {a: 'x'; b: 'x'}>,
);

// Union target with mixed optionality across members. The required target
// is required, the optional-only target is optional.
expectType<{x: number | string; y?: number}>(
	{} as RenameKeys<{a?: number; b: string}, {a: 'x' | 'y'; b: 'x'}>,
);

// Union target where one member collides with a kept required key.
expectType<{b: number | string; c: number | boolean}>(
	{} as RenameKeys<{a?: number; b: string; c: boolean}, {a: 'b' | 'c'}>,
);

// Sources span all four modifier categories simultaneously.
expectType<{
	readonly x: 'a-val' | 'b-val';
	readonly y?: 'b-val' | 'c-val';
	z: 'd-val';
}>(
	{} as RenameKeys<
		{
			readonly a: 'a-val';
			b?: 'b-val';
			readonly c?: 'c-val';
			d: 'd-val';
		},
		{a: 'x'; b: 'x' | 'y'; c: 'y'; d: 'z'}
	>,
);

// Index signature is preserved when the only renamed source is optional. The
// index sig key must not affect the target's modifier routing.
expectType<{[x: string]: number; b?: 1}>(
	{} as RenameKeys<{[x: string]: number; a?: 1}, {a: 'b'}>,
);

// Three-way swap with the optional source in the middle.
expectType<{b: 1; c?: 2; a: 3}>(
	{} as RenameKeys<{a: 1; b?: 2; c: 3}, {a: 'b'; b: 'c'; c: 'a'}>,
);

// Swapping a required and an optional key. Each modifier travels with its key,
// so the new `a` is optional (it came from the optional `b`).
expectType<{b: 1; a?: 2}>({} as RenameKeys<{a: 1; b?: 2}, {a: 'b'; b: 'a'}>);

// Symbol source key renamed through a symbol map key.
expectType<{x: 1; b: 2}>({} as RenameKeys<{[symbolKey]: 1; b: 2}, {[symbolKey]: 'x'}>);

// Two sources merged into a symbol target.
expectType<{[symbolKey]: 1 | 2}>(
	{} as RenameKeys<{a?: 1; b: 2}, {a: SymbolKey; b: SymbolKey}>,
);

// Both string and number index signatures are carried across.
expectType<{[x: string]: unknown; [x: number]: number; b?: 1}>(
	{} as RenameKeys<{[x: string]: unknown; [x: number]: number; a?: 1}, {a: 'b'}>,
);

// A readonly index signature stays readonly.
expectType<{readonly [x: string]: number; b?: 1}>(
	{} as RenameKeys<{readonly [x: string]: number; a?: 1}, {a: 'b'}>,
);

// `any` and `unknown` values survive a merge.
expectType<{x: any}>({} as RenameKeys<{a: any; b?: 1}, {a: 'x'; b: 'x'}>);
expectType<{x: unknown}>({} as RenameKeys<{a: unknown; b?: 1}, {a: 'x'; b: 'x'}>);

// A self-referential source renames one key, the recursive reference is left alone.
type Tree = {value: number; next: Tree};
expectType<{v: number; next: Tree}>({} as RenameKeys<Tree, {value: 'v'}>);

// An explicit `| undefined` in a required value is kept on rename.
expectType<{x: number | undefined; b: 2}>(
	{} as RenameKeys<{a: number | undefined; b: 2}, {a: 'x'}>,
);

// Numeric keys merged into one target.
expectType<{a: string | number}>({} as RenameKeys<{0: number; 1?: string}, {0: 'a'; 1: 'a'}>);
