import type {IsAny} from './is-any.d.ts';
import type {IsReadonlyProperty} from './internal/object.d.ts';
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
- An index signature that is not `readonly` is reported as a writable key, so `WritableKeysOf<Record<string, unknown>>` is `string`, even though no particular property has to be present.
- A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `WritableKeysOf<{a?: string} | {b?: number}>` is `'a' | 'b'` while `keyof` of the same union is `never`. Read one member at a time if you need a key that is valid for the whole union.

@category Utilities
*/
export type WritableKeysOf<Type extends object> =
	IsAny<Type> extends true ? keyof Type // `any` has every key, and none of them are readonly.
		: Type extends unknown // For distributing `Type`
			? (keyof {[Key in keyof Type as
				// Each mapped key belongs to this distributed member, so compare its modifiers directly.
				IsReadonlyProperty<Type, Key> extends true
					? never
					: Key
				]: never
			}) & keyof Type // Intersect with `keyof Type` to narrow the member's own keys. For a union this runs per member, see the note on unions in the docs.
			: never; // Should never happen

export {};
