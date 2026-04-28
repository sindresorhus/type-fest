/**
Revert the `Required` modifier on an object type.

Use-case: Infer the underlying type `T` when only `Required<T>` is available or the original type may not be directly accessible.

@example
```
import type {UnwrapRequired} from 'type-fest';

type ContactFormData = Required<{
	email: string;
	message?: string;
}>;

type DraftContactFormData = UnwrapRequired<ContactFormData>;
//=> {email: string; message?: string}
```

Note 1: If the provided type isn’t of `Required<T>`, `UnwrapRequired` has no effect on the original type.

Note 2: `Required<T>` is lossy for tuples with optional elements. `UnwrapRequired` cannot recover the original tuple type in these cases. Object types with optional properties are unaffected by this limitation (and work as expected with `UnwrapRequired`).

@category Object
*/
export type UnwrapRequired<RequiredObjectType> =
	RequiredObjectType extends Required<infer ObjectType>
		? (
			Required<ObjectType> extends RequiredObjectType
				? ObjectType
				: RequiredObjectType
		)
		: RequiredObjectType;

export {};
