import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';

/**
Reverse options.

@see {@link Reverse}
*/
type ReverseOptions = {
	/**
	Whether to preserve the optional modifier (`?`).

	- When set to `true` and all members are optional, the optional modifiers are preserved as-is. But if any member is required, the (`?`) is replaced with `| undefined`.
	- When set to `false`, optional elements like `T?` are transformed to `T | undefined` or simply `T` depending on the `exactOptionalPropertyTypes` compiler option.

	@example
	```
	import type {Reverse} from 'type-fest';

	type T1 = Reverse<[string, number, boolean]>;
	//=> [boolean, number, string]

	type T2 = Reverse<[string?, number?, boolean?], {preserveOptionalModifier: true}>;
	//=> [boolean?, number?, string?]

	type T3 = Reverse<[string, number?, boolean?]>;
	//=> [boolean, number, string] or [boolean | undefined, number | undefined, string]

	type T4 = Reverse<[string, number?, boolean?], {preserveOptionalModifier: true}>;
	//=> [boolean | undefined, number | undefined, string]
	```

	@default false
	*/
	preserveOptionalModifier?: boolean;
};

type DefaultReverseOptions = {
	preserveOptionalModifier: false;
};

/**
Reverse array/tuple elements.
*/
type _Reverse<
	Array_ extends UnknownArray,
	KeepOptional extends boolean,
	Head extends UnknownArray = [],
	Tail extends UnknownArray = [],
> =
	keyof Array_ & `${number}` extends never // Is `Array_` leading a rest element or empty
		? Array_ extends readonly [...infer Rest, infer Last]
			? _Reverse<Rest, KeepOptional, [...Head, Last], Tail>
			: [...Head, ...Array_, ...Tail]
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			? _Reverse<Rest, KeepOptional, Head, [
				...IsOptionalKeyOf<Array_, '0'> extends true
					? KeepOptional extends false
						? [If<IsExactOptionalPropertyTypesEnabled, First, First | undefined>] // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
						: [First?]
					: [First],
				...Tail,
			]>
			: never;

/**
Creates a new array type by reversing the element order of the original array.

By default, the optional modifier (`?`) is **not** preserved and replaced with `T` or `T | undefined` depending on the `exactOptionalPropertyTypes` compiler option.
See {@link ReverseOptions `ReverseOptions`}.

@example
```
type T1 = Reverse<['a', 'b', 'c']>
//=> ['c', 'b', 'a']

type T2 = Reverse<readonly [1, 2, 3, 4, 5, 6]>
//=> readonly [6, 5, 4, 3, 2, 1]

type T3 = Reverse<['a', 'b'?, 'c'?]>
//=> ['c', 'b', 'a']

type T4 = Reverse<['a'?, 'b'?, 'c'?], {preserveOptionalModifier: true}>
//=> ['c'?, 'b'?, 'a'?]

type T5 = Reverse<readonly [1, 2, ...number[], 4]>
//=> readonly [4, ...number[], 2, 1]

declare function reverse<const T extends unknown[]>(array: T): Reverse<T>;
reverse(['a', 'b', 'c', 'd']);
//=> ['d', 'c', 'b', 'a']
```

@category Array
*/
export type Reverse<Array_ extends UnknownArray, Options extends ReverseOptions = {}> =
	IsAny<Array_> extends false // Prevent the return of `Readonly<[] | [unknown] | unknown[] | [...unknown[], unknown]>`
		? Array_ extends UnknownArray // For distributing `Array_`
			? _Reverse<Array_, ApplyDefaultOptions<
				ReverseOptions,
				DefaultReverseOptions,
				Options
			>['preserveOptionalModifier']> extends infer Result
				? If<IsArrayReadonly<Array_>, Readonly<Result>, Result>
				: never
			: never
		: Array_;

export {};
