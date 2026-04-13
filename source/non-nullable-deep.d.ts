import type {BuiltIns, HasMultipleCallSignatures} from './internal/type.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
Recursively removes `null` and `undefined` from the specified type.

Use-cases:
- Normalizing data received from external sources where `null`/`undefined` have been cleaned.
- Creating non-nullable variants of deeply nested types.

@example
```
import type {NonNullableDeep} from 'type-fest';

type User = {
	name: string | null;
	address: {
		city: string | undefined;
		street?: string | null;
	};
	contact: {
		email?: string | null | undefined;
		phone: string | undefined;
	};
};

type UpdatedUser = NonNullableDeep<User>;
//=> {
// 	name: string;
// 	address: {
// 		city: string;
// 		street?: string;
// 	};
// 	contact: {
// 		email?: string;
// 		phone: string;
// 	};
// }
```

@category Utilities
@category Object
@category Array
@category Set
@category Map
*/
export type NonNullableDeep<T> =
	T extends BuiltIns | (new (...arguments_: any[]) => unknown)
		? Exclude<T, null | undefined> // `Exclude` is used instead of `NonNullable` because `NonNullable<void>` results in `void & {}`.
		: T extends Map<infer KeyType, infer ValueType>
			? Map<NonNullableDeep<KeyType>, NonNullableDeep<ValueType>>
			: T extends Set<infer ItemType>
				? Set<NonNullableDeep<ItemType>>
				: T extends ReadonlyMap<infer KeyType, infer ValueType>
					? ReadonlyMap<NonNullableDeep<KeyType>, NonNullableDeep<ValueType>>
					: T extends ReadonlySet<infer ItemType>
						? ReadonlySet<NonNullableDeep<ItemType>>
						: T extends WeakMap<infer KeyType, infer ValueType>
							? WeakMap<NonNullableDeep<KeyType>, NonNullableDeep<ValueType>>
							: T extends WeakSet<infer ItemType>
								? WeakSet<NonNullableDeep<ItemType>>
								: T extends Promise<infer ValueType>
									? Promise<NonNullableDeep<ValueType>>
									: T extends (...arguments_: any[]) => unknown
										? HasMultipleCallSignatures<T> extends true
											? T
											: ((...arguments_: NonNullableDeep<Parameters<T>>) => NonNullableDeep<ReturnType<T>>)
												& (IsNever<keyof T> extends true
													? unknown
													: NonNullableDeep<Simplify<T>>) // `Simplify` removes the call signature
										: T extends object
											? {[P in keyof T]: NonNullableDeep<T[P]>}
											: unknown;

export {};
