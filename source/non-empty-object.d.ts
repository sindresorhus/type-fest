import type {HasRequiredKeys} from './has-required-keys.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {RequireAtLeastOne} from './require-at-least-one.d.ts';

/**
Represents an object with at least 1 non-optional key.

This is useful when you need an object where all keys are optional, but there must be at least 1 key.

Note: A type whose only members are index signatures (e.g. `{[key: string]: unknown}`) cannot statically express "at least one dynamic key" in TypeScript. For such types, `NonEmptyObject` fails closed and resolves to `never` rather than silently accepting `{}`.

@example
```
import type {NonEmptyObject} from 'type-fest';

type User = {
	name: string;
	surname: string;
	id: number;
};

type UpdateRequest<Entity extends object> = NonEmptyObject<Partial<Entity>>;

const update1: UpdateRequest<User> = {
	name: 'Alice',
	surname: 'Acme',
};

// At least 1 key is required, therefore this will report a 2322 error:
// Type '{}' is not assignable to type 'UpdateRequest<User>'
// @ts-expect-error
const update2: UpdateRequest<User> = {};
```

@see Use `IsEmptyObject` to check whether an object is empty.

@category Object
*/
export type NonEmptyObject<T extends object> =
	keyof OmitIndexSignature<T> extends never
		? never
		: HasRequiredKeys<OmitIndexSignature<T>> extends true
			? T
			: RequireAtLeastOne<T, keyof OmitIndexSignature<T>>;

export {};
