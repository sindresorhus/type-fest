import type {IsArrayOfUnknownLength, NonRecursiveLeaf} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {PartialDeep} from './partial-deep.d.ts'; // For `@link`
import type {UndefinedOnPartialDeep} from './undefined-on-partial-deep.d.ts'; // For `@link`

/**
Create a deep version of another type where leaf values also accept `undefined`, keeping object containers present.

Unlike {@link PartialDeep}, this type keeps required properties required. It widens primitive values, `Date`, `RegExp`, typed arrays, functions, and constructors to accept `undefined`, while preserving the structure of nested objects, arrays, tuples, maps, sets, and promises. Optional and `readonly` modifiers are preserved.

Use this to model form state that retains its nested structure while individual fields are cleared or have not yet been populated.

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
// 	};
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

The transformation recurses into object properties and collection elements. For example, `string[]` becomes `Array<string | undefined>`, and `Promise<string>` becomes `Promise<string | undefined>`. Other thenables, such as `PromiseLike`, are leaves. An object-valued property or collection element stays an object unless its original type already includes `undefined`.

Functions and constructors are leaves: their signatures and attached properties are preserved unchanged, including generic and overloaded signatures. Weak collections exclude `undefined` from transformed keys because it is not a valid `WeakMap` key or `WeakSet` item. A `never` leaf becomes `undefined`.

@see {@link UndefinedOnPartialDeep}

@category Object
@category Array
@category Set
@category Map
*/
export type UndefinableDeep<Type> = IsNever<Type> extends true
	? undefined
	// Functions are leaves, unlike in `PartialDeep` and `ReadonlyDeep`: a function is a value that is cleared as a whole, and rebuilding it to reach its properties would lose generic signatures.
	: Type extends NonRecursiveLeaf | Function
		? Type | undefined
		: Type extends Map<infer KeyType, infer ValueType>
			? Map<UndefinableDeep<KeyType>, UndefinableDeep<ValueType>>
			: Type extends Set<infer ItemType>
				? Set<UndefinableDeep<ItemType>>
				: Type extends ReadonlyMap<infer KeyType, infer ValueType>
					? ReadonlyMap<UndefinableDeep<KeyType>, UndefinableDeep<ValueType>>
					: Type extends ReadonlySet<infer ItemType>
						? ReadonlySet<UndefinableDeep<ItemType>>
						: Type extends WeakMap<infer KeyType, infer ValueType>
							? WeakMap<Extract<UndefinableDeep<KeyType>, WeakKey>, UndefinableDeep<ValueType>>
							: Type extends WeakSet<infer ItemType>
								? WeakSet<Extract<UndefinableDeep<ItemType>, WeakKey>>
								: Type extends Promise<infer ValueType>
									? Promise<UndefinableDeep<ValueType>>
									// Other thenables are leaves, so they stay awaitable.
									: Type extends PromiseLike<unknown>
										? Type | undefined
										: Type extends readonly unknown[]
											? IsArrayOfUnknownLength<Type> extends false
												// A homomorphic mapped type keeps the length, the optional elements and the rest element, without a recursion step per element.
												? {[KeyType in keyof Type]: UndefinableDeep<Type[KeyType]>}
												// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
												: Type extends unknown[]
													? Array<UndefinableDeep<Type[number]>>
													: ReadonlyArray<UndefinableDeep<Type[number]>>
											: Type extends object
												? {[KeyType in keyof Type]: UndefinableDeep<Type[KeyType]>}
												: Type | undefined;

export {};
