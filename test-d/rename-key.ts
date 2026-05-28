import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {RenameKey} from '../source/rename-key.d.ts';

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

// Renaming the only key.
// eslint-disable-next-line no-lone-blocks
{
	type Single = {value: number};
	expectTypeOf<RenameKey<Single, 'value', 'amount'>>().toEqualTypeOf<{amount: number}>();
}

// Preserves optional modifier.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {
		id: string;
		label?: string;
	};

	expectTypeOf<RenameKey<Source, 'label', 'name'>>().toEqualTypeOf<{id: string; name?: string}>();
}

// Preserves readonly modifier.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {
		readonly id: string;
		name: string;
	};

	expectTypeOf<RenameKey<Source, 'id', 'identifier'>>().toEqualTypeOf<{readonly identifier: string; name: string}>();
}

// Symbol target keys.
{
	const symbolKey: unique symbol = Symbol('symbolKey');
	type SymbolKey = typeof symbolKey;
	type Source = {tag: string};
	expectTypeOf<RenameKey<Source, 'tag', SymbolKey>>().toEqualTypeOf<{[symbolKey]: string}>();
}

// Number target keys.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {first: number};
	expectTypeOf<RenameKey<Source, 'first', 0>>().toEqualTypeOf<{0: number}>();
}

// Symbol source keys.
{
	const tag: unique symbol = Symbol('tag');
	type Tag = typeof tag;
	type Source = {[tag]: 'x'; name: string};
	expectTypeOf<RenameKey<Source, Tag, 'label'>>().toEqualTypeOf<{label: 'x'; name: string}>();
}

// Distributes over union object types.
// eslint-disable-next-line no-lone-blocks
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

// Distributes when the target key only exists in one variant.
// eslint-disable-next-line no-lone-blocks
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

// Renaming a key to its existing name is a no-op.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKey<Source, 'a', 'a'>>().toEqualTypeOf<{a: number; b: string}>();
}

// Renaming to a name that already exists collapses the values.
// This mirrors how mapped-type renames behave: the target key's value type
// becomes the union of all source values mapped to it.
// eslint-disable-next-line no-lone-blocks
{
	type Source = {a: number; b: string};
	expectTypeOf<RenameKey<Source, 'a', 'b'>>().toEqualTypeOf<{b: number | string}>();
}

// @ts-expect-error 'missing' is not a key of Source.
type Bad1 = RenameKey<{a: number}, 'missing', 'renamed'>;

// @ts-expect-error 'b' is not a key of any union variant.
type Bad2 = RenameKey<{a: number} | {a: string}, 'b', 'c'>;
