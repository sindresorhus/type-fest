import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {ExtendsStrict} from './extends-strict.d.ts';
import type {IsAnyOrNever, Not} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {And} from './and.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {Or} from './or.d.ts';

/**
{@link Includes `Includes`} Options.
*/
export type IncludesOptions = {
	/**
	Compare the item and the elements member by member, by assignability, instead of comparing them exactly.

	With it, `Includes<[1 | 2], 1, {distributeItem: true}>` is `boolean`, because the element may be `1`, and `Includes<[1, 2], 1 | 2, {distributeItem: true}>` is `true`, because both members are included.

	@example
	```
	import type {Includes} from 'type-fest';

	type T1 = Includes<[1, 2, 3], 1 | 4, {distributeItem: false}>;
	//=> false

	type T2 = Includes<[1, 2, 3], 1 | 4, {distributeItem: true}>;
	//=> boolean

	type T3 = Includes<[1 | 2, 3], 1, {distributeItem: false}>;
	//=> false

	type T4 = Includes<[1 | 2, 3], 1, {distributeItem: true}>;
	//=> boolean

	type T5 = Includes<[1, 2, 3], 1 | 2, {distributeItem: true}>;
	//=> true

	type T6 = Includes<[1, 2, 3], number, {distributeItem: true}>;
	//=> boolean

	type T7 = Includes<[string, 1], 'a', {distributeItem: true}>;
	//=> boolean
	```

	@default false
	*/
	distributeItem?: boolean;
};

type DefaultIncludesOptions = {
	distributeItem: false;
};

type IsEqualOrExtend<Type, Item, Options extends Required<IncludesOptions>> =
	And<
		Options['distributeItem'],
		Not<IsNever<Type>>
	> extends true
		? Type extends unknown // Distribute element
			// `any` is assignable both ways to anything, which would make any element match, so an `any` on only one side is a possible match, not a certain one.
			? Or<IsAny<Type>, IsAny<Item>> extends true
				? IsEqual<Type, Item> extends true ? true : boolean
				// `true` if both extend each other, `boolean` if only one extends the other, and `false` if neither does.
				: ExtendsStrict<Type, Item> | ExtendsStrict<Item, Type>
			: never
		: IsEqual<Type, Item>;

/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

Elements are compared exactly, so `Includes<[boolean], true>` is `false`. Use the `distributeItem` option to compare by assignability.

The result describes every array of the given type: `true` if each one includes the item, `boolean` if only some do, and `false` otherwise. Only some do when the item is only matched by an optional element, or by the element type of an array of unknown length, which can be empty. Use `true extends Includes<…>` to check whether the item may be included.

@example
```
import type {Includes} from 'type-fest';

type T1 = Includes<[1, 2, ...Array<3>], 2>;
//=> true

type T2 = Includes<[1, 2, ...Array<3>], 0>;
//=> false

type T3 = Includes<[1, 2, ...Array<3>], 3>;
//=> boolean

type T4 = Includes<[1, 2, 3?], 3>;
//=> boolean

type T5 = Includes<[1, 3, 3?], 3>;
//=> true

type T6 = Includes<string[], string>;
//=> boolean

type T7 = Includes<[1, 2, 3], 1 | 4, {distributeItem: true}>;
//=> boolean

type T8 = Includes<[string, number], 'a', {distributeItem: true}>;
//=> boolean
```

@see {@link IncludesOptions `IncludesOptions`}
@category Array
*/
// An item that is only possibly present gives `boolean`, not `true`. This is intentional, so do not change it to count an optional element or an array of unknown length as including the item: `true` must mean that every array of the type includes the item, otherwise `Includes<…> extends true` would accept an array that does not. `true extends Includes<…>` covers the "may include" case. See https://github.com/sindresorhus/type-fest/pull/1252.
export type Includes<
	Array_ extends UnknownArray, Item,
	Options extends IncludesOptions = {},
> =
	IsAnyOrNever<Array_> extends true ? Array_ // Handle any/never
		: ApplyDefaultOptions<
			IncludesOptions,
			DefaultIncludesOptions,
			Options
		> extends infer ResolvedOptions extends Required<IncludesOptions>
			? And<
				ResolvedOptions['distributeItem'],
				Not<IsNever<Item>>
			> extends true
				? Item extends unknown // Distribute item
					? IncludesEach<Array_, Item, ResolvedOptions>
					: never
				: IncludesEach<Array_, Item, ResolvedOptions>
			: never;

/**
Checks each member of a union of arrays on its own, because the search takes a different path for an array that starts with a fixed element and one that does not.
*/
type IncludesEach<Array_ extends UnknownArray, Item, Options extends Required<IncludesOptions>> =
	Array_ extends unknown // For distributing `Array_`
		? _Includes<Array_, Item, Options>
		: never; // Should never happen

/**
`Found` is `boolean` once an element may be the item, so a possible match is remembered while the search continues for a certain one. Carrying it along, instead of returning `true | <rest of the search>`, keeps the recursion in tail position, so long tuples do not hit the instantiation depth limit.
*/
type _Includes<
	Array_ extends UnknownArray, Item,
	Options extends Required<IncludesOptions>,
	Found extends boolean = false,
> =
	keyof Array_ & `${number}` extends never
		// The array starts with a rest element, or has no elements, so its fixed elements are searched from the end.
		? Array_ extends readonly [...infer Rest, infer Last]
			? IsEqualOrExtend<Last, Item, Options> extends infer Result
				? [Result] extends [true]
					? true
					: _Includes<Rest, Item, Options, Found | (true extends Result ? boolean : false)>
				: never // Should never happen
			// Only the rest element is left, which can hold any number of elements, including none, so a match is only possible.
			: Array_ extends readonly []
				? Found // No certain match, so only a remembered possible match is left
				: Found | (true extends IsEqualOrExtend<Array_[number], Item, Options> ? boolean : false)
		// The array starts with a fixed element, which can be optional, so the elements are searched from the start.
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			// A required element is read with `Array_[0]`, because `First` loses its `undefined` when `exactOptionalPropertyTypes` is disabled, even for a required element.
			? IsEqualOrExtend<IsOptionalKeyOf<Array_, 0> extends true ? First : Array_[0], Item, Options> extends infer Result
				? [Result] extends [true]
					// An optional element can be absent, so it is only a possible match. With `exactOptionalPropertyTypes` disabled, an optional element can also be `undefined`, which is not considered, so `Includes<[1?], undefined>` is `false`.
					? IsOptionalKeyOf<Array_, 0> extends true
						? _Includes<Rest, Item, Options, boolean>
						: true
					: _Includes<Rest, Item, Options, Found | (true extends Result ? boolean : false)>
				: never // Should never happen
			: never; // Should never happen

export {};
