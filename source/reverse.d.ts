import type {IsArrayReadonly, IsLeadingSpread} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {ExtendsStrict} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ArrayTail} from './array-tail.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {And} from './and.d.ts';
import type {Or} from './or.d.ts';

/**
@see {@link Reverse}
*/
type ArrayReverseOptions = {
	/**
	Return a reversed readonly array if the input array is readonly.

	@default true

	@example
	```
	import type {Reverse} from 'type-fest';

	type Example1 = Reverse<readonly [string, number, boolean], {preserveReadonly: true}>;
	//=> readonly [boolean, number, string]

	type Example2 = Reverse<[string, number, boolean], {preserveReadonly: true}>;
	//=> [boolean, number, string]

	type Example3 = Reverse<readonly [string, number, boolean], {preserveReadonly: false}>;
	//=> [boolean, number, string]

	type Example4 = Reverse<[string, number, boolean], {preserveReadonly: false}>;
	//=> [boolean, number, string]
	```
	*/
	preserveReadonly?: boolean;
	/**
	Return a reversed array with Optional keys as `type | undefined`.

	@default false

	@example
	```
	import type {Reverse} from 'type-fest';

	type Example1 = Reverse<[string, number, boolean?], {keepOptional: false}>;
	//=> [boolean, number, string]

	type Example2 = Reverse<[string, number, boolean?], {keepOptional: true}>;
	//=> [boolean | undefined, number, string]

	type Example3 = Reverse<[string, number, boolean], {keepOptional: false}>;
	//=> [boolean, number, string]

	type Example4 = Reverse<[string, number, boolean], {keepOptional: true}>;
	//=> [boolean, number, string]
	```
	*/
	keepOptionals?: boolean;
};

type DefaultArrayReverseOptions = {
	preserveReadonly: true;
	keepOptionals: false;
};

/**
Reverse an Array Items.
*/
type _Reverse<Array_ extends UnknownArray, Options extends Required<ArrayReverseOptions>, AHead = Array_[0]> =
	IsAny<Array_> extends false
		? Array_ extends readonly []
			? []
			: [
				..._Reverse<ArrayTail<Array_>, Options>,
				...IsLeadingSpread<Array_> extends true
					? AHead[]
					: [
						Or<
							Options['keepOptionals'],
							ExtendsStrict<AHead, undefined>
						> extends true
							? AHead
							: Exclude<AHead, undefined>,
					],
			]
		: never;

/**
Creates a new array type by Reversing the order of each element in the original array.

By default, The type Preserve `readonly` modifier, and replace Optional keys with `type | undefined`. See {@link ArrayReverseOptions} options to change this behaviour.

@example
```
type T = Reverse<['a', 'b', 'c']>
//=> ['c', 'b', 'a']

type T = Reverse<readonly [1, 2, 3, 4, 5, 6]>
//=> readonly [6, 5, 4, 3, 2, 1]

type T = Reverse<['a', 'b'?, 'c'?]>
//=> ['c', 'b', 'a']

type T = Reverse<readonly [1, 2, ...number[]]>
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
	ApplyDefaultOptions<ArrayReverseOptions, DefaultArrayReverseOptions, Options> extends infer ResolvedOptions extends Required<ArrayReverseOptions>
		? Array_ extends UnknownArray // For distributing `Array_`
			? _Reverse<Array_, ResolvedOptions> extends infer Result
				? And<
					ResolvedOptions['preserveReadonly'],
					IsArrayReadonly<Array_>
				> extends true
					? Readonly<Result>
					: Result
				: never
			: never
		: never;
