import type {IsReadonlyKeyOf} from './is-readonly-key-of.d.ts';
import type {PickReadonly} from './pick-readonly.d.ts'; // For `@link`

/**
Extract all readonly keys from the given type.

Use {@link PickReadonly} to create a type that contains the readonly properties only.

@example
```
import type {ReadonlyKeysOf} from 'type-fest';

type User = {
	name: string;
	surname: string;

	readonly id: number;
};

type UserReadonlyKeys = ReadonlyKeysOf<User>;
//=> 'id'
```

Known limitations:
- A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `ReadonlyKeysOf<{readonly a?: string} | {readonly b?: number}>` is `'a' | 'b'` while `keyof` of the same union is `never`. Read one member at a time if you need a key that is valid for the whole union.

@category Utilities
*/
export type ReadonlyKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
		? (keyof {[Key in keyof Type as
			IsReadonlyKeyOf<Type, Key> extends false
				? never
				: Key
			]: never
		}) & keyof Type // Intersect with `keyof Type` to narrow the member's own keys. For a union this runs per member, see the note on unions in the docs.
		: never; // Should never happen

export {};
