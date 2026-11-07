import type {ApplyDefaultOptions, CallSignatureOf, HasMultipleCallSignatures, NonRecursiveLeaf} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
@see {@link PartialDeep}
*/
export type PartialDeepOptions = {
	/**
	Whether to affect the individual elements of arrays and tuples.

	When `true`, the elements of arrays and tuples are made deeply partial too, and the fixed elements of tuples become optional. `undefined` is not added to the elements of non-tuple arrays, unless `allowUndefinedInNonTupleArrays` is also `true`.

	@default false
	*/
	readonly recurseIntoArrays?: boolean;

	/**
	Allows `undefined` values in non-tuple arrays.

	- When set to `true`, elements of non-tuple arrays can be `undefined`.
	- When set to `false`, only explicitly defined elements are allowed in non-tuple arrays, ensuring stricter type checking.

	@default false

	@example
	You can allow `undefined` values in non-tuple arrays by passing `{recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}` as the second type argument:

	```
	import type {PartialDeep} from 'type-fest';

	type Settings = {
		languages: string[];
	};

	declare const partialSettings: PartialDeep<Settings, {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}>;

	partialSettings.languages = [undefined]; // OK
	```
	*/
	readonly allowUndefinedInNonTupleArrays?: boolean;

	/**
	The types to keep as is, instead of making deeply partial.

	A kept type is left untouched at every depth, including everything inside it. Use it for class instances whose properties and methods should not be walked, like a `THREE.Color` value from three.js. Matching uses assignability, so a plain object type that structurally matches a kept type is kept too, and a wide type, like `object`, keeps every object.

	@default never

	@example
	```
	import type {PartialDeep} from 'type-fest';

	class Color {
		r = 0;
		g = 0;
		b = 0;
	}

	type Item = {
		name: string;
		color: Color;
	};

	type PartialItem = PartialDeep<Item, {keep: Color}>;
	// {
	// 	name?: string;
	// 	color?: Color;
	// }
	```
	*/
	readonly keep?: unknown;
};

type DefaultPartialDeepOptions = {
	recurseIntoArrays: false;
	allowUndefinedInNonTupleArrays: false;
	keep: never;
};

/**
Create a deeply optional version of another type.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

Use [`Partial<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) if you only need one level deep.

@example
```
import type {PartialDeep} from 'type-fest';

let settings = {
	textEditor: {
		fontSize: 14,
		fontColor: '#000000',
		fontWeight: 400,
	},
	autocomplete: false,
	autosave: true,
};

const applySavedSettings = (savedSettings: PartialDeep<typeof settings>) => (
	{...settings, ...savedSettings, textEditor: {...settings.textEditor, ...savedSettings.textEditor}}
);

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```

By default, this does not affect elements in array and tuple types. You can change this by passing `{recurseIntoArrays: true}` as the second type argument:

```
import type {PartialDeep} from 'type-fest';

type Shape = {
	dimensions: [number, number];
	layers: Array<{name: string; visible: boolean}>;
};

const partialShape: PartialDeep<Shape, {recurseIntoArrays: true}> = {
	dimensions: [], // OK
	layers: [{name: 'Background'}], // OK
};

partialShape.dimensions = [15]; // OK

// @ts-expect-error
partialShape.layers = [undefined]; // The elements of a non-tuple array cannot be `undefined`
```

Class instances are made deeply partial too, which turns their properties and methods optional. Pass the types to keep as is through the `keep` option:

```
import type {PartialDeep} from 'type-fest';

class Color {
	r = 0;
	g = 0;
}

type Item = {
	name: string;
	color: Color;
};

type PartialItem = PartialDeep<Item, {keep: Color}>;
// {
// 	name?: string;
// 	color?: Color;
// }

declare const partialItem: PartialItem;

partialItem.name = 'shirt'; // OK
partialItem.color = new Color(); // OK: the property is optional, but the kept `Color` itself is untouched
partialItem.color.r = 3; // OK: the assignment above narrows `partialItem.color` to `Color`, which is kept as is
```

@see {@link PartialDeepOptions}

@category Object
@category Array
@category Set
@category Map
*/
export type PartialDeep<T, Options extends PartialDeepOptions = {}> =
	_PartialDeep<T, ApplyDefaultOptions<PartialDeepOptions, DefaultPartialDeepOptions, Options>>;

type _PartialDeep<T, Options extends Required<PartialDeepOptions>> =
	// A `Set` is structurally assignable to `WeakSet<WeakKey>`, so it has to be matched before the guard below, which would otherwise leave every `Set` as is. A `Map` is assignable to `WeakMap<WeakKey>` the same way as soon as its key is an object or a symbol, so it is matched here for the same reason. `Function` is excluded because a function is handled further down, where its own properties are made partial too.
	T extends Set<infer ItemType>
		? PartialSetDeep<T, ItemType, Options>
		: T extends Map<infer KeyType, infer ValueType>
			? PartialMapDeep<T, KeyType, ValueType, Options>
			: T extends NonRecursiveLeaf | PromiseLike<unknown> | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>
				? T
				: T extends ReadonlyMap<infer KeyType, infer ValueType>
					? PartialReadonlyMapDeep<T, KeyType, ValueType, Options>
					: T extends ReadonlySet<infer ItemType>
						? PartialReadonlySetDeep<T, ItemType, Options>
						: T extends (...arguments_: any[]) => unknown
							? IsNever<keyof T> extends true
								? T // For functions with no properties
								: HasMultipleCallSignatures<T> extends true
									? T
									: T extends Options['keep']
										? T
										: CallSignatureOf<T> & PartialObjectDeep<T, Options>
							// The `Function` interface has no call signature, so the branch above misses it, and mapping it would produce an uncallable record of its own methods.
							: T extends Function
								? T
								: T extends object
									? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
										? Options['recurseIntoArrays'] extends true
											? T extends Options['keep']
												? T // A kept array is returned as is, including its elements, instead of being rebuilt around them.
												: ItemType[] extends T // Test for arrays (non-tuples) specifically
													? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
														? ReadonlyArray<_PartialDeep<Options['allowUndefinedInNonTupleArrays'] extends false ? ItemType : ItemType | undefined, Options>>
														: Array<_PartialDeep<Options['allowUndefinedInNonTupleArrays'] extends false ? ItemType : ItemType | undefined, Options>>
													: PartialObjectDeep<T, Options> // Tuples behave properly
											: T // If they don't opt into array testing, just use the original type
										: PartialObjectDeep<T, Options>
									: unknown;

/**
Same as `PartialDeep`, but accepts only `Map`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialMapDeep<MapType, KeyType, ValueType, Options extends Required<PartialDeepOptions>> =
	MapType extends Options['keep']
		? MapType
		: {} & Map<_PartialDeep<KeyType, Options>, _PartialDeep<ValueType, Options>>;

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialSetDeep<SetType, ItemType, Options extends Required<PartialDeepOptions>> =
	SetType extends Options['keep']
		? SetType
		: {} & Set<_PartialDeep<ItemType, Options>>;

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialReadonlyMapDeep<MapType, KeyType, ValueType, Options extends Required<PartialDeepOptions>> =
	MapType extends Options['keep']
		? MapType
		: {} & ReadonlyMap<_PartialDeep<KeyType, Options>, _PartialDeep<ValueType, Options>>;

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialReadonlySetDeep<SetType, ItemType, Options extends Required<PartialDeepOptions>> =
	SetType extends Options['keep']
		? SetType
		: {} & ReadonlySet<_PartialDeep<ItemType, Options>>;

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.

The kept types are matched in the helpers and in the recursed branches of `_PartialDeep`, rather than at the top, so a generic `Options` still resolves every branch that does not recurse into members, like a leaf or a non-recursed array.
*/
type PartialObjectDeep<ObjectType extends object, Options extends Required<PartialDeepOptions>> =
	// A kept object is returned as is, including everything inside it, so its properties are not made optional either.
	ObjectType extends Options['keep']
		? ObjectType
		: {
			[KeyType in keyof ObjectType]?: _PartialDeep<ObjectType[KeyType], Options>
		};

export {};
