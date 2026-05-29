import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {RenameKey} from '../source/rename-key.d.ts';

/* eslint-disable no-lone-blocks -- Each case is wrapped in a block to scope its reused local aliases (`Source`, `Bad`). */

// Basic rename.
{
	type User = {
		id: string;
		name: string;
		createdAt: Date;
	};

	const fixture: RenameKey<User, 'createdAt', 'created_at'> = {
		id: 'a',
		name: 'b',
		created_at: new Date(),
	};
	expectType<{id: string; name: string; created_at: Date}>(fixture);
}

{
	type Single = {value: number};
	expectTypeOf<RenameKey<Single, 'value', 'amount'>>().toEqualTypeOf<{amount: number}>();
}

// Preserves the optional modifier.
{
	type Source = {
		id: string;
		label?: string;
	};

	expectTypeOf<RenameKey<Source, 'label', 'name'>>().toEqualTypeOf<{id: string; name?: string}>();
}

// Preserves the readonly modifier.
{
	type Source = {
		readonly id: string;
		name: string;
	};

	expectTypeOf<RenameKey<Source, 'id', 'identifier'>>().toEqualTypeOf<{readonly identifier: string; name: string}>();
}

// `readonly` and optional combine and travel together to the new name.
{
	type Source = {readonly a?: number; x: string};
	expectTypeOf<RenameKey<Source, 'a', 'b'>>().toEqualTypeOf<{readonly b?: number; x: string}>();
}

// An explicit `| undefined` value stays required; it does not become optional.
{
	type Source = {a: string | undefined; x: number};
	expectTypeOf<RenameKey<Source, 'a', 'b'>>().toEqualTypeOf<{b: string | undefined; x: number}>();
}

// Renaming is shallow: a nested object value is preserved verbatim.
{
	type Source = {a: {nested: number; deep: {x: string}}; c: boolean};
	expectTypeOf<RenameKey<Source, 'a', 'b'>>().toEqualTypeOf<{b: {nested: number; deep: {x: string}}; c: boolean}>();
}

// Symbol target key.
{
	const symbolKey: unique symbol = Symbol('symbolKey');
	type SymbolKey = typeof symbolKey;
	type Source = {tag: string};
	expectTypeOf<RenameKey<Source, 'tag', SymbolKey>>().toEqualTypeOf<{[symbolKey]: string}>();
}

// Number target key.
{
	type Source = {first: number};
	expectTypeOf<RenameKey<Source, 'first', 0>>().toEqualTypeOf<{0: number}>();
}

// Symbol source key.
{
	const tag: unique symbol = Symbol('tag');
	type Tag = typeof tag;
	type Source = {[tag]: 'x'; name: string};
	expectTypeOf<RenameKey<Source, Tag, 'label'>>().toEqualTypeOf<{label: 'x'; name: string}>();
}

// Distributes over union members.
{
	type Event =
		| {kind: 'click'; target: string}
		| {kind: 'submit'; target: HTMLFormElement};

	type Renamed = RenameKey<Event, 'target', 'element'>;
	expectTypeOf<Renamed>().toEqualTypeOf<
		| {kind: 'click'; element: string}
		| {kind: 'submit'; element: HTMLFormElement}
	>();
}

// The source key need not exist in every union member.
{
	type Variants =
		| {kind: 'a'; payload: string}
		| {kind: 'b'};

	type Renamed = RenameKey<Variants, 'payload', 'value'>;
	expectTypeOf<Renamed>().toEqualTypeOf<
		| {kind: 'a'; value: string}
		| {kind: 'b'}
	>();
}

// Renaming a key to itself is a no-op.
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKey<Source, 'a', 'a'>>().toEqualTypeOf<{a: number; b: string}>();
}

{
	type Source = {a: number};
	// @ts-expect-error 'missing' is not a key of the source.
	type Bad = RenameKey<Source, 'missing', 'renamed'>;
}

{
	type Source = {a: number} | {a: string};
	// @ts-expect-error 'b' is not a key of any union member.
	type Bad = RenameKey<Source, 'b', 'c'>;
}

// Renaming onto an existing key is rejected: collapsing two keys would also
// collapse their modifiers, silently turning a required key optional.
{
	type Source = {a: number; b: string};
	// @ts-expect-error 'b' already exists on the source.
	type Bad = RenameKey<Source, 'a', 'b'>;
}

{
	type Source = {a: number} | {b: string};
	// @ts-expect-error 'b' exists in a sibling union member, so the rename is rejected union-wide.
	type Bad = RenameKey<Source, 'a', 'b'>;
}

{
	type Source = any;
	// @ts-expect-error `any` could hold the target key, so the rename can't be proven safe.
	type Bad = RenameKey<Source, 'a', 'b'>;
}

{
	type Source = never;
	// @ts-expect-error `never` has no keys to rename.
	type Bad = RenameKey<Source, 'a', 'b'>;
}

{
	type Source = unknown;
	// @ts-expect-error `unknown` has no keys to rename.
	type Bad = RenameKey<Source, 'a', 'b'>;
}

// A string index signature means every string key already exists, so any rename is a collision.
{
	type Source = {[key: string]: number; a: number};
	// @ts-expect-error target collides with the index signature.
	type Bad = RenameKey<Source, 'a', 'b'>;
}

// Renaming is shallow; nested keys are not addressable.
{
	type Source = {a: {nested: number}};
	// @ts-expect-error 'nested' is not a top-level key.
	type Bad = RenameKey<Source, 'nested', 'x'>;
}
