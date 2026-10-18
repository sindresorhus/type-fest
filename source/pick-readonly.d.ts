import type {IsReadonlyKeyOf} from './is-readonly-key-of.d.ts';
import type {ReadonlyKeysOf} from './readonly-keys-of.d.ts'; // For `@link`
import type {PickWritable} from './pick-writable.d.ts'; // For `@link`

/**
Pick only the `readonly` properties from the given object type, leaving out the writable ones.

This is the counterpart of {@link PickWritable}. Unlike `Pick<Type, ReadonlyKeysOf<Type>>`, it picks from each member of a union separately, instead of merging the members into one object.

Use-cases:
- Create the type of the properties that only the server sets, like `id` and `createdAt`.

@example
```
import type {PickReadonly} from 'type-fest';

type User = {
	readonly id: number;
	readonly createdAt?: Date;
	name: string;
};

type ServerFields = PickReadonly<User>;
//=> {readonly id: number; readonly createdAt?: Date}

type Shape =
	| {readonly kind: 'circle'; radius: number}
	| {readonly kind: 'square'; readonly size: number};

type FixedShape = PickReadonly<Shape>;
//=> {
// 	readonly kind: 'circle';
// } | {
// 	readonly kind: 'square';
// 	readonly size: number;
// }
```

Known limitations:
- Arrays and tuples become plain objects with properties like `length` and `push`, like with `Pick`.
- In a generic function, a property of the result cannot be read, like `fields.id` when `fields` is `PickReadonly<Entity>`. `Pick<Entity, ReadonlyKeysOf<Entity>>` has the same limitation.

@see {@link ReadonlyKeysOf}
@see {@link PickWritable}
@category Object
*/
export type PickReadonly<ObjectType extends object> =
	{[Key in keyof ObjectType as // A mapped type over `keyof ObjectType` maps each member of a union by itself, and unlike a distributive conditional type, it keeps a generic `ObjectType` assignable to the result.
		IsReadonlyKeyOf<ObjectType, Key> extends false
			? never
			: Key
		]: ObjectType[Key]
	};

export {};
