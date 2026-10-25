import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsArrayReadonly, MaxLength} from './internal/array.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {If} from './if.d.ts';
import type {ExtractRestElement} from './extract-rest-element.d.ts'; // For `@link`
import type {ExcludeRestElement} from './exclude-rest-element.d.ts'; // For `@link`

/**
{@link SplitOnRestElement} options.
*/
type SplitOnRestElementOptions = {
	/**
	Whether to preserve the optional modifier (`?`).

	- When set to `true`, the optional modifiers are preserved as-is. For example:
		`SplitOnRestElement<[number, string?, ...boolean[]], {preserveOptionalModifier: true}>` returns `[[number, string?], boolean[], []]`.

	- When set to `false`, optional elements like `T?` are transformed to `T`, preserving explicitly declared `undefined`. For example:
		`SplitOnRestElement<[number, string?, ...boolean[]], {preserveOptionalModifier: false}>` returns `[[number, string], boolean[], []]`.

	@default true
	*/
	preserveOptionalModifier?: boolean;
};

type DefaultSplitOnRestElementOptions = {
	preserveOptionalModifier: true;
};

/**
Splits an array into three parts, where the first contains all elements before the rest element, the second is the [`rest`](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) element itself, and the third contains all elements after the rest element.

Note: If any of the parts are missing, then they will be represented as empty arrays. For example, `SplitOnRestElement<[string, number]>` returns `[[string, number], [], []]`, where parts corresponding to the rest element and elements after it are empty.

By default, the optional modifier (`?`) is preserved.
See {@link SplitOnRestElementOptions `SplitOnRestElementOptions`}.

@example
```ts
import type {SplitOnRestElement} from 'type-fest';

type T1 = SplitOnRestElement<[number, ...string[], boolean]>;
//=> [[number], string[], [boolean]]

type T2 = SplitOnRestElement<readonly [...boolean[], string]>;
//=> readonly [[], boolean[], [string]]

type T3 = SplitOnRestElement<[number, string?]>;
//=> [[number, string?], [], []]

type T4 = SplitOnRestElement<[number, string?], {preserveOptionalModifier: false}>;
//=> [[number, string], [], []]

type T5 = SplitOnRestElement<readonly [string?, ...number[]], {preserveOptionalModifier: false}>;
//=> readonly [[string], number[], []]
```

@see {@link ExtractRestElement}
@see {@link ExcludeRestElement}
@category Array
*/
export type SplitOnRestElement<
	Array_ extends UnknownArray,
	Options extends SplitOnRestElementOptions = {},
> =
	Array_ extends unknown // For distributing `Array_`
		? IfNotAnyOrNever<Array_, {
			ifNot: _SplitOnRestElement<
				Array_,
				ApplyDefaultOptions<SplitOnRestElementOptions, DefaultSplitOnRestElementOptions, Options>
			>;
		}> extends infer Result extends UnknownArray
			? If<IsArrayReadonly<Array_>, Readonly<Result>, Result>
			: never // Should never happen
		: never; // Should never happen

/**
Deconstructs an array on its rest element and returns the split portions.

The traversal starts with its own recursion budget after the fixed-tuple preflight.
*/
export type _SplitOnRestElement<
	Array_ extends UnknownArray,
	Options extends Required<SplitOnRestElementOptions>,
> = number extends [...Array_]['length']
	? SplitOnRestElementImplementation<Array_, Options> & {}
	// A required fixed tuple has no rest or optional modifier to resolve, so copy it without traversal. Inspect a copy so an array length refinement does not look like a fixed tuple.
	: [...Array_]['length'] extends MaxLength<[...Array_]>
		? [[...Array_], [], []]
		: SplitOnRestElementImplementation<Array_, Options> & {};

/**
Walks tuple positions to separate a rest element and preserve or remove optional modifiers.
*/
type SplitOnRestElementImplementation<
	Array_ extends UnknownArray,
	Options extends Required<SplitOnRestElementOptions>,
	HeadAcc extends UnknownArray = [],
	TailAcc extends UnknownArray = [],
> =
	'0' extends keyof Array_
		// Enters this branch, if `Array_` starts with a non-rest element (e.g., `[string, number]` or `[string, ...number[]]`).
		? Array_ extends readonly [(infer First)?, ...infer Rest]
			? SplitOnRestElementImplementation<
				Rest, Options,
				[
					...HeadAcc,
					// A tuple allows fewer than one element only when its first element is optional. Written in exactly this shape because equivalent ones, such as `[] extends Array_`, are several times slower.
					...Array_ extends readonly [unknown, ...unknown[]]
						? [First]
						: Options['preserveOptionalModifier'] extends false
							? [First] // Optional inference preserves explicitly declared `undefined`.
							: [First?],
				],
				TailAcc
			> // Accumulate elements that are present before the rest element.
			: never // Should never happen, since `[(infer First)?, ...infer Rest]` is a top-type for arrays.
		// Enters this branch, if `Array_` is empty (e.g., []),
		// or `Array_` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
		: Array_ extends readonly [...infer Rest, infer Last]
			? SplitOnRestElementImplementation<Rest, Options, HeadAcc, [Last, ...TailAcc]> // Accumulate elements that are present after the rest element.
			// Add the rest element between the accumulated elements. It is spread into a fresh array, because a rest-only input such as `readonly [...string[]]` is the whole array and would otherwise bake `readonly` into the middle part, which the branch above, that peels the rest off element by element, never does.
			: [HeadAcc, Array_ extends readonly [] ? [] : [...Array_], TailAcc];

export {};
