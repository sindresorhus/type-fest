import type {IfNotAnyOrNever, IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {If} from './if.d.ts';

/**
{@link SplitOnRestElement} options.
*/
type SplitOnRestElementOptions = {
	/**
	Whether to preserve the optional modifier (`?`).

	- When set to `true` (default), the optional modifiers are preserved as-is. For example, `SplitOnRestElement<[number, string?, ...boolean[]], {keepOptionals: true}>` returns `[[number, string?], boolean[], []]`.

	- When set to `false`, optional elements like `T?` are transformed to `T | undefined` or simply `T` depending on the `exactOptionalPropertyTypes` compiler option. For example:
		- With `exactOptionalPropertyTypes` enabled, `SplitOnRestElement<[number, string?, ...boolean[]], {keepOptionals: false}>` returns `[[number, string], boolean[], []]`.
		- And, with it disabled, the result is `[[number, string | undefined], boolean[], []]`.

	@default true
	*/
	keepOptionals?: boolean;
};

type DefaultSplitOnRestElementOptions = {
	keepOptionals: true;
};

/**
Splits an array on its [`Rest`](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) element portion into three parts:

1. The static prefix before any `Rest` element element (if any).
2. The inferred `Rest` element type (e.g., `string` from `...string[]`) as a single-element tuple.
3. The static suffix after the `Rest` element (if any).

If no `Rest` element exists, the entire array is treated as a static prefix with empty `Rest` element and suffix parts.

By default, The optional modifier (`?`) is preserved. See {@link SplitOnRestElementOptions.keepOptionals keepOptionals} option to change this behavior.

@example
```ts
import type {SplitOnRestElement} from 'type-fest';

type T1 = SplitOnRestElement<[number, ...string[], boolean]>;
//=> [[number], [string], [boolean]]

type T2 = SplitOnRestElement<[...boolean[], string]>;
//=> [[], [boolean], [string]]

type T3 = SplitOnRestElement<[number, string?]>;
//=> [[number, string?], [], []]

type T4 = SplitOnRestElement<[number, string?], {keepOptionals: false}>;
//=> [[number, string], [], []] Or [[number, string | undefined], [], []]

type T5 = SplitOnRestElement<[...number[]]>;
//=> [[], [number], []]
```

@see ExtractRestElement, ExcludeRestElement
@category Array
*/
export type SplitOnRestElement<Array_ extends UnknownArray, Options extends SplitOnRestElementOptions = {}> = IfNotAnyOrNever<Array_,
	DeconstructRestArray<Array_, ApplyDefaultOptions<SplitOnRestElementOptions, DefaultSplitOnRestElementOptions, Options>>
>;

/**
Deconstructs an array on its rest element and returns the split portions.

See {@link SplitOnRestElement SplitOnRestElement} for details.
*/
export type DeconstructRestArray<
	Array_ extends UnknownArray,
	Options extends Required<SplitOnRestElementOptions>,
	HeadAcc extends UnknownArray = [],
	TailAcc extends UnknownArray = [],
> =
	Array_ extends UnknownArray // For distributing `Array_`
		? keyof Array_ & `${number}` extends never
			// Enters this branch, if `Array_` is empty (e.g., []),
			// or `Array_` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
			? Array_ extends readonly [...infer Rest, infer Last]
				? DeconstructRestArray<Rest, Options, HeadAcc, [Last, ...TailAcc]> // Accumulate elements that are present after the rest element.
				: [HeadAcc, Array_ extends readonly [] ? [] : [Array_[number]], TailAcc] // Add the rest element between the accumulated elements.
			: Array_ extends readonly [(infer First)?, ...infer Rest]
				? DeconstructRestArray<
					Rest, Options,
					[
						...HeadAcc,
						...'0' extends OptionalKeysOf<Array_>
							? Options['keepOptionals'] extends false
								? [If<IsExactOptionalPropertyTypesEnabled, First, First | undefined>] // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
								: [First?]
							: [First],
					],
					TailAcc
				>
				: never // Should never happen, since `[(infer First)?, ...infer Rest]` is a top-type for arrays.
		: never; // Should never happen
