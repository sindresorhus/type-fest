import type {If} from './if.d.ts';
import type {ApplyDefaultOptions, LiteralKeyOf, NonRecursiveType} from './internal/index.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {Merge} from './merge.d.ts';

/**
@see {@link PartialOnUndefinedDeep}
*/
export type PartialOnUndefinedDeepOptions = {
	/**
	Whether to affect the individual elements of arrays and tuples.

	@default false
	*/
	readonly recurseIntoArrays?: boolean;
};

type DefaultPartialOnUndefinedDeepOptions = {
	recurseIntoArrays: false;
};

/**
Create a deep version of another type where all keys accepting `undefined` type are set to optional.

This utility type is recursive, transforming at any level deep. By default, it does not affect arrays and tuples items unless you explicitly pass `{recurseIntoArrays: true}` as the second type argument.

Use-cases:
- Make all properties of a type that can be undefined optional to not have to specify keys with undefined value.

@example
```
import type {PartialOnUndefinedDeep} from 'type-fest';

type Settings = {
	optionA: string;
	optionB: number | undefined;
	subOption: {
		subOptionA: boolean;
		subOptionB: boolean | undefined;
	};
};

const testSettings: PartialOnUndefinedDeep<Settings> = {
	optionA: 'foo',
	// 👉 optionB is now optional and can be omitted
	subOption: {
		subOptionA: true,
		// 👉 subOptionB is now optional as well and can be omitted
	},
};
```

@category Object
*/
export type PartialOnUndefinedDeep<T, Options extends PartialOnUndefinedDeepOptions = {}> =
	PartialOnUndefinedDeepValue<T, ApplyDefaultOptions<PartialOnUndefinedDeepOptions, DefaultPartialOnUndefinedDeepOptions, Options>>;

type _PartialOnUndefinedDeep<T, Options extends Required<PartialOnUndefinedDeepOptions>> = T extends Record<any, any> | undefined
	? {[KeyType in keyof T as undefined extends T[KeyType] ? If<IsUnknown<T[KeyType]>, never, KeyType> : never]?: PartialOnUndefinedDeepValue<T[KeyType], Options>} extends infer U // Make a partial type with all value types accepting undefined (and set them optional)
		? Merge<{[KeyType in keyof T as KeyType extends LiteralKeyOf<U> ? never : KeyType]: PartialOnUndefinedDeepValue<T[KeyType], Options>}, U> // Join all remaining keys not treated in U
		: never // Should not happen
	: T;

/**
Utility type to get the value type by key and recursively call `PartialOnUndefinedDeep` to transform sub-objects.
*/
type PartialOnUndefinedDeepValue<T, Options extends Required<PartialOnUndefinedDeepOptions>> = T extends NonRecursiveType
	? T
	: T extends ReadonlyArray<infer U> // Test if type is array or tuple
		? Options['recurseIntoArrays'] extends true // Check if option is activated
			? U[] extends T // Check if array not tuple
				? readonly U[] extends T
					? ReadonlyArray<PartialOnUndefinedDeepValue<U, Options>> // Readonly array treatment
					: Array<PartialOnUndefinedDeepValue<U, Options>> // Mutable array treatment
				: {[Key in keyof T]: PartialOnUndefinedDeepValue<T[Key], Options>} // Tuple treatment
			: T
		// A map or set is a container, so its value or item type is converted. Rebuilding it member by member instead would leave the value type untouched, defeating the point of the type.
		: T extends Map<infer KeyType, infer ValueType>
			? Map<KeyType, PartialOnUndefinedDeepValue<ValueType, Options>>
			: T extends ReadonlyMap<infer KeyType, infer ValueType>
				? ReadonlyMap<KeyType, PartialOnUndefinedDeepValue<ValueType, Options>>
				: T extends WeakMap<infer KeyType extends WeakKey, infer ValueType>
					? WeakMap<KeyType, PartialOnUndefinedDeepValue<ValueType, Options>>
					: T extends Set<infer ItemType>
						? Set<PartialOnUndefinedDeepValue<ItemType, Options>>
						: T extends ReadonlySet<infer ItemType>
							? ReadonlySet<PartialOnUndefinedDeepValue<ItemType, Options>>
							: T extends WeakSet<infer ItemType extends WeakKey>
								? WeakSet<PartialOnUndefinedDeepValue<ItemType, Options>>
								: T extends Record<any, any> | undefined
									? _PartialOnUndefinedDeep<T, Options>
									: unknown;

export {};
