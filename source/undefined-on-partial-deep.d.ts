import type {IsArrayOfUnknownLength, NonRecursiveType} from './internal/index.d.ts';

/**
Create a deep version of another type where all optional keys are set to also accept `undefined`.

Note: This is only needed when the [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes) TSConfig setting is enabled.

Use-cases:
- When `exactOptionalPropertyTypes` is enabled, an object like `{a: undefined}` is not assignable to the type `{a?: number}`. You can use `UndefinedOnPartialDeep<{a?: number}>` to make it assignable.

@example
```
import type {UndefinedOnPartialDeep} from 'type-fest';

type Settings = {
	optionA: string;
	optionB?: number;
	subOption: {
		subOptionA: boolean;
		subOptionB?: boolean;
	};
};

const testSettingsA: Settings = {
	optionA: 'foo',
	optionB: undefined, // TypeScript error if `exactOptionalPropertyTypes` is true.
	// @ts-expect-error
	subOption: {
		subOptionA: true,
		subOptionB: undefined, // TypeScript error if `exactOptionalPropertyTypes` is true
	},
};

const testSettingsB: UndefinedOnPartialDeep<Settings> = {
	optionA: 'foo',
	optionB: undefined, // `optionB` can be set to `undefined` now.
	subOption: {
		subOptionA: true,
		subOptionB: undefined, // `subOptionB` can be set to `undefined` now.
	},
};
```
*/
export type UndefinedOnPartialDeep<T> =
	// Handle the non-recursive types. Mapping over one of them replaces it with a plain object of its own members, so a `Uint8Array` would come back as a fifty property object literal.
	T extends NonRecursiveType
		? T
		// Handle tuple and array
		: T extends readonly unknown[]
			? UndefinedOnPartialList<T>
			// Handle map and readonly map
			: T extends Map<infer K, infer V>
				? Map<K, UndefinedOnPartialDeep<V>>
				: T extends ReadonlyMap<infer K, infer V>
					? ReadonlyMap<K, UndefinedOnPartialDeep<V>>
					// Handle weak map
					: T extends WeakMap<infer K extends WeakKey, infer V>
						? WeakMap<K, UndefinedOnPartialDeep<V>>
						// Handle set and readonly set
						: T extends Set<infer K>
							? Set<UndefinedOnPartialDeep<K>>
							: T extends ReadonlySet<infer K>
								? ReadonlySet<UndefinedOnPartialDeep<K>>
								// Handle weak set
								: T extends WeakSet<infer K extends WeakKey>
									? WeakSet<UndefinedOnPartialDeep<K>>
									// Handle object
									: T extends Record<any, any>
										? UndefinedOnPartialProperties<T>
										: T; // If T is not builtins / function / array / map / set / object, return T

// Handle tuples and arrays
type UndefinedOnPartialList<T extends readonly unknown[]> = IsArrayOfUnknownLength<T> extends false
	? UndefinedOnPartialProperties<T>
	// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
	: T extends unknown[]
		? Array<UndefinedOnPartialDeep<T[number]>>
		: ReadonlyArray<UndefinedOnPartialDeep<T[number]>>;

/**
Converts object properties and tuple elements, keeping their optional and readonly modifiers, and a tuple's length, labels and rest element.
*/
type UndefinedOnPartialProperties<T> = {
	// A homomorphic mapped type keeps fixed positions at either end, including optional elements and elements after a leading rest.
	[Key in keyof T]: undefined extends T[Key]
		// An optional property or tuple element needs an explicit `undefined` in its value type, beyond the absence allowed by its `?` modifier.
		? UndefinedOnPartialDeep<T[Key]> | undefined
		: UndefinedOnPartialDeep<T[Key]>
};

export {};
