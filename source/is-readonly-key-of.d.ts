import type {IsAny} from './is-any.d.ts';
import type {IsReadonlyProperty} from './internal/object.d.ts';

/**
Returns a boolean for whether the given key is a readonly key of type.

This is useful when writing utility types or schema validators that need to differentiate `readonly` keys.

Distributes over object and key unions, returning `boolean` when results differ. Returns `false` when either input is `never`.

An `any` object has every key, and none of them are readonly, so the result is `false`, like `ReadonlyKeysOf<any>` is `never`. This also applies when the key is `any`. Otherwise, an `any` key returns `boolean`. `unknown` is not accepted.

@example
```
import type {IsReadonlyKeyOf} from 'type-fest';

type User = {
	name: string;
	surname: string;

	readonly id: number;
};

type Admin = {
	name: string;
	id: string;
};

type T1 = IsReadonlyKeyOf<User, 'id'>;
//=> true

type T2 = IsReadonlyKeyOf<User, 'name'>;
//=> false

type T3 = IsReadonlyKeyOf<User, 'name' | 'id'>;
//=> boolean

type T4 = IsReadonlyKeyOf<User | Admin, 'name'>;
//=> false

type T5 = IsReadonlyKeyOf<User | Admin, 'id'>;
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsReadonlyKeyOf<Type extends object, Key extends keyof Type> =
	// `any` is checked before `never`, so generic code that wraps the result keeps resolving it after instantiation. `any` has every key, and none of them are readonly.
	IsAny<Type | Key> extends true
		? [Type, Key] extends [never, unknown] | [unknown, never] ? false : IsAny<Type> extends true ? false : boolean
		: [Type, Key] extends [never, unknown] | [unknown, never] ? false
			: Key extends unknown // For distributing `Key`
				? Type extends unknown // For distributing `Type`
					? IsReadonlyProperty<Type, Key>
					: never // Should never happen
				: never; // Should never happen

export {};
