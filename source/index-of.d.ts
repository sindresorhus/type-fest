import type {IsEqualOrExtend} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './apply-default-options.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {Not} from './not.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {_SplitOnRestElement, SplitOnRestElement} from './split-on-rest-element.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Includes} from './includes.d.ts'; // For `@link`

/**
{@link IndexOf `IndexOf`} Options.
*/
export type IndexOfOptions = {
	/**
	Compare the item and the elements by assignability in either direction, and each union member separately, instead of exactly.

	An index is included when a member may match, so `IndexOf<[1 | 2, 3], 1, {distributeItem: true}>` is `0`, because the element may be `1`, and `IndexOf<[1, 2, 3], number, {distributeItem: true}>` is `0 | 1 | 2`, because every element is a `number`.

	@example
	```
	import type {IndexOf} from 'type-fest';

	type T1 = IndexOf<[1, 2, 3], 1 | 4, {distributeItem: true}>;
	//=> 0

	type T2 = IndexOf<[1 | 2, 3], 1, {distributeItem: true}>;
	//=> 0

	type T3 = IndexOf<[1, 2, 3], 1 | 2, {distributeItem: true}>;
	//=> 0 | 1

	type T4 = IndexOf<[1, 2, 3], number, {distributeItem: true}>;
	//=> 0 | 1 | 2
	```

	@default false
	*/
	distributeItem?: boolean;
};

type DefaultIndexOfOptions = {
	distributeItem: false;
};

/**
Returns the union of indices at which the given item can be found in the given array.

This is the position counterpart of {@link Includes `Includes`}: `Includes` tells whether the array includes the item, and `IndexOf` tells where. Unlike `Array#indexOf()`, which returns the first index or `-1`, this type returns every matching index, or `never`. Use it to find which positions can hold a type.

Elements are compared exactly by default, so `IndexOf<[boolean], true>` is `never`. An optional position counts unless its element type is `never`, so `IndexOf<[1, 2, 3?], 3>` is `2`, but it does not add `undefined`, so `IndexOf<[1?, 2?], undefined>` is `never`. With the `distributeItem` option, members of a union are compared by assignability in either direction, and an index is included when a member may match: `IndexOf<[1, 2, 3], number, {distributeItem: true}>` is `0 | 1 | 2`.

A match at or after a rest element, or in an array that is not a tuple, gives `number`, which over-approximates: `IndexOf<[1, ...Array<2>], 2>` is `number`, which includes `0` even though position `0` always holds `1`.

A tuple intersected with an object type, such as `readonly [1, ...string[]] & {readonly description: string}`, widens its rest element to `unknown[]`, so the rest element is not searched precisely: an exact comparison can miss a match, and `distributeItem` can report one that cannot happen. Fixed positions are not affected. The same widening affects {@link SplitOnRestElement}.

Use concrete option values before relying on a definite answer: a non-literal option, such as `boolean` or a generic, resolves like the default.

@example
```
import type {IndexOf} from 'type-fest';

type T1 = IndexOf<['a', 'b', 'c'], 'b'>;
//=> 1

type T2 = IndexOf<[1, 2, 1], 1>;
//=> 0 | 2

type T3 = IndexOf<['a', 'b'], 'c'>;
//=> never

type T4 = IndexOf<[1, 2, 3?], 3>;
//=> 2

type T5 = IndexOf<[1, 2, ...Array<3>], 3>;
//=> number

type T6 = IndexOf<string[], string>;
//=> number

type T7 = IndexOf<[1, 2, 3], 1 | 2, {distributeItem: true}>;
//=> 0 | 1
```

@see {@link Includes} to check whether the item is included
@see {@link IndexOfOptions `IndexOfOptions`}

@category Array
*/
export type IndexOf<
	Array_ extends UnknownArray, Item,
	Options extends IndexOfOptions = {},
> =
	IsAnyOrNever<Array_> extends true ? Array_ // Handle any/never
		// Keep inferred options so a constrained exact-comparison mode remains exact.
		: ApplyDefaultOptions<
			IndexOfOptions,
			DefaultIndexOfOptions,
			Options
		> extends infer ResolvedOptions extends Required<IndexOfOptions>
			? (ResolvedOptions['distributeItem'] extends true ? Not<IsNever<Item>> : false) extends true
				? Item extends unknown // Distribute item
					? IndexOfEach<Array_, Item, ResolvedOptions['distributeItem']>
					: never
				: IndexOfEach<Array_, Item, ResolvedOptions['distributeItem']>
			: never;

/**
Checks each member of a union of arrays on its own, because the search takes a different path for an array with a rest element and one without.
*/
type IndexOfEach<Array_ extends UnknownArray, Item, Distribute extends boolean> =
	Array_ extends unknown // For distributing `Array_`
		? IndexOfFixedPart<Array_, Item, Distribute> | IndexOfRestPart<Array_, Item, Distribute>
		: never; // Should never happen

/**
Maps each declared position before a rest element to its numeric index when the item can be found there.
*/
type IndexOfFixedPart<Array_ extends UnknownArray, Item, Distribute extends boolean> = {
	[Key in keyof Array_ & `${number}`]: Key extends `${infer Index extends number}`
		? ElementMatches<Array_, Index, Item, Distribute> extends true
			? Index
			: never
		: never;
}[keyof Array_ & `${number}`];

/**
Checks the rest element, and the elements after it, whose positions are unknown.
*/
type IndexOfRestPart<Array_ extends UnknownArray, Item, Distribute extends boolean> =
	HasPositionsOutsideFixedPart<Array_> extends true
		? _SplitOnRestElement<Array_, {preserveOptionalModifier: true}> extends readonly [unknown, infer Rest extends UnknownArray, infer AfterRest extends UnknownArray]
			// The rest element type is compared as a whole, so the `string | number` element of `Array<string | number>` only matches `string | number` itself. With the `distributeItem` option, its members are compared too. A `never` rest element cannot hold a value.
			? true extends (IsNever<Rest[number]> extends true ? false : IsEqualOrExtend<Rest[number], Item, Distribute>)
				? number
				// Elements after the rest element sit at declared positions, so they are compared one by one.
				: [IndexOfFixedPart<AfterRest, Item, Distribute>] extends [never]
					? never
					: number
			: never // Should never happen
		: never;

/**
Returns whether the array can have a position outside its fixed tuple part: an array of unknown length, or a length-refined array without tuple keys.
*/
type HasPositionsOutsideFixedPart<Array_ extends UnknownArray> =
	number extends Array_['length']
		? true
		: '0' extends keyof Array_
			? false
			: Array_['length'] extends 0
				? false
				: true;

/**
Returns whether the element at the given declared position matches the item.

Inference from an optional position gives the declared element type, without the `undefined` that reading the position adds, so an optional `undefined` element is still compared exactly. This also keeps the element type of a tuple with metadata, which inference from the tuple itself widens to every element.
*/
type ElementMatches<Array_ extends UnknownArray, Index extends number, Item, Distribute extends boolean> =
	DeclaredElement<Array_, Index> extends infer Element
		? IsEqualOrExtend<Element, Item, Distribute> extends false
			? false
			: Array_ extends {[Key in Index]: unknown}
				? true
				// An optional position whose element type is `never` can never hold a value.
				: IsNever<Element> extends true ? false : true
		: never; // Should never happen

/**
Returns the declared type of the element at the given position, without the `undefined` that reading an optional position adds.
*/
type DeclaredElement<Array_ extends UnknownArray, Index extends number> =
	Array_ extends {[Key in Index]?: infer Element} ? Element : never;

export {};
