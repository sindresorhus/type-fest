import type {BuiltIns, HasMultipleCallSignatures} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
Create a deep version of another type where all keys are set to also accept `undefined`.

This is like {@link UndefinedOnPartialDeep}, but instead of only widening the already-optional keys, it widens *every* key (required and optional alike) so that each value can additionally be `undefined`. Keys keep their original optionality and `readonly` modifiers, and the transformation is applied at every level.

Use-cases:
- Modeling a fully-shaped object whose fields are all present but may not yet be populated, such as a form-state object initialized from a schema before the user fills it in.
- Describing the result of a reset or clear operation that keeps the object's structure while blanking out every value.
- Typing partially-hydrated data where every field might be missing a value but the shape is fixed.

Use `{[Key in keyof Type]: Type[Key] | undefined}` if you only need one level deep.

@example
```
import type {UndefinableDeep} from 'type-fest';

type Settings = {
	textEditor: {
		fontSize: number;
		fontColor: string;
	};
	autosave: boolean;
};

type DraftSettings = UndefinableDeep<Settings>;
//=> {
// 	textEditor: {
// 		fontSize: number | undefined;
// 		fontColor: string | undefined;
// 	} | undefined;
// 	autosave: boolean | undefined;
// }

const draft: DraftSettings = {
	textEditor: {
		fontSize: undefined, // Present but not yet chosen
		fontColor: undefined,
	},
	autosave: undefined,
};
```

Note that types containing overloaded functions are not made deeply undefinable due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@see {@link UndefinedOnPartialDeep}

@category Object
@category Array
@category Set
@category Map
*/
export type UndefinableDeep<T> = T extends BuiltIns | ((new (...arguments_: any[]) => unknown))
	? T
	: T extends Map<infer KeyType, infer ValueType>
		? Map<UndefinableDeep<KeyType>, UndefinableDeep<ValueType>>
		: T extends Set<infer ItemType>
			? Set<UndefinableDeep<ItemType>>
			: T extends ReadonlyMap<infer KeyType, infer ValueType>
				? ReadonlyMap<UndefinableDeep<KeyType>, UndefinableDeep<ValueType>>
				: T extends ReadonlySet<infer ItemType>
					? ReadonlySet<UndefinableDeep<ItemType>>
					: T extends WeakMap<infer KeyType, infer ValueType>
						? WeakMap<UndefinableDeep<KeyType>, UndefinableDeep<ValueType>>
						: T extends WeakSet<infer ItemType>
							? WeakSet<UndefinableDeep<ItemType>>
							: T extends Promise<infer ValueType>
								? Promise<UndefinableDeep<ValueType>>
								: T extends (...arguments_: any[]) => unknown
									? IsNever<keyof T> extends true
										? T // For functions with no properties
										: HasMultipleCallSignatures<T> extends true
											? T
											: ((...arguments_: Parameters<T>) => ReturnType<T>) & UndefinableObjectDeep<T>
									: T extends readonly unknown[]
										? UndefinableListDeep<T>
										: T extends object
											? Simplify<UndefinableObjectDeep<T>> // `Simplify` to prevent `UndefinableObjectDeep` from appearing in the resulting type
											: unknown;

/**
Same as `UndefinableDeep`, but accepts only arrays and tuples as inputs, recursing into their elements without making the elements themselves `undefined`. Homomorphic mapping preserves the tuple structure along with `readonly`, optional, and rest modifiers. Internal helper for `UndefinableDeep`.
*/
type UndefinableListDeep<T extends readonly unknown[]> = {
	[KeyType in keyof T]: UndefinableDeep<T[KeyType]>
};

/**
Same as `UndefinableDeep`, but accepts only `object`s as inputs. Internal helper for `UndefinableDeep`.
*/
type UndefinableObjectDeep<ObjectType extends object> = {
	[KeyType in keyof ObjectType]: UndefinableDeep<ObjectType[KeyType]> | undefined
};

export {};
