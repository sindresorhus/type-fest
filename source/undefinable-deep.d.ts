import type {ApplyDefaultOptions, IsArrayOfUnknownLength, NonRecursiveLeaf} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {PartialDeep} from './partial-deep.d.ts'; // For `@link`
import type {UndefinedOnPartialDeep} from './undefined-on-partial-deep.d.ts'; // For `@link`

/**
@see {@link UndefinableDeep}
*/
export type UndefinableDeepOptions = {
	/**
	The types to keep as is, instead of adding `undefined` to its leaf values.

	A kept type is left untouched at every depth, including everything inside it. Matching uses assignability.

	@default never

	@example
	```
	import type {UndefinableDeep} from 'type-fest';

	type Color = {red: number};
	type Settings = {name: string; color: Color};
	type DraftSettings = UndefinableDeep<Settings, {keep: Color}>;
	//=> {name: string | undefined; color: Color}
	```
	*/
	readonly keep?: unknown;
};

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

Pass the types to keep as is through the `keep` option to leave matching types untouched at every depth, like a class instance whose properties and methods should not accept `undefined`. Matching uses assignability, so a plain object type that structurally matches a kept type is kept too, and a wide type, like `object`, keeps every object:

@example
```
import type {UndefinableDeep} from 'type-fest';

class Color {
	r = 0;
	g = 0;
}

type Item = {
	name: string;
	color: Color;
};

type DraftItem = UndefinableDeep<Item, {keep: Color}>;
// {
// 	name: string | undefined;
// 	color: Color;
// }
```

Functions and constructors are leaves: their signatures and attached properties are preserved unchanged, including generic and overloaded signatures. Weak collections exclude `undefined` from transformed keys because it is not a valid `WeakMap` key or `WeakSet` item. A `never` leaf becomes `undefined`.

@see {@link UndefinedOnPartialDeep}

@see {@link UndefinableDeepOptions}

@category Object
@category Array
@category Set
@category Map
*/
export type UndefinableDeep<Type, Options extends UndefinableDeepOptions = {}> =
	_UndefinableDeep<Type, ApplyDefaultOptions<UndefinableDeepOptions, {keep: never}, Options>['keep']>;

/**
Internal helper for {@link UndefinableDeep}.
*/
type _UndefinableDeep<Type, Keep> = IsNever<Type> extends true
	? undefined
	// A kept type is returned as is, including everything inside it. It is matched before everything else, so a kept `Map` or `Set` is not rebuilt either.
	: Type extends Keep
		? Type
		// Functions are leaves, unlike in `PartialDeep` and `ReadonlyDeep`: a function is a value that is cleared as a whole, and rebuilding it to reach its properties would lose generic signatures.
		: Type extends NonRecursiveLeaf | Function
			? Type | undefined
			: Type extends Map<infer KeyType, infer ValueType>
				? Map<_UndefinableDeep<KeyType, Keep>, _UndefinableDeep<ValueType, Keep>>
				: Type extends Set<infer ItemType>
					? Set<_UndefinableDeep<ItemType, Keep>>
					: Type extends ReadonlyMap<infer KeyType, infer ValueType>
						? ReadonlyMap<_UndefinableDeep<KeyType, Keep>, _UndefinableDeep<ValueType, Keep>>
						: Type extends ReadonlySet<infer ItemType>
							? ReadonlySet<_UndefinableDeep<ItemType, Keep>>
							: Type extends WeakMap<infer KeyType, infer ValueType>
								? WeakMap<Extract<_UndefinableDeep<KeyType, Keep>, WeakKey>, _UndefinableDeep<ValueType, Keep>>
								: Type extends WeakSet<infer ItemType>
									? WeakSet<Extract<_UndefinableDeep<ItemType, Keep>, WeakKey>>
									: Type extends Promise<infer ValueType>
										? Promise<_UndefinableDeep<ValueType, Keep>>
										// Other thenables are leaves, so they stay awaitable.
										: Type extends PromiseLike<unknown>
											? Type | undefined
											: Type extends readonly unknown[]
												? IsArrayOfUnknownLength<Type> extends false
													// A homomorphic mapped type keeps the length, the optional elements and the rest element, without a recursion step per element.
													? {[KeyType in keyof Type]: _UndefinableDeep<Type[KeyType], Keep>}
													// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
													: Type extends unknown[]
														? Array<_UndefinableDeep<Type[number], Keep>>
														: ReadonlyArray<_UndefinableDeep<Type[number], Keep>>
												: Type extends object
													? {[KeyType in keyof Type]: _UndefinableDeep<Type[KeyType], Keep>}
													: Type | undefined;

export {};
