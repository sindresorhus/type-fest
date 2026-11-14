import type {IsAny} from './is-any.d.ts';
import type {RequireExactlyOne} from './require-exactly-one.d.ts'; // For `@link`

/**
Create a union of single-property objects, one for each property of the given object.

Use-cases:
- Describe operations that act on one field at a time, such as field-level patches.

Each member keeps exactly one property, with its modifiers (`readonly`, `?`) preserved. Values are kept as they are, without distribution or recursive conversion. Arrays, tuples, and objects with no known properties produce `never`. Each index signature becomes one member that keeps the signature, absorbing the keys it covers. Distributes over object unions, discarding members that produce `never`; `any` produces `any` and `never` produces `never`.

Note: members are ordinary objects, so a value may still have the properties of the other members. Use {@link RequireExactlyOne} when a value must have exactly one of the keys. A member with an optional property also matches objects without it.

@example
```
import type {ObjectToUnion} from 'type-fest';

type Update = ObjectToUnion<{name: string; age: number}>;
//=> {name: string} | {age: number}

type Fields = ObjectToUnion<{readonly id: string; done?: boolean}>;
//=> {readonly id: string} | {done?: boolean}
```

@category Object
*/
export type ObjectToUnion<ObjectType extends object> = IsAny<ObjectType> extends true
	? any
	: ObjectType extends unknown
		? ObjectType extends readonly unknown[]
			// Arrays and tuples have a `length`, methods, and an index signature, so they cannot be split into one-property members.
			? never
			: {[Key in keyof ObjectType]-?: Pick<ObjectType, Key>}[keyof ObjectType]
		: never;

export {};
