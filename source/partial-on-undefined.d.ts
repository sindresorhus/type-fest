import type {MapsSetsOrArrays, NonRecursiveType, SimplifyObject} from './internal/index.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PartialOnUndefinedDeep} from './partial-on-undefined-deep.d.ts'; // For `@link`

/**
Create a type where all keys accepting `undefined` type are set to optional.

Unlike {@link PartialOnUndefinedDeep}, this type only changes the top-level properties. Nested objects, array and tuple elements, map values, set items, functions, and built-in values are kept as is.

The `undefined` type stays in the value of a key that becomes optional, and the `readonly` modifier is preserved. A key whose value is `unknown` is not made optional, while a key whose value is `any` is.

The index signature itself is kept as is, because it has no optional modifier.

Use-cases:
- Build an update payload from a model where a field set to `undefined` means “not provided”.
- Make configuration fields that accept `undefined` optional without recursing into a large nested type, which keeps the type simple and fast to check.

@example
```
import type {PartialOnUndefined} from 'type-fest';

type UserPatch = {
	id: string;
	name: string | undefined;
	email: string | undefined;
	address: {
		street: string | undefined;
		city: string;
	};
};

const patch: PartialOnUndefined<UserPatch> = {
	id: 'user_1',
	// 👉 `name` and `email` are now optional and can be omitted.
	address: {
		// 👉 Nested keys are unchanged, so `street` is still required.
		street: undefined,
		city: 'Oslo',
	},
};

const invalidPatch: PartialOnUndefined<UserPatch> = {
	id: 'user_1',
	// @ts-expect-error `street` is nested, so it is still required and cannot be omitted.
	address: {
		city: 'Oslo',
	},
};
```

@see {@link PartialOnUndefinedDeep} for the recursive version.

@category Object
*/
export type PartialOnUndefined<Type> =
	Type extends NonRecursiveType | MapsSetsOrArrays
		? Type
		: Type extends object
			? PartialOnUndefinedObject<Type>
			: Type;

/**
Transforms the top-level properties of an object type, keeping every value type as is.
*/
type PartialOnUndefinedObject<Type extends object> =
	{[Key in keyof Type as undefined extends Type[Key] ? IsUnknown<Type[Key]> extends true ? never : Key : never]?: Type[Key]} extends infer OptionalProperties
		// Join the optional properties with the remaining keys.
		? SimplifyObject<{[Key in keyof Type as Key extends keyof OmitIndexSignature<OptionalProperties> ? never : Key]: Type[Key]} & OptionalProperties>
		: never; // Should not happen

export {};
