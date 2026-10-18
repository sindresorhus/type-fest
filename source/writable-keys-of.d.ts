import type {IsWritableKeyOf} from './is-writable-key-of.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {PickWritable} from './pick-writable.d.ts'; // For `@link`

/**
Extract all writable keys from the given type.

Use {@link PickWritable} to create a type that contains the writable properties only.

@example
```
import type {WritableKeysOf} from 'type-fest';

type User = {
	name: string;
	surname: string;

	readonly id: number;
};

type UserWritableKeys = WritableKeysOf<User>;
//=> 'name' | 'surname'
```

Known limitations:
- An index signature is reported as a writable key, for the same reason `RequiredKeysOf` reports it as a required key. See the note in that type's docs.
- A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `WritableKeysOf<{a?: string} | {b?: number}>` is `'a' | 'b'` while `keyof` of the same union is `never`. Read one member at a time if you need a key that is valid for the whole union.

@category Utilities
*/
export type WritableKeysOf<Type extends object> =
	IsAny<Type> extends true ? keyof Type // `IsWritableKeyOf<any, Key>` is `never`, which would filter out every key below.
		: Type extends unknown // For distributing `Type`
			? (keyof {[Key in keyof Type as
				IsWritableKeyOf<Type, Key> extends false
					? never
					: Key
				]: never
			}) & keyof Type // Intersect with `keyof Type` to narrow the member's own keys. For a union this runs per member, see the note on unions in the docs.
			: never; // Should never happen

export {};
