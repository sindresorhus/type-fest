import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';

/**
@see {@link Reverse}
*/
type ArrayReverseOptions = {
	/**
	Whether to preserve the optional modifier (`?`).

	- When set to `true` and all members are optional, the optional modifiers are preserved as-is. but if one of the members is required the (`?`) is replaced with `| undefined`.
	- When set to `false`, optional elements like `T?` are transformed to `T | undefined` or simply `T` depending on the `exactOptionalPropertyTypes` compiler option.

	@example
	```
	import type {Reverse} from 'type-fest';

	type Example1 = Reverse<[string?, number?, boolean?]>;
	//=> [boolean, number, string]

	type Example2 = Reverse<[string?, number?, boolean?], {preserveOptionalModifier: true}>;
	//=> [boolean?, number?, string?]

	type Example3 = Reverse<[string, number?, boolean?]>;
	//=> [boolean, number, string] or [boolean | undefined, number | undefined, string]

	type Example4 = Reverse<[string, number, boolean], {preserveOptionalModifier: true}>;
	//=> [boolean | undefined, number | undefined, string]
	```

	@default false
	*/
	preserveOptionalModifier?: boolean;
};

type DefaultArrayReverseOptions = {
	preserveOptionalModifier: false;
};

/**
Reverse an Array Items.
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
				...'0' extends OptionalKeysOf<Array_> // TODO: replace with `IsOptionalKeyOf`.
					? KeepOptional extends false
						? [If<IsExactOptionalPropertyTypesEnabled, First, First | undefined>] // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
						: [First?]
					: [First],
				...Tail,
			]>
			: never;

/**
Creates a new array type by Reversing the order of each element in the original array.

By default, The type Preserve `readonly` modifier, and replace Optional keys with `type | undefined`. See {@link ArrayReverseOptions} options to change this behaviour.

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

type T5 = Reverse<readonly [1, 2, ...number[]]>
//=> readonly [...number[], 2, 1]

declare function reverse<const T extends unknown[]>(array: T): Reverse<T>;
reverse(['a', 'b', 'c', 'd']);
//=> ['d', 'c', 'b', 'a']
```

@author benzaria
@see {@link ArrayReverseOptions}
@category Array
*/
export type Reverse<Array_ extends UnknownArray, Options extends ArrayReverseOptions = {}> =
	IsAny<Array_> extends false // Prevent the return of `Readonly<[] | [unknown] | unknown[] | [...unknown[], unknown]>`
		? Array_ extends UnknownArray // For distributing `Array_`
			? _Reverse<Array_, ApplyDefaultOptions<
				ArrayReverseOptions,
				DefaultArrayReverseOptions,
				Options
			>['preserveOptionalModifier']> extends infer Result
				? IsArrayReadonly<Array_> extends true
					? Readonly<Result>
					: Result
				: never
			: never
		: never;
