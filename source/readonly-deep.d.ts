import type {CallSignatureOf, HasMultipleCallSignatures, IsArrayOfUnknownLength, NonRecursiveLeaf, NonRecursiveType} from './internal/index.d.ts';
import type {ApplyDefaultOptions} from './apply-default-options.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
@see {@link ReadonlyDeep}
*/
export type ReadonlyDeepOptions = {
	/**
	The types to keep as is, instead of making deeply readonly.

	A kept type is left untouched at every depth, including everything inside it. Matching uses assignability.

	@default never

	@example
	```
	import type {ReadonlyDeep} from 'type-fest';

	type Color = {red: number};
	type Settings = {name: string; color: Color};
	type ReadonlySettings = ReadonlyDeep<Settings, {keep: Color}>;
	//=> {readonly name: string; readonly color: Color}
	```
	*/
	readonly keep?: unknown;
};

/**
Create a deeply immutable version of another type.

This is useful when a deeply nested structure needs to be exposed as completely immutable, for example, an imported JSON module or when receiving an API response that is passed around.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/13923) if you want to have this type as a built-in in TypeScript.

Use [`Readonly<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype) if you only need one level deep.

@example
```
import type {ReadonlyDeep} from 'type-fest';

declare const foo: {
	a: string;
	b: {c: number};
	d: Array<{e: number}>;
};

foo.a = 'bar'; // Allowed

foo.b = {c: 3}; // Allowed

foo.b.c = 4; // Allowed

foo.d = [{e: 5}]; // Allowed

foo.d.push({e: 6}); // Allowed

const last = foo.d.at(-1);
if (last) {
	last.e = 7; // Allowed
}

declare const readonlyFoo: ReadonlyDeep<typeof foo>;

// @ts-expect-error
readonlyFoo.a = 'bar';
// Error: Cannot assign to 'a' because it is a read-only property.

// @ts-expect-error
readonlyFoo.b = {c: 3};
// Error: Cannot assign to 'b' because it is a read-only property.

// @ts-expect-error
readonlyFoo.b.c = 4;
// Error: Cannot assign to 'c' because it is a read-only property.

// @ts-expect-error
readonlyFoo.d = [{e: 5}];
// Error: Cannot assign to 'd' because it is a read-only property.

// @ts-expect-error
readonlyFoo.d.push({e: 6});
// Error: Property 'push' does not exist on type 'ReadonlyArray<{readonly e: number}>'.

const readonlyLast = readonlyFoo.d.at(-1);
if (readonlyLast) {
	// @ts-expect-error
	readonlyLast.e = 8;
	// Error: Cannot assign to 'e' because it is a read-only property.
}
```

Pass the types to keep as is through the `keep` option to leave matching types untouched at every depth, like a class instance whose properties and methods should not be made readonly. Matching uses assignability, so a plain object type that structurally matches a kept type is kept too, and a wide type, like `object`, keeps every object:

@example
```
import type {ReadonlyDeep} from 'type-fest';

class Color {
	r = 0;
	g = 0;
}

declare const theme: {
	name: string;
	background: Color;
};

declare const readonlyTheme: ReadonlyDeep<typeof theme, {keep: Color}>;

// @ts-expect-error
readonlyTheme.name = 'solarized';
// Error: Cannot assign to 'name' because it is a read-only property.

readonlyTheme.background.r = 3; // OK: `Color` is kept as is, so its properties stay writable
```

Note that types containing overloaded functions are not made deeply readonly due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

Note that the methods of an array, such as `join`, can still be reassigned, because TypeScript treats `Readonly<ReadonlyArray<T>>` the same as `ReadonlyArray<T>`. The methods of a `Map` or a `Set` are made readonly.

@see {@link ReadonlyDeepOptions}

@category Object
@category Array
@category Set
@category Map
*/
export type ReadonlyDeep<Value, Options extends ReadonlyDeepOptions = {}> =
	_ReadonlyDeep<Value, ApplyDefaultOptions<ReadonlyDeepOptions, {keep: never}, Options>['keep']>;

/**
Internal helper for {@link ReadonlyDeep}.
*/
type _ReadonlyDeep<Value, Keep> =
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
						: CallSignatureOf<Value> & _ReadonlyObjectDeep<Value, Keep>
				: Value extends ReadonlyMap<infer KeyType, infer ValueType>
					? ReadonlyMapDeep<KeyType, ValueType, Keep>
					: Value extends ReadonlySet<infer ItemType>
						? ReadonlySetDeep<ItemType, Keep>
						: Value extends readonly unknown[]
							? IsArrayOfUnknownLength<Value> extends false
								// A homomorphic mapped type keeps the length, the optional elements and the rest element, without a recursion step per element.
								? {readonly [Key in keyof Value]: _ReadonlyDeep<Value[Key], Keep>}
								// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
								: ReadonlyArray<_ReadonlyDeep<Value[number], Keep>>
							: Value extends NonRecursiveType | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>
								? Value // These are a single value rather than a structure to recurse into, so their methods are not made readonly. The weak collections are separate because they are rebuilt rather than skipped by the sibling types.
								: Value extends object
									? _ReadonlyObjectDeep<Value, Keep>
									: unknown;

/**
Same as `ReadonlyDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `ReadonlyDeep`.

The `ReadonlyMap` is wrapped in `Readonly` so that its methods are readonly too. A `ReadonlyMap` only leaves out the methods that change the map, and the methods it has can still be reassigned, so linters such as the `prefer-readonly-parameter-types` rule of typescript-eslint do not see it as readonly. See https://github.com/sindresorhus/type-fest/issues/357
*/
type ReadonlyMapDeep<KeyType, ValueType, Keep> = {} & Readonly<ReadonlyMap<_ReadonlyDeep<KeyType, Keep>, _ReadonlyDeep<ValueType, Keep>>>;

/**
Same as `ReadonlyDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `ReadonlyDeep`. See the note on {@link ReadonlyMapDeep `ReadonlyMapDeep`} for why the built-in is wrapped in `Readonly`.
*/
type ReadonlySetDeep<ItemType, Keep> = {} & Readonly<ReadonlySet<_ReadonlyDeep<ItemType, Keep>>>;

/**
Same as `ReadonlyDeep`, but accepts only `object`s as inputs. Internal helper for `ReadonlyDeep`.
*/
export type _ReadonlyObjectDeep<ObjectType extends object, Keep = never> = {
	readonly [KeyType in keyof ObjectType]: _ReadonlyDeep<ObjectType[KeyType], Keep>
};

export {};
