import type {BuiltIns} from './internal';

type ExcludeUndefined<T> = Exclude<T, undefined>;

/**
Create a type from another type with all keys and nested keys set to required.

Use-cases:
 - Creating optional configuration interfaces where the underlying implementation still requires all options to be fully specified
 - Modeling the resultant type after a deep merge with a set of defaults

@example
```
import type {RequiredDeep} from 'type-fest';

type Settings = {
	textEditor?: {
		fontSize?: number | undefined;
		fontColor?: string | undefined;
		fontWeight?: number | undefined;
	}
	autocomplete?: boolean | undefined;
	autosave?: boolean | undefined;
};

type RequiredSettings = RequiredDeep<Settings>;
// 	type RequiredSettings = {
//		textEditor: {
//			fontSize: number;
//			fontColor: string;
//			fontWeight: number;
//		}
//		autocomplete: boolean;
//		autosave: boolean;
//	}
```

Note that types containing overloaded functions are not made deeply required due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

 @category Utilities
 @category Object
 @category Array
 @category Set
 @category Map
 */
export type RequiredDeep<T, E extends ExcludeUndefined<T> = ExcludeUndefined<T>> = E extends BuiltIns
	? E
	: E extends Map<infer KeyType, infer ValueType>
		? Map<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
		: E extends Set<infer ItemType>
			? Set<RequiredDeep<ItemType>>
			: E extends ReadonlyMap<infer KeyType, infer ValueType>
				? ReadonlyMap<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
				: E extends ReadonlySet<infer ItemType>
					? ReadonlySet<RequiredDeep<ItemType>>
					: E extends WeakMap<infer KeyType, infer ValueType>
						? WeakMap<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
						: E extends WeakSet<infer ItemType>
							? WeakSet<RequiredDeep<ItemType>>
							: E extends Promise<infer ValueType>
								? Promise<RequiredDeep<ValueType>>
								: E extends (...args: any[]) => unknown
									? {} extends RequiredObjectDeep<E>
										? E
										: HasMultipleCallSignatures<E> extends true
											? E
											: ((...arguments: Parameters<E>) => ReturnType<E>) & RequiredObjectDeep<E>
									: E extends object
										? E extends Array<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
											? ItemType[] extends E // Test for arrays (non-tuples) specifically
												? Array<RequiredDeep<ItemType>> // Recreate relevant array type to prevent eager evaluation of circular reference
												: RequiredObjectDeep<E> // Tuples behave properly
											: RequiredObjectDeep<E>
										: unknown;

type RequiredObjectDeep<ObjectType extends object> = {
	[KeyType in keyof ObjectType]-?: RequiredDeep<ObjectType[KeyType]>
};

/**
Test if the given function has multiple call signatures.

Needed to handle the case of a single call signature with properties.

Multiple call signatures cannot currently be supported due to a TypeScript limitation.
@see https://github.com/microsoft/TypeScript/issues/29732
*/
type HasMultipleCallSignatures<T extends (...arguments: any[]) => unknown> =
	T extends {(...arguments: infer A): unknown; (...arguments: any[]): unknown}
		? unknown[] extends A
			? false
			: true
		: false;
