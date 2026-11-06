import type {IsReadonlyKeyOf} from './is-readonly-key-of.d.ts';
import type {Not} from './not.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is a writable key of type.

This is useful when writing utility types or schema validators that need to differentiate `writable` keys.

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
	IsAny<Type | Key> extends true ? never
		: Key extends keyof Type
			// `IsReadonlyKeyOf` is `never` when `Type` is `never`; keep it instead of turning it into `true` through `Not`.
			? [IsReadonlyKeyOf<Type, Key>] extends [never]
				? never
				: Not<IsReadonlyKeyOf<Type, Key>>
			: false;

export {};
