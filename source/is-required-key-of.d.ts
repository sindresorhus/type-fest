import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is a required key of type.

This is useful when writing utility types or schema validators that need to differentiate `required` keys.

Distributes over object and key unions, returning `boolean` when results differ. Returns `false` when either input is `never`.

An `any` object is read like `Record<PropertyKey, any>`, as TypeScript reads it, so a literal key is not required, while a `string`, `number`, or `symbol` key is. An `any` key returns `boolean`. `unknown` is not accepted.

Note: A literal key of an index signature is not reported as required, because the index signature does not require it, so `IsRequiredKeyOf<Record<string, T>, 'a'>` is `false`. The `string` key itself is reported as required.

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
	// `any` is checked before `never`, so generic code that wraps the result keeps resolving it after instantiation. An `any` object is read like `Record<PropertyKey, any>`.
	IsAny<Type | Key> extends true
		? [Type, Key] extends [never, unknown] | [unknown, never] ? false : IsAny<Type> extends true ? IsRequiredKeyOf<Record<PropertyKey, any>, Key> : boolean
		: [Type, Key] extends [never, unknown] | [unknown, never] ? false
			: Type extends unknown
				? Key extends keyof Type
					// A mapped type is used instead of `Record<Key, Type[Key]>`, because TypeScript compares two references to `Record` by their type arguments, which reported a literal key of `Record<string, T>` as required.
					? Type extends {[Property in Key]: Type[Property]}
						? true
						: false
					: false
				: never;

export {};
