import type {CallSignatureOf, HasMultipleCallSignatures, IsArrayOfUnknownLength, NonRecursiveLeaf, NonRecursiveType} from './internal/index.d.ts';
import type {ApplyDefaultOptions} from './apply-default-options.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Writable} from './writable.d.ts'; // For `@link`

/**
@see {@link WritableDeep}
*/
export type WritableDeepOptions = {
	/**
	The types to keep as is, instead of making deeply writable.

	A kept type is left untouched at every depth, including everything inside it. Matching uses assignability.

	@default never

	@example
	```
	import type {WritableDeep} from 'type-fest';

	type Color = {readonly red: number};
	type Settings = {readonly name: string; readonly color: Color};
	type WritableSettings = WritableDeep<Settings, {keep: Color}>;
	//=> {name: string; color: Color}
	```
	*/
	readonly keep?: unknown;
};

/**
Create a deeply mutable version of an `object`/`ReadonlyMap`/`ReadonlySet`/`ReadonlyArray` type. The inverse of `ReadonlyDeep<T>`. Use `Writable<T>` if you only need one level deep.

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509), or to define a single model where the only thing that changes is whether or not some of the keys are writable.

@example
```
import type {WritableDeep} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: readonly string[]; // To show that mutability is deeply affected.
	readonly c: boolean;
};

const writableDeepFoo: WritableDeep<Foo> = {a: 1, b: ['2'], c: true};
writableDeepFoo.a = 3;
writableDeepFoo.b[0] = 'new value';
writableDeepFoo.b = ['something'];
```

Pass the types to keep as is through the `keep` option to leave matching types untouched at every depth, like a class instance whose properties and methods should not be made writable. Matching uses assignability, so a plain object type that structurally matches a kept type is kept too, and a wide type, like `object`, keeps every object:

@example
```
import type {WritableDeep} from 'type-fest';

class Color {
	get r(): number {
		return 0;
	}

	get g(): number {
		return 0;
	}
}

declare const readonlyTheme: {
	readonly name: string;
	readonly background: Color;
};

declare const writableTheme: WritableDeep<typeof readonlyTheme, {keep: Color}>;

writableTheme.name = 'solarized'; // OK

// @ts-expect-error
writableTheme.background.r = 3; // Error: `Color` is kept as is, so its properties stay readonly
```

Note that types containing overloaded functions are not made deeply writable due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@see {@link Writable}
@see {@link WritableDeepOptions}

@category Object
@category Array
@category Set
@category Map
*/
export type WritableDeep<Value, Options extends WritableDeepOptions = {}> =
	_WritableDeep<Value, ApplyDefaultOptions<WritableDeepOptions, {keep: never}, Options>['keep']>;

/**
Internal helper for {@link WritableDeep}.
*/
type _WritableDeep<Value, Keep> =
	// A kept type is returned as is, including everything inside it. It is matched before everything else, so a kept `Map` or `Set` is not rebuilt either.
	Value extends Keep
		? Value
		: Value extends NonRecursiveLeaf
			? Value
			: Value extends (...arguments_: any[]) => unknown
				? IsNever<keyof Value> extends true // For functions with no properties
					? Value
					: HasMultipleCallSignatures<Value> extends true
						? Value
						: CallSignatureOf<Value> & _WritableObjectDeep<Value, Keep>
				: Value extends ReadonlyMap<unknown, unknown>
					? WritableMapDeep<Value, Keep>
					: Value extends ReadonlySet<unknown>
						? WritableSetDeep<Value, Keep>
						: Value extends readonly unknown[]
							? WritableArrayDeep<Value, Keep>
							// These are a single value rather than a structure to recurse into, or a weak collection whose contents cannot be reached, so they are left alone and their methods are not rebuilt.
							: Value extends NonRecursiveType | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>
								? Value
								: Value extends object
									? _WritableObjectDeep<Value, Keep>
									: unknown;

/**
Same as `WritableDeep`, but accepts only `Map`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableMapDeep<MapType extends ReadonlyMap<unknown, unknown>, Keep> =
	MapType extends ReadonlyMap<infer KeyType, infer ValueType>
		? Map<_WritableDeep<KeyType, Keep>, _WritableDeep<ValueType, Keep>>
		: MapType; // Should not happen

/**
Same as `WritableDeep`, but accepts only `Set`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableSetDeep<SetType extends ReadonlySet<unknown>, Keep> =
	SetType extends ReadonlySet<infer ItemType>
		? Set<_WritableDeep<ItemType, Keep>>
		: SetType; // Should not happen

/**
Same as `WritableDeep`, but accepts only `object`s as inputs. Internal helper for `WritableDeep`.
*/
export type _WritableObjectDeep<ObjectType extends object, Keep = never> = {
	-readonly [KeyType in keyof ObjectType]: _WritableDeep<ObjectType[KeyType], Keep>
};

/**
Same as `WritableDeep`, but accepts only `Array`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableArrayDeep<ArrayType extends readonly unknown[], Keep> =
	// A tuple has fixed elements at either end, including an optional first element or a fixed element after a leading rest.
	IsArrayOfUnknownLength<ArrayType> extends false
		// A homomorphic mapped type keeps the length, labels, optional elements and rest element without a recursion step per element.
		? _WritableObjectDeep<ArrayType, Keep>
		// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
		: Array<_WritableDeep<ArrayType[number], Keep>>;

export {};
