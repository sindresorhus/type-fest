import type {ExactKey} from './exact-key.d.ts';
import type {DeduplicatedKeys} from './internal/keys.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {IsUnion} from './is-union.d.ts';

/**
Group an array of objects by a property, preserving the order within each group.

Use-cases:
- Group static route or command definitions by their kind.
- Keep the contents and length of each group as a tuple.

The input must be a fixed tuple of required elements. Arrays and rest tuples give `never`; optional tuple elements are not accepted. Tuples intersected with brands or extra properties are unsupported. Every element must have the selected property, holding one literal property key. Missing, optional, union-valued, and non-literal group properties give `never`. Branded group values are unsupported.

Groups are required and preserve the input's readonly modifier. The resulting record is mutable. Numeric and string forms of the selected property and group values are resolved with TypeScript's key rules, so `0` and `'0'` belong to the same group.

Distributes over unions of arrays and keys. Returns `any` for `any` and `never` for `never`.

@example
```
import type {ArrayGroupBy} from 'type-fest';

type Routes = [
	{method: 'GET'; path: '/users'},
	{method: 'POST'; path: '/users'},
	{method: 'GET'; path: '/health'},
];

type GetRoutes = ArrayGroupBy<Routes, 'method'>['GET'];
//=> [{method: 'GET'; path: '/users'}, {method: 'GET'; path: '/health'}]
```

The group keys are mapped once, and each group collects its items in input order. `ExactKey` resolves group membership, so numeric and string forms of the same key share one tuple without building nested mapped accumulators.

@category Array
*/
export type ArrayGroupBy<Items extends readonly object[], Key extends PropertyKey> = IfNotAnyOrNever<Items, {
	ifNot: Items extends unknown
		? Key extends unknown
			? HasGroupKeys<Items, Key> extends true
				? GroupItems<Items, Key> extends infer Groups
					? {[Group in keyof Groups]: Items extends unknown[] ? Groups[Group] : Readonly<Groups[Group]>}
					: never
				: never
			: never
		: never;
}>;

/**
Checks that each item has one definite group key.
*/
type HasGroupKey<Item extends object, Key extends keyof Item> = [Item] extends [Record<Key, PropertyKey>]
	? [IsLiteral<Item[Key]>, IsUnion<Item[Key]>] extends [true, false] ? true : false
	: false;

/**
Consumes required tuple positions, rejecting uncertain group keys and unknown-length inputs.
*/
type HasGroupKeys<Items extends readonly object[], Key extends PropertyKey> = Items extends readonly [infer First extends object, ...infer Rest extends object[]]
	? ExactKey<First, Key> extends infer ItemKey extends keyof First
		? HasGroupKey<First, ItemKey> extends true
			? HasGroupKeys<Rest, Key>
			: false
		: false
	: Items extends readonly [] ? true : false;

/**
Maps group keys once, keeping each group's tuple independent of the other groups.

Deduplicate numeric and string aliases first, because TypeScript can drop a remapped property when both spellings are present.
*/
type GroupItems<Items extends readonly object[], Key extends PropertyKey> = {
	[Group in DeduplicatedKeys<GroupKeyValues<Items[number], Key>>]: CollectGroup<Items, Key, Group>
};

/**
Reads the selected property on each item before combining the group values.
*/
type GroupKeyValues<Item extends object, Key extends PropertyKey> = Item extends unknown ? Item[ExactKey<Item, Key>] & PropertyKey : never;

/**
Appends matching items to one group, using the native key resolver for numeric and string aliases.
*/
type CollectGroup<
	Items extends readonly object[],
	Key extends PropertyKey,
	Group extends PropertyKey,
	Result extends object[] = [],
> = Items extends readonly [infer Item extends object, ...infer Rest extends object[]]
	? ExactKey<Record<Group, unknown>, Item[ExactKey<Item, Key>] & PropertyKey> extends never
		? CollectGroup<Rest, Key, Group, Result>
		: CollectGroup<Rest, Key, Group, [...Result, Item]>
	: Result;

export {};
