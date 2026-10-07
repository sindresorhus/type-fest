import type {CallSignatureOf, HasMultipleCallSignatures, IsArrayOfUnknownLength, NonRecursiveLeaf, NonRecursiveType} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';

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

Note that types containing overloaded functions are not made deeply readonly due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@category Object
@category Array
@category Set
@category Map
*/
export type ReadonlyDeep<T> = T extends NonRecursiveLeaf
	? T
	: T extends (...arguments_: any[]) => unknown
		? IsNever<keyof T> extends true // For functions with no properties
			? T
			: HasMultipleCallSignatures<T> extends true
				? T
				: CallSignatureOf<T> & _ReadonlyObjectDeep<T>
		: T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
			? ReadonlyMapDeep<KeyType, ValueType>
			: T extends Readonly<ReadonlySet<infer ItemType>>
				? ReadonlySetDeep<ItemType>
				: T extends readonly unknown[]
					? IsArrayOfUnknownLength<T> extends false
						// A homomorphic mapped type keeps the length, the optional elements and the rest element, without a recursion step per element.
						? {readonly [Key in keyof T]: ReadonlyDeep<T[Key]>}
						// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
						: ReadonlyArray<ReadonlyDeep<T[number]>>
					: T extends NonRecursiveType | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>
						? T // These are a single value rather than a structure to recurse into, so their methods are not made readonly. The weak collections are separate because they are rebuilt rather than skipped by the sibling types.
						: T extends object
							? _ReadonlyObjectDeep<T>
							: unknown;

/**
Same as `ReadonlyDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `ReadonlyDeep`.

The result is the `ReadonlyMap` built-in rather than a `Readonly` wrapped around it. A `ReadonlyMap` is already immutable, so the wrapper added nothing but an anonymous object type that is only mutually assignable to a `ReadonlyMap` rather than being one, which every other `*Deep` type here returns directly.
*/
type ReadonlyMapDeep<KeyType, ValueType> = {} & ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>;

/**
Same as `ReadonlyDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `ReadonlyDeep`. See the note on {@link ReadonlyMapDeep `ReadonlyMapDeep`} for why the built-in is returned unwrapped.
*/
type ReadonlySetDeep<ItemType> = {} & ReadonlySet<ReadonlyDeep<ItemType>>;

/**
Same as `ReadonlyDeep`, but accepts only `object`s as inputs. Internal helper for `ReadonlyDeep`.
*/
export type _ReadonlyObjectDeep<ObjectType extends object> = {
	readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]>
};

export {};
