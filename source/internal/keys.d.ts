import type {IsLiteral} from '../is-literal.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
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
Returns the key if its property is JSON-able and cannot be `undefined`, otherwise `never`. An `any` or `unknown` property is kept.
*/
export type DefinedKeyFilter<Type, Key extends keyof Type> = Key extends symbol
	// A symbol key is checked first, because the `any` and `unknown` branch returns the key without `BaseKeyFilter`.
	? never
	// `unknown` is only assignable to `any` and `unknown`.
	: unknown extends Type[Key]
		? Key
		: undefined extends Type[Key]
			? never
			// Only `never` gets here.
			: Type[Key] extends undefined
				? never
				: BaseKeyFilter<Type, Key>;

/**
Returns the key if its property is JSON-able and can be `undefined`, but is not only `undefined`, otherwise `never`. An `any` or `unknown` property is not included, because `DefinedKeyFilter` keeps it.
*/
export type OptionalKeyFilter<Type, Key extends keyof Type> = unknown extends Type[Key]
	? never
	: undefined extends Type[Key]
		? Type[Key] extends undefined
			? never
			: BaseKeyFilter<Type, Key>
		: never;

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

/**
Returns the keys of `Type` that are not in `Keys`.

For an array, only the indices of its elements are returned, so that the type stays an array instead of becoming an object with its methods as keys.

@example
```
type Object = KeysExcept<{a: 1; b: 2; c: 3}, 'a'>;
//=> 'b' | 'c'

type Tuple = KeysExcept<[string, number, boolean], 0>;
//=> '1' | '2'
```
*/
export type KeysExcept<Type, Keys> = Type extends UnknownArray
	? Exclude<keyof Type & `${number}`, `${Keys & (string | number)}`>
	: Exclude<keyof Type, Keys>;

export {};
