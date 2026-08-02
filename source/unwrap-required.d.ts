import type {MapsSetsOrArrays, NonRecursiveType} from './internal/type.d.ts';

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

Note:
	- If the provided type isn’t of the form `Required<T>`, `UnwrapRequired` simply returns the input type.
	- `UnwrapRequired` doesn't work with arrays, if instantiated with arrays, it simply returns the input type.

@category Object
*/
export type UnwrapRequired<RequiredObjectType> =
	RequiredObjectType extends NonRecursiveType | MapsSetsOrArrays
		? RequiredObjectType
		: _UnwrapRequired<RequiredObjectType>;

type _UnwrapRequired<RequiredObjectType> =
	RequiredObjectType extends Required<infer ObjectType>
		? ObjectType
		: RequiredObjectType;

export {};
