import type {IfNotAnyOrNever, IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {If} from './if.d.ts';

/**
{@link SplitOnSpread} options.
*/
type SplitOnSpreadOptions = {
	/**
	Whether to preserve the optional modifier (`?`).

	@default true
	*/
	keepOptionals?: boolean;
};

type DefaultSplitOnSpreadOptions = {
	keepOptionals: true;
};

/**
Splits an Array on its spreaded portion. into three parts:

1. The static (non-spread) prefix before any spread element.
2. The inferred spread type (e.g., `string` from `...string[]`) as a single-element tuple.
3. The static suffix after the spread (if any).

If no spread exists, the entire array is treated as a static prefix with empty spread and suffix parts.

By default, Optional modifier (`?`) is preserved. See {@link SplitOnSpreadOptions.keepOptionals keepOptionals} option to change this behaviour.

@example
```ts
import type {SplitOnSpread} from 'type-fest';

type T1 = SplitOnSpread<[number, ...string[], boolean]>;
//=> [[number], [string], [boolean]]

type T2 = SplitOnSpread<[...boolean[], string]>;
//=> [[], [boolean], [string]]

type T3 = SplitOnSpread<[number, string?]>;
//=> [[number, string?], [], []]

type T4 = SplitOnSpread<[number, string?], {keepOptionals: false}>;
//=> [[number, string], [], []] Or [[number, string | undefined], [], []]

type T5 = SplitOnSpread<[...number[]]>;
//=> [[], [number], []]
```

@see ExtractSpread, ExcludeSpread
@category Array
*/
export type SplitOnSpread<Array_ extends UnknownArray, Options extends SplitOnSpreadOptions = {}> = IfNotAnyOrNever<Array_,
	DeconstructSpreadArray<Array_, ApplyDefaultOptions<SplitOnSpreadOptions, DefaultSplitOnSpreadOptions, Options>>
>;

/**
Deconstruct an Array on its rest element and return the split portions.

See {@link SplitOnSpread SplitOnSpread} for details.
*/
export type DeconstructSpreadArray<
	Array_ extends UnknownArray,
	Options extends Required<SplitOnSpreadOptions>,
	HeadAcc extends UnknownArray = [],
	TailAcc extends UnknownArray = [],
> =
	Array_ extends UnknownArray // For distributing `Array_`
		? keyof Array_ & `${number}` extends never
			// Enters this branch, if `Array_` is empty (e.g., []),
			// or `Array_` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
			? Array_ extends readonly [...infer Rest, infer Last]
				? DeconstructSpreadArray<Rest, Options, HeadAcc, [Last, ...TailAcc]> // Accumulate elements that are present after the rest element.
				: [HeadAcc, Array_ extends readonly [] ? [] : [Array_[number]], TailAcc] // Add the rest element between the accumulated elements.
			: Array_ extends readonly [(infer First)?, ...infer Rest]
				? DeconstructSpreadArray<
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
