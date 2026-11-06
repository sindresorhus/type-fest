import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {Get} from './get.d.ts'; // For `@link`
import type {ValueOfDeep} from './value-of-deep.d.ts'; // For `@link`
import type {ArrayValues} from './array-values.d.ts'; // For `@link`
import type {IterableElement} from './iterable-element.d.ts'; // For `@link`

/**
Create a union of the given object's values, and optionally specify which keys to get the values from.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31438) if you want to have this type as a built-in in TypeScript.

@example
```
import type {ValueOf} from 'type-fest';

type A = ValueOf<{id: number; name: string; active: boolean}>;
//=> string | number | boolean

type B = ValueOf<{id: number; name: string; active: boolean}, 'name'>;
//=> string

type C = ValueOf<{id: number; name: string; active: boolean}, 'id' | 'name'>;
//=> string | number
```

This type is only for objects. Reading an array with it gives its values mixed with the types of its methods, so use {@link ArrayValues} for the values of an array or tuple, and {@link IterableElement} for the element type of an `Iterable`, like `Set`, `Map`, and typed arrays.

This type only reads one level. For a deeply nested property, use {@link Get} with a key path: `Get<{a: {b: string}}, 'a.b'>` is `string`. For a union of all leaf values at every level, use {@link ValueOfDeep}.

@see {@link Get}
@see {@link ValueOfDeep}
@see {@link ArrayValues}
@see {@link IterableElement}

@category Object
*/
// The keys are gathered with `KeysOfUnion` because `keyof` of a union is the intersection of its members' keys, which is empty for a union of objects that share nothing. Each member is then read at the keys it actually has, so a key the other member lacks contributes nothing rather than poisoning the whole result.
export type ValueOf<ObjectType, ValueType extends KeysOfUnion<ObjectType> = KeysOfUnion<ObjectType>> =
	// The undistributed read keeps a generic `ObjectType[Key]` assignable to the result, because a value is assignable to a union when it is assignable to one of its members. For a concrete type it adds nothing, since it is a subset of the distributed read. The wrapping conditional, which is always true, keeps the result from being displayed as `ValueOf<…>`.
	[ObjectType] extends [unknown]
		// The second read distributes over `ObjectType`, so each member is read at its own keys.
		? ObjectType[ValueType & keyof ObjectType] | (ObjectType extends unknown ? ObjectType[ValueType & keyof ObjectType] : never)
		: never;

export {};
