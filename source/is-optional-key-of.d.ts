import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is an optional key of type.

This is useful when writing utility types or schema validators that need to differentiate `optional` keys.

Distributes over object and key unions, returning `boolean` when results differ. Returns `false` when either input is `never`.

An `any` object has every key, and all of them are required, so the result is `false`, like `OptionalKeysOf<any>` is `never`. This also applies when the key is `any`. Otherwise, an `any` key returns `boolean`. `unknown` is not accepted.

Note: A literal key of an index signature is reported as optional, because the index signature does not require it, so `IsOptionalKeyOf<Record<string, T>, 'a'>` is `true`. The `string` key itself is reported as required.

@example
```
import type {IsOptionalKeyOf} from 'type-fest';

type User = {
	name: string;
	surname: string;

	luckyNumber?: number;
};

type Admin = {
	name: string;
	surname?: string;
};

type T1 = IsOptionalKeyOf<User, 'luckyNumber'>;
//=> true

type T2 = IsOptionalKeyOf<User, 'name'>;
//=> false

type T3 = IsOptionalKeyOf<User, 'name' | 'luckyNumber'>;
//=> boolean

type T4 = IsOptionalKeyOf<User | Admin, 'name'>;
//=> false

type T5 = IsOptionalKeyOf<User | Admin, 'surname'>;
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsOptionalKeyOf<Type extends object, Key extends KeysOfUnion<Type>> =
	// `any` is checked before `never`, so generic code that wraps the result keeps resolving it after instantiation. `any` has every key, and all of them are required.
	IsAny<Type | Key> extends true
		? [Type, Key] extends [never, unknown] | [unknown, never] ? false : IsAny<Type> extends true ? false : boolean
		: [Type, Key] extends [never, unknown] | [unknown, never] ? false
			// The distribution comes first, because `keyof` of a union is the intersection of its members' keys, so a key only one member has would fail the check below.
			: Type extends unknown
				? Key extends keyof Type
					// A mapped type is used instead of `Record<Key, Type[Key]>`, because TypeScript compares two references to `Record` by their type arguments, which reported a literal key of `Record<string, T>` as required.
					? Type extends {[Property in Key]: Type[Property]}
						? false
						: true
					: false
				: never;

export {};
