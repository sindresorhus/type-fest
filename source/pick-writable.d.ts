import type {IsWritableKeyOf} from './is-writable-key-of.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {WritableKeysOf} from './writable-keys-of.d.ts'; // For `@link`
import type {PickReadonly} from './pick-readonly.d.ts'; // For `@link`

/**
Pick only the writable properties from the given object type, leaving out the `readonly` ones.

This is the counterpart of {@link PickReadonly}. Unlike `Pick<Type, WritableKeysOf<Type>>`, it picks from each member of a union separately, instead of merging the members into one object.

Use-cases:
- Create the type of an update request, where readonly properties like `id` cannot be changed.

@example
```
import type {PickWritable} from 'type-fest';

type User = {
	readonly id: number;
	name: string;
	surname?: string;
};

type UpdateRequest = PickWritable<User>;
//=> {name: string; surname?: string}

type Shape =
	| {readonly kind: 'circle'; radius: number}
	| {readonly kind: 'square'; size: number};

type ShapeUpdate = PickWritable<Shape>;
//=> {radius: number} | {size: number}
```

Known limitations:
- Arrays and tuples become plain objects with properties like `length` and `push`, like with `Pick`.
- In a generic function, a property of the result cannot be read, like `changes.name` when `changes` is `PickWritable<Entity>`. `Pick<Entity, WritableKeysOf<Entity>>` has the same limitation.

@see {@link WritableKeysOf}
@see {@link PickReadonly}
@category Object
*/
export type PickWritable<ObjectType extends object> =
	IsAny<ObjectType> extends true ? ObjectType // `any` has every key, and none of them are readonly. `IsWritableKeyOf<any, Key>` is `never`, which would filter out every key below.
		: {[Key in keyof ObjectType as // A mapped type over `keyof ObjectType` maps each member of a union by itself, and unlike a distributive conditional type, it keeps a generic `ObjectType` assignable to the result.
			IsWritableKeyOf<ObjectType, Key> extends false
				? never
				: Key
			]: ObjectType[Key]
		};

export {};
