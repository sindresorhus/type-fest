import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {RenameKeys} from '../source/rename-keys.d.ts';

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

// Empty rename map is identity.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKeys<Source, {}>>().toEqualTypeOf<{a: number; b: string}>();
}

// Partial rename. Unlisted keys pass through.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {a: number; b: string; c: boolean};
	expectTypeOf<RenameKeys<Source, {a: 'alpha'}>>().toEqualTypeOf<{alpha: number; b: string; c: boolean}>();
}

// Preserves optional and readonly modifiers across renames.
// eslint-disable-next-line no-lone-blocks
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

// Distributes over union object types.
// eslint-disable-next-line no-lone-blocks
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

// Symbol target keys.
// eslint-disable-next-line no-lone-blocks
{
	const symbolKey: unique symbol = Symbol('symbolKey');
	type SymbolKey = typeof symbolKey;
	type Source = {tag: string; other: number};
	expectTypeOf<RenameKeys<Source, {tag: SymbolKey}>>().toEqualTypeOf<{[symbolKey]: string; other: number}>();
}

// Number target keys.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {first: number; second: string};
	expectTypeOf<RenameKeys<Source, {first: 0; second: 1}>>().toEqualTypeOf<{0: number; 1: string}>();
}

// @ts-expect-error 'missing' is not a key of Source.
type Bad1 = RenameKeys<{a: number}, {missing: 'renamed'}>;

// @ts-expect-error 'b' is not a key of any union variant.
type Bad2 = RenameKeys<{a: number} | {a: string}, {b: 'c'}>;

// Renaming to a name that collides with an existing kept key collapses the values.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKeys<Source, {a: 'b'}>>().toEqualTypeOf<{b: number | string}>();
}
