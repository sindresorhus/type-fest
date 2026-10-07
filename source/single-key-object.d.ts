import type {IsEmptyObject} from './empty-object.d.ts';
import type {If} from './if.d.ts';
import type {IsUnion} from './is-union.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';

/**
Create a type that only accepts an object with a single key.

@example
```
import type {SingleKeyObject} from 'type-fest';

declare function someFunction<T>(parameter: SingleKeyObject<T>): void;

someFunction({value: true});

// @ts-expect-error
someFunction({value: true, otherKey: true});
// Error: Argument of type '{value: boolean; otherKey: boolean}' is not assignable to parameter of type 'never'.ts(2345)
```

@category Object
*/
export type SingleKeyObject<ObjectType> =
	// `keyof` of a type with an index signature is `string | number`, which is a union even when there is only one key, so only the explicitly defined keys are counted. The index signature is still kept in the result, so for such a type the single-key restriction is not enforced: an object with any number of keys still satisfies it.
	ObjectType extends unknown // For distributing `ObjectType`, since `keyof` of a union is the intersection of the members' keys
		? IsUnion<keyof OmitIndexSignature<ObjectType>> extends true
			? never
			: If<IsEmptyObject<ObjectType>, never, ObjectType>
		: never;

export {};
