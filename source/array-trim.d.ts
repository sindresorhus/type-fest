import type {If} from './if.d.ts';
import type {FirstArrayElement, IsArrayReadonly} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {ExcludeRestElement} from './exclude-rest-element.d.ts';
import type {ExtractRestElement} from './extract-rest-element.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
{@link ArrayTrimStart `ArrayTrimStart`}, {@link ArrayTrimEnd `ArrayTrimEnd`}, and {@link ArrayTrim `ArrayTrim`} options.
*/
export type ArrayTrimOptions = {
	/**
	How an element is compared with the item.

	- `'equality'`: The element type must be exactly the item type. A union item only matches an element of the same union.
	- `'extends'`: The element type must be assignable to the item type.

	@default 'equality'

	@example
	```
	import type {ArrayTrimStart} from 'type-fest';

	type T1 = ArrayTrimStart<[1, 2, 'a', 3], number>;
	//=> [1, 2, 'a', 3]

	type T2 = ArrayTrimStart<[1, 2, 'a', 3], number, {condition: 'extends'}>;
	//=> ['a', 3]

	type T3 = ArrayTrimStart<[1, 2, 'a', 3], 1 | 2>;
	//=> [1, 2, 'a', 3]

	type T4 = ArrayTrimStart<[1, 2, 'a', 3], 1 | 2, {condition: 'extends'}>;
	//=> ['a', 3]
	```
	*/
	condition?: 'equality' | 'extends';
};

type DefaultArrayTrimOptions = {
	condition: 'equality';
};

/**
Remove the elements of the given type from the start of an array.

Elements are removed from the start until one does not match. They are compared exactly by default. Use the `condition` option to compare by assignability.

Use-case: Remove padding from a tuple, like the leading zeros of a tuple of digits.

@example
```
import type {ArrayTrimStart} from 'type-fest';

type A = ArrayTrimStart<[0, 0, 1, 0], 0>;
//=> [1, 0]

type B = ArrayTrimStart<readonly [undefined, string, undefined], undefined>;
//=> readonly [string, undefined]

type C = ArrayTrimStart<[0, ...Array<0>, 1], 0>;
//=> [1]

type D = ArrayTrimStart<[1, 2, 'a', 3], number, {condition: 'extends'}>;
//=> ['a', 3]
```

Note: Trimming stops at the first element that does not match, even if it is a rest element, which can be empty. So `ArrayTrimStart<[...string[], 0], 0>` is `[...string[], 0]`, even though the value `[0]` trims to `[]`.

@see {@link ArrayTrimOptions `ArrayTrimOptions`}
@see {@link ArrayTrimEnd `ArrayTrimEnd`}
@see {@link ArrayTrim `ArrayTrim`}
@category Array
*/
export type ArrayTrimStart<Array_ extends UnknownArray, Item, Options extends ArrayTrimOptions = {}> =
	TrimEach<Array_, Item, ApplyDefaultOptions<ArrayTrimOptions, DefaultArrayTrimOptions, Options>, 'start'>;

/**
Remove the elements of the given type from the end of an array.

Elements are removed from the end until one does not match. They are compared exactly by default. Use the `condition` option to compare by assignability.

Use-case: Remove padding from a tuple, like the trailing `undefined` elements of a list of arguments.

@example
```
import type {ArrayTrimEnd} from 'type-fest';

type A = ArrayTrimEnd<[0, 1, 0, 0], 0>;
//=> [0, 1]

type B = ArrayTrimEnd<readonly [string, undefined, undefined?], undefined>;
//=> readonly [string]

type C = ArrayTrimEnd<[1, 0?, ...Array<0>], 0>;
//=> [1]

type D = ArrayTrimEnd<[1, 'a', 2, 3], number, {condition: 'extends'}>;
//=> [1, 'a']
```

Note: Trimming stops at the last element that does not match, even if it is an optional or rest element, which can be absent. So `ArrayTrimEnd<[0, string?], 0>` is `[0, string?]`, even though the value `[0]` trims to `[]`.

@see {@link ArrayTrimOptions `ArrayTrimOptions`}
@see {@link ArrayTrimStart `ArrayTrimStart`}
@see {@link ArrayTrim `ArrayTrim`}
@category Array
*/
export type ArrayTrimEnd<Array_ extends UnknownArray, Item, Options extends ArrayTrimOptions = {}> =
	TrimEach<Array_, Item, ApplyDefaultOptions<ArrayTrimOptions, DefaultArrayTrimOptions, Options>, 'end'>;

/**
Remove the elements of the given type from both ends of an array.

It is {@link ArrayTrimStart `ArrayTrimStart`} and {@link ArrayTrimEnd `ArrayTrimEnd`} combined, so the same notes apply.

@example
```
import type {ArrayTrim} from 'type-fest';

type A = ArrayTrim<[0, 0, 1, 0, 2, 0], 0>;
//=> [1, 0, 2]

type B = ArrayTrim<readonly [null, string, number, null], null>;
//=> readonly [string, number]

type C = ArrayTrim<['a', 1, 'b', 2], string, {condition: 'extends'}>;
//=> [1, 'b', 2]
```

@see {@link ArrayTrimOptions `ArrayTrimOptions`}
@see {@link ArrayTrimStart `ArrayTrimStart`}
@see {@link ArrayTrimEnd `ArrayTrimEnd`}
@category Array
*/
export type ArrayTrim<Array_ extends UnknownArray, Item, Options extends ArrayTrimOptions = {}> =
	ArrayTrimEnd<ArrayTrimStart<Array_, Item, Options>, Item, Options>;

/**
Trims each member of a union of arrays on its own, so that `readonly` is decided per member.
*/
type TrimEach<Array_ extends UnknownArray, Item, Options extends Required<ArrayTrimOptions>, Side extends 'start' | 'end'> = IfNotAnyOrNever<Array_, {
	ifNot: Array_ extends unknown // For distributing `Array_`
		? (Side extends 'start' ? _ArrayTrimStart<Array_, Item, Options> : _ArrayTrimEnd<Array_, Item, Options>) extends infer Result extends UnknownArray
			? If<IsArrayReadonly<Array_>, Readonly<Result>, Result>
			: never // Should never happen
		: never; // Should never happen
}>;

/**
Returns whether the element matches the item, according to the `condition` option.
*/
type Matches<Element, Item, Options extends Required<ArrayTrimOptions>> =
	Options['condition'] extends 'extends'
		? [Element] extends [Item] ? true : false
		: IsEqual<Element, Item>;

type _ArrayTrimStart<Array_ extends UnknownArray, Item, Options extends Required<ArrayTrimOptions>> =
	'0' extends keyof Array_
		// The array starts with a required or optional element.
		? Array_ extends readonly [unknown?, ...infer Rest]
			? Matches<FirstArrayElement<Array_>, Item, Options> extends true
				? _ArrayTrimStart<Rest, Item, Options>
				: Array_
			: never // Should never happen
		// The array is empty, or starts with a rest element.
		: Array_ extends readonly []
			? Array_
			: Matches<ExtractRestElement<Array_>, Item, Options> extends true
				? _ArrayTrimStart<ExcludeRestElement<Array_>, Item, Options>
				: Array_;

type _ArrayTrimEnd<Array_ extends UnknownArray, Item, Options extends Required<ArrayTrimOptions>> =
	Array_ extends readonly [...infer Rest, infer Last]
		// The array ends with a required element.
		? Matches<Last, Item, Options> extends true
			? _ArrayTrimEnd<Rest, Item, Options>
			: Array_
		: Array_ extends readonly []
			? Array_
			: number extends Array_['length']
				// The array ends with a rest element.
				? Matches<ExtractRestElement<Array_>, Item, Options> extends true
					? _ArrayTrimEnd<ExcludeRestElement<Array_>, Item, Options>
					: Array_
				// The array ends with an optional element.
				: Array_ extends readonly [...infer Rest, (infer Last)?]
					? Matches<Last, Item, Options> extends true
						? _ArrayTrimEnd<Rest, Item, Options>
						: Array_
					: never; // Should never happen

export {};
