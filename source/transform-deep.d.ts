import {BuiltIns} from './internal';

type IsAny<T> = 0 extends 1 & T ? true : false; // https://stackoverflow.com/a/49928360/3406963

/**
Create a type from another type with all keys and nested keys set to an arbitrary value.

Use-cases:
- When validating an object, return an object with the same key disposition where each value is a string with a description of the error.

@example
```
import {PartialDeep, TransformDeep} from 'type-fest';

const formValues: Values = {
	name: "John Doe",
	address: {
		street: "Av. de Mayo",
		number: 505,
		city: "Buenos Aires",
		country: "Argentina"
	}
	subscribeToNewsletter: true
};

const validate = (values: Values): PartialDeep<TransformDeep<Values, string>> => {
	// ...
}

const errors = validate(formValues);
```

@category Object
@category Array
@category Set
@category Map
*/
export type TransformDeep<Base, Value> = IsAny<Base> extends true
	? Value
	: Base extends BuiltIns | ((...arguments: any[]) => unknown)
	? Value
	: Base extends Map<infer KeyType, infer ValueType>
	? TransformMapDeep<KeyType, ValueType, Value>
	: Base extends Set<infer ItemType>
	? TransformSetDeep<ItemType, Value>
	: Base extends ReadonlyMap<infer KeyType, infer ValueType>
	? TransformReadonlyMapDeep<KeyType, ValueType, Value>
	: Base extends ReadonlySet<infer ItemType>
	? TransformReadonlySetDeep<ItemType, Value>
	: Base extends object
	? Base extends Array<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
		? ItemType[] extends Base // Test for arrays (non-tuples) specifically
			? Array<TransformDeep<ItemType | undefined, Value>> // Recreate relevant array type to prevent eager evaluation of circular reference
			: TransformObjectDeep<Base, Value> // Tuples behave properly
		: TransformObjectDeep<Base, Value>
	: Value;

/**
Same as `TransformDeep`, but accepts only `Map`s and as inputs. Internal helper for `TransformDeep`.
*/
interface TransformMapDeep<KeyType, ValueType, TransformValue>
	extends Map<
		TransformDeep<KeyType, TransformValue>,
		TransformDeep<ValueType, TransformValue>
	> {}

/**
Same as `TransformDeep`, but accepts only `Set`s as inputs. Internal helper for `TransformDeep`.
*/
interface TransformSetDeep<Base, Value>
	extends Set<TransformDeep<Base, Value>> {}

/**
Same as `TransformDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `TransformDeep`.
*/
interface TransformReadonlyMapDeep<KeyType, ValueType, TransformValue>
	extends ReadonlyMap<
		TransformDeep<KeyType, TransformValue>,
		TransformDeep<ValueType, TransformValue>
	> {}

/**
Same as `TransformDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `TransformDeep`.
*/
interface TransformReadonlySetDeep<Base, Value>
	extends ReadonlySet<TransformDeep<Base, Value>> {}

/**
Same as `TransformDeep`, but accepts only `object`s as inputs. Internal helper for `TransformDeep`.
*/
type TransformObjectDeep<ObjectType extends object, Value> = {
	[KeyType in keyof ObjectType]: TransformDeep<ObjectType[KeyType], Value>;
};
