import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is a required key of type.

This is useful when writing utility types or schema validators that need to differentiate `required` keys.

Distributes over object and key unions, returning `boolean` when results differ. Returns `false` when either input is `never`.

An `any` object has every key, and all of them are required, so the result is `true`, like `RequiredKeysOf<any>` is `PropertyKey`. This also applies when the key is `any`. Otherwise, an `any` key returns `boolean`. `unknown` is not accepted.

@example
```
import type {IsRequiredKeyOf} from 'type-fest';

type User = {
	name: string;
	surname: string;

	luckyNumber?: number;
};

type Admin = {
	name: string;
	surname?: string;
};

type T1 = IsRequiredKeyOf<User, 'name'>;
//=> true

type T2 = IsRequiredKeyOf<User, 'luckyNumber'>;
//=> false

type T3 = IsRequiredKeyOf<User, 'name' | 'luckyNumber'>;
//=> boolean

type T4 = IsRequiredKeyOf<User | Admin, 'name'>;
//=> true

type T5 = IsRequiredKeyOf<User | Admin, 'surname'>;
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsRequiredKeyOf<Type extends object, Key extends KeysOfUnion<Type>> =
	// `any` is checked before `never`, so generic code that wraps the result keeps resolving it after instantiation. `any` has every key, and all of them are required.
	IsAny<Type | Key> extends true
		? [Type, Key] extends [never, unknown] | [unknown, never] ? false : IsAny<Type> extends true ? true : boolean
		: [Type, Key] extends [never, unknown] | [unknown, never] ? false
			: Type extends unknown
				? Key extends keyof Type
					? Type extends Record<Key, Type[Key]>
						? true
						: false
					: false
				: never;

export {};
