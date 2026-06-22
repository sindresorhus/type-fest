import {expectType} from 'tsd';
import type {RenameKeys} from '../source/rename-keys.d.ts';

// Basic batch rename.
expectType<{id: string; first_name: string; created_at: Date}>(
	{} as RenameKeys<{id: string; firstName: string; createdAt: Date}, {firstName: 'first_name'; createdAt: 'created_at'}>,
);

// Empty rename map is identity.
expectType<{a: number; b: string}>({} as RenameKeys<{a: number; b: string}, {}>);

// Partial rename: unlisted keys pass through.
expectType<{alpha: number; b: string; c: boolean}>(
	{} as RenameKeys<{a: number; b: string; c: boolean}, {a: 'alpha'}>,
);

// `readonly` and optional combine and travel together to the new name.
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

// A literal target onto a string-indexed object is fine: the index signature
// does not preclude adding a named property.
expectType<{[x: string]: number; b: 1}>(
	{} as RenameKeys<{[x: string]: number; a: 1}, {a: 'b'}>,
);

// Swapping two keys is fine: both keys rename away simultaneously, so no
// kept-key collision occurs.
expectType<{b: 1; a: 2}>({} as RenameKeys<{a: 1; b: 2}, {a: 'b'; b: 'a'}>);

// Renaming to itself is a no-op (the only "collision" allowed: the key is
// renaming away, not into a kept property).
expectType<{a: 1; b: 2}>({} as RenameKeys<{a: 1; b: 2}, {a: 'a'}>);

// Typo'd source key is ignored, matching `Omit`'s behavior on missing keys.
expectType<{a: 1; b: 2}>({} as RenameKeys<{a: 1; b: 2}, {nme: 'fullName'}>);

// Optional rename-map entry returns `never`. Without this, an optional source
// key could silently make a required target key optional.
expectType<never>({} as RenameKeys<{a: number; b: string}, {a?: 'alpha'}>);

// Collision with a kept property merges the values into a union.
expectType<{b: number | string}>({} as RenameKeys<{a: number; b: string}, {a: 'b'}>);

// Cross-union collision merges per union member.
expectType<{b: number} | {b: string}>({} as RenameKeys<{a: number} | {b: string}, {a: 'b'}>);

// Duplicate targets across the same rename map merge into a union.
expectType<{x: 1 | 2; c: 3}>({} as RenameKeys<{a: 1; b: 2; c: 3}, {a: 'x'; b: 'x'}>);

// Non-literal targets return `never`: a `string`-typed target would widen to
// an index signature.
expectType<never>({} as RenameKeys<{a: number; b: string}, {a: string}>);

// Union targets return `never`: a `'b' | 'c'` target would distribute in the
// mapped-type `as` clause and create multiple output keys.
expectType<never>({} as RenameKeys<{a: 1; b: 2}, {a: 'b' | 'c'}>);

// Three-member union of rename maps distributes correctly.
expectType<{x: 1; b: 2; c: 3} | {a: 1; y: 2; c: 3} | {a: 1; b: 2; z: 3}>(
	{} as RenameKeys<{a: 1; b: 2; c: 3}, {a: 'x'} | {b: 'y'} | {c: 'z'}>,
);

// `any` source returns `never`: the target key cannot be proven absent from
// an `any` shape.
expectType<never>({} as RenameKeys<any, {a: 'x'}>);

// Generic instantiation: the constraint is structural-only, so the type can
// be used inside other generics without erroring at the definition site.
type WrappedGeneric<T, K extends keyof T & string> = RenameKeys<T, {[P in K]: `new_${P}`}>;
expectType<{new_a: number; b: string; new_c: string}>({} as WrappedGeneric<{a: number; b: string; c: string}, 'a' | 'c'>);

// Merge: all contributors required.
expectType<{new_p: string | number | bigint}>(
	{} as RenameKeys<{p1: string; p2: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);

// Merge: all contributors optional. The optional modifier carries to the
// target.
expectType<{new_p?: string | number | bigint}>(
	{} as RenameKeys<{p1?: string; p2?: number; p3?: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);

// Merge: mixed optionality. The target is required because at least one
// contributor is required. The value type follows `exactOptionalPropertyTypes`:
// with EOPT on (as in this test project), the value omits `undefined`.
expectType<{new_p: string | number | bigint}>(
	{} as RenameKeys<{p1: string; p2?: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);

// Merge: mixed readonly. The target is readonly because at least one
// contributor is readonly.
expectType<{readonly new_p: string | number | bigint}>(
	{} as RenameKeys<{p1: string; readonly p2: number; p3: bigint}, {p1: 'new_p'; p2: 'new_p'; p3: 'new_p'}>,
);
