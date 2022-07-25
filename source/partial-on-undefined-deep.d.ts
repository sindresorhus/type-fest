import type {BuiltIns} from './internal';
import type {Merge} from './merge';

/**
Create a type from another type with all keys and nested keys accepting undefined type set to optional.

Use-cases:
- Make all properties of a type that can be undefined optional to not have to specify keys with undefined value

https://github.com/sindresorhus/type-fest/issues/399
@example
```
import type {PartialOnUndefinedDeep} from 'type-fest';

interface Settings {
	optionA: string;
	optionB: number | undefined;
	subOption: {
		subOptionA: boolean;
		subOptionB: boolean | undefined;
	}
};

const testSettings: PartialOnUndefinedDeep<Settings> = {
	optionA: "foo",
	// 👉 optionB is now optional and can be omited
	subOption: {
		subOptionA: true,
		// 👉 subOptionB is now optional aswell and can be omited
	},
};
```

@category Object
*/
export type PartialOnUndefinedDeep<T> = T extends Record<any, any> | undefined
	? {[KeyType in keyof T as undefined extends T[KeyType] ? KeyType : never]?: PartialOnUndefinedDeepValue<T[KeyType]>} extends infer U // Make a partial type with all value types accepting undefined (and set them optional)
		? Merge<{[KeyType in keyof T as KeyType extends keyof U ? never : KeyType]: PartialOnUndefinedDeepValue<T[KeyType]>}, U> // Join all remaining keys not treated in U
		: never // Should not happen
	: T;

/**
 * Utility type to get the value type by key and recursively call `PartialOnUndefinedDeep` to transform sub-objects.
 */
type PartialOnUndefinedDeepValue<T> = T extends BuiltIns | ((...arguments: any[]) => unknown)
	? T
	: T extends Record<any, any> | undefined
	? PartialOnUndefinedDeep<T>
	: unknown;
