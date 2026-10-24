import type {ConditionalExcept} from './conditional-except.d.ts'; // For `@link`
import type {IsNever} from './is-never.d.ts';

/**
Pick only the properties of the given object type that do not have the `never` type.

A mapped type often marks the properties it filters out by setting them to `never`. This type removes those properties. Unlike `ConditionalExcept<ObjectType, never>`, it keeps a generic `ObjectType` assignable to the result.

Use-cases:
- Remove the `never` markers from a mapped type that you cannot change.
- Compose several mapped types that each mark properties with `never`, and remove all the markers at the end.

@example
```
import type {PickNonNever} from 'type-fest';

type Example = {
	a: string;
	b: never;
	c?: number;
	d?: never;
};

type Result = PickNonNever<Example>;
//=> {a: string; c?: number}
```

@example
```
import type {PickNonNever} from 'type-fest';

type Client = {
	getUser: 'GET /users/:id';
	getPosts?: 'GET /posts';
	createPost?: 'POST /posts';
};

type Getters<ObjectType> = {
	[Key in keyof ObjectType]: Key extends `get${string}` ? ObjectType[Key] : never;
};

type ClientGetters = PickNonNever<Getters<Client>>;
//=> {getUser: 'GET /users/:id'; getPosts?: 'GET /posts'}
```

A mapped type cannot remove a property by changing its value, so this type checks each value in an `as` clause on the key: a key whose value is `never` maps to `never`, and TypeScript leaves it out.

Known limitations:
- Only the top level is checked, so a nested `never` property is kept.
- An optional `never` property is removed too, including the `b?: never` markers that exclusive unions use to forbid a property, so the result no longer forbids it.
- An index signature whose value is `never` is removed, so `Record<string, never>` becomes `{}`.
- Call and construct signatures are dropped, like with `Pick`.
- Arrays and tuples become plain objects with properties like `length` and `push`, like with `Pick`.
- A union member with no property left becomes `{}`, which accepts any non-null value.
- In a generic function, a property of the result cannot be read. `Pick` with keys computed from the property types has the same limitation.

@see {@link ConditionalExcept}
@category Object
*/
export type PickNonNever<ObjectType extends object> =
	{[Key in keyof ObjectType as // A mapped type over `keyof ObjectType` maps each member of a union by itself, and unlike a distributive conditional type, it keeps a generic `ObjectType` assignable to the result.
		IsNever<Required<ObjectType>[Key]> extends true // `Required`, because an optional `never` property reads as `undefined`.
			? never
			: Key
		]: ObjectType[Key]
	};

export {};
