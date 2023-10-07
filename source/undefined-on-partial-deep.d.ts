import type {BuiltIns} from './internal';
import type {Merge} from './merge';

/**
Create a deep version of another type where all optional keys accept `undefined` type when exactOptionalPropertyTypes enabled.

Note: When tsconfig `exactOptionalPropertyTypes` disabled, you don`t need this type, because `UndefinedOnPartialDeep<T>` will be the same as `T` when exactOptionalPropertyTypes is false.

Use-cases:
- When tsconfig `exactOptionalPropertyTypes` enabled, object `{a: undefined}` is not assignable to type `{a?: number}`, you can use `UndefinedOnPartialDeep<{a?: number}>` to make it assignable.

@example
```
import type {UndefinedOnPartialDeep} from 'type-fest';

interface Settings {
	optionA: string;
	optionB?: number;
	subOption: {
		subOptionA: boolean;
		subOptionB?: boolean;
	}
};

const testSettingsA: Settings = {
  optionA: 'foo',
  optionB: undefined, // TS error if exactOptionalPropertyTypes is true
  subOption: {
    subOptionA: true,
    subOptionB: undefined, // TS error if exactOptionalPropertyTypes is true
  },
};

const testSettingsB: UndefinedOnPartialDeep<Settings> = {
  optionA: 'foo',
  optionB: undefined, // 👉 optionB can be set to undefined now
  subOption: {
    subOptionA: true,
    subOptionB: undefined, // 👉 subOptionB can be set to undefined now
  },
};
```
**/

export type UndefinedOnPartialDeep<T> =
	// Handle built-in type and function
	T extends BuiltIns | Function
		? T
		// Handle tuple and array
		: T extends readonly unknown[]
			? UndefinedOnPartialList<T>
			// Handle map and readonly map
			: T extends Map<infer K, infer V>
				? Map<K, UndefinedOnPartialDeep<V>>
				: T extends ReadonlyMap<infer K, infer V>
					? ReadonlyMap<K, UndefinedOnPartialDeep<V>>
					// Handle set and readonly set
					: T extends Set<infer K>
						? Set<UndefinedOnPartialDeep<K>>
						: T extends ReadonlySet<infer K>
							? ReadonlySet<UndefinedOnPartialDeep<K>>
							// Handle object
							: T extends Record<any, any>
								? {
									[KeyType in keyof T]: undefined extends T[KeyType]
										? UndefinedOnPartialDeep<T[KeyType]> | undefined
										: UndefinedOnPartialDeep<T[KeyType]>
								}
								: T; // If T is not builtins / function / array / map / set / object, return T

// Handle tuples and arrays
type UndefinedOnPartialList<T extends readonly unknown[]> = T extends []
	? []
	: T extends [infer F, ...infer R]
		? [UndefinedOnPartialDeep<F>, ...UndefinedOnPartialDeep<R>]
		: T extends readonly [infer F, ...infer R]
			? readonly [UndefinedOnPartialDeep<F>, ...UndefinedOnPartialDeep<R>]
			: T extends Array<infer F>
				? Array<UndefinedOnPartialDeep<F>>
				: T extends ReadonlyArray<infer F>
					? ReadonlyArray<UndefinedOnPartialDeep<F>>
					: never;
