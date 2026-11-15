import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {ApplyDefaultOptions} from './apply-default-options.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

/**
@see {@link StringToArray}
*/
export type StringToArrayOptions = {
	/**
	When enabled, a non-literal part of the string (e.g., `string`, `Uppercase<string>`) becomes `...string[]`, since its individual characters do not necessarily satisfy the type of the whole part. When disabled, each non-literal part is mapped as a single element instead.

	Note: Disabling this option can produce misleading results that might not reflect the actual runtime behavior.
	For example, `StringToArray<string, {strict: false}>` returns `[string]`, but at runtime, the string could be `'abc'` (which satisfies `string`), and converting it to an array would result in `['a', 'b', 'c']`, which doesn't satisfy `[string]`.

	So, it is recommended to not disable this option unless you are aware of the implications.

	@default true

	@example
	```
	import type {StringToArray} from 'type-fest';

	type A = StringToArray<string, {strict: true}>;
	//=> string[]

	type B = StringToArray<string, {strict: false}>;
	//=> [string]

	type C = StringToArray<`on${string}`, {strict: true}>;
	//=> ['o', 'n', ...string[]]

	type D = StringToArray<`on${string}`, {strict: false}>;
	//=> ['o', 'n', string]

	type E = StringToArray<`${string}xyz`, {strict: true}>;
	//=> [...string[], 'x', 'y', 'z']

	type F = StringToArray<`${string}xyz`, {strict: false}>;
	//=> [string, 'x', 'y', 'z']
	```
	*/
	strict?: boolean;
};

type DefaultStringToArrayOptions = {
	strict: true;
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

type E = StringToArray<`foo${string}bar`, {strict: false}>;
//=> ['f', 'o', 'o', string, 'b', 'a', 'r']
```

@see {@link StringToArrayOptions}

@category String
*/
export type StringToArray<S extends string, Options extends StringToArrayOptions = {}> =
	IfNotAnyOrNever<
		S,
		{
			// The brand belongs to the complete input string, not to its individual characters.
			ifNot: (S extends object ? UnwrapBrandedPrimitive<S> : S) extends infer Input extends string
				? Input extends unknown // Classify each normalized union member before choosing its traversal.
					? IsStringLiteral<Input> extends true
						? StringToArrayLiteral<Input>
						: _StringToArray<Input, ApplyDefaultOptions<StringToArrayOptions, DefaultStringToArrayOptions, Options>>
					: never
				: never;
			ifAny: unknown[];
		}
	>;

type _StringToArray<S extends string, Options extends Required<StringToArrayOptions>, Accumulator extends string[] = []> =
	S extends `${infer First}${infer Rest}`
		? (Options['strict'] extends false ? true : IsStringLiteral<First>) extends true
			? _StringToArray<Rest, Options, [...Accumulator, First]>
			// A placeholder like `${number}` can include characters such as `-` and `.`, which are not themselves numeric strings.
			: _StringToArray<Rest, Options, [...Accumulator, ...string[]]>
		: S extends ''
			? Accumulator
			: Options['strict'] extends false
				? [...Accumulator, S]
				: [...Accumulator, ...string[]];

// Literal inputs contain no placeholders, so consume ten characters at a time without reclassifying each character.
type StringToArrayLiteral<Value extends string, Accumulator extends string[] = []> =
	Value extends `${infer First}${infer Second}${infer Third}${infer Fourth}${infer Fifth}${infer Sixth}${infer Seventh}${infer Eighth}${infer Ninth}${infer Tenth}${infer Rest}`
		? StringToArrayLiteral<Rest, [...Accumulator, First, Second, Third, Fourth, Fifth, Sixth, Seventh, Eighth, Ninth, Tenth]>
		: Value extends `${infer First}${infer Rest}`
			? StringToArrayLiteral<Rest, [...Accumulator, First]>
			: Accumulator;

export {};
