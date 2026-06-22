import {expectType} from 'tsd';
import type {RenameKey} from '../source/rename-key.d.ts';

// Basic rename.
expectType<{id: string; name: string; created_at: Date}>(
	{} as RenameKey<{id: string; name: string; createdAt: Date}, 'createdAt', 'created_at'>,
);

// Single-key source.
expectType<{amount: number}>({} as RenameKey<{value: number}, 'value', 'amount'>);

// Preserves the optional modifier.
expectType<{id: string; name?: string}>(
	{} as RenameKey<{id: string; label?: string}, 'label', 'name'>,
);

// Preserves the readonly modifier.
expectType<{readonly identifier: string; name: string}>(
	{} as RenameKey<{readonly id: string; name: string}, 'id', 'identifier'>,
);

// `readonly` and optional combine and travel together to the new name.
expectType<{readonly b?: number; x: string}>(
	{} as RenameKey<{readonly a?: number; x: string}, 'a', 'b'>,
);

// An explicit `| undefined` value stays required; it does not become optional.
expectType<{b: string | undefined; x: number}>(
	{} as RenameKey<{a: string | undefined; x: number}, 'a', 'b'>,
);

// Renaming is shallow: a nested object value is preserved verbatim.
expectType<{b: {nested: number; deep: {x: string}}; c: boolean}>(
	{} as RenameKey<{a: {nested: number; deep: {x: string}}; c: boolean}, 'a', 'b'>,
);

// Symbol target key.
declare const symbolKey: unique symbol;
type SymbolKey = typeof symbolKey;
expectType<{[symbolKey]: string}>({} as RenameKey<{tag: string}, 'tag', SymbolKey>);

// Number target key.
expectType<{0: number}>({} as RenameKey<{first: number}, 'first', 0>);

// Symbol source key.
declare const tag: unique symbol;
type Tag = typeof tag;
expectType<{label: 'x'; name: string}>({} as RenameKey<{[tag]: 'x'; name: string}, Tag, 'label'>);

// Distributes over union members.
expectType<{kind: 'click'; element: string} | {kind: 'submit'; element: HTMLFormElement}>(
	{} as RenameKey<
		{kind: 'click'; target: string} | {kind: 'submit'; target: HTMLFormElement},
		'target',
		'element'
	>,
);

// The source key need not exist in every union member.
expectType<{kind: 'a'; value: string} | {kind: 'b'}>(
	{} as RenameKey<{kind: 'a'; payload: string} | {kind: 'b'}, 'payload', 'value'>,
);

// Renaming a key to itself is a no-op.
expectType<{a: number; b: string}>({} as RenameKey<{a: number; b: string}, 'a', 'a'>);

// A literal target onto a string-indexed object is fine: the index signature
// does not preclude adding a named property.
expectType<{[x: string]: number; b: 1}>(
	{} as RenameKey<{[x: string]: number; a: 1}, 'a', 'b'>,
);

// Renaming onto an existing key merges the values into a union at the target.
expectType<{b: number | string}>({} as RenameKey<{a: number; b: string}, 'a', 'b'>);

// Cross-union collision merges per union member; the source key in a member
// that lacks it is ignored, the member that has it merges.
expectType<{b: number} | {b: string}>({} as RenameKey<{a: number} | {b: string}, 'a', 'b'>);

// Source must be a property of BaseType.
// @ts-expect-error 'missing' is not a property of the source.
type _Bad1 = RenameKey<{a: number}, 'missing', 'renamed'>;

// In a union source, the source key must exist in at least one member.
// @ts-expect-error 'b' is not a property of any union member.
type _Bad2 = RenameKey<{a: number} | {a: string}, 'b', 'c'>;

// `any` source returns `never`: the target key cannot be proven absent from
// an `any` shape.
expectType<never>({} as RenameKey<any, 'a', 'b'>);

// `never` source returns `never`. The wrapper constraint `KeysOfUnion<never>`
// evaluates to `string | number | symbol` (not `never`), so the call site does
// not error; the body short-circuits via the `IsNever<BaseType>` check.
expectType<never>({} as RenameKey<never, 'a', 'b'>);

// `unknown` source: no keys to rename.
// @ts-expect-error `unknown` has no keys.
type _Bad4 = RenameKey<unknown, 'a', 'b'>;

// Renaming is shallow; nested keys are not addressable.
// @ts-expect-error 'nested' is not a top-level key.
type _Bad5 = RenameKey<{a: {nested: number}}, 'nested', 'x'>;
