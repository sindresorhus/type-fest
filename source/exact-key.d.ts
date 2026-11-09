import type {ToString} from './internal/string.d.ts';

/**
Resolve a property key to the matching key type in an object, converting between numeric and string forms when needed.

Useful when composing generic property access utilities that accept either `0` or `'0'` for the same property. Returns `never` if no key matches.

Keys assignable to `keyof ObjectType` are returned unchanged, including keys covered by index signatures. Otherwise, numeric keys are tried as strings, and numeric strings as numbers only if converting back preserves their spelling. For example, `'01'` does not match `1`.

Distributes over a union of keys. For a union of objects, only keys in `keyof ObjectType` are considered, so a key must be common to all members. Plain strings do not select string enum keys. Array and tuple indices are not bounds-checked.

@example
```
import type {ExactKey} from 'type-fest';

type StatusMessages = {
	200: 'OK';
	'404': 'Not found';
};

type SuccessKey = ExactKey<StatusMessages, '200'>;
//=> 200

type NotFoundKey = ExactKey<StatusMessages, 404>;
//=> '404'

type PropertyValue<ObjectType extends object, Key extends PropertyKey> = ObjectType[ExactKey<ObjectType, Key>];

type Message = PropertyValue<StatusMessages, '200'>;
//=> 'OK'

type UnknownMessage = PropertyValue<StatusMessages, '500'>;
//=> never
```

@category Object
*/
export type ExactKey<ObjectType extends object, Key extends PropertyKey> =
	Key extends keyof ObjectType
		? Key
		: ToString<Key> extends keyof ObjectType
			? ToString<Key>
			: Key extends `${infer NumberKey extends number}`
				// A numeric-looking string names a number key only when its spelling survives the conversion.
				? `${NumberKey}` extends Key
					? NumberKey extends keyof ObjectType
						? NumberKey
						: never
					: never
				: never;

export {};
