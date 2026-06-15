import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-literal.d.ts';
import type {Or} from './or.d.ts';

export type StringToArrayOptions = {
	/**
	When enabled, non-literal parts of the string (e.g., `string`, `Uppercase<string>`) are mapped as single elements instead of being mapped as rest elements.

	Note: Enabling this option can produce misleading results that might not reflect the actual runtime behavior.
	For example, `StringToArray<string, {nonLiteralsAsElements: true}>` returns `[string]`, but at runtime, the string could be `'abc'` (which satisfies `string`), and converting it to an array would result in `['a', 'b', 'c']`, which doesn't satisfy `[string]`.

	So, it is recommended to not enable this option unless you are aware of the implications.

	@default false

	@example
	```
	import type {StringToArray} from 'type-fest';

	type A = StringToArray<string, {nonLiteralsAsElements: false}>;
	//=> string[]

	type B = StringToArray<string, {nonLiteralsAsElements: true}>;
	//=> [string]

	type C = StringToArray<`on${string}`, {nonLiteralsAsElements: false}>;
	//=> ['o', 'n', ...string[]]

	type D = StringToArray<`on${string}`, {nonLiteralsAsElements: true}>;
	//=> ['o', 'n', string]

	type E = StringToArray<`${string}xyz`, {nonLiteralsAsElements: false}>;
	//=> [...string[], 'x', 'y', 'z']

	type F = StringToArray<`${string}xyz`, {nonLiteralsAsElements: true}>;
	//=> [string, 'x', 'y', 'z']
	```
	*/
	nonLiteralsAsElements?: boolean;
};

type DefaultStringToArrayOptions = {
	nonLiteralsAsElements: false;
};

/**
Returns an array of the characters of the specified string.

@example
```
import type {StringToArray} from 'type-fest';

type A = StringToArray<'abcde'>;
//=> ['a', 'b', 'c', 'd', 'e']

type B = StringToArray<''>;
//=> []
```

@category String
*/
export type StringToArray<S extends string, Options extends StringToArrayOptions = {}> =
	IfNotAnyOrNever<
		S,
		_StringToArray<S, ApplyDefaultOptions<StringToArrayOptions, DefaultStringToArrayOptions, Options>>,
		unknown[]
	>;

type _StringToArray<S extends string, Options extends Required<StringToArrayOptions>, Accumulator extends string[] = []> =
	S extends `${infer First}${infer Rest}`
		? Or<IsStringLiteral<First>, Options['nonLiteralsAsElements']> extends true
			? _StringToArray<Rest, Options, [...Accumulator, First]>
			: _StringToArray<Rest, Options, [...Accumulator, ...First[]]>
		: S extends ''
			? Accumulator
			: Options['nonLiteralsAsElements'] extends true
				? [...Accumulator, S]
				: [...Accumulator, ...S[]];

export {};
