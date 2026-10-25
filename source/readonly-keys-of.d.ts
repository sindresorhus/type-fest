import type {IsAny} from './is-any.d.ts';
import type {IsReadonlyProperty} from './internal/object.d.ts';
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
	// Check `any` once; each mapped key already belongs to its distributed member.
	IsAny<Type> extends true ? never
		: Type extends unknown // For distributing `Type`
			? (keyof {[Key in keyof Type as
				IsReadonlyProperty<Type, Key> extends true ? Key : never
				]: never
			}) & keyof Type // Intersect with `keyof Type` to narrow the member's own keys. For a union this runs per member, see the note on unions in the docs.
			: never; // Should never happen

export {};
