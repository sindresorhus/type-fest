import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {RenameKeys} from '../source/rename-keys.d.ts';

/* eslint-disable no-lone-blocks -- Each case is wrapped in a block to scope its reused local aliases (`Source`, `Bad`). */

// Basic batch rename.
{
	type User = {
		id: string;
		firstName: string;
		createdAt: Date;
	};

	const fixture: RenameKeys<User, {firstName: 'first_name'; createdAt: 'created_at'}> = {
		id: 'a',
		first_name: 'b',
		created_at: new Date(),
	};
	expectType<{id: string; first_name: string; created_at: Date}>(fixture);
}

// Empty rename map is the identity.
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKeys<Source, {}>>().toEqualTypeOf<{a: number; b: string}>();
}

// Unlisted keys pass through unchanged.
{
	type Source = {a: number; b: string; c: boolean};
	expectTypeOf<RenameKeys<Source, {a: 'alpha'}>>().toEqualTypeOf<{alpha: number; b: string; c: boolean}>();
}

// A map entry that renames a key to itself is a no-op.
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKeys<Source, {a: 'a'}>>().toEqualTypeOf<{a: number; b: string}>();
}

// Preserves optional and readonly modifiers across renames.
{
	type Source = {
		readonly id: string;
		label?: string;
		count: number;
	};

	expectTypeOf<RenameKeys<Source, {id: 'identifier'; label: 'name'}>>().toEqualTypeOf<{
		readonly identifier: string;
		name?: string;
		count: number;
	}>();
}

// `readonly` and optional combine and travel together to the new name.
{
	type Source = {readonly a?: number; x: string};
	expectTypeOf<RenameKeys<Source, {a: 'b'}>>().toEqualTypeOf<{readonly b?: number; x: string}>();
}

// An explicit `| undefined` value stays required; it does not become optional.
{
	type Source = {a: string | undefined; b: number};
	expectTypeOf<RenameKeys<Source, {a: 'c'}>>().toEqualTypeOf<{c: string | undefined; b: number}>();
}

// Swapping two keys is allowed, since neither key is lost.
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKeys<Source, {a: 'b'; b: 'a'}>>().toEqualTypeOf<{b: number; a: string}>();
}

// Swapping carries each key's modifier to its new name, not by position.
{
	type Source = {a: number; b?: string};
	expectTypeOf<RenameKeys<Source, {a: 'b'; b: 'a'}>>().toEqualTypeOf<{b: number; a?: string}>();
}

// Renaming a key onto a name that is itself renamed away is not a collision.
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKeys<Source, {a: 'b'; b: 'c'}>>().toEqualTypeOf<{b: number; c: string}>();
}

// Renaming is shallow: a nested object value is preserved verbatim.
{
	type Source = {a: {nested: number}; c: boolean};
	expectTypeOf<RenameKeys<Source, {a: 'b'}>>().toEqualTypeOf<{b: {nested: number}; c: boolean}>();
}

// Distributes over union members.
{
	type Event =
		| {kind: 'click'; target: string}
		| {kind: 'submit'; payload: HTMLFormElement};

	type Renamed = RenameKeys<Event, {target: 'element'; payload: 'data'}>;
	expectTypeOf<Renamed>().toEqualTypeOf<
		| {kind: 'click'; element: string}
		| {kind: 'submit'; data: HTMLFormElement}
	>();
}

// A renamed key need not exist in every union member.
{
	type Source =
		| {kind: 'a'; payload: string}
		| {kind: 'b'};

	expectTypeOf<RenameKeys<Source, {payload: 'value'}>>().toEqualTypeOf<
		| {kind: 'a'; value: string}
		| {kind: 'b'}
	>();
}

// Symbol target key.
{
	const symbolKey: unique symbol = Symbol('symbolKey');
	type SymbolKey = typeof symbolKey;
	type Source = {tag: string; other: number};
	expectTypeOf<RenameKeys<Source, {tag: SymbolKey}>>().toEqualTypeOf<{[symbolKey]: string; other: number}>();
}

// Symbol source key.
{
	const tag: unique symbol = Symbol('tag');
	type Source = {[tag]: number; keep: string};
	expectTypeOf<RenameKeys<Source, {[tag]: 'renamed'}>>().toEqualTypeOf<{renamed: number; keep: string}>();
}

// Number target key.
{
	type Source = {first: number; second: string};
	expectTypeOf<RenameKeys<Source, {first: 0; second: 1}>>().toEqualTypeOf<{0: number; 1: string}>();
}

{
	type Source = {a: number};
	// @ts-expect-error 'missing' is not a key of the source.
	type Bad = RenameKeys<Source, {missing: 'renamed'}>;
}

{
	type Source = {a: number} | {a: string};
	// @ts-expect-error 'b' is not a key of any union member.
	type Bad = RenameKeys<Source, {b: 'c'}>;
}

// Renaming onto a kept key is rejected: collapsing two keys would also
// collapse their modifiers, silently turning a required key optional.
{
	type Source = {a: number; b: string};
	// @ts-expect-error 'b' is a kept key of the source.
	type Bad = RenameKeys<Source, {a: 'b'}>;
}

{
	type Source = {a: number; b: string};
	// @ts-expect-error two entries target the same key.
	type Bad = RenameKeys<Source, {a: 'c'; b: 'c'}>;
}

// Optional map entries are rejected.
{
	type Source = {a: number; b: string};
	// @ts-expect-error map entries must be required.
	type Bad = RenameKeys<Source, {a?: 'alpha'}>;
}

{
	type Source = any;
	// @ts-expect-error `any` could hold the target key, so the rename can't be proven safe.
	type Bad = RenameKeys<Source, {a: 'b'}>;
}

{
	type Source = never;
	// @ts-expect-error `never` has no keys to rename.
	type Bad = RenameKeys<Source, {a: 'b'}>;
}

{
	type Source = unknown;
	// @ts-expect-error `unknown` has no keys to rename.
	type Bad = RenameKeys<Source, {a: 'b'}>;
}

// A string index signature means every string key already exists, so any rename is a collision.
{
	type Source = {[key: string]: number; a: number};
	// @ts-expect-error target collides with the index signature.
	type Bad = RenameKeys<Source, {a: 'b'}>;
}

// Renaming is shallow; nested keys are not addressable.
{
	type Source = {a: {nested: number}};
	// @ts-expect-error 'nested' is not a top-level key.
	type Bad = RenameKeys<Source, {nested: 'x'}>;
}

/* eslint-enable no-lone-blocks */
