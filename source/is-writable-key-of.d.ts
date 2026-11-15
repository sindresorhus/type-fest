import type {IsReadonlyKeyOf} from './is-readonly-key-of.d.ts';
import type {Not} from './not.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is a writable key of type.

This is useful when writing utility types or schema validators that need to differentiate `writable` keys.

Distributes over object and key unions, returning `boolean` when results differ. Returns `false` when either input is `never`. Otherwise, returns `true` for an `any` object, because `any` has every key and none of them are readonly, like `WritableKeysOf<any>` is `PropertyKey`, and `boolean` for an `any` key. `unknown` is not accepted.

@example
```
import type {IsWritableKeyOf} from 'type-fest';

type User = {
	name: string;
	surname: string;

	readonly id: number;
};

type Admin = {
	name: string;
	id: string;
};

type T1 = IsWritableKeyOf<User, 'name'>;
//=> true

type T2 = IsWritableKeyOf<User, 'id'>;
//=> false

type T3 = IsWritableKeyOf<User, 'name' | 'id'>;
//=> boolean

type T4 = IsWritableKeyOf<User | Admin, 'name'>;
//=> true

type T5 = IsWritableKeyOf<User | Admin, 'id'>;
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsWritableKeyOf<Type extends object, Key extends keyof Type> =
	// `any` is checked before `never`, so generic code that wraps the result keeps resolving it after instantiation. `any` has every key, and none of them are readonly.
	IsAny<Type | Key> extends true
		? [Type, Key] extends [never, unknown] | [unknown, never] ? false : IsAny<Type> extends true ? true : boolean
		: [Type, Key] extends [never, unknown] | [unknown, never] ? false
			// `never` is handled above, so `IsReadonlyKeyOf` is a boolean here, and `Not` cannot turn a `never` result into `true`.
			: Key extends keyof Type
				? Not<IsReadonlyKeyOf<Type, Key>>
				: false;

export {};
