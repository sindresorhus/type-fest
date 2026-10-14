import type {SimplifyObject} from './internal/index.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {Except} from './except.d.ts';
import type {IsAny} from './is-any.d.ts';

// The default of the keys, which stands for every key. It is not a key any type can have, so it is told apart from an explicit key set, including `never`.
declare const allKeys: unique symbol;

/**
Create a writable version of the given array type.
*/
type WritableArray<ArrayType extends readonly unknown[]> = {-readonly [Key in keyof ArrayType]: ArrayType[Key]};

/**
Create a type that strips `readonly` from the given type. Inverse of `Readonly<T>`.

The 2nd argument will be ignored if the input type is not an object. Passing `never` as the keys makes no key of an object writable, while passing no keys makes every key writable.

Note: A `Map`, `Set` or array member of a union is made writable as a whole whenever any key is named.

Note: This type can make readonly `Set` and `Map` writable. This behavior is different from `Readonly<T>` (as of TypeScript 5.2.2). See: https://github.com/microsoft/TypeScript/issues/29655

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509), or to define a single model where the only thing that changes is whether or not some of the keys are writable.

@example
```
import type {Writable} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: readonly string[]; // To show that only the mutability status of the properties, not their values, are affected.
	readonly c: boolean;
};

const writableFoo: Writable<Foo> = {a: 1, b: ['2'], c: true};
writableFoo.a = 3;
// @ts-expect-error
writableFoo.b[0] = 'new value'; // Will still fail as the value of property "b" is still a readonly type.
writableFoo.b = ['something']; // Will work as the "b" property itself is no longer readonly.

type SomeWritable = Writable<Foo, 'b' | 'c'>;
//=> {readonly a: number; b: readonly string[]; c: boolean}

// Also supports array
const readonlyArray: readonly number[] = [1, 2, 3];
// @ts-expect-error
readonlyArray.push(4); // Will fail as the array itself is readonly.
const writableArray: Writable<typeof readonlyArray> = readonlyArray as Writable<typeof readonlyArray>;
writableArray.push(4); // Will work as the array itself is now writable.
```

@category Object
*/
// `BaseType` is distributed, because `keyof` of a union is the intersection of the members' keys, so without it no member of a union would have its `readonly` removed. The keys are gathered with `KeysOfUnion` for the same reason, so a key only one member has is accepted. The default is a sentinel rather than the key set itself, so `Writable<this>` reaches the single mapped type below without comparing key sets that are not resolved yet. The check goes both ways, because `never` is assignable to the sentinel and the sentinel is assignable to `symbol`, so either alone would read such a key set as every key.
export type Writable<BaseType, Keys extends KeysOfUnion<BaseType> | typeof allKeys = typeof allKeys> =
	[Keys, typeof allKeys] extends [typeof allKeys, Keys]
		? WritableAllKeys<BaseType>
		: WritableSelectedKeys<BaseType, Keys>;

// A single mapped type rather than the intersection `_Writable` builds, because an intersection of two mapped types never resolves when it is written over `this`.
type WritableAllKeys<BaseType> = BaseType extends unknown
	? BaseType extends ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | readonly unknown[]
		? _Writable<BaseType, keyof BaseType>
		: IsAny<BaseType> extends true
			? BaseType
			: SimplifyObject<{-readonly [KeyType in keyof BaseType]: BaseType[KeyType]}>
	: never;

// The intersection is against the member, not the union, so a key only one member has is applied to that member and is a no-op for the others.
type WritableSelectedKeys<BaseType, Keys> = BaseType extends unknown ? _Writable<BaseType, Keys & keyof BaseType> : never;

type _Writable<BaseType, Keys extends keyof BaseType> =
	BaseType extends ReadonlyMap<infer KeyType, infer ValueType>
		? Map<KeyType, ValueType>
		: BaseType extends ReadonlySet<infer ItemType>
			? Set<ItemType>
			: BaseType extends readonly unknown[]
				// Handle array
				? WritableArray<BaseType>
				// Handle object
				: IsAny<BaseType> extends true ? BaseType : SimplifyObject<
					// Pick just the keys that are not writable from the base type.
					Except<BaseType, Keys>
					// Make the specified keys writable.
					& {-readonly [KeyType in keyof BaseType as KeyType extends Keys ? KeyType : never]: BaseType[KeyType]}
				>;

export {};
