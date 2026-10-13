import type {IsAny} from '../is-any.d.ts';
import type {IsLiteral} from '../is-literal.d.ts';
import type {IsUnknown} from '../is-unknown.d.ts';
import type {ToString} from './string.d.ts';

// Returns `never` if the key or property is not jsonable without testing whether the property is required or optional otherwise return the key.
type BaseKeyFilter<Type, Key extends keyof Type> = Key extends symbol
	? never
	: Type[Key] extends symbol
		? never
		/*
		An object with only a `name` property can accept a function without being callable itself.
		Check for actual functions in the property's type instead of whether a function fits that type, so optional records and interfaces are kept while unions containing functions are still omitted.
		See: https://github.com/sindresorhus/type-fest/issues/657
		*/
		: Extract<Type[Key], Function> extends never
			? Key
			: never;

/**
Returns the required keys.
*/
export type FilterDefinedKeys<T extends object> = Exclude<
	{
		[Key in keyof T]: IsAny<T[Key]> extends true
			? Key
			: IsUnknown<T[Key]> extends true ? Key : undefined extends T[Key]
				? never
				: T[Key] extends undefined
					? never
					: BaseKeyFilter<T, Key>;
	}[keyof T],
	undefined
>;

/**
Returns the optional keys.
*/
export type FilterOptionalKeys<T extends object> = Exclude<
	{
		[Key in keyof T]: IsAny<T[Key]> extends true
			? never
			: undefined extends T[Key]
				? T[Key] extends undefined
					? never
					: BaseKeyFilter<T, Key>
				: never;
	}[keyof T],
	undefined
>;

/**
Disallows any of the given keys.
*/
export type RequireNone<KeysType extends PropertyKey> = Partial<Record<KeysType, never>>;

/**
Utility type to retrieve only literal keys from type.
*/
export type LiteralKeyOf<T> = keyof {[K in keyof T as IsLiteral<K> extends true ? K : never]-?: never};

/**
Get the exact version of the given `Key` in the given object `T`.

Use-case: You know that a number key (e.g. 10) is in an object, but you don't know how it is defined in the object, as a string or as a number (e.g. 10 or '10'). You can use this type to get the exact version of the key. See the example.

@example
```
type Object = {
	0: number;
	'1': string;
};

type Key1 = ExactKey<Object, '0'>;
//=> 0
type Key2 = ExactKey<Object, 0>;
//=> 0

type Key3 = ExactKey<Object, '1'>;
//=> '1'
type Key4 = ExactKey<Object, 1>;
//=> '1'
```

@category Object
*/
export type ExactKey<T extends object, Key extends PropertyKey> =
	Key extends keyof T
		? Key
		: ToString<Key> extends keyof T
			? ToString<Key>
			: Key extends `${infer NumberKey extends number}`
				? NumberKey extends keyof T
					? NumberKey
					: never
				: never;

export {};
