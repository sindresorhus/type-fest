import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-literal.d.ts';
import type {Or} from './or.d.ts';

/**
@see {@link StringToArray}
*/
export type StringToArrayOptions = {
	/**
	When enabled, non-literal parts of the string (e.g., `string`, `Uppercase<string>`) are mapped as single elements instead of being mapped as a rest element.

	Note: Enabling this option can produce misleading results that might not reflect the actual runtime behavior.
	For example, `StringToArray<string, {mapNonLiteralsDirectly: true}>` returns `[string]`, but at runtime, the string could be `'abc'` (which satisfies `string`), and converting it to an array would result in `['a', 'b', 'c']`, which doesn't satisfy `[string]`.

	So, it is recommended to not enable this option unless you are aware of the implications.

	@default false

	@example
	```
	import type {StringToArray} from 'type-fest';

	type A = StringToArray<string, {mapNonLiteralsDirectly: false}>;
	//=> string[]

	type B = StringToArray<string, {mapNonLiteralsDirectly: true}>;
	//=> [string]

	type C = StringToArray<`on${string}`, {mapNonLiteralsDirectly: false}>;
	//=> ['o', 'n', ...string[]]

	type D = StringToArray<`on${string}`, {mapNonLiteralsDirectly: true}>;
	//=> ['o', 'n', string]

	type E = StringToArray<`${string}xyz`, {mapNonLiteralsDirectly: false}>;
	//=> [...string[], 'x', 'y', 'z']

	type F = StringToArray<`${string}xyz`, {mapNonLiteralsDirectly: true}>;
	//=> [string, 'x', 'y', 'z']
	```
	*/
	mapNonLiteralsDirectly?: boolean;
};

type DefaultStringToArrayOptions = {
	mapNonLiteralsDirectly: false;
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

type C = StringToArray<string>;
//=> string[]

type D = StringToArray<`foo${string}bar`>;
//=> ['f', 'o', 'o', ...string[], 'b', 'a', 'r']

type E = StringToArray<`foo${string}bar`, {mapNonLiteralsDirectly: true}>;
//=> ['f', 'o', 'o', string, 'b', 'a', 'r']
```

@see {@link StringToArrayOptions}

@category String
*/
export type StringToArray<S extends string, Options extends StringToArrayOptions = {}> =
	IfNotAnyOrNever<
		S,
		{
			ifNot: _StringToArray<S, ApplyDefaultOptions<StringToArrayOptions, DefaultStringToArrayOptions, Options>>;
			ifAny: unknown[];
		}
	>;

type _StringToArray<S extends string, Options extends Required<StringToArrayOptions>, Accumulator extends string[] = []> =
	S extends `${infer First}${infer Rest}`
		? Or<IsStringLiteral<First>, Options['mapNonLiteralsDirectly']> extends true
			? _StringToArray<Rest, Options, [...Accumulator, First]>
			: _StringToArray<Rest, Options, [...Accumulator, ...First[]]>
		: S extends ''
			? Accumulator
			: Options['mapNonLiteralsDirectly'] extends true
				? [...Accumulator, S]
				: [...Accumulator, ...S[]];

export {};
