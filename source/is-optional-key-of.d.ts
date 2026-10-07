import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is an optional key of type.

This is useful when writing utility types or schema validators that need to differentiate `optional` keys.

Note: A literal key of an index signature is reported as optional, except for the built-in `Record` type, where it is reported as required. `IsOptionalKeyOf<{[key: string]: T}, 'a'>` is `true`, while `IsOptionalKeyOf<Record<string, T>, 'a'>` is `false`. This is because the check compares the type with `Record<Key, Type[Key]>`, and TypeScript compares two `Record` types by their type arguments instead of by their properties. The `string` key itself is reported as required for both.

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
	IsAny<Type | Key> extends true ? never
		// The distribution comes first, because `keyof` of a union is the intersection of its members' keys, so a key only one member has would fail the check below.
		: Type extends unknown
			? Key extends keyof Type
				? Type extends Record<Key, Type[Key]>
					? false
					: true
				: false
			: never;

export {};
